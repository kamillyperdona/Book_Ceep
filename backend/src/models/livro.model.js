const db = require('../config/db');

class LivroModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM livros');
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
