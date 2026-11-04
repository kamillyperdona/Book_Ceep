const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/livro.controller');

// Rota para listar todos os livros ou buscar por título (via query param ?pesquisa=)
router.get('/', LivroController.listar);

// Rota para cadastrar um novo livro e seus exemplares
router.post('/', LivroController.criar);

// CORREÇÃO: Altere de '/livros/:isbn' para apenas '/:isbn'
router.delete('/:isbn', LivroController.deletar);

module.exports = router;
