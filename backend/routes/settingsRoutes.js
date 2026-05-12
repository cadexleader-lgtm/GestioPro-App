const express = require('express')
const { getSettings, updateSettings } = require('../controllers/settingsController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(protect)

// GET /api/settings - Récupérer les paramètres
router.get('/', getSettings)

// PUT /api/settings - Mettre à jour les paramètres
router.put('/', updateSettings)

module.exports = router