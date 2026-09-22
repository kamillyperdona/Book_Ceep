const AutorModel = require('../models/autor.model');

class AutorService {
  async listar() { return await AutorModel.getAll(); }
  async criar(data) {
    if (!data.nome_autor) throw new Error('Nome do autor é obrigatório.');
    return await AutorModel.create(data);
  }
}

module.exports = new AutorService();
