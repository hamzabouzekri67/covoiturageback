const Reservation = require("../models/Reservation");
const Trajet = require("../models/Trajet");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");


// Vérifie l'accès à la réservation
exports.verifyReservationAccess = async (req, res, next) => {
  try {

    console.log(req.user.id);
    
    const reservation = await Reservation.findById(req.params.id).populate(
      "trajet",
      "conducteur"
    );

    

    if (!reservation) {
      return next(new AppError("Réservation non trouvée", 404));
    }




   
    const isPassager = reservation.passager._id.toString() === req.user.id;
    const isConducteur =
      reservation.trajet.conducteur._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";    

    if (!isPassager && !isConducteur && !isAdmin) {
      return next(new AppError("Accès non autorisé", 403));
    }
     const trajet = await Trajet.findById(reservation.trajet._id);
     if (trajet.passagers.some(user => user._id.toString() == req.user.id)) {
      trajet.passagers.pull(req.user.id);
       await trajet.save();
     // return res.status(400).json({ message: "Ce passager est déjà réservé pour ce trajet." });
    }

    req.reservation = reservation;
    next();
  } catch (err) {
    next(err);
  }
};


exports.createReservation = async (req, res, next) => {
  try {
     const {tripId, places, paymentMethod,message,preferences,totalPrice } = req.body;



     const trajet = await Trajet.findById(tripId);
     
    if (!trajet) {
      return next(new AppError("Trajet non trouvé", 404));
    }
     
  // 
     
     if (trajet.passagers.some(user => user._id.toString() == req.user.id)) {
      return res.status(400).json({ message: "Ce passager est déjà réservé pour ce trajet." });
    }
     trajet.passagers.push(req.user.id);
     await trajet.save();
    const reservation = new Reservation({
      passager: req.user.id,
      trajet: tripId,
      placesReservees: places,
      paymentMethod: paymentMethod,
      preferences:preferences,
      totalPrice:totalPrice,
      message:message
    });

    await reservation.save();
    res.status(201).json({
      status: "success",
      data: { reservation },
    });
  } catch (err) {
    next(err);
  }
};

// Obtenir les réservations de l'utilisateur
exports.getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      passager: req.user.id,
    }).populate("trajet", "depart arrivee date heure");

    res.status(200).json({
      status: "success",
      results: reservations.length,
      data: reservations,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
    })

    res.status(200).json({
      status: "success",
      results: reservations.length,
      data: reservations,
    });
  } catch (err) {
    next(err);
  }
};


// Obtenir une réservation spécifique
exports.getReservation = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: { reservation: req.reservation },
  });
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res, next) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: { reservation: updatedReservation },
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res, next) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
