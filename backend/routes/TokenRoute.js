const express = require('express');
const tokenController = require('../controllers/TokenController');

const router = express.Router();

router.get('/balance/:username', tokenController.getBalance);
router.post('/loyalty/withdraw', tokenController.withdraw);
router.post('/fiat/withdraw', tokenController.withdrawFiatToCrypto);

module.exports = router;