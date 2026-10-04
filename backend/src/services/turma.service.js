const TurmaModel = require('../models/turma.model');

async function criar(dados) {
  if (!dados.nome) {
    throw new Error('O nome da turma é obrigatório.');
  }
  return await TurmaModel.criar(dados);
}

async function listar() {
  return await TurmaModel.listar();
}

async function buscarPorId(id) {
  return await TurmaModel.buscarPorId(id);
}

module.exports = {
  criar,
  listar,
  buscarPorId
};
