const db = require('../config/db');

class FuncionarioModel {
  static async getAll() {
    const [rows] = await db.query('SELECT id_funcionario, nome_funcionario, usuario, cargo FROM funcionario');
    return rows;
  }
  static async create(data) {
    const { nome_funcionario, usuario, senha, cargo } = data;
    const [result] = await db.query(
      'INSERT INTO funcionario (nome_funcionario, usuario, senha, cargo) VALUES (?, ?, ?, ?)',
      [nome_funcionario, usuario, senha, cargo]
    );
    return result.insertId;
  }
}

module.exports = FuncionarioModel;
