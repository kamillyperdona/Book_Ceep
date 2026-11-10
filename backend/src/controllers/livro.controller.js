const db = require('../config/db');

const LivroController = {
  listar: async (req, res) => {
    const { pesquisa } = req.query;

    try {
      let query = `
  SELECT l.ISBN, l.titulo, l.ano_lancamento, l.edicao, l.idioma, l.sinopse, 
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
      query += ` GROUP BY l.ISBN, l.titulo, l.ano_lancamento, l.edicao, l.idioma, l.sinopse ORDER BY l.titulo ASC`;

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
      // 1. Validação do ISBN (exatamente 13 dígitos numéricos)
      const regexISBN = /^\d{13}$/;

      if (!regexISBN.test(isbn)) {
        return res.status(400).json({ 
          success: false,
          message: "ISBN inválido! Digite exatamente 13 números, sem traços ou letras." 
        });
      }

      // 2. Insere o livro principal
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
  },

  deletar: async (req, res) => {
    const { isbn } = req.params;

    try {
      // 1. Remove os exemplares vinculados primeiro (evita erro de FK)
      await db.query(`DELETE FROM biblioteca.exemplar WHERE ISBN = ?`, [isbn]);

      // 2. Remove o livro principal
      const [resultado] = await db.query(`DELETE FROM biblioteca.livro WHERE ISBN = ?`, [isbn]);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Livro não encontrado.' });
      }

      return res.status(200).json({ success: true, message: 'Livro excluído com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      return res.status(500).json({ success: false, message: 'Erro ao excluir livro.' });
    }
  },

  atualizar: async (req, res) => {
    const { isbn } = req.params;
    const { titulo, ano_lancamento, edicao, idioma, sinopse, novos_exemplares } = req.body;

    try {
      // Atualiza os dados principais incluindo a sinopse
      await db.query(
        `UPDATE biblioteca.livro SET titulo = ?, ano_lancamento = ?, edicao = ?, idioma = ?, sinopse = ? WHERE ISBN = ?`,
        [titulo, ano_lancamento, edicao || '1ª', idioma || 'Português', sinopse, isbn]
      );

      const qtdAdicionar = parseInt(novos_exemplares) || 0;
      if (qtdAdicionar > 0) {
        for (let i = 0; i < qtdAdicionar; i++) {
          const numeroTombo = Date.now() + i;
          await db.query(
            `INSERT INTO biblioteca.exemplar (ISBN, numero_tombo, status) VALUES (?, ?, 'Disponível')`,
            [isbn, numeroTombo]
          );
        }
      }

      return res.status(200).json({ success: true, message: 'Livro atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar livro.' });
    }
  }
};

module.exports = LivroController;
