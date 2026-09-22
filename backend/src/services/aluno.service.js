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
    // Aqui você pode validar se o CGM já existe ou campos obrigatórios
    return await AlunoModel.create(data);
  }

  async atualizarAluno(cgm, data) {
    await this.buscarAlunoPorCgm(cgm); // Garante que existe
    return await AlunoModel.update(cgm, data);
  }

  async deletarAluno(cgm) {
    await this.buscarAlunoPorCgm(cgm);
    return await AlunoModel.delete(cgm);
  }
}

module.exports = new AlunoService();
