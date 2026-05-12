import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Produits from './pages/Produits'
import NouvelleVente from './pages/NouvelleVente'
import Ventes from './pages/Ventes'
import Clients from './pages/Clients'
import Stock from './pages/Stock'
import Rapports from './pages/Rapports'
import Plus from './pages/Plus'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/ventes/new" element={<NouvelleVente />} />
        <Route path="/ventes" element={<Ventes />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/rapports" element={<Rapports />} />
        <Route path="/plus" element={<Plus />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}