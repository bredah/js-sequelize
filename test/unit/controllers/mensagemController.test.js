// test/unit/controller/MensagemController.test.js

import MensagemController from "../../../src/controllers/mensagemController";
import MensagemService from "../../../src/services/mensagemService";

// Mock do Modelo de Mensagem
const MensagemModelMock = {
  build: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const mensagemService = new MensagemService(MensagemModelMock);
const mensagemController = new MensagemController(mensagemService);

let req;
let res;

const MSG_ID = "71c869f0-ce23-4da0-804f-71e735199da3";
const DADOS_MSG = {
  usuario: "usuario_00",
  conteudo: "Mensagem de teste",
};



beforeEach(() => {
  req = { body: {}, params: {}, query: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("controller: mensagem", () => {
  describe("contexto: registrar mensagem", () => {
    test("deve registrar uma nova mensagem", async () => {
      const dadosMsgMock = {
        id: MSG_ID,
        ...DADOS_MSG,
      };
      mockRegistrarMensagem(dadosMsgMock);

      req.body = DADOS_MSG;

      await mensagemController.registrar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(dadosMsgMock);
    });

    test("deve retornar erro ao tentar registrar uma nova mensagem", async () => {
      MensagemModelMock.build.mockReturnValueOnce({
        save: jest.fn().mockRejectedValue(new Error("erro gerado pelo mock")),
      });

      req.body = DADOS_MSG;

      await mensagemController.registrar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      // parte da mensagem
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("erro ao registrar mensagem"),
        })
      );
      // mensagem completa
      expect(res.json).toHaveBeenCalledWith({
        error: "erro ao registrar mensagem: erro gerado pelo mock",
      });
    });
  });

  describe("contexto: buscar mensagem", () => {
    test("deve retornar mensagem por ID", async () => {
      const dadosMsgMock = {
        id: MSG_ID,
        ...DADOS_MSG,
      };

      mockBuscarMensagem(dadosMsgMock);

      req.params.id = MSG_ID;

      await mensagemController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(dadosMsgMock);
    });

    test("deve retornar erro se a mensagem não for encontrada", async () => {
      MensagemModelMock.findByPk.mockResolvedValue(null);

      req.params.id = MSG_ID;

      await mensagemController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: `erro ao obter mensagem: ${MSG_ID} - mensagem não encontrada`,
      });
    });
  });

  describe("contexto: atualizar mensagem", () => {
    test("deve atualizar mensagem", async () => {
      const dadosMsgMock = {
        id: MSG_ID,
        ...DADOS_MSG,
      };
      const updatedMensagem = { ...DADOS_MSG, conteudo: "novo conteudo" };

      mockAtualizarMensagem(updatedMensagem, dadosMsgMock);

      req.params.id = MSG_ID;
      req.body = { conteudo: "novo conteudo" };

      await mensagemController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedMensagem);
    });

    test("deve retornar erro ao tentar atualizar mensagem", async () => {
      MensagemModelMock.update.mockRejectedValue(new Error("erro gerado pelo mock"));

      req.params.id = MSG_ID;
      req.body = { conteudo: "Mensagem atualizada" };

      await mensagemController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: `erro ao atualizar mensagem ${MSG_ID}: erro gerado pelo mock`,
      });
    });

    test("deve retornar erro se a mensagem não for encontrada para atualizar", async () => {
      MensagemModelMock.update.mockResolvedValue([0]);

      req.params.id = MSG_ID;
      req.body = { conteudo: "novo conteudo" };
      await mensagemController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "mensagem não encontrada",
      });
    });
  });

  describe("eliminar mensagem", () => {
    test("deve eliminar mensagem", async () => {
      const dadosMsgMock = {
        id: MSG_ID,
        ...DADOS_MSG,
      };
      mockBuscarMensagem(dadosMsgMock);

      req.params.id = MSG_ID;
      await mensagemController.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test("deve retornar erro ao tentar eliminar mensagem", async () => {
      const id = MSG_ID;
      MensagemModelMock.findByPk.mockRejectedValue(new Error("erro gerado pelo mock"));

      req.params.id = id;
      await mensagemController.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: `não foi possível eliminar mensagem: ${id}`,
      });
    });
  });
});

// Funções de Mock

function mockRegistrarMensagem(mensagem) {
  MensagemModelMock.build.mockReturnValueOnce({
    ...mensagem,
    save: jest.fn().mockResolvedValue(mensagem),
    toJSON: jest.fn().mockReturnValue(mensagem),
  });
}

function mockBuscarMensagem(mensagem) {
  MensagemModelMock.findByPk.mockResolvedValue({
    toJSON: jest.fn().mockReturnValue(mensagem),
  });
}

function mockListarMensagens(mensagens) {
  MensagemModelMock.findAll.mockResolvedValue(
    mensagens.messages.map((msg) => ({
      ...msg,
      toJSON: () => msg,
    }))
  );
  MensagemModelMock.count.mockResolvedValue(mensagens.total);
}

function mockAtualizarMensagem(mensagem, updatedMensagem) {
  const updatedInstance = {
    ...updatedMensagem,
    toJSON: jest.fn().mockReturnValue(updatedMensagem),
  };

  MensagemModelMock.update.mockResolvedValue([1, [updatedInstance]]);
  MensagemModelMock.findByPk.mockResolvedValue({
    toJSON: jest.fn().mockReturnValue(mensagem),
  });
}
