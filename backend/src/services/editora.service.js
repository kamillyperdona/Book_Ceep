const EditoraModel = require('../models/editora.model');

class EditoraService {
  async listar() { return await EditoraModel.getAll(); }
  async criar(data) {
    if (!data.nome_editora) throw new Error('Nome da editora é obrigatório.');
    return await EditoraModel.create(data);
  }
}

module.exports = new EditoraService();
