// backend/src/services/relatorio.service.js
const db = require('../config/db');

class RelatorioService {
  // Lista todos os empréstimos que ultrapassaram a data de devolução prevista
  static async relatorioAtrasados() {
    const query = `
      SELECT 
        e.id AS id_emprestimo,
        a.nome AS aluno_nome,
        a.matricula AS aluno_matricula,
        t.nome AS turma,
        l.titulo AS livro_titulo,
        ex.tombo AS exemplar_tombo,
        e.data_emprestimo,
        e.data_devolucao_prevista,
        DATEDIFF(CURRENT_DATE(), e.data_devolucao_prevista) AS dias_atraso
      FROM emprestimos e
      JOIN alunos a ON e.id_aluno = a.id
      LEFT JOIN turmas t ON a.id_turma = t.id
      JOIN exemplares ex ON e.id_exemplar = ex.id
      JOIN livros l ON ex.id_livro = l.id
      WHERE e.status = 'ativo' AND e.data_devolucao_prevista < CURRENT_DATE()
      ORDER BY e.data_devolucao_prevista ASC
    `;

    const [rows] = await db.query(query);
    return rows;
  }

  // Histórico completo de empréstimos (ativos e finalizados) de um aluno específico
  static async historicoAluno(id_aluno) {
    const query = `
      SELECT 
        e.id,
        l.titulo AS livro_titulo,
        ex.tombo AS exemplar_tombo,
        e.data_emprestimo,
        e.data_devolucao_prevista,
        e.data_devolucao_real,
        e.status
      FROM emprestimos e
      JOIN exemplares ex ON e.id_exemplar = ex.id
      JOIN livros l ON ex.id_livro = l.id
      WHERE e.id_aluno = ?
      ORDER BY e.data_emprestimo DESC
    `;

    const [rows] = await db.query(query, [id_aluno]);
    return rows;
  }
}

module.exports = RelatorioService;
