const { Router } = require('express');
const alunoController = require('../controllers/aluno.controller');

const router = Router();

router.get('/', alunoController.listar);
router.get('/:cgm', alunoController.buscarPorId);
router.post('/', alunoController.criar);
router.put('/:cgm', alunoController.atualizar);
router.delete('/:cgm', alunoController.deletar);

module.exports = router;
