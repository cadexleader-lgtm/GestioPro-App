const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur GestioPro en ligne ✓' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur GestioPro démarré sur le port ${PORT}`)
})