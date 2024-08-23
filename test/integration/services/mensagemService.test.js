// tests/integration/services/mensagemService.test.js

import { mensagemService } from "../../../src/services";
import { models, sequelize } from "../../../src/models";
import seedMensagem from "../../../database/seeders/20240815113429-mensagens";
import { validate } from "uuid";

let seedMensagens;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await seedMensagem.up(sequelize.getQueryInterface(), sequelize);
  seedMensagens = await models.mensagem.findAll();
});

afterEach(async () => {
  await models.mensagem.truncate();
});

afterAll(async () => {
});

describe("service: mensagem", () => {
  describe("registrar", () => {
    test("deve permitir registrar uma mensagem", async () => {
      const msgData = {
        usuario: "ususario_00",
        conteudo: "Olá, mundo!",
      };

      const mensagem = await mensagemService.registrar(msgData);
      expect(validate(mensagem.id)).toBe(true);
      expect(mensagem.usuario).toBe(msgData.usuario);
      expect(mensagem.conteudo).toBe(msgData.conteudo);
      expect(mensagem.gostei).toBe(0);
      expect(mensagem.updatedAt).toBeInstanceOf(Date);
      expect(mensagem.createdAt).toBeInstanceOf(Date);
    });

    test("não deve permitir registrar uma mensagem sem usuário", async () => {
      const msgData = {
        conteudo: "Olá, mundo!",
      };
      await expect(mensagemService.registrar(msgData)).rejects.toThrow(
        "o campo 'usuario' é obrigatório"
      );
    });

    test("não deve permitir registrar uma mensagem sem conteudo", async () => {
      const msgData = {
        usuario: "usuario",
      };

      await expect(mensagemService.registrar(msgData)).rejects.toThrow(
        "o campo 'conteudo' é obrigatório"
      );
    });
  });

  describe("deletar", () => {
    test("deve permitir deletar uma mensagem", async () => {
      const mensagem = seedMensagens[0];
      await mensagemService.eliminar(mensagem.id);

      const mensagemEncontrada = await models.mensagem.findByPk(mensagem.id);

      expect(mensagemEncontrada).toBeNull();
    });
  });

describe("atualizar", () => {
  test("deve permitir atualizar apenas o conteúdo de uma mensagem", async () => {
    const mensagem = seedMensagens[0];
    const msgDataAtualizada = { conteudo: "Tudo bem?" };

    // Realiza a atualização
    await mensagemService.atualizar(mensagem.id, msgDataAtualizada);

    // Obtém a mensagem atualizada do banco de dados
    const msgAtualizada = await models.mensagem.findByPk(mensagem.id);

    // Verifica se o ID permaneceu o mesmo
    expect(mensagem.id).toBe(msgAtualizada.id);

    // Verifica se o campo 'conteudo' foi atualizado corretamente
    expect(msgAtualizada.conteudo).not.toBe(mensagem.conteudo);
    expect(msgAtualizada.conteudo).toBe("Tudo bem?");

    // Verifica se o campo 'usuario' não foi alterado
    expect(msgAtualizada.usuario).toBe(mensagem.usuario);


    // Verifica se o campo 'updatedAt' foi atualizado corretamente
    expect(msgAtualizada.updatedAt.getTime()).toBeGreaterThan(
      msgAtualizada.createdAt.getTime()
    );
  });
});

  describe("buscar", () => {
    test("deve permitir buscar mensagem por ID", async () => {
      const mensagem = seedMensagens[0];
      const mensagemEncontrada = await mensagemService.buscarPorId(
        mensagem.id
      );

      expect(mensagemEncontrada.id).toBe(mensagem.id);
      expect(mensagemEncontrada.usuario).toBe(mensagem.usuario);
      expect(mensagemEncontrada.conteudo).toBe(mensagem.conteudo);
      expect(mensagemEncontrada.gostei).toBe(0);
      expect(mensagemEncontrada.updatedAt).toBeInstanceOf(Date);
      expect(mensagemEncontrada.createdAt).toBeInstanceOf(Date);
    });

    test("deve retornar null quando a mensagem não for encontrada", async () => {
      const msgId = "d2160977-bdba-4c4e-9167-c90f9fd1baa6";
      await expect(mensagemService.buscarPorId(msgId)).rejects.toThrow(
        `erro ao obter mensagem: ${msgId} - mensagem não encontrada`
      );
    });
  });
});
