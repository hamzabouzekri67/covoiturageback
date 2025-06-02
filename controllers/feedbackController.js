const Feedback = require('../models/Feedback');
const AppError = require('../utils/appError');

// Middleware de vérification d'accès
exports.verifyFeedbackAccess = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return next(new AppError('Feedback non trouvé', 404));
    }

    

    // Autoriser l'auteur, l'admin ou le destinataire
    const isAuthor = feedback.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
   // const isRecipient = feedback.destinataire.toString() === req.user.id;

    if (!isAuthor && !isAdmin) {
      return next(new AppError('Accès non autorisé à ce feedback', 403));
    }

    req.feedback = feedback;
    next();
  } catch (err) {
    next(err); 
  }
};

// Créer un feedback
exports.createFeedback = async (req, res, next) => {
  try {
    console.log(req.body.content);
    
    const feedback = await Feedback.create({
      author: req.user.id,
      comment: req.body.content
    });

    res.status(200).json({
      status: 'success',
      data:feedback
    });
  } catch (err) {
    next(err);
  }
};

// Obtenir tous les feedbacks (admin)
exports.getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({}).populate('author');      
    res.status(200).json({
      status: 'success',
      results: feedbacks.length,
      data:  feedbacks 
    });
  } catch (err) {
    next(err);
  }
};

// Obtenir un feedback spécifique
exports.getFeedback = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: { feedback: req.feedback }
  });
};

// Mettre à jour un feedback
exports.updateFeedback = async (req, res, next) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { feedback: updatedFeedback }
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer un feedback
exports.deleteFeedback = async (req, res, next) => {
  try {    
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
