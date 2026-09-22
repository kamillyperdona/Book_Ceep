const db = require('../config/db');

class GeneroModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM genero');
    return rows;
  }
  static async create(data) {
    const { nome_genero } = data;
    const [result] = await db.query('INSERT INTO genero (nome_genero) VALUES (?)', [nome_genero]);
    return result.insertId;
  }
}

module.exports = GeneroModel;
