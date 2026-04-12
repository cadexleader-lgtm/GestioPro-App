const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    // Récupérer le token dans le header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé — token manquant' })
    }

    // Extraire le token
    const token = authHeader.split(' ')[1]

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attacher les infos utilisateur à la requête
    req.user = decoded

    // Laisser passer
    next()

  } catch (error) {
    res.status(401).json({ message: 'Non autorisé — token invalide' })
  }
}

module.exports = { protect }