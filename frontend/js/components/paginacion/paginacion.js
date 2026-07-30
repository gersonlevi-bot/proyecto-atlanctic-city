import paginacionStyle from "./paginacion.css" with { type: "css" };

const paginacionTemplate = document.createElement("template");
paginacionTemplate.innerHTML = /* html */ `
<div class="contenedor-paginacion">
    <div class="info-paginacion">
        <span id="texto-info">Mostrando 0 de 0 registros</span>
    </div>
    <div class="controles-paginacion" id="controles">
        <!-- Los botones se generarán dinámicamente aquí -->
    </div>
</div>
`;

/**
 * Web Component que renderiza los controles de paginación e información de tabla.
 * CustomEvent "cambio-pagina" Evento emitido al seleccionar una nueva página.
 * @attr {number} total-registros - Número total de elementos disponibles.
 * @attr {number} pagina-actual - El índice (base 1) de la página actual.
 * @attr {number} registros-por-pagina - Cantidad de registros mostrados por cada vista.
 */
export class PaginacionTablas extends HTMLElement {
    /**
     * Define los atributos HTML a observar para reactivar el renderizado automático.
     */
    static get observedAttributes() {
        return ["total-registros", "pagina-actual", "registros-por-pagina"];
    }

    /**
     * Inicializa la instancia del componente creando el Shadow DOM y agregando la plantilla con estilos.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [paginacionStyle];
        this.shadowRoot.appendChild(paginacionTemplate.content.cloneNode(true));
    }

    /**
     * Callback del ciclo de vida que se invoca automáticamente al cambiar cualquier atributo de `observedAttributes`.
     * Recalcula la paginación y actualiza el Shadow DOM.
     */
    attributeChangedCallback() {
        this.render();
    }

    /**
     * Calcula la información de rango y genera los controles interactivos dentro del Shadow Root.
     */
    render() {
        // Obtener valores de los atributos (con valores por defecto seguros)
        const total = parseInt(this.getAttribute("total-registros")) || 0;
        const paginaActual = parseInt(this.getAttribute("pagina-actual")) || 1;
        const porPagina = parseInt(this.getAttribute("registros-por-pagina")) || 5;

        // Calcular datos de paginación
        const totalPaginas = Math.ceil(total / porPagina) || 1;
        const desde = total === 0 ? 0 : (paginaActual - 1) * porPagina + 1;
        const hasta = Math.min(paginaActual * porPagina, total);

        // Actualizar texto informativo de manera automática
        const textoInfo = this.shadowRoot.getElementById("texto-info");
        if (textoInfo) {
            textoInfo.textContent = `Mostrando ${desde} a ${hasta} de ${total} registros`;
        }

        // Generar botones de navegación dinámicamente
        const contenedorControles = this.shadowRoot.getElementById("controles");
        if (!contenedorControles) return;
        contenedorControles.innerHTML = ""; // Limpiar controles anteriores

        // Botón Anterior
        const btnAnterior = document.createElement("button");
        btnAnterior.className = "btn-pagina btn-navegacion";
        btnAnterior.innerHTML = "&lt;";
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.onclick = () => this.cambiarPagina(paginaActual - 1);
        contenedorControles.appendChild(btnAnterior);

        // Botón de la página activa actual
        const btnActivo = document.createElement("span");
        btnActivo.className = "btn-pagina activo";
        btnActivo.textContent = paginaActual;
        contenedorControles.appendChild(btnActivo);

        // Botón Siguiente
        const btnSiguiente = document.createElement("button");
        btnSiguiente.className = "btn-pagina btn-navegacion";
        btnSiguiente.innerHTML = "&gt;";
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.onclick = () => this.cambiarPagina(paginaActual + 1);
        contenedorControles.appendChild(btnSiguiente);
    }

    /**
     * Emite un evento `cambio-pagina` que informa al controlador externo sobre la navegación.
     */
    cambiarPagina(nuevaPagina) {
        this.dispatchEvent(new CustomEvent("cambio-pagina", {
            detail: { pagina: nuevaPagina },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define("paginacion-tablas", PaginacionTablas);