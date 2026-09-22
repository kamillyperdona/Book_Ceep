const funcionarioService = require('../services/funcionario.service');

class FuncionarioController {
  async listar(req, res) {
    try {
      const funcionarios = await funcionarioService.listar();
      return res.status(200).json(funcionarios);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async criar(req, res) {
    try {
      const id = await funcionarioService.criar(req.body);
      return res.status(201).json({ message: 'Funcionário cadastrado com sucesso!', id });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new FuncionarioController();
