@echo off
echo 🚀 Démarrage de GestioPro avec base de données locale
echo.

echo 📦 Vérification de Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas installé !
    echo 📥 Téléchargez Docker Desktop : https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo 🐳 Démarrage de PostgreSQL avec Docker...
docker-compose up -d postgres

echo ⏳ Attente du démarrage de la base de données...
timeout /t 10 /nobreak >nul

echo 🗄️ Migration de la base de données...
cd backend
npx prisma db push --accept-data-loss

echo ✅ Base de données prête !
echo.
echo 🌐 Démarrage des serveurs...
start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm run dev"

echo 🎉 Application lancée !
echo 📱 Frontend : http://localhost:5177
echo 🔧 Backend : http://localhost:5000
echo.
echo 💡 Pour arrêter : docker-compose down
pause