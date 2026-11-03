const db = require('../config/db');

const LivroController = {
  listar: async (req, res) => {
    const { pesquisa } = req.query;

    try {
      let query = `
        SELECT l.ISBN, l.titulo, l.ano_lancamento, l.edicao, l.idioma, 
               COUNT(ex.id_exemplar) AS total_exemplares,
               SUM(CASE WHEN ex.status = 'Disponível' THEN 1 ELSE 0 END) AS exemplares_disponiveis
        FROM biblioteca.livro l
        LEFT JOIN biblioteca.exemplar ex ON l.ISBN = ex.ISBN
      `;
      
      let params = [];
      if (pesquisa) {
        query += ` WHERE l.titulo LIKE ? `;
        params.push(`%${pesquisa}%`);
      }

      // Agrupa e ordena os livros alfabeticamente por título
      query += ` GROUP BY l.ISBN, l.titulo, l.ano_lancamento, l.edicao, l.idioma ORDER BY l.titulo ASC`;

      const [livros] = await db.query(query, params);
      return res.json({ success: true, livros });

    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return res.status(500).json({ success: false, message: 'Erro ao listar livros.' });
    }
  },

criar: async (req, res) => {
    const { titulo, isbn, ano_lancamento, edicao, idioma, quantidade_exemplares } = req.body;

    try {
      // 1. Insere o livro principal
      await db.query(
        `INSERT INTO biblioteca.livro (ISBN, id_editora, id_genero, titulo, ano_lancamento, edicao, idioma) VALUES (?, 1, 1, ?, ?, ?, ?)`,
        [isbn, titulo, ano_lancamento, edicao || '1ª', idioma || 'Português']
      );

      const qtd = parseInt(quantidade_exemplares) || 1;
      for (let i = 0; i < qtd; i++) {
        // Gera um número de tombo único baseado no timestamp atual + o índice do loop
        const numeroTombo = Date.now() + i;

        await db.query(
          `INSERT INTO biblioteca.exemplar (ISBN, numero_tombo, status) VALUES (?, ?, 'Disponível')`,
          [isbn, numeroTombo]
        );
      }

      return res.status(201).json({ success: true, message: 'Livro e exemplares cadastrados com sucesso!' });
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      return res.status(500).json({ success: false, message: error.message || 'Erro ao cadastrar livro.' });
    }
  }
};

module.exports = LivroController;
