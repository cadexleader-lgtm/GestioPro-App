# GestioPro - Application de Gestion

## 🚀 Démarrage rapide

### Prérequis
- **Docker Desktop** installé ([Télécharger](https://www.docker.com/products/docker-desktop))
- **Node.js** 18+ installé

### Démarrage automatique
Double-cliquez sur `start.bat` ou exécutez :
```bash
./start.bat
```

### Démarrage manuel
```bash
# 1. Démarrer PostgreSQL
docker-compose up -d postgres

# 2. Attendre 10 secondes puis migrer la DB
cd backend
npx prisma db push --accept-data-loss

# 3. Démarrer les serveurs
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd ../frontend
npm run dev
```

## 🌐 Accès à l'application
- **Frontend** : http://localhost:5177
- **Backend API** : http://localhost:5000

## 🗄️ Base de données
- **Type** : PostgreSQL (Docker)
- **Port** : 5432
- **Base** : gestiopro
- **Utilisateur** : postgres
- **Mot de passe** : GestioPro2026

## 🛑 Arrêt
```bash
docker-compose down
```

## 📁 Structure
```
├── backend/          # API Node.js + Express + Prisma
├── frontend/         # React + Vite
├── docker-compose.yml # Configuration PostgreSQL
└── start.bat         # Script de démarrage automatique
```