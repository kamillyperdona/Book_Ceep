const { Router } = require('express');
const editoraController = require('../controllers/editora.controller');

const router = Router();
router.get('/', editoraController.listar);
router.post('/', editoraController.criar);

module.exports = router;
