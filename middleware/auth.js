const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // 1. Vérifier le token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }    

    if (!token) {
      return next(new AppError('Vous devez être connecté pour accéder à cette ressource', 401));
    }

    // 2. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("L'utilisateur n'existe plus", 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403)
      );
    }
    next();
  };
};