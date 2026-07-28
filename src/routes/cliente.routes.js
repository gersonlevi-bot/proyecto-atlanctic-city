import { Router } from "express";
import { validarCliente } from "../middleware/cliente.middleware.js";
import {
    getClientes,
    getCliente,
    createCliente,
    deleteCliente,
    updateCliente,
} from "../controllers/cliente.controller.js";

const router = Router();

// Obtener todos los Clientes
router.get("/clientes", getClientes);

// Obtener un cliente en particular
router.get("/clientes/:id", getCliente);

// Registrar un cliente
router.post("/clientes", validarCliente,createCliente);

// Actualizar/editar un cliente
router.put("/clientes/:id", validarCliente,updateCliente);

// Eliminar un cliente
router.delete("/clientes/:id", deleteCliente);

export default router;
