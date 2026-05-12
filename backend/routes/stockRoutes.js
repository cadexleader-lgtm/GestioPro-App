const express = require('express')
const router  = express.Router()
const { getStock, updateStock } = require('../controllers/stockController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/',     getStock)
router.put('/:id',  updateStock)

module.exports = router