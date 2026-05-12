const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getRapport = async (req, res) => {
  try {
    const { periode = '7' } = req.query
    const userId = req.user.id

    const now = new Date()
    const dateDebut = new Date()
    if (periode === '1')    dateDebut.setDate(now.getDate() - 1)
    else if (periode === '7')  dateDebut.setDate(now.getDate() - 7)
    else if (periode === '30') dateDebut.setDate(now.getDate() - 30)
    else if (periode === '365') dateDebut.setFullYear(now.getFullYear() - 1)
    else dateDebut.setDate(now.getDate() - 7)
    dateDebut.setHours(0, 0, 0, 0)

    // Toutes les ventes de la période
    const ventes = await prisma.vente.findMany({
      where: { userId, createdAt: { gte: dateDebut } },
      include: { produit: true },
      orderBy: { createdAt: 'asc' }
    })

    // Stats globales
    const totalRevenus  = ventes.reduce((s, v) => s + (v.prixVente * v.quantite), 0)
    const totalBenefice = ventes.reduce((s, v) => s + v.benefice, 0)
    const totalVentes   = ventes.length
    const margeMoyenne  = totalRevenus > 0 ? Math.round((totalBenefice / totalRevenus) * 100) : 0

    // Top produits
    const produitMap = {}
    ventes.forEach(v => {
      const nom = v.produit?.nom || 'Vente directe'
      if (!produitMap[nom]) produitMap[nom] = { nom, quantite: 0, revenus: 0, benefice: 0 }
      produitMap[nom].quantite += v.quantite
      produitMap[nom].revenus  += v.prixVente * v.quantite
      produitMap[nom].benefice += v.benefice
    })
    const topProduits = Object.values(produitMap).sort((a, b) => b.revenus - a.revenus).slice(0, 5)

    // Top clients
    const clientMap = {}
    ventes.filter(v => v.clientNom).forEach(v => {
      if (!clientMap[v.clientNom]) clientMap[v.clientNom] = { nom: v.clientNom, depenses: 0, commandes: 0 }
      clientMap[v.clientNom].depenses  += v.prixVente * v.quantite
      clientMap[v.clientNom].commandes += 1
    })
    const topClients = Object.values(clientMap).sort((a, b) => b.depenses - a.depenses).slice(0, 5)

    // Graphique par jour
    const graphique = {}
    ventes.forEach(v => {
      const jour = new Date(v.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      if (!graphique[jour]) graphique[jour] = { jour, revenus: 0, benefices: 0, ventes: 0 }
      graphique[jour].revenus  += v.prixVente * v.quantite
      graphique[jour].benefices += v.benefice
      graphique[jour].ventes   += 1
    })
    const graphData = Object.values(graphique)

    // Répartition modes paiement
    const paiementMap = {}
    ventes.forEach(v => {
      if (!paiementMap[v.modePaiement]) paiementMap[v.modePaiement] = 0
      paiementMap[v.modePaiement] += v.prixVente * v.quantite
    })
    const paiements = Object.entries(paiementMap).map(([mode, montant]) => ({ mode, montant }))

    // Produits stock faible
    const produits = await prisma.produit.findMany({ where: { userId, stock: { lte: 5 } } })

    // Total clients
    const totalClients = await prisma.client.count({ where: { userId } })
    const totalDettes  = await prisma.client.aggregate({ where: { userId }, _sum: { dette: true } })

    res.status(200).json({
      stats: { totalRevenus, totalBenefice, totalVentes, margeMoyenne, totalClients, totalDettes: totalDettes._sum.dette || 0 },
      graphData,
      topProduits,
      topClients,
      paiements,
      alertesStock: produits,
    })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

module.exports = { getRapport }