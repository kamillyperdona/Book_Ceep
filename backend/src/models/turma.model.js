const db = require('../config/db');

class TurmaModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM turmas');
    return rows;
  }

  static async create(data) {
    const { nome } = data;
    const [result] = await db.query('INSERT INTO turmas (nome) VALUES (?)', [nome]);
    return { id: result.insertId, nome };
  }

  static async update(id, data) {
    const { nome } = data;
    const [result] = await db.query('UPDATE turmas SET nome = ? WHERE id = ?', [nome, id]);
    return result;
  }
  
  static async delete(id) {
  const [result] = await db.query('DELETE FROM turmas WHERE id = ?', [id]);
  return result;
  }
}

module.exports = TurmaModel;
