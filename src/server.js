// src/server.js
import express from "express";
import mensagemRouter from "./routes/mensagemRoute";


const app = express();

app.use(express.json());
app.use("/mensagens", mensagemRouter);

export default app;
