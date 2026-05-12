// ══════════════════════════════════════════════
// backend/controllers/clientController.js
// ══════════════════════════════════════════════
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const addClient = async (req, res) => {
  try {
    const { nom, telephone, email, adresse, note } = req.body
    if (!nom) return res.status(400).json({ message: 'Le nom est requis' })
    const client = await prisma.client.create({
      data: { nom, telephone: telephone||null, email: email||null, adresse: adresse||null, note: note||null, dette: 0, userId: req.user.id }
    })
    res.status(201).json({ message: 'Client ajouté', client })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user.id },
      include: {
        ventes: {
          select: { prixVente: true, quantite: true, benefice: true, createdAt: true },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const enriched = clients.map(c => {
      const totalAchats    = c.ventes.reduce((s, v) => s + (v.prixVente * v.quantite), 0)
      const nbCommandes    = c.ventes.length
      const dernierAchat   = c.ventes.length > 0 ? c.ventes[0].createdAt : null
      const isVip          = totalAchats >= 200000
      return { ...c, totalAchats, nbCommandes, dernierAchat, isVip }
    })

    res.status(200).json(enriched)
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

const getClientById = async (req, res) => {
  try {
    const client = await prisma.client.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: {
        ventes: {
          include: { produit: { select: { nom: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    if (!client) return res.status(404).json({ message: 'Client non trouvé' })

    const totalAchats  = client.ventes.reduce((s, v) => s + (v.prixVente * v.quantite), 0)
    const nbCommandes  = client.ventes.length
    const dernierAchat = client.ventes.length > 0 ? client.ventes[0].createdAt : null
    const isVip        = totalAchats >= 200000

    res.status(200).json({ ...client, totalAchats, nbCommandes, dernierAchat, isVip })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

const updateClient = async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.dette !== undefined) data.dette = parseFloat(data.dette) || 0
    delete data.ventes; delete data.totalAchats; delete data.nbCommandes; delete data.dernierAchat; delete data.isVip
    const client = await prisma.client.update({ where: { id: parseInt(req.params.id) }, data })
    res.status(200).json({ message: 'Client modifié', client })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

const deleteClient = async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: parseInt(req.params.id) } })
    res.status(200).json({ message: 'Client supprimé' })
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }) }
}

module.exports = { addClient, getClients, getClientById, updateClient, deleteClient }