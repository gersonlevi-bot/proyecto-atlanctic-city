import {
    obtenerClientes,
    obtenerCliente,
    registrarCliente,
} from "../api/clientesApi.js";

// Ejecutamos la prueba automáticamente cuando la página termine de cargar
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Iniciando pruebas de la API de Clientes...");

    try {
        // PRUEBA 1: Obtener todos los clientes
        console.group("1. Prueba obtenerClientes");
        const todosLosClientes = await obtenerClientes();
        console.log("Respuesta del servidor:", todosLosClientes);
        console.table(todosLosClientes); // Muestra los datos en una tabla interactiva en consola
        console.groupEnd();

        // PRUEBA 2: Obtener un cliente específico (Usa un ID real de tu Base de Datos)
        const idDePrueba = 2;
        console.group(`2. Prueba obtenerCliente con ID: ${idDePrueba}`);
        const unCliente = await obtenerCliente(idDePrueba);
        console.log("Datos del cliente único:", unCliente);
        console.groupEnd();

        // // PRUEBA 3: Registrar un nuevo cliente
        // console.group("3. Prueba registrarCliente");
        // const nuevoClienteMock = {
        //     tipo_cliente_id: 2,
        //     nombre: "Gerson",
        //     apellido: "Urbina",
        //     DNI: "76543210",
        //     correo: "gato@email.com",
        //     direccion: "Av. Larco 456, Miraflores",
        //     telefono: "987654321",
        // };
        // const clienteRegistrado = await registrarCliente(nuevoClienteMock);
        // console.log("Cliente registrado exitosamente:", clienteRegistrado);
        // console.groupEnd();
    } catch (error) {
        console.error("❌ Error detectado en las pruebas de la API:");
        console.error(error.message);
    }
});
