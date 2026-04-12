const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Ajouter un produit
const addProduit = async (req, res) => {
  try {
    const { nom, prixAchat, prixVente, categorie, stock, description } = req.body
    const produit = await prisma.produit.create({
      data: {
        nom,
        prixAchat: parseFloat(prixAchat),
        prixVente: parseFloat(prixVente),
        categorie,
        stock: parseInt(stock) || 0,
        description,
        userId: req.user.id
      }
    })
    res.status(201).json({ message: 'Produit ajouté', produit })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// Lister les produits
const getProduits = async (req, res) => {
  try {
    const produits = await prisma.produit.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(produits)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// Modifier un produit
const updateProduit = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, prixAchat, prixVente, categorie, stock, description } = req.body
    const produit = await prisma.produit.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prixAchat: parseFloat(prixAchat),
        prixVente: parseFloat(prixVente),
        categorie,
        stock: parseInt(stock),
        description
      }
    })
    res.status(200).json({ message: 'Produit modifié', produit })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// Supprimer un produit
const deleteProduit = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.produit.delete({ where: { id: parseInt(id) } })
    res.status(200).json({ message: 'Produit supprimé' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

module.exports = { addProduit, getProduits, updateProduit, deleteProduit }