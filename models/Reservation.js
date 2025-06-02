const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  trajet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trajet',
    required: [true, 'Une réservation doit être associée à un trajet']
  },
  passager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Une réservation doit avoir un passager']
  },
  placesReservees: {
    type: Number,
    required: [true, 'Veuillez spécifier le nombre de places'],
    min: 1
  },
  totalPrice: {
    type: Number,
  },
  statut: {
    type: String,
    enum: ['confirmé', 'annulé', 'terminé', 'en_attente'],
    default: 'en_attente'
  },
  paymentMethod: {
    type: String,
  },
  preferences: {
    type: {},
  },
  pointDeRdV: {
    type: String,
    trim: true
  },
  message:{
    type: String,
    trim: true
  },
  commentaire: {
    type: String,
    trim: true,
    maxlength: 200
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Middleware pour mettre à jour la date de modification
reservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware pour peupler automatiquement les références
reservationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'trajet',
    select: 'depart arrivee date heure prix conducteur'
  }).populate({
    path: 'passager',
    select: 'nom prenom telephone'
  });
  next();
});

// Validation pour vérifier la disponibilité des places
reservationSchema.pre('save', async function(next) {
  const trajet = await mongoose.model('Trajet').findById(this.trajet);
  const reservations = await mongoose.model('Reservation').find({
    trajet: this.trajet,
    statut: { $ne: 'annulé' }
  });
  
  const placesReservees = reservations.reduce((acc, resa) => acc + resa.places, 0);
  
  if (placesReservees + this.places > trajet.places) {
    throw new Error('Pas assez de places disponibles sur ce trajet');
  }
  
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);