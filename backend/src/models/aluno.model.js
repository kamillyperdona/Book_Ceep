const db = require('../config/db');

class AlunoModel {
  static async getAll() {
    // Consulta simples na tabela de alunos
    const [rows] = await db.query('SELECT * FROM alunos');
    return rows;
  }

  static async getByCgm(cgm) {
    const [rows] = await db.query('SELECT * FROM alunos WHERE matricula = ?', [cgm]);
    return rows[0];
  }

  static async create(data) {
    const { matricula, CGM, nome, nome_aluno, turma_id, id_turma } = data;
    
    const mat = matricula || CGM;
    const nomeAluno = nome || nome_aluno;
    const turmaId = id_turma || turma_id;

    const [result] = await db.query(
      'INSERT INTO alunos (matricula, nome, id_turma) VALUES (?, ?, ?)',
      [mat, nomeAluno, turmaId || null]
    );
    return { id: result.insertId, matricula: mat, nome: nomeAluno, id_turma: turmaId };
  }

  static async update(cgm, data) {
    const { nome, nome_aluno, turma_id, id_turma } = data;
    const nomeAluno = nome || nome_aluno;
    const turmaId = id_turma || turma_id;

    const [result] = await db.query(
      'UPDATE alunos SET nome = ?, id_turma = ? WHERE matricula = ?',
      [nomeAluno, turmaId, cgm]
    );
    return result;
  }

  static async delete(cgm) {
    const [result] = await db.query('DELETE FROM alunos WHERE matricula = ?', [cgm]);
    return result;
  }
}

module.exports = AlunoModel;
