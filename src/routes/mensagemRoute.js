// src/routes/mensagemRoute.js
import express from "express";
import {mensagemController} from "../controllers";

const mensagemRouter = express.Router();

mensagemRouter.post("/", mensagemController.registrar.bind(mensagemController));
mensagemRouter.get("/", mensagemController.listar.bind(mensagemController));
mensagemRouter.get("/:id", mensagemController.buscarPorId.bind(mensagemController));
mensagemRouter.put("/:id", mensagemController.atualizar.bind(mensagemController));
mensagemRouter.delete("/:id", mensagemController.eliminar.bind(mensagemController));

export default mensagemRouter;
