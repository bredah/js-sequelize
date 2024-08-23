import request from "supertest";
import { sequelize, models } from "../../../src/models";
import server from "../../../src/server";
import seedMensagem from "../../../database/seeders/20240815113429-mensagens";

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

describe("controller: mensagem", () => {
  describe("contexto: registrar mensagem", () => {
    test("deve registrar uma nova mensagem", async () => {
      const novaMensagem = {
        usuario: "usuario_01",
        conteudo: "Nova mensagem",
      };

      const response = await request(server)
        .post("/mensagens")
        .send(novaMensagem);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(novaMensagem);
    });

    test("deve retornar erro ao tentar registrar uma mensagem sem usuário", async () => {
      const novaMensagem = { conteudo: "Nova mensagem" };

      const response = await request(server)
        .post("/mensagens")
        .send(novaMensagem);

      expect(response.status).toBe(500);
      expect(response.body.error).toMatch(
        "erro ao registrar mensagem: notNull Violation: o campo 'usuario' é obrigatório"
      );
    });

    test("deve retornar erro ao tentar registrar uma mensagem sem conteúdo", async () => {
      const novaMensagem = { usuario: "usuario_00" };

      const response = await request(server)
        .post("/mensagens")
        .send(novaMensagem);

      expect(response.status).toBe(500);
      expect(response.body.error).toMatch(
        "erro ao registrar mensagem: notNull Violation: o campo 'conteudo' é obrigatório"
      );
    });
  });

  describe("Buscar Mensagem por ID", () => {
    test("deve buscar uma mensagem por ID", async () => {
      const mensagem = seedMensagens[0];

      const response = await request(server).get(`/mensagens/${mensagem.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        usuario: mensagem.usuario,
        conteudo: mensagem.conteudo,
      });
    });

    test("deve retornar 404 se a mensagem não for encontrada", async () => {
      const msgId = "non-existing-id";
      const response = await request(server).get(`/mensagens/${msgId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(
        `erro ao obter mensagem: ${msgId} - mensagem não encontrada`
      );
    });
  });

  describe("Atualizar Mensagem", () => {
    test("deve atualizar uma mensagem por ID", async () => {
      const mensagem = seedMensagens[0];

      const response = await request(server)
        .put(`/mensagens/${mensagem.id}`)
        .send({ conteudo: "Mensagem atualizada" });

      expect(response.status).toBe(200);
      expect(response.body.conteudo).toBe("Mensagem atualizada");
    });

    test("deve retornar erro ao tentar atualizar uma mensagem que não existe", async () => {
      const response = await request(server)
        .put("/mensagens/non-existing-id")
        .send({ conteudo: "Mensagem atualizada" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("mensagem não encontrada");
    });

    test("deve retornar erro ao tentar atualizar uma mensagem sem conteúdo", async () => {
      const mensagem = seedMensagens[0];
      const response = await request(server)
        .put(`/mensagens/${mensagem.id}`)
        .send({ conteudo: "" });

      expect(response.status).toBe(500);

      expect(response.body.error).toEqual(
        expect.stringContaining(`erro ao atualizar mensagem ${mensagem.id}`)
      );
      expect(response.body.error).toEqual(
        expect.stringContaining("o campo 'conteudo' deve ser preenchido")
      );
    });
  });

  describe("Eliminar Mensagem", () => {
    test("deve eliminar uma mensagem por ID", async () => {
      const mensagem = seedMensagens[0];
      const response = await request(server).delete(
        `/mensagens/${mensagem.id}`
      );

      expect(response.status).toBe(204);
    });

    test("deve retornar erro ao tentar eliminar uma mensagem que não existe", async () => {
      const msgId = "f3015e81-5972-47e3-84a2-fd3432ec7e9b";
      const response = await request(server).delete("/mensagens/" + msgId);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe(
        "não foi possível eliminar mensagem: " + msgId
      );
    });
  });
});
