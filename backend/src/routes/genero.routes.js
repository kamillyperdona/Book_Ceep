const { Router } = require('express');
const generoController = require('../controllers/genero.controller');

const router = Router();
router.get('/', generoController.listar);
router.post('/', generoController.criar);

module.exports = router;
