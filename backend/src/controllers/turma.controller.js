const turmaService = require('../services/turma.service');

class TurmaController {
  async listar(req, res) {
    try {
      const turmas = await turmaService.listarTurmas();
      return res.status(200).json(turmas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const turma = await turmaService.buscarTurmaPorId(id);
      return res.status(200).json(turma);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      await turmaService.criarTurma(req.body);
      return res.status(201).json({ message: 'Turma cadastrada com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      await turmaService.atualizarTurma(id, req.body);
      return res.status(200).json({ message: 'Turma atualizada com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await turmaService.deletarTurma(id);
      return res.status(200).json({ message: 'Turma removida com sucesso!' });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new TurmaController();
