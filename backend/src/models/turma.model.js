const db = require('../config/db'); // Ajuste o caminho do seu banco se necessário

class TurmaModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM turma');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM turma WHERE id_turma = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { nome_turma, serie, ano_letivo, turno } = data;
    const [result] = await db.query(
      'INSERT INTO turma (nome_turma, serie, ano_letivo, turno) VALUES (?, ?, ?, ?)',
      [nome_turma, serie, ano_letivo, turno]
    );
    return result;
  }

  static async update(id, data) {
    const { nome_turma, serie, ano_letivo, turno } = data;
    const [result] = await db.query(
      'UPDATE turma SET nome_turma = ?, serie = ?, ano_letivo = ?, turno = ? WHERE id_turma = ?',
      [nome_turma, serie, ano_letivo, turno, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM turma WHERE id_turma = ?', [id]);
    return result;
  }
}

module.exports = TurmaModel;
