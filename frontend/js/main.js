import Swup from 'https://unpkg.com/swup@4?module';
import SwupHeadPlugin from 'https://unpkg.com/@swup/head-plugin@2?module';

/**
 * Instancia principal de Swup para la gestión de transiciones SPA (Single Page Application).
 * Configura los contenedores y plugins para mantener actualizadas las cabeceras HTML.
 */
window.swup = new Swup({
    containers: ["#swup"],
    plugins: [
        new SwupHeadPlugin({ awaitAssets: true })
    ]
});

/**
 * Detecta la ruta URL actual de la aplicación e importa/ejecuta dinámicamente 
 * el controlador JS de frontend correspondiente.
 */
async function inicializarControlador() {
    const rutaActual = window.location.pathname.toLowerCase();

    try {
        if (rutaActual.includes('cliente.html')) {
            const modulo = await import('./controllers/cliente.controller.front.js');
            if (modulo.init) modulo.init();
        } 
    } catch (error) {
        console.error("Error al cargar el controlador de la página:", error);
    }
}

/**
 * Suscripción al evento DOMContentLoaded.
 * Carga el controlador JS inicial en el primer renderizado de la página (F5 o entrada directa).
 */
document.addEventListener('DOMContentLoaded', () => {
    inicializarControlador();
});

/**
 * Suscripción al hook de Swup `page:view`.
 * Ejecuta la inicialización del controlador correspondiente cada vez que Swup finaliza una transición.
 */
window.swup.hooks.on('page:view', () => {
    inicializarControlador();
});