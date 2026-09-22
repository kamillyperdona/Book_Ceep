const db = require('../config/db');

class LivroModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT l.*, e.nome_editora, g.nome_genero,
             GROUP_CONCAT(a.nome_autor SEPARATOR ', ') AS autores
      FROM livro l
      LEFT JOIN editora e ON l.id_editora = e.id_editora
      LEFT JOIN genero g ON l.id_genero = g.id_genero
      LEFT JOIN livro_autor la ON l.ISBN = la.ISBN
      LEFT JOIN autor a ON la.id_autor = a.id_autor
      GROUP BY l.ISBN
    `);
    return rows;
  }

  static async getByIsbn(isbn) {
    const [rows] = await db.query('SELECT * FROM livro WHERE ISBN = ?', [isbn]);
    return rows[0];
  }

  static async create(data) {
    const { ISBN, titulo, ano_publicacao, edicao, idioma, id_editora, id_genero, autoresIds } = data;

    await db.query(
      `INSERT INTO livro (ISBN, titulo, ano_publicacao, edicao, idioma, id_editora, id_genero) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ISBN, titulo, ano_publicacao, edicao, idioma, id_editora, id_genero]
    );

    if (autoresIds && autoresIds.length > 0) {
      const valores = autoresIds.map(id_autor => [ISBN, id_autor]);
      await db.query('INSERT INTO livro_autor (ISBN, id_autor) VALUES ?', [valores]);
    }

    return ISBN;
  }
}

module.exports = LivroModel;
