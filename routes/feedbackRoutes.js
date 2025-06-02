const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Vérification que le contrôleur est bien configuré
if (!feedbackController || typeof feedbackController.createFeedback !== 'function') {
  throw new Error('Le contrôleur de feedback est mal configuré');
}

// Middleware d'authentification global
router.use(auth.protect);

// Routes pour les feedbacks
router.post('/:id',
  role.restrictTo('passager'),
  feedbackController.createFeedback
);

router.get('/all',
  role.restrictTo('admin'),
  feedbackController.getAllFeedbacks
);

router.get('/:id',
  role.restrictTo('passager', 'conducteur', 'admin'),
  feedbackController.verifyFeedbackAccess,
  feedbackController.getFeedback
);

router.patch('/:id',
  role.restrictTo('passager', 'conducteur'),
  feedbackController.verifyFeedbackAccess,
  feedbackController.updateFeedback
);

router.delete('/:id',
 role.restrictTo('passager', 'conducteur', 'admin'),
  feedbackController.verifyFeedbackAccess,
  feedbackController.deleteFeedback
);

module.exports = router;