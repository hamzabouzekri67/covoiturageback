 const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Un feedback doit avoir un auteur']
  },
  comment: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// feedbackSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'author',
//     select: 'nom prenom'
//   }).populate({
//     path: 'recipient',
//     select: 'nom prenom'
//   }).populate({
//     path: 'trajet',
//     select: 'depart arrivee date'
//   });
//   next();
// });

// Validation pour s'assurer qu'un utilisateur ne donne qu'un feedback par réservation
feedbackSchema.index({author: 1});

module.exports = mongoose.model('Feedback', feedbackSchema);