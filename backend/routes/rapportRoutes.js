const express = require('express')
const router  = express.Router()
const { getRapport } = require('../controllers/rapportController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/', getRapport)

module.exports = router