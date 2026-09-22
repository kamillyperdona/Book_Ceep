const { Router } = require('express');
const autorController = require('../controllers/autor.controller');

const router = Router();
router.get('/', autorController.listar);
router.post('/', autorController.criar);

module.exports = router;
