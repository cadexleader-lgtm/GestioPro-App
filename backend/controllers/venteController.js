const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Enregistrer une vente
const addVente = async (req, res) => {
  try {
    const { produitId, quantite, prixVente, prixAchat, modePaiement, clientNom, note } = req.body

    const benefice = (parseFloat(prixVente) - parseFloat(prixAchat)) * parseInt(quantite)
    const marge = Math.round((benefice / (parseFloat(prixVente) * parseInt(quantite))) * 100)

    const vente = await prisma.vente.create({
      data: {
        produitId: produitId ? parseInt(produitId) : null,
        quantite: parseInt(quantite),
        prixVente: parseFloat(prixVente),
        prixAchat: parseFloat(prixAchat),
        benefice,
        marge,
        modePaiement: modePaiement || 'Cash',
        clientNom: clientNom || null,
        note: note || null,
        userId: req.user.id
      }
    })

    // Mettre à jour le stock si produit sélectionné
    if (produitId) {
      await prisma.produit.update({
        where: { id: parseInt(produitId) },
        data: { stock: { decrement: parseInt(quantite) } }
      })
    }

    res.status(201).json({ message: 'Vente enregistrée', vente })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// Lister les ventes
const getVentes = async (req, res) => {
  try {
    const ventes = await prisma.vente.findMany({
      where: { userId: req.user.id },
      include: { produit: true },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(ventes)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// Stats du jour
const getStatsJour = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ventes = await prisma.vente.findMany({
      where: {
        userId: req.user.id,
        createdAt: { gte: today }
      }
    })

    const totalVentes = ventes.length
    const totalRevenus = ventes.reduce((sum, v) => sum + (v.prixVente * v.quantite), 0)
    const totalBenefice = ventes.reduce((sum, v) => sum + v.benefice, 0)
    const margeMoyenne = totalRevenus > 0 ? Math.round((totalBenefice / totalRevenus) * 100) : 0

    res.status(200).json({
      totalVentes,
      totalRevenus,
      totalBenefice,
      margeMoyenne
    })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

module.exports = { addVente, getVentes, getStatsJour }