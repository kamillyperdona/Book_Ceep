const alunoService = require('../services/aluno.service');

class AlunoController {
  async listar(req, res) {
    try {
      const alunos = await alunoService.listarAlunos();
      return res.status(200).json(alunos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { cgm } = req.params;
      const aluno = await alunoService.buscarAlunoPorCgm(cgm);
      return res.status(200).json(aluno);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      await alunoService.criarAluno(req.body);
      return res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { cgm } = req.params;
      await alunoService.atualizarAluno(cgm, req.body);
      return res.status(200).json({ message: 'Aluno atualizado com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { cgm } = req.params;
      await alunoService.deletarAluno(cgm);
      return res.status(200).json({ message: 'Aluno removido com sucesso!' });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new AlunoController();
