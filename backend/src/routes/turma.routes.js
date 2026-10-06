const express = require('express');
const router = express.Router();
const TurmaController = require('../controllers/turma.controller');

router.get('/', TurmaController.listar);
router.post('/', TurmaController.criar);
router.put('/:id', TurmaController.atualizar);
router.delete('/:id', TurmaController.deletar);

module.exports = router;
