const { Router } = require('express');
const turmaController = require('../controllers/turma.controller');

const router = Router();

router.get('/', turmaController.listar);
router.get('/:id', turmaController.buscarPorId);
router.post('/', turmaController.criar);
router.put('/:id', turmaController.atualizar);
router.delete('/:id', turmaController.deletar);

module.exports = router;
