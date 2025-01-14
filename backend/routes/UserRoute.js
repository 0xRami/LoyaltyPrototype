const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

router.post('', userController.createUser);
router.get('/:username', userController.getUser);

module.exports = router;