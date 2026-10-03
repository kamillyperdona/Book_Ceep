// backend/src/controllers/livro.controller.js
const LivroService = require('../services/livro.service');

class LivroController {
  static async buscar(req, res, next) {
    try {
      const { titulo, autor, genero } = req.query;
      const livros = await LivroService.buscarComFiltros({ titulo, autor, genero });
      
      res.status(200).json({
        sucess: true,
        total: livros.length,
        data: livros
      });
    } catch (error) {
      next(error);
    }
  }

  static async listarExemplares(req, res, next) {
    try {
      const { id } = req.params;
      const exemplares = await LivroService.buscarExemplaresPorLivro(id);
      
      res.status(200).json({
        sucess: true,
        data: exemplares
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LivroController;
