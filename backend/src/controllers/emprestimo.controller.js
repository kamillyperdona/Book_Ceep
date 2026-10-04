const EmprestimoModel = require('../models/emprestimo.model');

const EmprestimoController = {
  async listar(req, res, next) {
    try {
      const emprestimos = await EmprestimoModel.getAll();
      return res.status(200).json(emprestimos);
    } catch (error) {
      next(error);
    }
  },

  async criar(req, res, next) {
    try {
      const { id_aluno, id_exemplar, id_funcionario } = req.body;

      if (!id_aluno || !id_exemplar || !id_funcionario) {
        return res.status(400).json({
          sucess: false,
          message: 'É necessário informar id_aluno, id_exemplar e id_funcionario.'
        });
      }

      const novoEmprestimo = await EmprestimoModel.create(req.body);
      return res.status(201).json(novoEmprestimo);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = EmprestimoController;
