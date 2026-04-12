const express = require('express')
const router = express.Router()
const { addProduit, getProduits, updateProduit, deleteProduit } = require('../controllers/produitController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/', addProduit)
router.get('/', getProduits)
router.put('/:id', updateProduit)
router.delete('/:id', deleteProduit)

module.exports = router