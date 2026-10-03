// backend/src/routes/livro.routes.js
const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/livro.controller');

// Exemplo de chamada: GET /api/livros?titulo=Dom&genero=Romance
router.get('/', LivroController.buscar);

// Detalhes dos exemplares de um livro especifico: GET /api/livros/1/exemplares
router.get('/:id/exemplares', LivroController.listarExemplares);

module.exports = router;
