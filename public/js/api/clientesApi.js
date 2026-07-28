const URL_BASE = "http://localhost:3000";

export const obtenerClientes = async () => {
    const res = await fetch(`${URL_BASE}/clientes`);
    if (!res.ok) throw new Error("Error al obtener clientes");

    return res.json();
};

export const obtenerCliente = async (id) => {
    const res = await fetch(`${URL_BASE}/clientes/${id}`);
    if (!res.ok) throw new Error(`Error al obtener el cliente con id ${id}`);

    return res.json();
};

export const registrarCliente = async (datosCliente) => {
    const res = await fetch(`${URL_BASE}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosCliente),
    });

    return res.json();
};

export const actualizarCliente = async (id, datosActualizadosCliente) => {
    const res = await fetch(`${URL_BASE}/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizadosCliente),
    });

    return res.json();
};

export const eliminarCliente = async (id) => {
    const res = await fetch(`${URL_BASE}/clientes/:${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Error al elminar el cliente con id ${id}`);

    return res.json();
};
