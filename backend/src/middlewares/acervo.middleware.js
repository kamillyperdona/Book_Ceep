// backend/src/middlewares/acervo.middleware.js

function validarNomeObrigatorio(req, res, next) {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({
      sucess: false,
      message: 'O campo "nome" é obrigatório e não pode ficar em branco.'
    });
  }

  next();
}

module.exports = { validarNomeObrigatorio };
