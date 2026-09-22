const db = require('../config/db');

class EmprestimoModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT e.*, a.nome_aluno, a.suspenso_ate, l.titulo AS livro_titulo, ex.numero_tombo
      FROM emprestimo e
      JOIN aluno a ON e.CGM = a.CGM
      JOIN exemplar ex ON e.id_exemplar = ex.id_exemplar
      JOIN livro l ON ex.ISBN = l.ISBN
      ORDER BY e.data_emprestimo DESC
    `);
    return rows;
  }

  static async getById(id_emprestimo) {
    const [rows] = await db.query('SELECT * FROM emprestimo WHERE id_emprestimo = ?', [id_emprestimo]);
    return rows[0];
  }

  static async criar(data) {
    const { CGM, id_exemplar, id_funcionario, observacao, diasEmprestimo = 7 } = data;
    
    // Calcula a data prevista de devolução (padrão 7 dias)
    const dataPrevista = new Date();
    dataPrevista.setDate(dataPrevista.getDate() + diasEmprestimo);

    const [result] = await db.query(
      `INSERT INTO emprestimo (CGM, id_exemplar, id_funcionario, observacao, data_prevista_devolucao, status) 
       VALUES (?, ?, ?, ?, ?, 'ATIVO')`,
      [CGM, id_exemplar, id_funcionario, observacao, dataPrevista]
    );
    return result.insertId;
  }

  static async devolver(id_emprestimo, observacao, justificativa) {
    const [result] = await db.query(
      `UPDATE emprestimo 
       SET data_devolucao = NOW(), 
           status = 'CONCLUIDO', 
           observacao = COALESCE(?, observacao),
           justificativa = ?
       WHERE id_emprestimo = ?`,
      [observacao, justificativa, id_emprestimo]
    );
    return result;
  }
}

module.exports = EmprestimoModel;
