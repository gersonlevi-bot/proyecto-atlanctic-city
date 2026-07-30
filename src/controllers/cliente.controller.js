import { pool } from "../config/db.js";

/**
 * Obtiene el listado completo de clientes activos junto al nombre de su categoría.
 */
export const getClientes = async (req, res) => {
    try {
        // Consulta uniendo con la tabla Tipo_cliente
        const sql = `
            SELECT c.*, tc.nombre AS tipo_cliente_nombre 
            FROM Cliente c
            INNER JOIN Tipo_Cliente tc ON c.tipo_cliente_id = tc.id
            WHERE c.estado = true
        `;

        const [rows] = await pool.query(sql);

        res.json(rows);
    } catch (error) {
        console.error("Error en getClientes:", error);
        res.status(500).json({ error: "Error al obtener los clientes." });
    }
};

/**
 * Obtiene la información detallada de un cliente específico por su ID.
 */
export const getCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT c.*, tc.nombre AS tipo_cliente_nombre 
            FROM Cliente c
            INNER JOIN Tipo_Cliente tc ON c.tipo_cliente_id = tc.id
            WHERE c.id = ?
        `;

        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado." });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(`Error en getCliente (ID: ${req.params.id}):`, error);
        res.status(500).json({ error: "Error al obtener el cliente." });
    }
};

/**
 * Registra un nuevo cliente en la base de datos.
 * Nota: La validación previa de los datos es garantizada por el middleware `validarCliente`.
 */
export const createCliente = async (req, res) => {
    const { tipo_cliente_id, nombre, apellido, DNI, correo, direccion, telefono } = req.body;

    try {
        const sql = `
            INSERT INTO Cliente (tipo_cliente_id, nombre, apellido, DNI, correo, direccion, telefono) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            tipo_cliente_id,
            nombre,
            apellido,
            DNI,
            correo || null,
            direccion || null,
            telefono || null
        ]);

        res.status(201).json({
            message: "Cliente registrado exitosamente",
            id: result.insertId,
            tipo_cliente_id,
            nombre,
            apellido,
            DNI,
            correo,
            direccion,
            telefono
        });
    } catch (error) {
        console.error("Error en createCliente:", error);
        
        // Manejo de restricción de Unicidad SQL (Error 1062 = Entrada Duplicada)
        if (error.errno === 1062) {
            return res.status(400).json({ error: "El DNI o Correo ya se encuentra registrado." });
        }

        res.status(500).json({ error: "Error interno al registrar el cliente." });
    }
};

/**
 * Actualiza la información de un cliente existente por su ID.
 */
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_cliente_id, nombre, apellido, DNI, correo, direccion, telefono } = req.body;

        const sql = `
            UPDATE Cliente SET 
                tipo_cliente_id = ?,
                nombre = ?,
                apellido = ?,
                DNI = ?,
                correo = ?,
                direccion = ?,
                telefono = ?
            WHERE id = ?
        `;

        const [result] = await pool.query(sql, [
            tipo_cliente_id,
            nombre,
            apellido,
            DNI,
            correo || null,
            direccion || null,
            telefono || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado." });
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
            telefono
        });
    } catch (error) {
        console.error("Error en updateCliente:", error);
        
        if (error.errno === 1062) {
            return res.status(400).json({ error: "El DNI o Correo pertenece a otro cliente registrado." });
        }

        res.status(500).json({ error: "Error al actualizar el cliente." });
    }
};

/**
 * Desactiva un cliente mediante borrado lógico (estado = false).
 */
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            UPDATE Cliente SET estado = false WHERE id = ? AND estado = true
        `
        
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "El cliente no existe o ya está dado de baja." });
        }

        res.json({ message: "Cliente dado de baja correctamente." });
    } catch (error) {
        console.error("Error en deleteCliente:", error);
        res.status(500).json({ error: "Error al intentar dar de baja al cliente." });
    }
};