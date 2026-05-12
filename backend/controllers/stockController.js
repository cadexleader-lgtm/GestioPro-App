const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getStock = async (req, res) => {
  try {
    const produits = await prisma.produit.findMany({
      where: { userId: req.user.id },
      orderBy: { stock: 'asc' }
    })

    const stats = {
      totalProduits:  produits.length,
      totalUnites:    produits.reduce((s, p) => s + p.stock, 0),
      valeurTotale:   produits.reduce((s, p) => s + (p.prixAchat * p.stock), 0),
      alertesFaibles: produits.filter(p => p.stock > 0 && p.stock <= 5).length,
      ruptures:       produits.filter(p => p.stock === 0).length,
    }

    res.status(200).json({ produits, stats })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

const updateStock = async (req, res) => {
  try {
    const { id } = req.params
    const { quantite, type } = req.body

    const produit = await prisma.produit.findUnique({ where: { id: parseInt(id) } })
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' })

    let newStock
    if (type === 'add')      newStock = produit.stock + parseInt(quantite)
    else if (type === 'remove') newStock = Math.max(0, produit.stock - parseInt(quantite))
    else if (type === 'set')    newStock = parseInt(quantite)
    else return res.status(400).json({ message: 'Type invalide' })

    const updated = await prisma.produit.update({
      where: { id: parseInt(id) },
      data: { stock: newStock }
    })

    res.status(200).json({ message: 'Stock mis à jour', produit: updated })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

module.exports = { getStock, updateStock }