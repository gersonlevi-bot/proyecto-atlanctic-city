const URL_BASE = "http://localhost:3000";

/**
 * Obtiene el token de autenticación guardado en LocalStorage.
 */
const obtenerTokenHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

/**
 * Realiza una petición GET al servidor para obtener el listado completo de clientes.
 */
export const obtenerClientes = async () => {
    const res = await fetch(`${URL_BASE}/clientes`, {
        headers: {
            ...obtenerTokenHeader()
        }
    });
    if (!res.ok) throw new Error("Error al obtener clientes");

    return res.json();
};

/**
 * Consulta la información detallada de un cliente específico según su ID.
 */
export const obtenerCliente = async (id) => {
    const res = await fetch(`${URL_BASE}/clientes/${id}`, {
        headers: {
            ...obtenerTokenHeader()
        }
    });
    if (!res.ok) throw new Error(`Error al obtener el cliente con id ${id}`);

    return res.json();
};

/**
 * Envia los datos de un nuevo cliente mediante una petición POST para almacenarlo en la BD.
 */
export const registrarCliente = async (datosCliente) => {
    const res = await fetch(`${URL_BASE}/clientes`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...obtenerTokenHeader()
        },
        body: JSON.stringify(datosCliente),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || errorData.error || "Error en el servidor");
    }

    return await res.json();
};

/**
 * Modifica los datos de un cliente existente enviando una actualización completa (PUT).
 */
export const actualizarCliente = async (id, datosActualizadosCliente) => {
    const res = await fetch(`${URL_BASE}/clientes/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            ...obtenerTokenHeader()
        },
        body: JSON.stringify(datosActualizadosCliente),
    });

    return res.json();
};

/**
 * Elimina el registro (forma lógica) de un cliente en el sistema según su identificador.
 */
export const eliminarCliente = async (id) => {
    /** @type {Response} Objeto respuesta HTTP de la eliminación. */
    const res = await fetch(`${URL_BASE}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
            ...obtenerTokenHeader()
        }
    });
    if (!res.ok) throw new Error(`Error al eliminar el cliente con id ${id}`);

    return res.json();
};