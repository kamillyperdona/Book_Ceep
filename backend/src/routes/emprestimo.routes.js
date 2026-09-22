const { Router } = require('express');
const emprestimoController = require('../controllers/emprestimo.controller');

const router = Router();

router.post('/', emprestimoController.criar);
router.put('/:id/devolucao', emprestimoController.devolver);

module.exports = router;
