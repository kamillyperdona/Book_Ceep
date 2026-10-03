// backend/src/services/livro.service.js
const db = require('../config/db');

class LivroService {
  // Busca com filtros combinados (titulo, autor, genero)
  static async buscarComFiltros({ titulo, autor, genero }) {
    let sql = `
      SELECT 
        l.id,
        l.titulo,
        l.isbn,
        l.ano_publicacao,
        a.nome AS autor,
        e.nome AS editora,
        g.nome AS genero,
        COUNT(ex.id) AS total_exemplares,
        SUM(CASE WHEN ex.status = 'disponivel' THEN 1 ELSE 0 END) AS exemplares_disponiveis
      FROM livros l
      LEFT JOIN autores a ON l.id_autor = a.id
      LEFT JOIN editoras e ON l.id_editora = e.id
      LEFT JOIN generos g ON l.id_genero = g.id
      LEFT JOIN exemplares ex ON l.id = ex.id_livro
      WHERE 1=1
    `;

    const params = [];

    if (titulo) {
      sql += ` AND l.titulo LIKE ?`;
      params.push(`%${titulo}%`);
    }

    if (autor) {
      sql += ` AND a.nome LIKE ?`;
      params.push(`%${autor}%`);
    }

    if (genero) {
      sql += ` AND g.nome LIKE ?`;
      params.push(`%${genero}%`);
    }

    sql += ` GROUP BY l.id ORDER BY l.titulo ASC`;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // Busca os exemplares físicos vinculados a um livro específico
  static async buscarExemplaresPorLivro(id_livro) {
    const query = `
      SELECT id, tombo, localizacao, status 
      FROM exemplares 
      WHERE id_livro = ?
    `;
    const [rows] = await db.query(query, [id_livro]);
    return rows;
  }
}

module.exports = LivroService;
