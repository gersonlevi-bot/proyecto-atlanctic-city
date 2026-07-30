import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

/**
 * Clave secreta para firmar tokens JWT.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_atlantic_city';

/**
 * Registra un nuevo usuario en la base de datos, cifrando su contraseña.
 */
export const registrarUsuario = async (req, res) => {
    const { rol_id, nombre, correo, contrasena, foto_url } = req.body;

    if (!rol_id || !nombre || !correo || !contrasena) {
        return res.status(400).json({ message: "Los campos rol, nombre, correo y contraseña son obligatorios" });
    }

    try {
        // Verificar correo existente
        const [existe] = await pool.query('SELECT id FROM Usuario WHERE correo = ?', [correo]);
        if (existe.length > 0) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Encriptar clave
        const salt = await bcrypt.genSalt(10);
        const contrasenaHashed = await bcrypt.hash(contrasena, salt);

        const sql = `
            INSERT INTO Usuario (rol_id, nombre, correo, contrasena, foto_url, estado) 
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        await pool.query(sql, [rol_id, nombre, correo, contrasenaHashed, foto_url || null]);

        return res.status(201).json({ message: "Usuario registrado con éxito" });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Autentica un usuario verificando credenciales y emite un JWT firmado válido por 8 horas.
 */
export const iniciarSesion = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    try {
        // Consulta uniendo con la tabla Rol
        const sql = `
            SELECT u.*, r.nombre AS rol_nombre 
            FROM Usuario u 
            INNER JOIN Rol r ON u.rol_id = r.id 
            WHERE u.correo = ?
        `;
        const [usuarios] = await pool.query(sql, [correo]);

        if (usuarios.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const usuario = usuarios[0];

        if (usuario.estado === 0) {
            return res.status(403).json({ message: "La cuenta se encuentra inactiva" });
        }

        const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esValida) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Token JWT
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo, rol: usuario.rol_nombre }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        delete usuario.contrasena;

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            usuario
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Simula el proceso de solicitud de restablecimiento de contraseña.
 */
export const recuperarContrasena = async (req, res) => {
    const { correo } = req.body;

    if (!correo) return res.status(400).json({ message: "El correo es requerido" });

    try {
        const [usuarios] = await pool.query('SELECT id FROM Usuario WHERE correo = ?', [correo]);
        
        return res.status(200).json({ 
            message: usuarios.length > 0 
                ? "Código enviado al correo" 
                : "Si el correo existe, se enviará un código" 
        });

    } catch (error) {
        console.error("Error en recuperar contraseña:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};