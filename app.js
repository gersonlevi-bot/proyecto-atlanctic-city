import express from "express";
import cors from "cors";
import authRoutes from './src/routes/auth.routes.js';
import clienteRouter from "./src/routes/cliente.routes.js";

const app = express();

/**
 * Middlewares Globales
 */

app.use(cors());    // Habilita el intercambio de recursos de origen cruzado (CORS) para permitir peticiones desde el frontend
app.use(express.json());    // Parsea las peticiones entrantes con formato JSON y las disponibiliza en req.body

/**
 * Rutas de la API
 */
app.use('/auth', authRoutes);   // Módulo de autenticación (login, registro, recuperación de contraseña)
app.use(clienteRouter); // Módulo de gestión de clientes (listado, registro, actualización, baja lógica)


export default app;