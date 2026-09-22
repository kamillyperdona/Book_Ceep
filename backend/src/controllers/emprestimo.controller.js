const emprestimoService = require('../services/emprestimo.service');

class EmprestimoController {
  async criar(req, res) {
    try {
      const id = await emprestimoService.realizarEmprestimo(req.body);
      return res.status(201).json({ 
        success: true,
        message: 'Empréstimo realizado com sucesso!', 
        id 
      });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async devolver(req, res) {
    try {
      const { id } = req.params;
      const resultado = await emprestimoService.registrarDevolucao(id, req.body);
      return res.status(200).json({ success: true, ...resultado });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new EmprestimoController();
