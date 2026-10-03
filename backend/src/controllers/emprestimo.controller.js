// backend/src/controllers/emprestimo.controller.js
const EmprestimoService = require('../services/emprestimo.service');

class EmprestimoController {
  static async criar(req, res, next) {
    try {
      const { id_aluno, id_exemplar, id_funcionario } = req.body;
      const resultado = await EmprestimoService.realizarEmprestimo(id_aluno, id_exemplar, id_funcionario);
      res.status(201).json({ sucess: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }

  static async devolver(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await EmprestimoService.registrarDevolucao(id);
      res.status(200).json({ sucess: true, ...resultado });
    } catch (error) {
      next(error);
    }
  }

  static async listarAtivos(req, res, next) {
    try {
      const emprestimos = await EmprestimoService.listarAtivos();
      res.status(200).json({ sucess: true, data: emprestimos });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmprestimoController;
