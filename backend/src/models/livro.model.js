const db = require('../config/db');

class LivroModel {
  static async getAll() {
    const query = `
      SELECT l.*, 
             (COALESCE(l.quantidade, l.total_exemplares, 0) - (
                SELECT COUNT(*) 
                FROM emprestimos e 
                WHERE e.id_exemplar = l.ISBN 
                  AND e.data_devolucao_real IS NULL
             )) AS exemplares_disponiveis
      FROM livros l
      ORDER BY l.id DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  static async create(data) {
    const { titulo, isbn, ano_publicacao, ano, id_autor, id_editora, id_genero } = data;
    
    const anoPub = ano_publicacao || ano;

    const [result] = await db.query(
      'INSERT INTO livros (titulo, isbn, ano_publicacao, id_autor, id_editora, id_genero) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, isbn, anoPub || null, id_autor || null, id_editora || null, id_genero || null]
    );

    return { 
      id: result.insertId, 
      titulo, 
      isbn, 
      ano_publicacao: anoPub, 
      id_autor, 
      id_editora, 
      id_genero 
    };
  }
}

module.exports = LivroModel;
