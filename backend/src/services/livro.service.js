const LivroModel = require('../models/livro.model');

class LivroService {
  async listar() { return await LivroModel.getAll(); }

  async criar(data) {
    if (!data.ISBN || !data.titulo) {
      throw new Error('ISBN e Título são campos obrigatórios.');
    }
    const existe = await LivroModel.getByIsbn(data.ISBN);
    if (existe) throw new Error('Já existe um livro cadastrado com este ISBN.');

    return await LivroModel.create(data);
  }
}

module.exports = new LivroService();
