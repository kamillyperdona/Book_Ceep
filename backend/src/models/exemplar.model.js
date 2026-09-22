const db = require('../config/db');

class ExemplarModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT ex.*, l.titulo 
      FROM exemplar ex
      JOIN livro l ON ex.ISBN = l.ISBN
    `);
    return rows;
  }

  static async getDisponiveis() {
    const [rows] = await db.query(`
      SELECT ex.*, l.titulo 
      FROM exemplar ex
      JOIN livro l ON ex.ISBN = l.ISBN
      WHERE ex.status = 'DISPONIVEL'
    `);
    return rows;
  }

  static async create(data) {
    const { numero_tombo, localizacao, ISBN } = data;
    const [result] = await db.query(
      `INSERT INTO exemplar (numero_tombo, localizacao, status, ISBN) 
       VALUES (?, ?, 'DISPONIVEL', ?)`,
      [numero_tombo, localizacao, ISBN]
    );
    return result.insertId;
  }
}

module.exports = ExemplarModel;
