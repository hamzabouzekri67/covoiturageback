const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

// Générer un token de réinitialisation
exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Aucun compte associé à cet email'
      });
    }

    // 2. Générer un token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 heure

    // 3. Sauvegarder dans l'utilisateur
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // 4. Envoyer l'email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Réinitialisation de mot de passe',
      message: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetUrl}`
    });

    res.status(200).json({
      success: true,
      message: 'Email de réinitialisation envoyé'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: error.message
    });
  }
};

// Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 1. Trouver l'utilisateur avec le token valide
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // 2. Mettre à jour le mot de passe
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 3. Envoyer confirmation
    await sendEmail({
      email: user.email,
      subject: 'Mot de passe modifié',
      message: 'Votre mot de passe a été modifié avec succès'
    });

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation',
      error: error.message
    });
  }
};