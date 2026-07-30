/**
 * Puerto de escucha para el servidor HTTP Express.
 * Toma el puerto definido en la variable de entorno `PORT` o cae en el puerto 5000 por defecto.
 */
export const PORT = process.env.PORT || 5000;