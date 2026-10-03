// backend/src/routes/turma.routes.js
const express = require('express');
const router = express.Router();
const TurmaController = require('../controllers/turma.controller');

// Rota POST para cadastrar turma: POST /api/turmas
router.post('/', TurmaController.criar);

// Rota GET para listar turmas: GET /api/turmas
router.get('/', TurmaController.listar);

module.exports = router;
