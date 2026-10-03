// backend/src/controllers/turma.controller.js
const TurmaService = require('../services/turma.service');

async function criar(req, res, next) {
  try {
    const { nome, serie } = req.body;

    // Se o usuário enviou 'nome' e 'serie', junta os dois (ex: "3º Ano - Desenvolvimento de Sistemas")
    // Se enviou apenas 'nome', usa o 'nome' direto
    let nomeFinal = '';
    if (nome && serie) {
      nomeFinal = `${serie} - ${nome}`;
    } else if (nome) {
      nomeFinal = nome;
    } else {
      return res.status(400).json({
        error: 'O campo nome da turma é obrigatório.'
      });
    }

    const novaTurma = await TurmaService.criar({ nome: nomeFinal });

    return res.status(201).json({
      sucesso: true,
      data: novaTurma
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  criar,
  // ... mantenha as outras funções exportadas (listar, buscarPorId, etc)
};
