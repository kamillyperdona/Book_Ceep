const autorService = require('../services/autor.service');

class AutorController {
  async listar(req, res) {
    try {
      const autores = await autorService.listar();
      return res.status(200).json(autores);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async criar(req, res) {
    try {
      const id = await autorService.criar(req.body);
      return res.status(201).json({ message: 'Autor cadastrado com sucesso!', id });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AutorController();
