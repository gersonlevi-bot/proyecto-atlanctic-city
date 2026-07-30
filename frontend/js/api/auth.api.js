const URL_BASE = "http://localhost:3000";

/**
 * Realiza la petición POST para autenticar un usuario en el sistema.
 */
export const iniciarSesion = async (credenciales) => {
    const res = await fetch(`${URL_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Error al iniciar sesión");
    }

    return data;
};

/**
 * Envia la información de un nuevo usuario para registrarlo en la base de datos.
 */
export const registrarUsuario = async (datosUsuario) => {
    const res = await fetch(`${URL_BASE}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Error al registrar el usuario");
    }

    return data;
};

/**
 * Solicita el envío de un código de verificación para restablecer la contraseña.
 */
export const recuperarContrasena = async (correo) => {
    const res = await fetch(`${URL_BASE}/auth/recuperar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Error al solicitar el código");
    }

    return data;
};