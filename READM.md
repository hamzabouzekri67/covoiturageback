covoiturageback/
│
├── config/                         # Fichiers de configuration
│   └── db.js                       # Connexion à MongoDB
│
├── controllers/                   # Logique métier (Business Logic)
│   ├── adminController.js
│   ├── authController.js
│   ├── feedbackController.js
│   ├── passwordResetController.js
│   ├── reservationController.js
│   ├── trajetController.js
│   └── userController.js
│
├── middleware/                    # Middlewares Express personnalisés
│   ├── auth.js                    # Authentification JWT
│   ├── errorHandler.js           # Gestion centralisée des erreurs
│   └── role.js                    # Vérification des rôles (admin/user)
│
├── models/                        # Schémas Mongoose
│   ├── Feedback.js
│   ├── PasswordReset.js
│   ├── Reservation.js
│   ├── Trajet.js
│   └── User.js
│
├── routes/                        # Définition des routes API
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── feedbackRoutes.js
│   ├── passwordResetRoutes.js
│   ├── reservationRoutes.js
│   ├── trajetRoutes.js
│   └── userRoutes.js
│
├── utils/                         # Fonctions utilitaires globales
│   ├── appError.js                # Classe d'erreur personnalisée
│   ├── emailService.js           # Envoi d'e-mails via nodemailer
│   └── helpers.js                 # Fonctions d'aide (token, etc.)
│
├── .env                           # Variables d’environnement (non commit)
├── .gitignore                     # Fichiers/dossiers ignorés par Git
├── package.json                   # Dépendances et scripts
├── package-lock.json              # Versions exactes des dépendances
├── README.md                      # Documentation du projet
└── server.js                      # Point d’entrée de l’application