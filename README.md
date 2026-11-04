# DAR & ATELIER — Plateforme Immobilière & Atelier d'Architecture de Prestige

Plateforme web haut de gamme dédiée à l'immobilier d'exception, à la construction de villas de luxe, et à l'architecture d'intérieur au Maroc (Casablanca, Marrakech, Rabat, Tanger).

---

## 🏛️ Fonctionnalités Clés

### Espace Public (Vitrine de Prestige)
- **Catalogue Immobilier Haute Définition** : Recherche multicritères (ville, type de bien, fourchette de prix, chambres, surface), filtres avancés et tri dynamique.
- **Fiches Détaillées de Biens** : Mosaïque de galerie, diaporama lightbox, caractéristiques techniques complètes, géolocalisation et simulateur de financement.
- **Ingénierie & Construction** : Présentation du processus de construction (gros œuvre, finitions, domotique), standards parasismiques et fiches techniques.
- **Atelier d'Architecture & Décoration d'Intérieur** : Portfolio par catégories (Salons marocains contemporains, suites parentales, cuisines ouvertes, extérieurs & piscines).
- **Simulateur de Devis & Estimation** : Formulaire interactif guidé multi-étapes pour estimations de construction, rénovation et décoration.
- **Favoris & Partage** : Sauvegarde persistante des biens favoris (base de données pour utilisateurs connectés, localStorage pour visiteurs).
- **Internationalisation Complète** : Support bilingue et trilingue (Français, Anglais, Arabe avec support RTL).

### Système d'Authentification Complet
- **Inscription avec Vérification Email** : Création de compte sécurisée avec vérification par email réel (pas de simulation).
- **Connexion Sécurisée** : Authentification JWT avec vérification du statut de l'email.
- **Réinitialisation de Mot de Passe** : Flux complet de récupération de mot de passe par email.
- **Tableau de Bord Utilisateur** : Gestion du profil, favoris, demandes de devis, changement de mot de passe, suppression de compte.

### Direction Artistique & Motion Design
- Système d'animations fluide propulsé par **Framer Motion** avec courbe de Bézier personnalisée (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Transitions de pages fluides sans sauts de mise en page.
- Révélations progressives au défilement (`RevealOnScroll`) et conteneurs échelonnés (`StaggerContainer`).
- Curseur personnalisé raffiné sur desktop avec désactivation automatique sur tactile et respect strict de `prefers-reduced-motion: reduce`.

### Console d'Administration
- **Tableau de Bord Exécutif** : Métriques KPI, graphiques Recharts (tendances des leads, répartition du parc immobilier).
- **Gestion des Biens** : Création, modification, filtrage, gestion des statuts (Disponible, Sous compromis, Vendu, Loué).
- **Gestion des Leads & Contacts** : Qualification des prospects, statuts (Nouveau, Contacté, Qualifié, Clôturé).
- **Suivi des Chantiers & Devis** : Pipeline de projets de construction avec jalons et montants contractuels.
- **Contrôle d'Accès Basé sur les Rôles (RBAC)** : Super Administrateur, Chef de Projet, Agent Commercial, Architecte, Client.

---

## 🛠️ Stack Technique

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, React Hook Form, Zod.
- **Backend** : Node.js, Express, TypeScript, Prisma ORM, SQLite, JWT Authentication, Helmet, Rate Limiter, Nodemailer.
- **Tests** : Vitest (11 tests unitaires couvrant la cinématique, le stockage et les autorisations RBAC).

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js >= 18.x
- npm >= 9.x
- Aucun serveur de base de données externe requis (SQLite inclus)
- Compte email SMTP optionnel (Gmail, SendGrid, Brevo, Resend, etc.)

### 1. Cloner le dépôt
```bash
git clone https://github.com/arrimaniusothmane-prog/Dariestate-v2.git
cd Dariestate-v2
```

### 2. Frontend
```bash
# Installation des dépendances
npm install

# Lancement en mode développement (http://localhost:5173)
npm run dev

# Exécution des tests unitaires
npm test

# Build de production
npm run build
```

### 3. Backend (API REST)
```bash
cd server
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditez .env avec vos configurations (voir section Variables d'Environnement)

# Création de la base SQLite locale + génération du client Prisma
npx prisma db push
npx prisma generate

# Données de démonstration (admin, biens, chantiers, design...)
npm run prisma:seed

# Lancement du serveur API (http://localhost:5000)
npm run dev
```

---

## ⚙️ Configuration des Variables d'Environnement

### Backend (server/.env)

```bash
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données SQLite locale (aucun serveur PostgreSQL requis)
DATABASE_URL="file:./dev.db"

# Sécurité JWT
JWT_SECRET="votre-clé-secrète-jwt-minimum-32-caractères"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# Upload de fichiers
UPLOAD_DIR="./uploads"

# Configuration Email (IMPORTANT pour la vérification email)
EMAIL_SERVICE="smtp"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASSWORD="votre-mot-de-passe-application"
EMAIL_FROM="DAR & ATELIER <noreply@dar-atelier.ma>"

# URL frontend pour les liens de vérification email
FRONTEND_URL="http://localhost:5173"

# Admin de développement (optionnel)
DEV_ADMIN_EMAIL="admin@dar-atelier.ma"
DEV_ADMIN_PASSWORD="AdminSecure2025!"
```

### Frontend (root/.env)

```bash
VITE_API_URL=/api/v1
VITE_ENABLE_MOCK_FALLBACK=true
VITE_DEFAULT_LANGUAGE=fr
VITE_DEFAULT_CURRENCY=MAD
```

---

## 📧 Configuration de l'Email

### Gmail (Recommandé pour le développement)

1. Activez la vérification en 2 étapes sur votre compte Google
2. Allez dans [Google Account Settings](https://myaccount.google.com/security)
3. Cliquez sur "App passwords"
4. Créez un nouveau mot de passe d'application
5. Utilisez ce mot de passe dans `EMAIL_PASSWORD`

### SendGrid (Production)

```bash
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="apikey"
EMAIL_PASSWORD="SG.votre_clé_api"
```

### Brevo (anciennement Sendinblue)

```bash
EMAIL_HOST="smtp-relay.brevo.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="votre-email@brevo.com"
EMAIL_PASSWORD="votre-clé-smtp"
```

### Resend (Recommandé pour la production)

```bash
EMAIL_HOST="smtp.resend.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="resend"
EMAIL_PASSWORD="re_votre_clé_api"
```

---

## 🗄️ Migrations de Base de Données

### Nouvelles migrations ajoutées

1. **add_email_verification_and_password_reset** : Ajoute les champs pour la vérification email et la réinitialisation de mot de passe à la table User
   - `isEmailVerified` : Boolean
   - `emailVerificationToken` : String (unique)
   - `emailVerificationExpires` : DateTime
   - `resetPasswordToken` : String (unique)
   - `resetPasswordExpires` : DateTime

Pour appliquer la migration :
```bash
cd server
npx prisma migrate dev --name add_email_verification_and_password_reset
```

---

## 📊 Nouveaux Endpoints API

### Authentification

- `POST /api/v1/auth/register` - Inscription avec envoi d'email de vérification
- `POST /api/v1/auth/login` - Connexion avec vérification du statut email
- `GET /api/v1/auth/me` - Obtenir le profil utilisateur connecté
- `POST /api/v1/auth/logout` - Déconnexion
- `GET /api/v1/auth/verify-email?token=xxx` - Vérifier l'adresse email
- `POST /api/v1/auth/resend-verification` - Renvoyer l'email de vérification
- `POST /api/v1/auth/request-password-reset` - Demander une réinitialisation de mot de passe
- `POST /api/v1/auth/reset-password` - Réinitialiser le mot de passe

### Favoris

- `GET /api/v1/favorites` - Obtenir les favoris de l'utilisateur connecté
- `POST /api/v1/favorites` - Ajouter un favori
- `DELETE /api/v1/favorites/:propertyId` - Supprimer un favori
- `GET /api/v1/favorites/check/:propertyId` - Vérifier si une propriété est en favori

### Gestion de Profil Utilisateur

- `PATCH /api/v1/users/me/profile` - Mettre à jour le profil (nom, téléphone, avatar)
- `POST /api/v1/users/me/change-password` - Changer le mot de passe
- `DELETE /api/v1/users/me` - Supprimer le compte utilisateur

---

## 🔐 Sécurité

- **Mot de passe haché** avec bcryptjs (salt rounds: 10)
- **Tokens JWT** avec expiration configurable
- **Vérification email obligatoire** pour la connexion
- **Rate limiting** sur tous les endpoints API
- **Helmet** pour les headers de sécurité HTTP
- **CORS configuré** pour les origines autorisées
- **Validation des entrées** avec Zod
- **Protection contre les injections SQL** via Prisma ORM

---

## 📝 Flux Utilisateur à Tester

1. **Inscription** : Créer un compte → Recevoir email de vérification → Cliquer sur le lien
2. **Connexion** : Se connecter avec email vérifié → Accéder au tableau de bord
3. **Gestion du profil** : Modifier nom/téléphone → Changer photo de profil
4. **Favoris** : Ajouter des propriétés en favoris → Voir dans le tableau de bord
5. **Demande de devis** : Soumettre une demande → Voir dans l'historique
6. **Réinitialisation mot de passe** : Demander reset → Recevoir email → Créer nouveau mot de passe
7. **Suppression compte** : Supprimer le compte avec confirmation par mot de passe

---

## 🐛 Problèmes Connus

### Base de données locale

Le backend utilise **SQLite** par défaut afin que le projet soit immédiatement
fonctionnel sans installation de PostgreSQL. La base est créée dans
`server/prisma/dev.db`.

Si le schéma ou les données ont été réinitialisés :

```bash
cd server
npx prisma db push
npx prisma generate
npm run prisma:seed
```

Pour repartir d'une base vierge, supprimez `server/prisma/dev.db` puis relancez
les commandes ci-dessus.

---

## 📄 Licence
Propriété exclusive de **DAR & ATELIER**. Tous droits réservés.
