// tests/unit/services/mensagemService.test.js

import MensagemService from "../../../src/services/mensagemService";
import Mensagem from "../../../src/models/mensagem";

jest.mock("../../../src/models/mensagem");

const MSG_ID = "71c869f0-ce23-4da0-804f-71e735199da3";

/** @type {MensagemService} */
const mensagemService = new MensagemService(Mensagem);

describe("service: mensagem", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registrar mesagem", () => {
    test("deve permitir registrar uma nova mensagem", async () => {
      mockRegistrarMensagem(msgData());

      const resultado = await mensagemService.registrar(msgConteudo());

      expect(Mensagem.build).toHaveBeenCalledWith(msgConteudo());
      expect(resultado).toEqual(msgData());
    });

    test("deve lançar erro ao falhar no registro", async () => {
      Mensagem.build.mockReturnValueOnce({
        save: jest.fn().mockRejectedValue(new Error("Erro ao salvar")),
      });

      await expect(mensagemService.registrar(msgConteudo())).rejects.toThrow(
        "erro ao registrar mensagem"
      );
    });
  });

  describe("buscar mensagem", () => {
    test("deve permitir buscar uma mensagem por ID", async () => {
      const mensagem = msgData();
      mockBuscarMensagem(mensagem);

      const resultado = await mensagemService.buscarPorId(mensagem.id);

      expect(Mensagem.findByPk).toHaveBeenCalledWith(mensagem.id);
      expect(resultado).toEqual(mensagem);
    });

    test("deve lançar erro ao buscar mensagem quando o ID não for encontrado", async () => {
      Mensagem.findByPk.mockResolvedValue(null);

      await expect(mensagemService.buscarPorId(MSG_ID)).rejects.toThrow(
        `erro ao obter mensagem: ${MSG_ID} - mensagem não encontrada`
      );
    });
  });

  describe("atualizar mensagem", () => {
    test("deve atualizar uma mensagem", async () => {
      const mensagem = msgData();
      const updatedConteudo = { conteudo: "novo conteudo" };

      mockAtualizarMensagem(mensagem, updatedConteudo);

      const resultado = await mensagemService.atualizar(
        mensagem.id,
        updatedConteudo
      );

      expect(Mensagem.update).toHaveBeenCalledWith(updatedConteudo, {
        where: { id: mensagem.id },
      });

      expect(resultado).toEqual({ ...mensagem, conteudo: "novo conteudo" });
    });

    test("deve retornar null ao tentar atualizar uma mensagem que não existe", async () => {
      Mensagem.update.mockResolvedValue([0]);

      const resultado = await mensagemService.atualizar(MSG_ID, {
        conteudo: "novo conteudo",
      });

      expect(resultado).toBeNull();
    });

    test("deve lançar erro ao falhar na atualização", async () => {
      Mensagem.update.mockRejectedValue(new Error("Erro ao atualizar"));

      await expect(
        mensagemService.atualizar(MSG_ID, { conteudo: "novo conteudo" })
      ).rejects.toThrow("erro ao atualizar mensagem");
    });
  });

  describe("eliminar mensagem", () => {
    test("deve permitir eliminar uma mensagem", async () => {
      const mensagem = msgData();

      mockBuscarMensagem(mensagem);
      mockEliminarMensagem();

      await mensagemService.eliminar(MSG_ID);

      expect(Mensagem.findByPk).toHaveBeenCalledWith(MSG_ID);
      expect(Mensagem.destroy).toHaveBeenCalledWith({ where: { id: MSG_ID } });
    });

    test("deve lançar erro se a mensagem não for encontrada para eliminar", async () => {
      Mensagem.findByPk.mockResolvedValue(null);

      await expect(mensagemService.eliminar(MSG_ID)).rejects.toThrow(
        `não foi possível eliminar mensagem: ${MSG_ID}`
      );
    });

    test("deve lançar erro ao falhar na eliminação", async () => {
      Mensagem.findByPk.mockResolvedValue(msgData());
      Mensagem.destroy.mockRejectedValue(new Error("Erro ao eliminar"));

      await expect(mensagemService.eliminar(MSG_ID)).rejects.toThrow(
        `não foi possível eliminar mensagem: ${MSG_ID}`
      );
    });
  });
});

// Funções de Mock

function mockRegistrarMensagem(mensagem) {
  Mensagem.build.mockReturnValueOnce({
    ...mensagem,
    save: jest.fn().mockResolvedValue(mensagem),
    toJSON: jest.fn().mockReturnValue(mensagem),
  });
}

function mockBuscarMensagem(mensagem) {
  Mensagem.findByPk.mockResolvedValue({
    toJSON: jest.fn().mockReturnValue(mensagem),
  });
}

function mockListarMensagens(mensagens) {
  Mensagem.findAll.mockResolvedValue(
    mensagens.map((msg) => ({
      ...msg,
      toJSON: () => msg,
    }))
  );
  Mensagem.count.mockResolvedValue(mensagens.length);
}

function mockAtualizarMensagem(mensagem, updatedMensagem) {
  const updatedInstance = {
    ...mensagem, // Preserva os campos originais
    ...updatedMensagem, // Aplica as atualizações
    toJSON: jest.fn().mockReturnValue({ ...mensagem, ...updatedMensagem }), // Combina o original e atualizado
  };

  // Simula a resposta do método update do Sequelize, que retorna o número de linhas afetadas e as linhas atualizadas
  Mensagem.update.mockResolvedValue([1]);

  // Simula a resposta do método findByPk para retornar a mensagem atualizada
  Mensagem.findByPk.mockResolvedValue(updatedInstance);
}

function mockEliminarMensagem() {
  Mensagem.destroy.mockResolvedValue(1);
}

function msgConteudo() {
  return {
    usuario: "usuario_00",
    conteudo: "conteudo",
  };
}

function msgData() {
  return {
    id: MSG_ID,
    ...msgConteudo(),
  };
}
