const express = require('express');
const router = express.Router();
const EmprestimoController = require('../controllers/emprestimo.controller');

// Mapeamento direto aos métodos do Controller
router.get('/', EmprestimoController.listar);
router.post('/', EmprestimoController.criar);

module.exports = router;
