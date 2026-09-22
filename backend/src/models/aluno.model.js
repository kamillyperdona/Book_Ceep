const db = require('../config/db');

class AlunoModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT a.*, t.nome_turma, t.serie 
      FROM aluno a 
      LEFT JOIN turma t ON a.id_turma = t.id_turma
    `);
    return rows;
  }

  static async getByCgm(cgm) {
    const [rows] = await db.query('SELECT * FROM aluno WHERE CGM = ?', [cgm]);
    return rows[0];
  }

  static async create(data) {
    const { CGM, nome_aluno, email, telefone, status, id_turma } = data;
    const [result] = await db.query(
      'INSERT INTO aluno (CGM, nome_aluno, email, telefone, status, id_turma) VALUES (?, ?, ?, ?, ?, ?)',
      [CGM, nome_aluno, email, telefone, status || 'ATIVO', id_turma]
    );
    return result;
  }

  static async update(cgm, data) {
    const { nome_aluno, email, telefone, status, id_turma } = data;
    const [result] = await db.query(
      'UPDATE aluno SET nome_aluno = ?, email = ?, telefone = ?, status = ?, id_turma = ? WHERE CGM = ?',
      [nome_aluno, email, telefone, status, id_turma, cgm]
    );
    return result;
  }

  static async delete(cgm) {
    const [result] = await db.query('DELETE FROM aluno WHERE CGM = ?', [cgm]);
    return result;
  }
}

module.exports = AlunoModel;
