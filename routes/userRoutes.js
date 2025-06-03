const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Routes protégées
router.get('/profile/:id',auth.protect, userController.getProfile);
router.put('/profile/update/:id', auth.protect, userController.updateUser);
router.put('/profile/delete/:id', userController.deleteUser);

// Route admin
router.get('/', auth.protect, auth.restrictTo('admin'), userController.getAllUsers);
router.put('/acceptedUser/:id', auth.protect, auth.restrictTo('admin'), userController.acceptedUser);
router.put('/rejectedUser/:id', auth.protect, auth.restrictTo('admin'), userController.rejectedUser);

router.post('/forgetPass', userController.forgetPass);
router.post('/updatePass/:id', userController.UpdatePass);


module.exports = router;   