const livroService = require('../services/livro.service');

class LivroController {
  async listar(req, res) {
    try {
      const livros = await livroService.listar();
      return res.status(200).json(livros);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async criar(req, res) {
    try {
      const isbn = await livroService.criar(req.body);
      return res.status(201).json({ message: 'Livro cadastrado com sucesso!', isbn });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new LivroController();
