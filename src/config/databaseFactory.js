// src/config/databaseFactory.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class DataBaseFactory {
  constructor() {
    if (!DataBaseFactory.instance) {
      this.sequelize = this._initializeSequelize();
      DataBaseFactory.instance = this;
    }
  }

  _initializeSequelize() {
    const config =
      process.env.NODE_ENV === "test"
        ? {
            options: {
              dialect: "sqlite",
              storage: ":memory:",
              logging: false,
            },
          }
        : {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            options: {
              dialect: process.env.DB_DIALECT,
              host: process.env.DB_HOST,
              port: process.env.DB_PORT,
              database: process.env.DB_NAME,
              sync: process.env.DB_SYNC === "true" || false,
              logging: process.env.DB_LOGGING === "true" || false,
            },
          };

    return new Sequelize(
      config.database || undefined,
      config.username || undefined,
      config.password || undefined,
      config.options
    );
  }

  async connect() {
    if (this.sequelize) {
      try {
        await this.sequelize.authenticate();
        console.log("Conexão estabelecida com sucesso");
      } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw error;
      }
    }
    return this.sequelize;
  }

  async disconnect() {
    if (this.sequelize) {
      try {
        await this.sequelize.close();
        this.sequelize = null;
        console.log("Conexão com o banco de dados encerrada");
      } catch (error) {
        console.error(
          "Erro ao encerrar a conexão com o banco de dados:",
          error
        );
        throw error;
      }
    } else {
      console.log("Nenhuma conexão com o banco de dados para encerrar");
    }
  }

  async isConnected() {
    if (!this.sequelize) {
      return false;
    }
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }
}

const databaseFactory = new DataBaseFactory();
export default databaseFactory.sequelize;
