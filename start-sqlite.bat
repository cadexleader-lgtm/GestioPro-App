@echo off
echo 🚀 Démarrage de GestioPro avec SQLite (sans Docker)
echo.

echo 🗄️ Configuration de la base de données SQLite...
cd backend
npx prisma generate
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
echo 💡 La base de données SQLite est stockée dans backend/dev.db
pause