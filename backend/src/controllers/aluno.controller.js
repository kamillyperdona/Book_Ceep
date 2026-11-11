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

  // aluno.controller.js
  async criar(req, res) {
    try {
      const { cgm, matricula } = req.body;
      const valorCGM = cgm || matricula;

      // Validação estrita: exatamente 10 números
      const regexCGM = /^\d{10}$/;

      if (!regexCGM.test(valorCGM)) {
        return res.status(400).json({ 
          error: 'O CGM/Matrícula deve conter exatamente 10 dígitos numéricos.' 
        });
      }

      await alunoService.criarAluno(req.body);
      return res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
}

  async atualizar(req, res, next) {
    try {
      const { cgm } = req.params; // ou id
      await alunoService.atualizarAluno(cgm, req.body);
      return res.status(200).json({ message: 'Aluno atualizado com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // No seu aluno.controller.js
  async deletar(req, res, next) {
    try {
      const { cgm } = req.params; 
      await alunoService.deletarAluno(cgm);
      // Retorna uma resposta JSON limpa indicando o sucesso
      return res.status(200).json({ message: 'Aluno removido com sucesso!' });
    } catch (error) {
      // Se realmente houver erro, retorna a mensagem
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AlunoController();
