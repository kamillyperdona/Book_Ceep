const FuncionarioModel = require('../models/funcionario.model');

class FuncionarioService {
  async listar() { return await FuncionarioModel.getAll(); }
  async criar(data) {
    if (!data.usuario || !data.senha) {
      throw new Error('Usuário e senha são obrigatórios.');
    }
    return await FuncionarioModel.create(data);
  }
}

module.exports = new FuncionarioService();
