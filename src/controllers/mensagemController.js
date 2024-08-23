// src/controllers/MensagemController.js
import services from "../services";



class MensagemController {
  /**
   * @param {MensagemService} mensagemService
   * @returns {any}
   */
  constructor(mensagemService) {
    this.mensagemService = mensagemService;
  }

  async registrar(req, res) {
    try {
      const novaMensagem = await this.mensagemService.registrar(req.body);
      res.status(201).json(novaMensagem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listar(req, res) {
    try {
      const pagina = parseInt(req.query.pagina, 10) || 1;
      const limite = parseInt(req.query.limite, 10) || 10;
      const mensagens = await this.mensagemService.listar(pagina, limite);
      res.status(200).json(mensagens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const mensagem = await this.mensagemService.buscarPorId(req.params.id);
      res.status(200).json(mensagem);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const mensagemAtualizada = await this.mensagemService.atualizar(
        req.params.id,
        req.body
      );
      if (!mensagemAtualizada) {
        return res.status(404).json({ error: "mensagem não encontrada" });
      }
      res.status(200).json(mensagemAtualizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await this.mensagemService.eliminar(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
export default MensagemController;
