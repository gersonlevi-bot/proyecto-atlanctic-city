import { json } from "express";
import { pool } from "../config/db.js";

// Listar los clientes (Trae también el nombre de la categoría)
export const getClientes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, tc.nombre AS tipo_cliente_nombre 
            FROM Cliente c
            INNER JOIN Tipo_Cliente tc ON c.tipo_cliente_id = tc.id
            WHERE c.estado = true
        `);

        res.json(rows);
    } catch (error) {
        console.error("Error en getClientes:", error);
        res.status(500).json({
            error: "Error al obtener todos los clientes de la base de datos",
        });
    }
};

// Obtener un solo cliente por su ID
export const getCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `
                SELECT c.*, tc.nombre AS tipo_cliente_nombre 
                FROM Cliente c
                INNER JOIN Tipo_Cliente tc ON c.tipo_cliente_id = tc.id
                WHERE c.id = ?
            `,
            [id],
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(`Error en getCliente (ID: ${req.params.id}):`, error);
        res.status(500).json({
            error: "Error al obtener el cliente de la base de datos",
        });
    }
};

// Crear un nuevo cliente
export const createCliente = async (req, res) => {
    const {
        tipo_cliente_id,
        nombre,
        apellido,
        DNI,
        correo,
        direccion,
        telefono,
    } = req.body;

    if (!nombre || !apellido || !DNI) {
        return res
            .status(400)
            .json({ message: "Nombre, Apellido y DNI son obligatorios." });
    }
    try {
        const [result] = await pool.query(
            `
                INSERT INTO Cliente (tipo_cliente_id, nombre, apellido, DNI, correo, direccion, telefono) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
            [
                tipo_cliente_id,
                nombre,
                apellido,
                DNI,
                correo,
                direccion,
                telefono,
            ],
        );

        res.status(201).json({
            message: "Cliente registrado exitosamente",
            id: result.insertId,
            tipo_cliente_id,
            nombre,
            apellido,
            DNI,
            correo,
            direccion,
            telefono,
        });
    } catch (error) {
        console.error("Error en createCliente:", error);
        if (error.errno === 1062) {
            return res.status(400).json({
                error: "El DNI o Correo ya se encuentra registrado.",
            });
        }

        res.status(500).json({
            error: "Error al registrar un cliente en la base de datos",
        });
    }
};

// Actualizar datos de un cliente
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            tipo_cliente_id,
            nombre,
            apellido,
            DNI,
            correo,
            direccion,
            telefono,
        } = req.body;

        // CORREGIDO: Sintaxis con comas (,) y cláusula WHERE obligatoria al final
        const [result] = await pool.query(
            `
            UPDATE Cliente SET 
                tipo_cliente_id = ?,
                nombre = ?,
                apellido = ?,
                DNI = ?,
                correo = ?,
                direccion = ?,
                telefono = ?
            WHERE id = ?
            `,
            [
                tipo_cliente_id,
                nombre,
                apellido,
                DNI,
                correo,
                direccion,
                telefono,
                id, // No olvides pasar el ID al final del arreglo
            ],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json({
            message: "Cliente actualizado con éxito",
            id,
            tipo_cliente_id,
            nombre,
            apellido,
            DNI,
            correo,
            direccion,
            telefono,
        });
    } catch (error) {
        console.error("Error en updateCliente:", error);
        
        // Manejo de error si intentan actualizar a un DNI o Correo ya ocupado por otro cliente
        if (error.errno === 1062) {
            return res.status(400).json({ error: "El DNI o Correo ya se encuentra registrado por otro cliente." });
        }

        res.status(500).json({
            error: "Error al actualizar el cliente en la base de datos",
        });
    }
};

// Eliminar un cliente aplicando Borrado Lógico
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        
        // En lugar de DELETE, usamos UPDATE para desactivar el estado
        const [result] = await pool.query(
            `
            UPDATE Cliente SET estado = false WHERE id = ? AND estado = true
            `,
            [id],
        );

        // Si no afectó filas, significa que el ID no existe o que ya estaba desactivado
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "El cliente no existe o ya se encuentra dado de baja" });
        }

        res.json({ message: "Cliente dado de baja correctamente en el sistema" });
    } catch (error) {
        console.error("Error en deleteCliente:", error);
        res.status(500).json({
            error: "Error al intentar dar de baja al cliente en la base de datos",
        });
    }
};

