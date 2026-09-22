const TurmaModel = require('../models/turma.model');

class TurmaService {
  async listarTurmas() {
    return await TurmaModel.getAll();
  }

  async buscarTurmaPorId(id) {
    const turma = await TurmaModel.getById(id);
    if (!turma) {
      throw new Error('Turma não encontrada.');
    }
    return turma;
  }

  async criarTurma(data) {
    // Validação simples de campos obrigatórios, se desejar
    if (!data.nome_turma || !data.serie) {
      throw new Error('Nome da turma e série são obrigatórios.');
    }
    return await TurmaModel.create(data);
  }

  async atualizarTurma(id, data) {
    await this.buscarTurmaPorId(id); // Garante que a turma existe antes de atualizar
    return await TurmaModel.update(id, data);
  }

  async deletarTurma(id) {
    await this.buscarTurmaPorId(id); // Garante que a turma existe antes de deletar
    return await TurmaModel.delete(id);
  }
}

module.exports = new TurmaService();
