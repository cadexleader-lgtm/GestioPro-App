import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Produits from './pages/Produits'
import NouvelleVente from './pages/NouvelleVente'
import Ventes from './pages/Ventes'

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
      </Routes>
    </BrowserRouter>
  )
}