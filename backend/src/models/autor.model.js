const db = require('../config/db');

class AutorModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM autor');
    return rows;
  }
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM autor WHERE id_autor = ?', [id]);
    return rows[0];
  }
  static async create(data) {
    const { nome_autor, nacionalidade } = data;
    const [result] = await db.query(
      'INSERT INTO autor (nome_autor, nacionalidade) VALUES (?, ?)',
      [nome_autor, nacionalidade]
    );
    return result.insertId;
  }
}

module.exports = AutorModel;
