const db = require('../config/db');

async function criar({ nome }) {
  const [result] = await db.execute(
    'INSERT INTO turmas (nome) VALUES (?)',
    [nome]
  );
  return { id: result.insertId, nome };
}

async function listar() {
  const [rows] = await db.execute('SELECT * FROM turmas');
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await db.execute('SELECT * FROM turmas WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = {
  criar,
  listar,
  buscarPorId
};
