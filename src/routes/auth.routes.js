import { Router } from 'express';
import { iniciarSesion, registrarUsuario, recuperarContrasena } from '../controllers/auth.controller.js';

const router = Router();

/**
 * POST /login
 * Inicia sesión validando credenciales y generando un token JWT.
 */
router.post('/login', iniciarSesion);

/**
 * POST /registro
 * Registra un nuevo usuario en la base de datos con contraseña encriptada.
 */
router.post('/registro', registrarUsuario);

/**
 * POST /recuperar-password
 * Solicita el restablecimiento de contraseña para un correo determinado.
 */
router.post('/recuperar-password', recuperarContrasena);

export default router;