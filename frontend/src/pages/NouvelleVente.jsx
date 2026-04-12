import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function NouvelleVente() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    produitId: '', quantite: 1,
    prixVente: '', prixAchat: '',
    modePaiement: 'Cash', clientNom: '', note: ''
  })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get('http://localhost:5000/api/produits', { headers })
      .then(res => setProduits(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    if (e.target.name === 'produitId') {
      const p = produits.find(p => p.id === parseInt(e.target.value))
      if (p) {
        updated.prixAchat = p.prixAchat
        updated.prixVente = p.prixVente
      }
    }
    setForm(updated)
  }

  const benefice = form.prixVente && form.prixAchat
    ? (parseFloat(form.prixVente) - parseFloat(form.prixAchat)) * parseInt(form.quantite || 1)
    : 0
  const marge = form.prixVente && benefice
    ? Math.round((benefice / (parseFloat(form.prixVente) * parseInt(form.quantite || 1))) * 100)
    : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/ventes', form, { headers })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setForm({ produitId:'', quantite:1, prixVente:'', prixAchat:'', modePaiement:'Cash', clientNom:'', note:'' })
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-800 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-blue-200 hover:text-white text-sm">← Retour</button>
        <h1 className="text-xl font-bold">Gestio<span className="text-yellow-400">Pro</span></h1>
        <span className="text-blue-200 text-sm">— Nouvelle vente</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 text-center font-medium">
            ✅ Vente enregistrée avec succès !
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Enregistrer une vente</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-600">Produit</label>
              <select name="produitId" value={form.produitId} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Choisir un produit --</option>
                {produits.map(p => (
                  <option key={p.id} value={p.id}>{p.nom} — Stock : {p.stock}</option>
                ))}
                <option value="">Produit non listé</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Prix d'achat (FCFA)</label>
                <input name="prixAchat" value={form.prixAchat} onChange={handleChange} required type="number"
                  className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5 000 000" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Prix de vente (FCFA)</label>
                <input name="prixVente" value={form.prixVente} onChange={handleChange} required type="number"
                  className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6 500 000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Quantité</label>
                <input name="quantite" value={form.quantite} onChange={handleChange} required type="number" min="1"
                  className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mode de paiement</label>
                <select name="modePaiement" value={form.modePaiement} onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>Cash</option>
                  <option>Mobile Money</option>
                  <option>Carte bancaire</option>
                  <option>Crédit client</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Client (optionnel)</label>
              <input name="clientNom" value={form.clientNom} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du client..." />
            </div>

            {/* CALCUL MARGE */}
            {form.prixVente && form.prixAchat && (
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total vente</span>
                  <span className="font-medium">{(parseFloat(form.prixVente) * parseInt(form.quantite || 1)).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Coût total</span>
                  <span className="font-medium">{(parseFloat(form.prixAchat) * parseInt(form.quantite || 1)).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="border-t border-blue-100 pt-2 flex justify-between">
                  <span className="font-bold text-gray-700">Bénéfice net</span>
                  <span className={`font-bold ${benefice >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {benefice >= 0 ? '+' : ''}{benefice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-700">Marge</span>
                  <span className={`font-bold ${marge >= 20 ? 'text-green-600' : 'text-orange-500'}`}>{marge}%</span>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 text-lg">
              {loading ? 'Enregistrement...' : 'Valider la vente'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}