const express = require('express');
const tokenController = require('../controllers/OrderController');

const router = express.Router();

router.post('/order', tokenController.placeOrder);

module.exports = router;