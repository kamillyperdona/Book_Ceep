// backend/src/routes/emprestimo.routes.js
const express = require('express');
const router = express.Router();
const EmprestimoController = require('../controllers/emprestimo.controller');
const { validarEmprestimo } = require('../middlewares/emprestimo.middleware');

router.post('/', validarEmprestimo, EmprestimoController.criar);
router.patch('/:id/devolucao', EmprestimoController.devolver);
router.get('/ativos', EmprestimoController.listarAtivos);

module.exports = router;
