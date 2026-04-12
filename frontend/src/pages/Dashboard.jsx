import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!userData || !token) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOPBAR */}
      <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            Gestio<span className="text-yellow-400">Pro</span>
          </h1>
          <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
            {user.secteur || 'Commerce'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200">{user.nom}</span>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* BIENVENUE */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Bonjour, {user.nom.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Voici votre tableau de bord — {new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}
          </p>
        </div>

        {/* MÉTRIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-2">Ventes du jour</p>
            <p className="text-3xl font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-400 mt-1">transactions</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-2">Revenus</p>
            <p className="text-3xl font-bold text-gray-800">0</p>
            <p className="text-xs text-green-500 mt-1 font-medium">FCFA</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-2">Marge nette</p>
            <p className="text-3xl font-bold text-gray-800">0%</p>
            <p className="text-xs text-gray-400 mt-1">bénéfice</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-2">Alertes</p>
            <p className="text-3xl font-bold text-red-500">0</p>
            <p className="text-xs text-gray-400 mt-1">à traiter</p>
          </div>
        </div>

        {/* ACTIONS RAPIDES */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/ventes/new')}
              className="bg-blue-800 hover:bg-blue-700 text-white rounded-2xl p-5 text-left transition"
            >
              <div className="text-2xl mb-2">+</div>
              <div className="font-semibold">Nouvelle vente</div>
              <div className="text-xs text-blue-200 mt-1">Enregistrer une transaction</div>
            </button>
            <button
              onClick={() => navigate('/produits')}
              className="bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 rounded-2xl p-5 text-left transition"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-semibold">Produits</div>
              <div className="text-xs text-gray-400 mt-1">Gérer le stock</div>
            </button>
            <button
              onClick={() => navigate('/clients')}
              className="bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 rounded-2xl p-5 text-left transition"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold">Clients</div>
              <div className="text-xs text-gray-400 mt-1">Voir les clients</div>
            </button>
            <button
              onClick={() => navigate('/rapports')}
              className="bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 rounded-2xl p-5 text-left transition"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Rapports</div>
              <div className="text-xs text-gray-400 mt-1">Voir les chiffres</div>
            </button>
          </div>
        </div>

        {/* VENTES RÉCENTES */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Dernières ventes</h3>
            <button className="text-blue-700 text-sm font-medium hover:underline">
              Voir tout
            </button>
          </div>
          <div className="p-6 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium text-gray-500">Aucune vente enregistrée</p>
            <p className="text-sm mt-1">Commencez par enregistrer votre première vente</p>
            <button
              onClick={() => navigate('/ventes/new')}
              className="mt-4 bg-blue-800 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              + Nouvelle vente
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}