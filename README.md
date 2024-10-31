# Projet de Gestion de Réservation d’Activités
![Occitanie Évasion](https://github.com/user-attachments/assets/b3cd8efd-ddd6-4bd3-a2c4-060fd405b335)

## Table des Matières
1. [À propos](#1-à-propos)
2. [Stack Technique](#2-stack-technique)
3. [Créateur](#3-créateur)
4. [Architecture](#4-architecture)
5. [Configuration](#5-configuration)
6. [Utilisation](#6-utilisation)


---

## 1. À propos
Ce projet est une **application de gestion de réservation d'activités** développée pour faciliter les réservations clients dans une entreprise de loisirs. Elle permet de gérer les créneaux horaires, les clients et les disponibilités des activités en temps réel.

---

## 2. Stack Technique
Cette application repose sur les technologies suivantes :
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 3. Créateur
**Nom du Créateur**  
Contact : [email@example.com](mailto:email@example.com)  
Profil GitHub : [GitHub](https://github.com/utilisateur)

---

## 4. Architecture
Le projet est organisé selon une architecture modulaire et maintenable, avec des dossiers spécifiques pour chaque type de fonctionnalité et composant.

**Structure du dossier :**
```plaintext
/src
├── /app               # API App Router de Next.js 13+
│   ├── /(routes)      # Routes regroupées par dossier (optionnel)
│   ├── /api           # Endpoints API pour la gestion des données
│   ├── /dashboard     # Exemple : route principale avec sous-routes
│   ├── layout.tsx     # Layout principal partagé par toutes les pages
│   └── page.tsx       # Page d'accueil (racine de l'application)
│
├── /components        # Composants réutilisables dans l'application
│   ├── /ui            # Composants d'interface (boutons, formulaires, etc.)
│   └── /modules       # Composants propres à des fonctionnalités précises
│
├── /hooks             # Hooks React personnalisés
│
├── /lib               # Fonctions utilitaires, helpers, et instances (ex. axios, firebase)
│
├── /styles            # CSS global et styles spécifiques
│
├── /context           # Fournisseurs de contexte pour l'état global (Context API)
│
├── /services          # Fonctions pour la communication avec les API
│
├── /store             # Gestion d'état global (ex. Redux, Zustand)
│
├── /utils             # Fonctions utilitaires, constantes et types
│
├── /types             # Types TypeScript et interfaces globales
│
└── /assets            # Images, polices, et autres ressources statiques
 ```
## 5. Configuration
Prérequis .env
Copier le code
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_API_KEY=your_api_key


## 6. Utilisation
### démarrer l'application en mode développement 
### Création d'un utilisateur 

Pour démarrer l'application en mode développement :


