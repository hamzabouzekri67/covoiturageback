const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600000) // 1 heure
  },
  used: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h' // Auto-suppression après 1 heure
  }
});

// Méthode pour vérifier si le token est valide
passwordResetSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

// Middleware pour peupler automatiquement l'utilisateur
passwordResetSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'email nom prenom'
  });
  next();
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);