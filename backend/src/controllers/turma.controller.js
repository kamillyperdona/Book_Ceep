const TurmaService = require('../services/turma.service');

// Cadastrar nova turma (POST)
async function criar(req, res, next) {
  try {
    const { nome, serie } = req.body;

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

// Listar todas as turmas (GET)
async function listar(req, res, next) {
  try {
    const turmas = await TurmaService.listar();
    return res.status(200).json({
      sucesso: true,
      data: turmas
    });
  } catch (error) {
    next(error);
  }
}

// Buscar turma por ID (GET /:id)
async function buscarPorId(req, res, next) {
  try {
    const { id } = req.params;
    const turma = await TurmaService.buscarPorId(id);

    if (!turma) {
      return res.status(404).json({
        sucesso: false,
        message: 'Turma não encontrada.'
      });
    }

    return res.status(200).json({
      sucesso: true,
      data: turma
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  criar,
  listar,
  buscarPorId
};
