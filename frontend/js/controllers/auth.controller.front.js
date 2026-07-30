import { iniciarSesion, registrarUsuario, recuperarContrasena } from '../api/auth.api.js';

// INICIALIZACIÓN Y EVENTOS PRINCIPALES
export function init() {
    configurarNavegacionVistas();
    configurarModalRecuperacion();
    configurarOjoPassword();
    configurarEnvioFormularios();
}

/**
 * Alterna entre el panel de Login y Registro
 */
function configurarNavegacionVistas() {
    const loginView = document.getElementById('ingreso');
    const registerView = document.getElementById('registro');

    document.getElementById('link-ir-a-registro')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('oculto');
        registerView.classList.remove('oculto');
    });

    document.getElementById('link-ir-a-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.classList.add('oculto');
        loginView.classList.remove('oculto');
    });
}

/**
 * Abre y cierra la ventana modal de recuperación
 */
function configurarModalRecuperacion() {
    const modal = document.getElementById('modal-recuperar');

    document.getElementById('link-olvide-pass')?.addEventListener('click', (e) => {
        e.preventDefault();
        modal?.classList.remove('oculto');
    });

    document.getElementById('cerrar-modal')?.addEventListener('click', () => {
        modal?.classList.add('oculto');
    });
}

/**
 * Permite ver/ocultar los caracteres de las contraseñas
 */
function configurarOjoPassword() {
    document.querySelectorAll('.password--eye').forEach(eyeIcon => {
        eyeIcon.addEventListener('click', () => {
            const input = eyeIcon.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                const esPassword = input.type === 'password';
                input.type = esPassword ? 'text' : 'password';
                eyeIcon.style.opacity = esPassword ? '1' : '0.4';
            }
        });
    });
}

/**
 * Conecta los eventos Submit de los formularios con la API REST
 */
function configurarEnvioFormularios() {
    // Submit Login
    document.querySelector('.form--login')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const correo = document.getElementById('correo-ingreso').value.trim();
        const contrasena = document.getElementById('contrasena-ingreso').value;

        try {
            const res = await iniciarSesion({ correo, contrasena });
            localStorage.setItem('token', res.token);
            alert(res.message);
            window.location.href = './inicio.html';
        } catch (err) {
            alert(err.message);
        }
    });

    // Submit Registro
    document.querySelector('.form--register')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            rol_id: parseInt(document.getElementById('rol-registro').value),
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            correo: document.getElementById('correo-registro').value.trim(),
            telefono: document.getElementById('telefono').value.trim() || null,
            contrasena: document.getElementById('contrasena-registro').value
        };

        try {
            const res = await registrarUsuario(payload);
            alert(res.message);
            document.getElementById('link-ir-a-login')?.click();
        } catch (err) {
            alert(err.message);
        }
    });
}

// Inicialización de script
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}