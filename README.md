# Projet de gestion de Reservation d’activités 
![occitanie evasion](https://github.com/user-attachments/assets/b3cd8efd-ddd6-4bd3-a2c4-060fd405b335)



## 1. A propos
Ce projet est une application de gestion de réservation d'activités. Il permet de gérer les réservations des clients pour les activités proposées par l'entreprise.

## 2. Stack Technique
[![Next.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)






## Créateur


## Architecture 
Dossiers :
- app : Utilise l'API App Router pour définir les pages et les routes. Chaque page a son propre répertoire avec un fichier page.tsx pour le rendu et un layout.tsx pour les layouts de page.
- components : Contient des composants réutilisables. Diviser en sous-dossiers, comme ui pour les éléments d'interface et modules pour les composants propres à certaines pages ou fonctionnalités.
- hooks : Stocke les hooks React personnalisés, permettant de séparer la logique de composants.
- lib : Fournit des fonctions, helpers, ou instances externes (ex. configuration d’axios).
- context : Contient les contextes d’état global pour faciliter la gestion de l’état global sans Redux.
- services : Accueille les fonctions de communication avec les API, facilitant leur gestion centralisée.
- store : Emplacement des fichiers d’état global (Redux, Zustand, etc.) si utilisé.
- utils et types : Pour les utilitaires, constantes, et types TypeScript globaux.
```
/src
├── /app               # Nouvelle API App Router (Next.js 13+)
│   ├── /(routes)      # Dossiers spécifiques pour chaque route (groupement optionnel)
│   ├── /api           # Endpoints API
│   ├── /dashboard     # Ex: une route principale avec des sous-routes
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Page d'accueil (racine de l'application)
│
├── /components        # Composants réutilisables dans l'app
│   ├── /ui            # Composants d'interface utilisateur génériques (boutons, formulaires, etc.)
│   └── /modules       # Composants spécifiques à des modules/fonctionnalités
│
├── /hooks             # Hooks React personnalisés
│
├── /lib               # Fonctions utilitaires, helpers, et instances (ex. axios, firebase)
│
├── /styles            # Fichiers CSS/SCSS, modules CSS, styles globaux
│
├── /context           # Fournisseurs de contexte (context API pour l'état global)
│
├── /services          # Fonctions de communication avec les API externes (ou répertoires par API)
│
├── /store             # État global (ex. Redux, Zustand)
│
├── /utils             # Fonctions utilitaires, constantes et types
│
├── /types             # Types TypeScript et interfaces globales
│
└── /assets            # Images, polices, et autres ressources statiques ```
