/**
 * Configura un filtro select genérico para cualquier tabla del sistema.
 * @param {string} selectId - El ID del elemento HTML <select>
 * @param {Function} obtenerListaActual - Función callback que retorna el array de datos actual del controller
 * @param {string} propiedad - El nombre de la propiedad del objeto a evaluar (ej: 'tipo_cliente_nombre')
 * @param {Function} funcionRender - La función encargada de actualizar los datos filtrados
 */
export const configurarFiltroSelect = (selectId, obtenerListaActual, propiedad, funcionRender) => {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    selectElement.addEventListener('change', (e) => {
        const valorSeleccionado = e.target.value.toLowerCase().trim();
        const listaActual = obtenerListaActual();

        if (valorSeleccionado === 'todos' || valorSeleccionado === '') {
            funcionRender(listaActual);
            return;
        }

        const datosFiltrados = listaActual.filter(item => {
            const valorPropiedad = item[propiedad] ? item[propiedad].toString().toLowerCase().trim() : '';
            return valorPropiedad === valorSeleccionado;
        });

        funcionRender(datosFiltrados);
    });
};