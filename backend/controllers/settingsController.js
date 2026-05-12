const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Récupérer les paramètres de l'entreprise
const getSettings = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' })
    }

    // Récupérer ou créer les paramètres par défaut
    let settings = await prisma.settings.findFirst({
      where: { userId }
    })

    if (!settings) {
      // Créer des paramètres par défaut
      settings = await prisma.settings.create({
        data: {
          userId,
          companyName: 'Mon Entreprise',
          companyPhone: '',
          companyEmail: '',
          companyAddress: '',
          companyLogo: '',
          sector: 'Commerce',
          currency: 'XAF',
          darkMode: false,
          stockAlert: true,
          whatsappNotifications: false
        }
      })
    }

    res.json(settings)
  } catch (error) {
    console.error('Erreur récupération paramètres:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// Mettre à jour les paramètres
const updateSettings = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' })
    }

    const {
      companyName,
      companyPhone,
      companyEmail,
      companyAddress,
      companyLogo,
      sector,
      currency,
      darkMode,
      stockAlert,
      whatsappNotifications
    } = req.body

    // Validation basique
    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({ message: 'Le nom de l\'entreprise est requis (minimum 2 caractères)' })
    }

    // Mettre à jour ou créer
    const settings = await prisma.settings.upsert({
      where: { userId },
      update: {
        companyName: companyName.trim(),
        companyPhone: companyPhone?.trim() || '',
        companyEmail: companyEmail?.trim() || '',
        companyAddress: companyAddress?.trim() || '',
        companyLogo: companyLogo?.trim() || '',
        sector: sector || 'Commerce',
        currency: currency || 'XAF',
        darkMode: Boolean(darkMode),
        stockAlert: Boolean(stockAlert),
        whatsappNotifications: Boolean(whatsappNotifications)
      },
      create: {
        userId,
        companyName: companyName.trim(),
        companyPhone: companyPhone?.trim() || '',
        companyEmail: companyEmail?.trim() || '',
        companyAddress: companyAddress?.trim() || '',
        companyLogo: companyLogo?.trim() || '',
        sector: sector || 'Commerce',
        currency: currency || 'XAF',
        darkMode: Boolean(darkMode),
        stockAlert: Boolean(stockAlert),
        whatsappNotifications: Boolean(whatsappNotifications)
      }
    })

    res.json({
      message: 'Paramètres mis à jour avec succès',
      settings
    })
  } catch (error) {
    console.error('Erreur mise à jour paramètres:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = {
  getSettings,
  updateSettings
}