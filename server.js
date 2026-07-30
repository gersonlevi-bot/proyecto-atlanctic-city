import app from "./app.js";
import { PORT } from "./src/config/config.js";

/**
 * Inicializa el servidor HTTP de la aplicación.
 * 
 * Utiliza la instancia configurada de Express (`app`) y escucha
 * en el puerto definido en las variables de entorno (`PORT`).
 */
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});