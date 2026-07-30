import { obtenerClientes, registrarCliente } from '../api/cliente.api.js';
import { configurarFiltroSelect } from '../utils/filtros-tablas.js';
import { renderizarTablaCliente } from '../ui/cliente.ui.js';

// Variables de estado globales 
let listaGlobalClientes = [];       // Lista completa de clientes obtenida del servidor.
let listaFiltradaClientes = [];     // Lista filtrada de clientes según búsquedas y selects.
let paginaActual = 1;               // Página actual de la tabla.
const REGISTROS_POR_PAGINA = 5;     // Cantidad de filas a renderizar por página.
let tipoClienteIdSeleccionado = 1;  // ID del tipo de cliente seleccionado en el modal (3: Regular por defecto).


// INICIALIZACIÓN Y EVENTOS PRINCIPALES
// Exportamos la función init para que main.js la ejecute en cada navegación de Swup
export async function init() {
    await cargarDatosIniciales();
    inicializarBuscador();
    inicializarFiltros();
    inicializarFormulario();
    inicializarEventosModal();
}

// Si la página se carga de forma directa (por F5 o URL directa), la ejecutamos
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}


// FUNCIONES BÁSICAS DE FLUJO / CARGA
/**
 * Consulta la API para obtener los clientes e inicializa la vista.
 */
async function cargarDatosIniciales() {
    try {
        listaGlobalClientes = await obtenerClientes();
        listaFiltradaClientes = [...listaGlobalClientes];
        actualizarPantallaCompleta();
    } catch (error) {
        console.error("Error al inicializar la tabla de clientes:", error);
    }
}

/**
 * Escucha los eventos del buscador en tiempo real.
 */
function inicializarBuscador() {
    const inputBuscar = document.getElementById('buscar-cliente');
    if (!inputBuscar) return;

    inputBuscar.addEventListener('input', (e) => {
        const valor = e.target.value.toLowerCase().trim();

        listaFiltradaClientes = listaGlobalClientes.filter(cliente => {
            const nombre = cliente.nombre?.toLowerCase() || '';
            const apellido = cliente.apellido?.toLowerCase() || '';
            const dni = cliente.DNI?.toString() || '';

            return nombre.includes(valor) || apellido.includes(valor) || dni.includes(valor);
        });

        paginaActual = 1;
        actualizarPantallaCompleta();
    });
}

/**
 * Configura los selectores de filtro y el paginador.
 */
function inicializarFiltros() {
    const paginadorHTML = document.getElementById('paginacion-clientes');
    if (paginadorHTML) {
        paginadorHTML.addEventListener('cambio-pagina', (e) => {
            paginaActual = e.detail.pagina;
            actualizarPantallaCompleta();
        });
    }

    configurarFiltroSelect(
        "filtro-nivel-cliente", 
        () => listaGlobalClientes, 
        "tipo_cliente_nombre", 
        (datosFiltrados) => {
            listaFiltradaClientes = datosFiltrados;
            paginaActual = 1;
            actualizarPantallaCompleta();
        }
    );
}

// GESTIÓN DEL FORMULARIO Y REGISTRO
/**
 * Asigna controladores de eventos para el registro de nuevos clientes.
 */
function inicializarFormulario() {
    const formulario = document.querySelector('.formulario-panel-lateral');
    const botonesNivel = document.querySelectorAll('.btn-nivel');
    const btnSubmit = formulario?.querySelector('button[type="submit"]');
    if (!formulario) return;

    if (formulario.dataset.listenerCargado === "true") {
        return;
    }
    formulario.dataset.listenerCargado = "true";

    // Selector de botones de nivel (VIP, Frecuente, Regular)
    botonesNivel.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesNivel.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            tipoClienteIdSeleccionado = parseInt(btn.dataset.id);
        });
    });

    // Envío del Formulario
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        limpiarErroresVisuales();

        const datosCliente = capturarDatosFormulario();
        console.log(datosCliente);
        

        if (!validarClienteFrontend(datosCliente)) {
            mostrarErroresFrontend(datosCliente);
            return;
        }

        try {
            if (btnSubmit) btnSubmit.disabled = true;

            const respuesta = await registrarCliente(datosCliente);

            alert(respuesta.message || "Cliente registrado con éxito");
            
            // Restablecer formulario y recargar datos
            formulario.reset();
            resetearBotonesNivel(botonesNivel);
            ocultarModal();
            await cargarDatosIniciales();

        } catch (error) {
            console.error("Error al registrar cliente:", error);
            alert(error.message);
        } finally {
            if (btnSubmit) btnSubmit.disabled = false;
        }
    });
}

/**
 * Captura los campos del DOM y construye el objeto del cliente.
 */
function capturarDatosFormulario() {
    return {
        tipo_cliente_id: tipoClienteIdSeleccionado,
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        DNI: document.getElementById('dni').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        direccion: document.getElementById('direccion').value.trim() || null,
        telefono: document.getElementById('telefono').value.trim() || null
    };
}

/**
 * Valida los datos obligatorios en el cliente.
 */
function validarClienteFrontend(cliente) {
    return Boolean(cliente.nombre && cliente.apellido && cliente.DNI && cliente.correo);
}


// RENDERIZADO Y COORDINACIÓN DE VISTAS
/**
 * Renderiza la paginación, tarjetas métricas y datos filtrados de la tabla.
 */
function actualizarPantallaCompleta() {
    const paginadorHTML = document.getElementById('paginacion-clientes');
    
    if (paginadorHTML) {
        paginadorHTML.setAttribute('total-registros', listaFiltradaClientes.length);
        paginadorHTML.setAttribute('pagina-actual', paginaActual);
        paginadorHTML.setAttribute('registros-por-pagina', REGISTROS_POR_PAGINA);
    }

    actualizarTarjetasContadoras();

    const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
    const fin = inicio + REGISTROS_POR_PAGINA;
    const clientesSegmentados = listaFiltradaClientes.slice(inicio, fin);

    renderizarTablaCliente(clientesSegmentados);
}

/**
 * Calcula las métricas globales por nivel de cliente y actualiza el Dashboard.
 */
function actualizarTarjetasContadoras() {
    const totalClientes = listaGlobalClientes.length;
    const contarPorTipo = (tipo) => 
        listaGlobalClientes.filter(c => c.tipo_cliente_nombre?.toLowerCase() === tipo).length;

    modificarValorSlot('card-total', totalClientes);
    modificarValorSlot('card-vip', contarPorTipo('vip'));
    modificarValorSlot('card-frecuente', contarPorTipo('frecuente'));
    modificarValorSlot('card-regular', contarPorTipo('regular'));
}

/**
 * Actualiza el slot "valor" dentro de un Web Component.
 */
function modificarValorSlot(idComponente, nuevoValor) {
    const componente = document.getElementById(idComponente);
    const slotValor = componente?.querySelector('[slot="valor"]');
    if (slotValor) slotValor.textContent = nuevoValor;
}


// CONTROLADORES DE ERRORES Y MODAL
/**
 * Oculta todos los elementos de error activos en el formulario.
 */
function limpiarErroresVisuales() {
    document.querySelectorAll('.error').forEach(err => err.classList.add('oculto'));
}

/**
 * Muestra alertas de validación para campos específicos.
 */
function mostrarErroresFrontend(datos) {
    const campos = ['nombre', 'apellido', 'dni', 'correo'];
    campos.forEach(campo => {
        const campoMinus = campo.toLowerCase();
        const prop = campo === 'dni' ? 'DNI' : campo;
        if (!datos[prop]) {
            document.querySelector(`#${campoMinus}`)
                ?.closest('.grupo-formulario')
                ?.querySelector('.error')
                ?.classList.remove('oculto');
        }
    });
}

/**
 * Resalta visualmente el nivel por defecto en el selector de tipo cliente.
 */
function resetearBotonesNivel(botones) {
    botones.forEach(b => b.classList.remove('activo'));
    const btnRegular = document.querySelector('.btn-nivel[data-id="1"]');
    if (btnRegular) {
        btnRegular.classList.add('activo');
        tipoClienteIdSeleccionado = 1; 
    }
}

/**
 * Maneja los eventos de apertura/cierre del panel lateral modal.
 */
function inicializarEventosModal() {
    const btnAnadirCliente = document.getElementById("btn-añadir-cliente");
    const backgraund = document.getElementById("backgraund-añadir-cliente");
    const panel = document.getElementById("panel-añadir-cliente");
    const btnCancelar = document.getElementById("btn-cancelar");

    btnAnadirCliente?.addEventListener('click', (e) => {
        e.stopPropagation();
        backgraund?.classList.remove("oculto");
    });

    document.addEventListener('click', (e) => {
        if (!backgraund || backgraund.classList.contains("oculto")) return;

        const clicFueraDelPanel = !panel.contains(e.target);
        const clicEnCancelar = btnCancelar?.contains(e.target);

        if (clicFueraDelPanel || clicEnCancelar) {
            ocultarModal();
        }
    });
}

/**
 * Oculta el modal del formulario lateral.
 */
function ocultarModal() {
    document.getElementById("backgraund-añadir-cliente")?.classList.add("oculto");
}