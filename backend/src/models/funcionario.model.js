const db = require('../config/db');

class FuncionarioModel {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM biblioteca.funcionario WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = FuncionarioModel;
