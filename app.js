import express from "express";
import clienteRouter from "./src/routes/cliente.routes.js";
import cors from "cors";

const app = express()
app.use(cors())
app.use(express.json())
app.use(clienteRouter)

export default app
