import cardPromocionStyle from "./card-promocion.css" with { type: "css" };

const cardPromocionTemplate = document.createElement("template");
cardPromocionTemplate.innerHTML = /* html */ `
<article class="tarjeta-promocion">
    <span class="estado-promocion activa"></span>
    <div class="promo-cuerpo">
        <h3><slot name="titulo">Bono</slot></h3>
        <p><slot name="descripcion">Detalles de la promoción...</slot></p>
    </div>

    <hr class="promo-separador">

    <div class="promo-pie">
        <div class="vigencia-promocion">
            Vigencia: <slot name="fecha">--/--/----</slot>
        </div>
        <a href="#" class="enlace-promocion">Ver detalles &gt;</a>
    </div>
</article>
`;

export class CardPromocion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [cardPromocionStyle];
        this.shadowRoot.appendChild(cardPromocionTemplate.content.cloneNode(true));
    }
    
    connectedCallback() {
        const badgeEstado = this.shadowRoot.querySelector(".estado-promocion")
        const badgeAtributo = this.getAttribute('badge-estado')
        
        badgeEstado.textContent = badgeAtributo
        badgeEstado.classList.add(badgeAtributo)
    }
}

customElements.define("card-promocion", CardPromocion);
