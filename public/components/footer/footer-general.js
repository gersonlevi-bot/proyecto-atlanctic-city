import footerGeneralStyles from "./footer-general.css" with { type: "css" };

const footerTemplate = document.createElement("template");
footerTemplate.innerHTML = /* html */ `
<footer class="footer-general">
    <p>
        &copy; 2026 ATLANTIC CITY CASINO & ENTERTAINMENT |
        <a href="#">Política de Privacidad</a> |
        <a href="#">Soporte Técnico</a>
    </p>
</footer>
`;

export class FooterGeneral extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [footerGeneralStyles];
        this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
    }
}

customElements.define("footer-general", FooterGeneral);
