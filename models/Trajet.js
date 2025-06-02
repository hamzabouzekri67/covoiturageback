const mongoose = require("mongoose");

const trajetSchema = new mongoose.Schema({
  conducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Un trajet doit avoir un conducteur"],
  },
  depart: {
    type: String,
    required: [true, "Veuillez spécifier un point de départ"],
    trim: true,
  },
  arrivee: {
    type: String,
    required: [true, "Veuillez spécifier une destination"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Veuillez spécifier une date"],
    validate: {
      validator: function (value) {
        return value >= Date.now();
      },
      message: "La date doit être ultérieure à aujourd'hui",
    },
  },
  heure: {
    type: String,
    required: [true, "Veuillez spécifier une heure de départ"],
  },
  places: {
    type: Number,
    required: [true, "Veuillez spécifier le nombre de places"],
    min: 1,
    max: 8,
  },
  prix: {
    type: Number,
    required: [true, "Veuillez spécifier un prix"],
    min: 0,
  },
  stops: [
    {
      type: String,
      trim: true,
    },
  ],
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  bagages: {
    type: Boolean,
    default: false,
  },
  animaux: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passagers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending','completed'],
    default: 'pending'
  },
});

// Index pour les recherches
trajetSchema.index({ depart: "text", arrivee: "text" });

// Middleware pour peupler automatiquement le conducteur
trajetSchema.pre(/^find/, function (next) {
  this.populate({
    path: "conducteur",
    select: "nom prenom telephone vehicule rating",
  }).populate({
    path: "passagers",
    select: "nom prenom telephone",
  });
  next();
});

module.exports = mongoose.model("Trajet", trajetSchema);
