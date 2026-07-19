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

export class CardInfo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [cardInfoStyle];
        this.shadowRoot.appendChild(cardInfoTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        const colorClass = this.getAttribute("color") || "gris";
        const iconWrap = this.shadowRoot.querySelector(".icono-tarjeta");
        if (iconWrap){
            iconWrap.classList.add(colorClass);
        }
    }
}

customElements.define("info-card", CardInfo);
