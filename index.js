// src/index.js

import app from "./src/server";
// import { config } from "dotenv";

// config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Não foi possível iniciar o servidor:", error);
  }
};

startServer();
