const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('../prisma/generated')

const prisma = new PrismaClient()

// INSCRIPTION
const register = async (req, res) => {
  try {
    const { nom, email, password, telephone, entreprise, secteur } = req.body

    // Vérifier si l'email existe déjà
    const userExiste = await prisma.user.findUnique({
      where: { email }
    })

    if (userExiste) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' })
    }

    // Crypter le mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        nom,
        email,
        password: hashedPassword,
        telephone,
        entreprise,
        secteur,
        role: 'admin'
      }
    })

    // Créer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        secteur: user.secteur,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// CONNEXION
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérifier si l'email existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        secteur: user.secteur,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

module.exports = { register, login }