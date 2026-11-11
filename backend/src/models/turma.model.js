const db = require('../config/db');

class TurmaModel {
  static async getAll() {
    // Aponta para a tabela correta da base de dados
    const [rows] = await db.query('SELECT * FROM biblioteca.turma');
    return rows;
  }

  static async create(data) {
    const { ano_letivo, turma, nome_turma, serie } = data;
    const [result] = await db.query(
      'INSERT INTO biblioteca.turma (ano_letivo, turma, nome_turma, serie) VALUES (?, ?, ?, ?)', 
      [ano_letivo, turma, nome_turma, serie]
    );
    return { id_turma: result.insertId, ano_letivo, turma, nome_turma, serie };
  }

  static async update(id, data) {
    const { ano_letivo, turma, nome_turma, serie } = data;
    const [result] = await db.query(
      'UPDATE biblioteca.turma SET ano_letivo = ?, turma = ?, nome_turma = ?, serie = ? WHERE id_turma = ?', 
      [ano_letivo, turma, nome_turma, serie, id]
    );
    return result;
  }
  
  static async delete(id) {
    // Usa id_turma que é a chave primária real da tabela
    const [result] = await db.query('DELETE FROM biblioteca.turma WHERE id_turma = ?', [id]);
    return result;
  }
}

module.exports = TurmaModel;
