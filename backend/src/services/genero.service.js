const GeneroModel = require('../models/genero.model');

class GeneroService {
  async listar() { return await GeneroModel.getAll(); }
  async criar(data) {
    if (!data.nome_genero) throw new Error('Nome do gênero é obrigatório.');
    return await GeneroModel.create(data);
  }
}

module.exports = new GeneroService();
