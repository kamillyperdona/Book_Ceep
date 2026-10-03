// backend/src/controllers/relatorio.controller.js
const RelatorioService = require('../services/relatorio.service');

class RelatorioController {
  static async atrasados(req, res, next) {
    try {
      const lista = await RelatorioService.relatorioAtrasados();
      res.status(200).json({
        sucess: true,
        total_atrasados: lista.length,
        data: lista
      });
    } catch (error) {
      next(error);
    }
  }

  static async historicoAluno(req, res, next) {
    try {
      const { id_aluno } = req.params;
      const historico = await RelatorioService.historicoAluno(id_aluno);
      res.status(200).json({
        sucess: true,
        total_registros: historico.length,
        data: historico
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RelatorioController;
