const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
// Protection globale des routes admin
// router.use(auth, role('admin'));
// Middleware pour vérifier si l'utilisateur est authentifié et a le rôle d'admin
router.use(auth.protect, role.restrictTo('admin'));


// Statistiques
router.get('/stats', adminController.getStats);

// Gestion utilisateurs
router.get('/users', adminController.getAllUsers);
// router.get('/users/:id', adminController.getUser);
// router.patch('/users/:id', adminController.updateUser);
// router.delete('/users/:id', adminController.deactivateUser);

// Gestion trajets
router.get('/trajets', adminController.getAllTrajets);
router.delete('/trajets/:id', adminController.deleteTrajet);

// Gestion réservations
router.get('/reservations', adminController.getAllReservations);
router.delete('/reservations/:id', adminController.deleteReservation);

module.exports = router;