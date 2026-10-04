const db = require('../config/db');

class EmprestimoModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT e.* 
      FROM emprestimos e
      ORDER BY e.id DESC
    `);
    return rows;
  }

  static async create(data) {
    const { id_aluno, id_exemplar, id_funcionario, data_emprestimo, data_devolucao_prevista } = data;
    
    const [result] = await db.query(
      `INSERT INTO emprestimos (id_aluno, id_exemplar, id_funcionario, data_emprestimo, data_devolucao_prevista) 
       VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [id_aluno, id_exemplar, id_funcionario]
    );
    
    return { id: result.insertId, id_aluno, id_exemplar, id_funcionario };
  }
}

module.exports = EmprestimoModel;
