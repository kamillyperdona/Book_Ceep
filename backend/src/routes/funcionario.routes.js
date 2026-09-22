const { Router } = require('express');
const funcionarioController = require('../controllers/funcionario.controller');

const router = Router();
router.get('/', funcionarioController.listar);
router.post('/', funcionarioController.criar);

module.exports = router;
