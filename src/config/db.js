import dotenv from "dotenv";
import path from "path";
import { createPool } from "mysql2/promise";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

/**
 * Pool de conexiones a la base de datos MySQL utilizando `mysql2/promise`.
 */
export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});

/**
 * Verificación inicial de conectividad a la base de datos MySQL al arrancar.
 */
pool.query("SELECT 1 AS conexion")
    .then(([rows]) => console.log("Conexión exitosa a MySQL:", rows))
    .catch((err) => console.log("Error al conectar con MySQL:", err.message));