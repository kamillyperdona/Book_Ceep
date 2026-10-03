// backend/src/routes/relatorio.routes.js
const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/relatorio.controller');

// GET /api/relatorios/atrasados
router.get('/atrasados', RelatorioController.atrasados);

// GET /api/relatorios/aluno/1
router.get('/aluno/:id_aluno', RelatorioController.historicoAluno);

module.exports = router;
