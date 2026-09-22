const db = require('../config/db');

class EditoraModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM editora');
    return rows;
  }
  static async create(data) {
    const { nome_editora, telefone, cidade } = data;
    const [result] = await db.query(
      'INSERT INTO editora (nome_editora, telefone, cidade) VALUES (?, ?, ?)',
      [nome_editora, telefone, cidade]
    );
    return result.insertId;
  }
}

module.exports = EditoraModel;
