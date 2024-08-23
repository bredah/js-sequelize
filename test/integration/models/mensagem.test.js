import * as uuid from "uuid";
import { models, sequelize } from "../../../src/models";
import seedMensagens from "../../../database/seeders/20240815113429-mensagens";

let seedMensagem;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await seedMensagens.up(sequelize.getQueryInterface(), sequelize);
  seedMensagem = await models.mensagem.findAll();
});

afterEach(async () => {
  await models.mensagem.truncate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("model: mensagem", () => {
  describe("registrar", () => {
    test("deve permitir registrar uma mensagem", async () => {
      const msgData = {
        usuario: "usuario_01",
        conteudo: "olá, mundo!",
      };

      const mensagem = await models.mensagem.create(msgData);
      expect(uuid.validate(mensagem.id)).toBe(true);
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
      await expect(models.mensagem.create(msgData)).rejects.toThrow(
        "o campo 'usuario' é obrigatório"
      );
    });

    test("não deve permitir registrar uma mensagem sem conteudo", async () => {
      const msgData = {
        usuario: "usuario",
      };

      await expect(models.mensagem.create(msgData)).rejects.toThrow(
        "o campo 'conteudo' é obrigatório"
      );
    });
  });

  describe("deletar", () => {
    test("deve permitir deletar uma mensagem", async () => {
      const mensagem = seedMensagem[0];
      await models.mensagem.destroy({ where: { id: mensagem.id } });
      const mensagemEncontrada = await models.mensagem.findByPk(mensagem.id);

      expect(mensagemEncontrada).toBeNull();
    });
  });

  describe("atualizar", () => {
    test("deve permitir atualizar uma mensagem", async () => {
      const mensagem = seedMensagem[0];

      const msgDataAtualizada = {  conteudo: "Tudo bem?" };

      await models.mensagem.update(msgDataAtualizada, {
        where: { id: mensagem.id },
      });

      const msgAtualizada = await models.mensagem.findByPk(mensagem.id);

      expect(mensagem.id).toBe(msgAtualizada.id);
      expect(mensagem.conteudo).not.toBe(msgAtualizada.conteudo);
      expect(msgAtualizada.updatedAt.getTime()).toBeGreaterThan(
        msgAtualizada.createdAt.getTime()
      );
    });
  });

  describe("buscar", () => {
    test("deve permitir buscar todas as mensagens", async () => {
      const mensagens = await models.mensagem.findAll();
      expect(mensagens.length).toBe(seedMensagem.length);
    });

    test("deve retornar null quando a mensagem não for encontrada", async () => {
      const msgId = "cfc1f0d5-581b-45ac-80bb-5b56865c69a8";
      expect(await models.mensagem.findByPk(msgId)).toBeNull();
    });

    test("deve permitir buscar mensagem por ID", async () => {
      const mensagem = seedMensagem[0];
      const mensagemEncontrada = await models.mensagem.findByPk(mensagem.id);

      expect(mensagemEncontrada.id).toBe(mensagem.id);
      expect(mensagemEncontrada.usuario).toBe(mensagem.usuario);
      expect(mensagemEncontrada.conteudo).toBe(mensagem.conteudo);
      expect(mensagemEncontrada.gostei).toBe(0);
      expect(mensagemEncontrada.updatedAt).toBeInstanceOf(Date);
      expect(mensagemEncontrada.createdAt).toBeInstanceOf(Date);
    });
  });
});
