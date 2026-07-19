import navHeaderStyles from "./nav-header.css" with { type: "css" };

const navHeaderTemplate = document.createElement("template");
navHeaderTemplate.innerHTML = /* html */ `
<header class="encabezado-principal">
    <nav class="ruta" aria-label="rutas">
        <ol>
            <li><a href="#">Inicio</a></li>
            <li aria-current="page"><slot name="ruta"></slot></li>
        </ol>
    </nav>

    <div class="acciones-encabezado">
        <!--<div class="busqueda-encabezado">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
            <input type="text" placeholder="Buscar..." />
        </div> -->

        <button type="button" class="btn-notificaciones" aria-label="Notificaciones">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
        </button>

        <div class="perfil-usuario">
            <div class="info-usuario">
                <span class="nombre-usuario">Administrador</span>
                <span class="rol-usuario">Casino Staff</span>
            </div>
            <div class="avatar-container">
                <div class="avatar-fallback">A</div>
                <span class="status-indicator"></span>
            </div>
        </div>
    </div>
</header>
`;

export class NavHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [navHeaderStyles];
        this.shadowRoot.appendChild(navHeaderTemplate.content.cloneNode(true));
    }
}

customElements.define("nav-header", NavHeader);
