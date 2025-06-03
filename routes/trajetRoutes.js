const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Routes publiques
router.get('/all', trajetController.getAllTrajets);
router.get('/:id', trajetController.getTrajetDetails);

router.get('/conducteur/:id', trajetController.getTrajetCondDetails);

// Routes protégées
router.use(auth.protect); // Protection globale pour les routes suivantes

router.post('/add', 
  role.restrictTo('conducteur', 'admin'),
  trajetController.createTrajet
);
    
router.route('/update/:id')
  .patch(
    role.restrictTo('conducteur', 'admin'),
    trajetController.verifyOwner,
    trajetController.updateTrajet
  );

  router.delete('/deleted/:id',
    role.restrictTo('conducteur', 'admin'),
    trajetController.verifyOwner,
    trajetController.deleteTrajet
  );

  router.put('/accepted/:id',
    role.restrictTo('admin'),
    trajetController.verifyOwner,
    trajetController.acceptedTrajet
  );

   router.put('/completed/:id',
    role.restrictTo('admin'),
    trajetController.verifyOwner,
    trajetController.completedTrajet
  );
 
// Route spécifique pour les réservations
router.get('/:id/reservations', 
  role.restrictTo('conducteur', 'admin'),
  trajetController.verifyOwner,
  trajetController.getTrajetReservations
);

module.exports = router;