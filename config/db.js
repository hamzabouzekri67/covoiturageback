const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 secondes timeout
      maxPoolSize: 10, // Nombre max de connexions
      socketTimeoutMS: 45000, // Fermeture après 45s d'inactivité
      family: 4, // Utiliser IPv4
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ MongoDB Connecté: ${conn.connection.host}'.cyan.underline);
    
    // Événements de connexion
    mongoose.connection.on('connected', () => {
      console.log('Mongoose: Connecté à la base de données'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose erreur de connexion: ${err.message}'.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose: Déconnecté de la base de données'.yellow);
    });

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB: ${error.message}'.red.bold);
    process.exit(1); // Quitte l'application avec erreur
  }
};

// Gestion propre de la fermeture
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose: Déconnexion suite à la fin de l\'application');
  process.exit(0);
});

module.exports = connectDB;