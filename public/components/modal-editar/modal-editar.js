import modalEditarstyle from "./modal-editar.css" with { type: "css" };

export class ModalEditarCliente extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [modalEditarstyle];

        const plantillaHTML = document.createElement("template");
        plantillaHTML.innerHTML = /* html */ `
            <div class="tarjeta-modal">
                <button type="button" id="boton-cerrar-modal" class="btn-cerrar" aria-label="Cerrar">&times;</button>
                
                <header class="encabezado-modal">
                    <div class="caja-avatar-modal">
                        <slot name="icono-encabezado"></slot>
                    </div>
                    <div class="titulos-modal">
                        <h2>Editar Cliente</h2>
                        <span id="nombre-subtitulo">Cargando...</span>
                    </div>
                </header>

                <form class="formulario-modal" id="formulario-editar" autocomplete="off">
                    <!-- Fila 1: Nombre y Apellido -->
                    <div class="fila-doble">
                        <div class="grupo-campo">
                            <label for="nombre">Nombre</label>
                            <div class="caja-input">
                                <slot name="icono-nombre"></slot>
                                <input type="text" id="nombre" name="nombre" required />
                            </div>
                        </div>
                        <div class="grupo-campo">
                            <label for="apellido">Apellido</label>
                            <div class="caja-input">
                                <slot name="icono-apellido"></slot>
                                <input type="text" id="apellido" name="apellido" required />
                            </div>
                        </div>
                    </div>

                    <!-- Fila 2: DNI y Correo -->
                    <div class="fila-doble">
                        <div class="grupo-campo">
                            <label for="dni">DNI</label>
                            <div class="caja-input">
                                <slot name="icono-dni"></slot>
                                <input type="text" id="dni" name="dni" required />
                            </div>
                        </div>
                        <div class="grupo-campo">
                            <label for="correo">Correo</label>
                            <div class="caja-input">
                                <slot name="icono-correo"></slot>
                                <input type="email" id="correo" name="correo" required />
                            </div>
                        </div>
                    </div>

                    <!-- Fila 3: Teléfono y Nivel -->
                    <div class="fila-doble">
                        <div class="grupo-campo">
                            <label for="telefono">Teléfono</label>
                            <div class="caja-input">
                                <slot name="icono-telefono"></slot>
                                <input type="tel" id="telefono" name="telefono" />
                            </div>
                        </div>
                        <div class="grupo-campo">
                            <label for="nivel">Nivel</label>
                            <div class="caja-input">
                                <slot name="icono-nivel"></slot>
                                <select id="nivel" name="nivel">
                                    <option value="VIP">VIP</option>
                                    <option value="Frecuente">Frecuente</option>
                                    <option value="Regular">Regular</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Fila 4: Dirección Completa -->
                    <div class="grupo-campo">
                        <label for="direccion">Dirección</label>
                        <div class="caja-input">
                            <slot name="icono-direccion"></slot>
                            <input type="text" id="direccion" name="direccion" />
                        </div>
                    </div>

                    <!-- Botones de Acción -->
                    <footer class="acciones-modal">
                        <button type="button" id="btn-cancelar" class="btn-accion btn-cancelar">Cancelar</button>
                        <button type="submit" class="btn-accion btn-guardar">Guardar cambios</button>
                    </footer>
                </form>
            </div>
        `;

        this.shadowRoot.appendChild(plantillaHTML.content.cloneNode(true));
    }

    connectedCallback() {
        const formulario = this.shadowRoot.getElementById("formulario-editar");
        const btnCerrarX = this.shadowRoot.getElementById("boton-cerrar-modal");
        const btnCancelar = this.shadowRoot.getElementById("btn-cancelar");
        const subtitulo = this.shadowRoot.getElementById("nombre-subtitulo");

        subtitulo.textContent = this.getAttribute("cliente-nombre") || "Juan Pérez";

        const cerrarModal = () => {
            this.dispatchEvent(new CustomEvent("al-cerrar", { bubbles: true, composed: true }));
        };

        btnCerrarX.addEventListener("click", cerrarModal);
        btnCancelar.addEventListener("click", cerrarModal);

        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            const datos = Object.fromEntries(new FormData(formulario));
            
            this.dispatchEvent(new CustomEvent("al-guardar", {
                detail: datos,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define("modal-editar-cliente", ModalEditarCliente);
