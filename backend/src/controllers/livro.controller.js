const LivroModel = require('../models/livro.model');

const LivroController = {
  async listar(req, res, next) {
    try {
      const livros = await LivroModel.getAll();
      return res.status(200).json(livros);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const novoLivro = await LivroModel.create(req.body);
      return res.status(201).json(novoLivro);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = LivroController;
