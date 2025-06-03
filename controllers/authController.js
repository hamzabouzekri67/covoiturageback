const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../utils/emailService');
const PasswordReset = require('../models/PasswordReset');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const { log } = require('winston');

// Helper pour générer des tokens
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('Configuration serveur invalide: JWT_SECRET manquant', 500);
  }
  return jwt.sign(
    { id: userId.toString(), role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '150d' }
  );
};

// Fonction pour envoyer la réponse utilisateur standard
const sendUserResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);
  
  const userResponse = {
    id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    emailVerified:user.emailVerified,
    cin:user.cin,
    telephone:user.telephone,
    createdAt: user.createdAt
  };

  res.status(statusCode).json({
    status: 'success',
    token,
    user: userResponse
  });
};

// Inscription
exports.register = async (req, res, next) => {
  
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail',
        errors: errors.array() 
      });
    }

    const { nom, prenom, email, password,cin,telephone, role = 'user' } = req.body;

    const existingUser = await User.findOne({email:email , status : {$ne:"deleted"}  });
    if (existingUser) {
      return next(new AppError('Email déjà utilisé', 400));
    }
    const user = await User.create({
      nom,
      prenom,
      email,
      password,
      role,
      cin,
      telephone
    });

    sendUserResponse(user, 201, res);

  } catch (err) {
    console.log(err);
    
    next(err);
  }
};

// Connexion
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'fail',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({email:email , status : {$ne:"deleted"}  }).select('+password');
    
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Identifiants invalides', 401));
    }

    sendUserResponse(user, 200, res);

  } catch (err) {
    next(err);
  }
};

// Mot de passe oublié
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Aucun utilisateur avec cet email', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user.email, resetToken);
      
      res.status(200).json({
        status: 'success',
        message: 'Email de réinitialisation envoyé'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError("Erreur lors de l'envoi de l'email", 500));
    }

  } catch (err) {
    next(err);
  }
};

// Réinitialisation du mot de passe
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // 1) Hash le token pour le comparer avec celui en DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Token invalide ou expiré', 400));
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    sendUserResponse(user, 200, res);

  } catch (err) {
    next(err);
  }
};