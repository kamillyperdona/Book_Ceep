// backend/src/middlewares/livro.middleware.js

function validarCadastroLivro(req, res, next) {
  const { titulo, id_autor, id_editora, id_genero } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({
      sucess: false,
      message: 'O título do livro é obrigatório.'
    });
  }

  if (!id_autor || !id_editora || !id_genero) {
    return res.status(400).json({
      sucess: false,
      message: 'Informe o autor, a editora e o gênero do livro.'
    });
  }

  next();
}

module.exports = { validarCadastroLivro };
