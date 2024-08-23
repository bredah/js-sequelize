// test/unit/models/Mensagem.test.js
import { describe, expect, test, beforeAll, afterAll } from "@jest/globals";
import sequelize from "../../../src/config/databaseFactory";
import Mensagem from "../../../src/models/mensagem";

process.env.MY_ENV_VARIABLE = "test";

describe("modelo: mensagem", () => {
  beforeAll(async () => {
    Mensagem.init(sequelize);
    await sequelize.sync({ force: true });
  });

  

  describe("registrar", () => {
    test("deve permitir criar uma instância válida", async () => {
      const mensagemData = {
        usuario: "UsuarioTeste",
        conteudo: "Olá, mundo!",
      };

      const mensagem = Mensagem.build(mensagemData);
      const savedMensagem = await mensagem.save();

      expect(savedMensagem.id).toBeDefined();
      expect(savedMensagem.usuario).toBe(mensagemData.usuario);
      expect(savedMensagem.conteudo).toBe(mensagemData.conteudo);
      expect(savedMensagem.gostei).toBe(0);
    });

    test("não deve permitir registrar mensagem sem o campo usuario", async () => {
      const mensagemData = { conteudo: "Olá, mundo!" };

      const mensagem = Mensagem.build(mensagemData);
      await expect(mensagem.validate()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining("o campo 'usuario' é obrigatório"),
        })
      );
    });

    test("não deve permitir registrar mensagem com o campo usuario vazio", async () => {
      const mensagemData = { usuario: "", conteudo: "Olá, mundo!" };

      const mensagem = Mensagem.build(mensagemData);
      await expect(mensagem.validate()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining(
            "o campo 'usuario' deve ser preenchido"
          ),
        })
      );
    });

    test("não deve permitir registrar mensagem com o campo usuario com menos de 10 caracteres", async () => {
      const mensagemData = { usuario: "usuario", conteudo: "Olá, mundo!" };

      const mensagem = Mensagem.build(mensagemData);
      await expect(mensagem.validate()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining(
            "o campo 'usuario' deve ter entre 8 a 20 caracteres"
          ),
        })
      );
    });

    test("não deve permitir registrar mensagem com o campo usuario com mais de 25 caracteres", async () => {
      const mensagemData = {
        usuario: "usuario mais de 25 caracteres",
        conteudo: "Olá, mundo!",
      };

      const mensagem = Mensagem.build(mensagemData);
      await expect(mensagem.validate()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining(
            "o campo 'usuario' deve ter entre 8 a 20 caracteres"
          ),
        })
      );
    });

    test("não deve permitir registrar mensagem sem o campo conteúdo", async () => {
      const mensagemData = { usuario: "UsuarioTeste" };

      const mensagem = Mensagem.build(mensagemData);
      await expect(mensagem.validate()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining("o campo 'conteudo' é obrigatório"),
        })
      );
    });

    test("não deve permitir registrar mensagem com o campo conteúdo vazio", async () => {
      const mensagemData = {
        usuario: "usuario 1",
        conteudo: "",
      };

      const mensagem = Mensagem.build(mensagemData);
      await expect(mensagem.validate()).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining(
            "o campo 'conteudo' deve ser preenchido"
          ),
        })
      );
    });
  });
});
