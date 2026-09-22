const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        sucess: true,
        message: 'API BookCeep está funcionando corretamente!'
    });
});

module.exports = router;
