const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/livro.controller');

router.get('/', LivroController.listar);
router.post('/', LivroController.criar);

module.exports = router;
