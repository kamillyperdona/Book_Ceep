const exemplarService = require('../services/exemplar.service');

class ExemplarController {
  async listar(req, res) {
    try {
      const exemplares = await exemplarService.listarTodos();
      return res.status(200).json(exemplares);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async listarDisponiveis(req, res) {
    try {
      const disponiveis = await exemplarService.listarDisponiveis();
      return res.status(200).json(disponiveis);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async criar(req, res) {
    try {
      const id = await exemplarService.criar(req.body);
      return res.status(201).json({ message: 'Exemplar cadastrado com sucesso!', id });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ExemplarController();
