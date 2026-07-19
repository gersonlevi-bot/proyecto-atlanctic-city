import paginacionStyle from "./paginacion.css" with { type: "css" };

const paginacionTemplate = document.createElement("template");
paginacionTemplate.innerHTML = /* html */ `
<div class="contenedor-paginacion">
    <div class="info-paginacion"><slot name="info"></slot></div>
    <div class="controles-paginacion">
        <button type="button" class="btn-pagina btn-navegacion" aria-label="Anterior">&lt;</button>
        <span class="btn-pagina activo">1</span>
        <button type="button" class="btn-pagina btn-navegacion" aria-label="Siguiente">&gt;</button>
    </div>
</div>
`;

export class PaginacionTablas extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [paginacionStyle];
        this.shadowRoot.appendChild(paginacionTemplate.content.cloneNode(true));
    }
}

customElements.define("paginacion-tablas", PaginacionTablas);
