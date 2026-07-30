import { Router } from "express";
import { validarCliente } from "../middleware/cliente.middleware.js";
import { permitirRoles, verificarToken } from "../middleware/auth.middleware.js";
import {
    getClientes,
    getCliente,
    createCliente,
    deleteCliente,
    updateCliente,
} from "../controllers/cliente.controller.js";

const router = Router();

/**
 * GET /clientes
 * Obtiene el listado de todos los clientes activos.
 */
router.get("/clientes", verificarToken, getClientes);

/**
 * GET /clientes/:id
 * Obtiene la información detallada de un cliente específico por ID.
 */
router.get("/clientes/:id", verificarToken, getCliente);

/**
 * POST /clientes
 * Registra un nuevo cliente aplicando validación de datos de entrada.
 */
router.post("/clientes", verificarToken, validarCliente, createCliente);

/**
 * PUT /clientes/:id
 * Actualiza los datos de un cliente existente tras validar la estructura enviada.
 */
router.put("/clientes/:id", verificarToken, validarCliente, updateCliente);

/**
 * DELETE /clientes/:id
 * Realiza una baja lógica del cliente desactivando su estado en la base de datos.
 */
router.delete("/clientes/:id",verificarToken,permitirRoles("Administrador"), deleteCliente);

export default router;