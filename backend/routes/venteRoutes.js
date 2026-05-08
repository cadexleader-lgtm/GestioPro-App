const express = require('express')
const router  = express.Router()
const { addVente, getVentes, getStatsJour } = require('../controllers/venteController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.post('/',     addVente)
router.get('/',      getVentes)
router.get('/stats', getStatsJour)

module.exports = router