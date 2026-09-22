const { Router } = require('express');
const livroController = require('../controllers/livro.controller');

const router = Router();
router.get('/', livroController.listar);
router.post('/', livroController.criar);

module.exports = router;
