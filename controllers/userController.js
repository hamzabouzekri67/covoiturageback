const User = require('../models/User');
const AppError = require('../utils/appError');


exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};


// Mettre à jour le profil
// exports.updateProfile = async (req, res, next) => {
//   try {
//     if (req.body.password) {
//       return next(new AppError('Cette route ne permet pas de modifier le mot de passe', 400));
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.status(200).json({
//       status: 'success',
//       data: { user: updatedUser }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true 
    }); 

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer le compte
// exports.deleteProfile = async (req, res, next) => {
//   try {
//     await User.findByIdAndDelete(req.user.id);
//     res.status(204).json({
//       status: 'success',
//       data: null
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.deleteUser = async (req, res, next) => {
  try {    
    const user = await User.findByIdAndUpdate(req.params.id,{
      status:'deleted'
    });

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(204).json({
      status: 'success',
      data: true
    });
  } catch (err) {
    next(err);
  }
};

// Pour les admins
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      role: { $ne: "admin" },
      status:"pending",
   });    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err) { 
    next(err);
  }
};   

exports.acceptedUser = async (req, res, next) => {
  try {    
      const user = await User.findByIdAndUpdate(req.params.id,
      {
        status:"accepted"
      },{new:true});      
    if (user != null) {
      res.status(200).json({
      status: 'success',
      data: user
    });
    }
  } catch (err) { 
    next(err);
  }
}; 

exports.rejectedUser = async (req, res, next) => {
  try {
      const user = await User.findByIdAndUpdate(req.params.id,{
        status:"rejeted"
      },{new:true});
    if (user != null) {
      res.status(200).json({
      status: 'success',
      data: user
    });
    }
  } catch (err) { 
    next(err);
  }
}; 