// ══════════════════════════════════════════════
// backend/routes/clientRoutes.js
// ══════════════════════════════════════════════
const express = require('express')
const router  = express.Router()
const { addClient, getClients, getClientById, updateClient, deleteClient } = require('../controllers/clientController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.post('/',    addClient)
router.get('/',     getClients)
router.get('/:id',  getClientById)
router.put('/:id',  updateClient)
router.delete('/:id', deleteClient)

module.exports = router