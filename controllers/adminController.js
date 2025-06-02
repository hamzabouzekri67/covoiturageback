const User = require('../models/User');
const Trajet = require('../models/Trajet');
const Reservation = require('../models/Reservation');

// Statistiques admin
exports.getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const trajetsCount = await Trajet.countDocuments();
    const reservationsCount = await Reservation.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        users: usersCount,
        trajets: trajetsCount,
        reservations: reservationsCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Obtenir un utilisateur spécifique
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Échec de la mise à jour',
      error: error.message
    });
  }
};

// Désactiver un utilisateur
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur désactivé',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Obtenir tous les trajets
exports.getAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find()
      .populate('conducteur', 'nom prenom')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trajets.length,
      data: trajets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Supprimer un trajet
exports.deleteTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findByIdAndDelete(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: 'Trajet non trouvé'
      });
    }

    // Supprimer les réservations associées
    await Reservation.deleteMany({ trajet: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Trajet supprimé'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('passager', 'nom prenom')
      .populate('trajet', 'depart arrivee date');

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};
