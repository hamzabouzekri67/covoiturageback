const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Protection globale
 router.use(auth.protect);

// Routes

router.put('/createdResrve', 
  role.restrictTo('passager'),
  reservationController.createReservation
);
// router.put('/add', 
//   reservationController.createReservation
// );

router.get('/me',
  role.restrictTo('passager', 'conducteur', 'admin'),
  reservationController.getUserReservations
);

router.get('/all',
  role.restrictTo('admin'),
  reservationController.getAllReservations
);

router.route('/:id')
  .get(
    role.restrictTo('passager', 'conducteur', 'admin'),
    reservationController.verifyReservationAccess,
    reservationController.getReservation
  )
  .patch(
    role.restrictTo('passager', 'admin'),
    reservationController.verifyReservationAccess,
    reservationController.updateReservation
  )
  .delete(
    role.restrictTo('passager', 'admin'),
    reservationController.verifyReservationAccess,
    reservationController.deleteReservation
  );

module.exports = router; 