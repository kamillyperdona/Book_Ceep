const TurmaModel = require('../models/turma.model');

const TurmaController = {
  async listar(req, res, next) {
    try {
      const turmas = await TurmaModel.getAll();
      return res.status(200).json(turmas);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ sucess: false, message: 'O nome da turma é obrigatório.' });
      }
      const novaTurma = await TurmaModel.create(req.body);
      return res.status(201).json(novaTurma);
    } catch (error) {
      next(error);
    }
  },

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ sucess: false, message: 'O nome da turma é obrigatório.' });
      }

      await TurmaModel.update(id, req.body);
      return res.status(200).json({ sucess: true, message: 'Turma atualizada com sucesso!' });
    } catch (error) {
      next(error);
    }
  },

  async deletar(req, res, next) {
  try {
    const { id } = req.params;
    await TurmaModel.delete(id);
    return res.status(200).json({ sucess: true, message: 'Turma removida com sucesso!' });
  } catch (error) {
    next(error);
  }
  }
};

module.exports = TurmaController;
