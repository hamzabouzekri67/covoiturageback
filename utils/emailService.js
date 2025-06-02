const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Configuration des templates Handlebars
transporter.use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve(__dirname, '../views/emails'),
    defaultLayout: false
  },
  viewPath: path.resolve(__dirname, '../views/emails'),
  extName: '.hbs'
}));

/**
 * Envoie un email de bienvenue
 * @param {Object} user - Utilisateur destinataire
 */
exports.sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"Covoiturage App" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Bienvenue sur notre plateforme de covoiturage',
    template: 'welcome',
    context: {
      name: `${user.prenom} ${user.nom}`,
      appName: process.env.APP_NAME
    }
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {Object} user - Utilisateur destinataire
 * @param {String} resetToken - Token de réinitialisation
 */
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Covoiturage App" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Réinitialisation de votre mot de passe',
    template: 'passwordReset',
    context: {
      name: user.prenom,
      resetUrl,
      expiresIn: '1 heure'
    }
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Envoie une notification de nouvelle réservation
 * @param {Object} reservation - Réservation créée
 */
exports.sendReservationNotification = async (reservation) => {
  const mailOptions = {
    from: `"Covoiturage App" <${process.env.EMAIL_FROM}>`,
    to: reservation.trajet.conducteur.email,
    subject: 'Nouvelle réservation sur votre trajet',
    template: 'newReservation',
    context: {
      conducteurName: reservation.trajet.conducteur.prenom,
      passagerName: `${reservation.passager.prenom} ${reservation.passager.nom}`,
      trajetDetails: `${reservation.trajet.depart} → ${reservation.trajet.arrivee}`,
      date: reservation.trajet.date.toLocaleDateString(),
      places: reservation.places
    }
  };

  await transporter.sendMail(mailOptions);
};