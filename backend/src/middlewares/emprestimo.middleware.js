// backend/src/middlewares/emprestimo.middleware.js

function validarEmprestimo(req, res, next) {
  const { id_aluno, id_exemplar, id_funcionario } = req.body;

  if (!id_aluno || !id_exemplar || !id_funcionario) {
    return res.status(400).json({
      sucess: false,
      message: 'É necessário informar id_aluno, id_exemplar e id_funcionario.'
    });
  }

  next();
}

module.exports = { validarEmprestimo };
