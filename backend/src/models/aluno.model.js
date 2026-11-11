const db = require('../config/db');

class AlunoModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT a.*, t.turma, t.nome_turma, t.serie 
      FROM alunos a 
      LEFT JOIN biblioteca.turma t ON a.id_turma = t.id_turma
    `);
    return rows;
  }

  static async getByCgm(matricula) {
    const [rows] = await db.query(
      'SELECT * FROM alunos WHERE matricula = ?', 
      [matricula]
    );
    return rows[0];
  }

  static async create(data) {
    const { nome, cgm, matricula, id_turma } = data;
    const valorMatricula = matricula || cgm;
    const [result] = await db.query(
      'INSERT INTO alunos (nome, matricula, id_turma) VALUES (?, ?, ?)', 
      [nome, valorMatricula, id_turma]
    );
    return result;
  }

  static async update(matriculaOriginal, data) {
    const { nome, cgm, matricula, id_turma } = data;
    const valorMatricula = matricula || cgm || matriculaOriginal;
    const [result] = await db.query(
      'UPDATE alunos SET nome = ?, matricula = ?, id_turma = ? WHERE matricula = ?', 
      [nome, valorMatricula, id_turma, matriculaOriginal]
    );
    return result;
  }

  static async delete(matricula) {
    const [result] = await db.query(
      'DELETE FROM alunos WHERE matricula = ?', 
      [matricula]
    );
    return result;
  }
}

module.exports = AlunoModel;
