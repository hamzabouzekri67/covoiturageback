const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom ne peut excéder 50 caractères']
  },
  prenom: { 
    type: String, 
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut excéder 50 caractères']
  },
  email: { 
    type: String, 
    required: [true, 'L\'email est obligatoire'],
    lowercase: true,
    trim: true,
    validate: { 
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} n'est pas un email valide!`
    }
  },
  password: { 
    type: String, 
    required: [true, 'Le mot de passe est obligatoire'],
    select: false, 
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['admin', 'conducteur', 'passager'],
    default: 'passager'
  },
  telephone: {
    type: String,
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
   status: {
    type: String,
    enum: ['accepted', 'rejeted', 'pending','deleted'],
    default: 'pending'
  },
  cin: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
    //select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware pour hasher le mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier si le mot de passe a changé après le token
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Méthode pour créer un token de réinitialisation
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// userSchema.createIndex(
//   { email: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { status: { $ne: "deleted" } }
//   }
// );
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "deleted" } } }
);

const User = mongoose.model('User', userSchema);
module.exports = User;