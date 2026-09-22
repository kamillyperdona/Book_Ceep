const ExemplarModel = require('../models/exemplar.model');

class ExemplarService {
  async listarTodos() { return await ExemplarModel.getAll(); }
  async listarDisponiveis() { return await ExemplarModel.getDisponiveis(); }

  async criar(data) {
    if (!data.numero_tombo || !data.ISBN) {
      throw new Error('Número de tombo e ISBN são obrigatórios.');
    }
    return await ExemplarModel.create(data);
  }
}

module.exports = new ExemplarService();
