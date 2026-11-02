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
- **Favoris & Partage** : Sauvegarde locale des biens favoris et contact direct WhatsApp / email.
- **Internationalisation Complète** : Support bilingue et trilingue (Français, Anglais, Arabe avec support RTL).

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
- **Backend** : Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, Helmet, Rate Limiter.
- **Tests** : Vitest (11 tests unitaires couvrant la cinématique, le stockage et les autorisations RBAC).

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js >= 18.x
- npm >= 9.x

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

# Génération du client Prisma et migrations
npx prisma generate
npx prisma migrate dev

# Lancement du serveur API (http://localhost:5000)
npm run dev
```

---

## 📄 Licence
Propriété exclusive de **DAR & ATELIER**. Tous droits réservés.
