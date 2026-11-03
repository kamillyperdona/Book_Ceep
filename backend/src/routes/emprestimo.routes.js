const express = require('express');
const router = express.Router();
const EmprestimoController = require('../controllers/emprestimo.controller');

// Mapeamento direto aos métodos do Controller
router.get('/', EmprestimoController.listar);
router.post('/', EmprestimoController.criar);

router.get('/', async (req, res) => {
  try {
    const [emprestimos] = await db.query(`
      SELECT e.id_emprestimo, a.nome_aluno, l.titulo_livro, e.data_emprestimo, e.data_devolucao, e.status
      FROM biblioteca.emprestimo e
      JOIN biblioteca.aluno a ON e.id_aluno = a.id_aluno
      JOIN biblioteca.exemplar ex ON e.id_exemplar = ex.id_exemplar
      JOIN biblioteca.livro l ON ex.id_livro = l.id_livro
      ORDER BY e.data_devolucao ASC
    `);
    
    return res.json({ success: true, emprestimos });
  } catch (error) {
    console.error('Erro ao buscar empréstimos:', error);
    return res.status(500).json({ success: false, message: 'Erro ao listar empréstimos.' });
  }
});

module.exports = router;
