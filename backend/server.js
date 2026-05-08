const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes    = require('./routes/authRoutes')
const produitRoutes = require('./routes/produitRoutes')
const venteRoutes   = require('./routes/venteRoutes')
const clientRoutes  = require('./routes/clientRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',     authRoutes)
app.use('/api/produits', produitRoutes)
app.use('/api/ventes',   venteRoutes)
app.use('/api/clients',  clientRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Serveur GestioPro en ligne ✓' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur GestioPro démarré sur le port ${PORT}`)
})