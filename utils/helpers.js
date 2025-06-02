const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Génère un token aléatoire
 * @param {Number} length - Longueur du token
 * @returns {String} Token généré
 */
exports.generateRandomToken = (length = 32) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

/**
 * Génère un token JWT
 * @param {Object} payload - Données à inclure dans le token
 * @returns {String} Token JWT
 */
exports.generateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Vérifie et décode un token JWT
 * @param {String} token - Token JWT
 * @returns {Object} Données décodées
 */
exports.verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Formate une date pour l'affichage
 * @param {Date} date - Date à formater
 * @param {String} locale - Locale (par défaut 'fr-FR')
 * @returns {String} Date formatée
 */
exports.formatDate = (date, locale = 'fr-FR') => {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calcule la distance entre deux points (formule haversine)
 * @param {Object} point1 - { lat, lng }
 * @param {Object} point2 - { lat, lng }
 * @returns {Number} Distance en km
 */
exports.calculateDistance = (point1, point2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * 
    Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Filtre les propriétés d'un objet
 * @param {Object} obj - Objet à filtrer
 * @param {Array} allowedFields - Champs autorisés
 * @returns {Object} Nouvel objet filtré
 */
exports.filterObject = (obj, allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

/**
 * Gestionnaire d'erreurs async/await
 * @param {Promise} promise - Promise à wrapper
 * @returns {Array} [data, error]
 */
exports.catchAsync = (promise) => {
  return promise
    .then(data => [data, null])
    .catch(error => [null, error]);
};