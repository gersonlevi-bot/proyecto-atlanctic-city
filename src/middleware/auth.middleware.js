import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

/**
 * Clave secreta para desencriptar y verificar tokens JWT.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_atlantic_city';

/**
 * Middleware para validar que la petición contenga un token JWT válido en las cabeceras (`Authorization: Bearer <token>`).
 */
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const decodificado = jwt.verify(token, JWT_SECRET);
        req.usuario = decodificado;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};

/**
 * Higher-Order Middleware para restringir el acceso a rutas según el rol del usuario autenticado.
 */
export const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario?.rol || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ message: "Sin permisos suficientes para esta acción." });
        }
        next();
    };
};