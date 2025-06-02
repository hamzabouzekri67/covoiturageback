const Trajet = require("../models/Trajet");
const Reservation = require("../models/Reservation");
const AppError = require("../utils/appError");

// Middleware de vérification de propriété
exports.verifyOwner = async (req, res, next) => {
  try {
    const trajet = await Trajet.findById(req.params.id);

    if (!trajet) {
      return next(new AppError("Trajet non trouvé", 404));
    }

    if (
      trajet.conducteur.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Non autorisé à modifier ce trajet", 403));
    }

    req.trajet = trajet;
    next();
  } catch (err) {
    next(err); 
  }
}; 

// Créer un trajet
exports.createTrajet = async (req, res, next) => {
  try {
    const trajet = await Trajet.create({
      conducteur: req.user.id,
      depart: req.body.pointDepart,
      arrivee: req.body.pointArrivee,
      date: req.body.date,
      heure: req.body.heureDepart,
      places: req.body.nombrePlaces,
      prix: req.body.prix,
      stops: req.body.stops || [],
      bagages:!req.body.bagages ? false: true,
      animaux:req.body.animaux,
      fumeur:req.body.fumeur
    });

    res.status(201).json({
      status: "success",
      data: { trajet },
    }); 
  } catch (err) {
    console.log(err);
    
    next(err);
  }
};

// Récupérer tous les trajets
exports.getAllTrajets = async (req, res, next) => {
  try {
    // console.log("req.query");
    
    const { depart, destination, date } = req.query;
     
    let criteres = {};

    if (depart) criteres.depart = { $regex: depart, $options: "i" };
    if (destination) criteres.arrivee = { $regex: destination, $options: "i" };

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      criteres.date = { $gte: startOfDay, $lte: endOfDay };
    }


    const trajets = await Trajet.find(criteres);
    if (trajets.length === 0) {
      return res.status(404).json({
        status: "error", 
        message: "Aucun trajet trouvé pour ces critères",
      });
    }

    res.status(200).json({
      status: "success",
      data: trajets,
    });
  } catch (err) {
    next(err);
  }
};

// Récupérer les détails d'un trajet
exports.getTrajetDetails = async (req, res, next) => {
  try {
   
    
    const trajet = await Trajet.find({
    conducteur:req.params.id
    });   
       console.log(trajet);
  
    if (!trajet) {
      return next(new AppError("Aucun trajet trouvé avec cet ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: trajet, 
    });
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un trajet
exports.updateTrajet = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "depart",
      "arrivee",
      "date",
      "heure",
      "places",
      "prix",
      "stops",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return next(new AppError("Mises à jour non autorisées", 400));
    }

    updates.forEach((update) => (req.trajet[update] = req.body[update]));
    const updatedTrajet = await req.trajet.save();

    res.status(200).json({
      status: "success",
      data: { trajet: updatedTrajet },
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer un trajet
exports.deleteTrajet = async (req, res, next) => {
  try {
     const trajet = await Trajet.findByIdAndUpdate(req.params.id,{
      status:"rejected",
      
    },{new:true});

    if (trajet) {
     res.status(200).json({
      status: "success",
      data: trajet,
    });
    }
  } catch (err) {
    next(err); 
  }
};

exports.acceptedTrajet = async (req, res, next) => {
  try {
    const trajet = await Trajet.findByIdAndUpdate(req.params.id,{
      status:"accepted",
      
    },{new:true});

    if (trajet) {
     res.status(200).json({
      status: "success",
      data: trajet,
    });
    }
  } catch (err) {
    next(err); 
  }
};

exports.completedTrajet = async (req, res, next) => {
  try {
    const trajet = await Trajet.findByIdAndUpdate(req.params.id,{
      status:"completed",
      
    },{new:true});

    if (trajet) {
     res.status(200).json({
      status: "success",
      data: trajet,
    });
    }
  } catch (err) {
    next(err); 
  }
};


// Récupérer les réservations d'un trajet
exports.getTrajetReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      trajet: req.params.id,
    }).populate("passager", "nom prenom telephone");

    res.status(200).json({
      status: "success",
      results: reservations.length,
      data: { reservations },
    });
  } catch (err) {
    next(err);
  }
};
