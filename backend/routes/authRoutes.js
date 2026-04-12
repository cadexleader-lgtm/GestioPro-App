const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Routes publiques
router.post('/register', register)
router.post('/login', login)

// Route protégée — test
router.get('/profile', protect, (req, res) => {
  res.json({ 
    message: 'Accès autorisé',
    user: req.user 
  })
})

module.exports = router