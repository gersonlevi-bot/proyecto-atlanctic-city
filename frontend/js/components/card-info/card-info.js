import cardInfoStyle from "./card-info.css" with { type: "css" };

const cardInfoTemplate = document.createElement("template");
cardInfoTemplate.innerHTML = /* html */ `
<article class="tarjeta">
    <div class="icono-tarjeta"><slot name="icono"></slot></div>
    <div class="datos-tarjeta">
        <h3><slot name="titulo"></slot></h3>
        <p><slot name="valor"></slot></p>
    </div>
</article>
`;

/**
 * Web Component que representa una tarjeta informativa/métrica con soporte para Slots.
 */
export class CardInfo extends HTMLElement {
    /**
     * Inicializa el componente con Shadow DOM y la plantilla predefinida.
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [cardInfoStyle];
        this.shadowRoot.appendChild(cardInfoTemplate.content.cloneNode(true));
    }

    /**
     * Callback del ciclo de vida invocado cuando el elemento se inserta en el DOM.
     * Asigna la clase de color según el atributo `color` especificado en HTML.
     */
    connectedCallback() {
        const colorClass = this.getAttribute("color") || "gris";
        const iconWrap = this.shadowRoot.querySelector(".icono-tarjeta");
        if (iconWrap){
            iconWrap.classList.add(colorClass);
        }
    }
}

customElements.define("info-card", CardInfo);