
const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// Demande de réinitialisation
router.post('/request', passwordResetController.requestReset);

// Réinitialisation effective
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;