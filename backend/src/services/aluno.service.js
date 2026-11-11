const AlunoModel = require('../models/aluno.model');

class AlunoService {
  async listarAlunos() {
    return await AlunoModel.getAll();
  }

  async buscarAlunoPorCgm(cgm) {
    const aluno = await AlunoModel.getByCgm(cgm);
    if (!aluno) {
      throw new Error('Aluno não encontrado.');
    }
    return aluno;
  }

  async criarAluno(data) {
    return await AlunoModel.create(data);
  }

  async atualizarAluno(cgm, data) {
    return await AlunoModel.update(cgm, data);
  }

  async deletarAluno(cgm) {
    const resultado = await AlunoModel.delete(cgm);
    return resultado;
  }
}

module.exports = new AlunoService();
