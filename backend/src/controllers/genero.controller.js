const generoService = require('../services/genero.service');

class GeneroController {
  async listar(req, res) {
    try {
      const generos = await generoService.listar();
      return res.status(200).json(generos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async criar(req, res) {
    try {
      const id = await generoService.criar(req.body);
      return res.status(201).json({ message: 'Gênero cadastrado com sucesso!', id });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new GeneroController();
