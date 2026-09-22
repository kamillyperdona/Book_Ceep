const { Router } = require('express');
const exemplarController = require('../controllers/exemplar.controller');

const router = Router();
router.get('/', exemplarController.listar);
router.get('/disponiveis', exemplarController.listarDisponiveis);
router.post('/', exemplarController.criar);

module.exports = router;
