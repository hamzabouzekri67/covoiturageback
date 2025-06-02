const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/register - Enregistrement d'un nouvel utilisateur
router.post('/register', authController.register);

// POST /api/auth/login - Connexion d'un utilisateur
router.post('/login', authController.login);

// POST /api/auth/forgot-password - Demande de réinitialisation de mot de passe
router.post('/forgot-password', authController.forgotPassword);

// PATCH /api/auth/reset-password/:token - Réinitialisation du mot de passe
router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;