const db = require('../config/db');

class EmprestimoModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT e.*, 
             a.nome AS nome_aluno, 
             l.titulo AS titulo_livro 
      FROM emprestimos e
      LEFT JOIN alunos a ON e.id_aluno = a.id
      LEFT JOIN exemplares ex ON e.id_exemplar = ex.id
      LEFT JOIN livros l ON ex.id_livro = l.id OR e.id_exemplar = l.id OR e.id_exemplar = l.ISBN
      ORDER BY e.data_devolucao_real IS NULL DESC, e.id DESC
    `);
    // O 'ORDER BY' agora deixa os pendentes no topo e os devolvidos no final
    return rows;
  }

  static async create(data) {
    let { id_aluno, id_exemplar, id_funcionario } = data;
    id_funcionario = id_funcionario || 1;

    const query = `
      INSERT INTO emprestimos (id_aluno, id_exemplar, id_funcionario, data_emprestimo, data_devolucao_prevista) 
      VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 2 MONTH))
    `;

    const [resultado] = await db.query(query, [id_aluno, id_exemplar, id_funcionario]);
    return resultado;
  }

  // Novo método que atualiza a data real de devolução
  static async devolver(id) {
    const query = `
      UPDATE emprestimos 
      SET data_devolucao_real = NOW(), status = 'concluido'
      WHERE id = ?
    `;
    const [resultado] = await db.query(query, [id]);
    return resultado;
  }
}

module.exports = EmprestimoModel;
