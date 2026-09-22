const editoraService = require('../services/editora.service');

class EditoraController {
  async listar(req, res) {
    try {
      const editoras = await editoraService.listar();
      return res.status(200).json(editoras);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async criar(req, res) {
    try {
      const id = await editoraService.criar(req.body);
      return res.status(201).json({ message: 'Editora cadastrada com sucesso!', id });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new EditoraController();
