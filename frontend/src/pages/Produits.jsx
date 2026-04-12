import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Produits() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nom: '', prixAchat: '', prixVente: '',
    categorie: '', stock: '', description: ''
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchProduits()
  }, [])

  const fetchProduits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/produits', { headers })
      setProduits(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/produits', form, { headers })
      setForm({ nom:'', prixAchat:'', prixVente:'', categorie:'', stock:'', description:'' })
      setShowForm(false)
      fetchProduits()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`, { headers })
      fetchProduits()
    } catch (err) {
      console.error(err)
    }
  }

  const marge = (pa, pv) => {
    if (!pa || !pv) return 0
    return Math.round(((pv - pa) / pv) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOPBAR */}
      <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-blue-200 hover:text-white text-sm">← Retour</button>
          <h1 className="text-xl font-bold">Gestio<span className="text-yellow-400">Pro</span></h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition"
        >
          + Ajouter produit
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mes produits</h2>
        <p className="text-gray-500 mb-6">{produits.length} produit{produits.length > 1 ? 's' : ''} enregistré{produits.length > 1 ? 's' : ''}</p>

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Nouveau produit</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom du produit</label>
                  <input name="nom" value={form.nom} onChange={handleChange} required
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Toyota Corolla 2020" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Catégorie</label>
                  <input name="categorie" value={form.categorie} onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Berline, SUV, Utilitaire..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prix d'achat (FCFA)</label>
                  <input name="prixAchat" value={form.prixAchat} onChange={handleChange} required type="number"
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5 000 000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prix de vente (FCFA)</label>
                  <input name="prixVente" value={form.prixVente} onChange={handleChange} required type="number"
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6 500 000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Quantité en stock</label>
                  <input name="stock" value={form.stock} onChange={handleChange} type="number"
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description (optionnel)</label>
                  <input name="description" value={form.description} onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Climatisée, faible kilométrage..." />
                </div>
              </div>
              {form.prixAchat && form.prixVente && (
                <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-800 font-medium">
                  Marge estimée : {marge(parseFloat(form.prixAchat), parseFloat(form.prixVente))}% — Bénéfice : {(parseFloat(form.prixVente) - parseFloat(form.prixAchat)).toLocaleString('fr-FR')} FCFA
                </div>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="bg-blue-800 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-gray-200 text-gray-600 px-6 py-2 rounded-xl hover:bg-gray-50 transition">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTE */}
        {produits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium text-gray-500">Aucun produit enregistré</p>
            <p className="text-sm text-gray-400 mt-1">Ajoutez votre premier produit</p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              + Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {produits.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-800">{p.nom}</h3>
                    {p.categorie && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{p.categorie}</span>}
                    {p.stock <= 2 && <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">Stock bas</span>}
                  </div>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span>Achat : <strong className="text-gray-700">{p.prixAchat.toLocaleString('fr-FR')} F</strong></span>
                    <span>Vente : <strong className="text-gray-700">{p.prixVente.toLocaleString('fr-FR')} F</strong></span>
                    <span>Marge : <strong className="text-green-600">{marge(p.prixAchat, p.prixVente)}%</strong></span>
                    <span>Stock : <strong className="text-gray-700">{p.stock}</strong></span>
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)}
                  className="text-red-400 hover:text-red-600 text-sm ml-4 transition">
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}