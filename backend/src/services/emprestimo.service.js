// backend/src/services/emprestimo.service.js
const db = require('../config/db');

class EmprestimoService {
  // Realizar novo empréstimo
  static async realizarEmprestimo(id_aluno, id_exemplar, id_funcionario) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Verificar se o exemplar existe e está disponível
      const [exemplares] = await connection.query(
        'SELECT status FROM exemplares WHERE id = ?', 
        [id_exemplar]
      );

      if (exemplares.length === 0) {
        throw new Error('Exemplar não encontrado.');
      }

      if (exemplares[0].status !== 'disponivel') {
        throw new Error('Este exemplar não está disponível para empréstimo.');
      }

      // 2. Calcular datas (Empréstimo: Hoje | Devolução prevista: +7 dias)
      const dataEmprestimo = new Date();
      const dataDevolucaoPrevista = new Date();
      dataDevolucaoPrevista.setDate(dataEmprestimo.getDate() + 7);

      // 3. Registrar o empréstimo
      const [resultado] = await connection.query(
        `INSERT INTO emprestimos 
         (id_aluno, id_exemplar, id_funcionario, data_emprestimo, data_devolucao_prevista, status) 
         VALUES (?, ?, ?, ?, ?, 'ativo')`,
        [id_aluno, id_exemplar, id_funcionario, dataEmprestimo, dataDevolucaoPrevista]
      );

      // 4. Atualizar status do exemplar para 'emprestado'
      await connection.query(
        "UPDATE exemplares SET status = 'emprestado' WHERE id = ?",
        [id_exemplar]
      );

      await connection.commit();
      return { id: resultado.insertId, status: 'ativo', dataDevolucaoPrevista };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Registrar devolução do exemplar
  static async registrarDevolucao(id_emprestimo) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Buscar dados do empréstimo ativo
      const [emprestimos] = await connection.query(
        "SELECT id_exemplar, status FROM emprestimos WHERE id = ?",
        [id_emprestimo]
      );

      if (emprestimos.length === 0) {
        throw new Error('Empréstimo não encontrado.');
      }

      if (emprestimos[0].status === 'concluido') {
        throw new Error('Este empréstimo já foi finalizado.');
      }

      const id_exemplar = emprestimos[0].id_exemplar;

      // 2. Atualizar empréstimo com a data real de devolução
      const dataDevolucaoReal = new Date();
      await connection.query(
        "UPDATE emprestimos SET data_devolucao_real = ?, status = 'concluido' WHERE id = ?",
        [dataDevolucaoReal, id_emprestimo]
      );

      // 3. Liberar o exemplar para novos empréstimos
      await connection.query(
        "UPDATE exemplares SET status = 'disponivel' WHERE id = ?",
        [id_exemplar]
      );

      await connection.commit();
      return { mensagem: 'Devolução registrada com sucesso.' };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Listar empréstimos ativos com detalhes do aluno e do livro
  static async listarAtivos() {
    const query = `
      SELECT 
        e.id, 
        a.nome AS aluno_nome, 
        a.matricula AS aluno_matricula, 
        l.titulo AS livro_titulo, 
        ex.tombo AS exemplar_tombo,
        e.data_emprestimo, 
        e.data_devolucao_prevista
      FROM emprestimos e
      JOIN alunos a ON e.id_aluno = a.id
      JOIN exemplares ex ON e.id_exemplar = ex.id
      JOIN livros l ON ex.id_livro = l.id
      WHERE e.status = 'ativo'
      ORDER BY e.data_devolucao_prevista ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  }
}

module.exports = EmprestimoService;
