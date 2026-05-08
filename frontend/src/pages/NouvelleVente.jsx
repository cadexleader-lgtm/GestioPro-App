const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'

export default function NouvelleVente() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ produitId: '', quantite: 1, prixVente: '', prixAchat: '', modePaiement: 'Cash', clientNom: '', note: '' })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.get(`${API}/api/produits`, { headers }).then(r => setProduits(r.data)).catch(console.error)
  }, [])

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    if (e.target.name === 'produitId') {
      const p = produits.find(p => p.id === parseInt(e.target.value))
      if (p) { updated.prixAchat = p.prixAchat; updated.prixVente = p.prixVente }
    }
    setForm(updated)
  }

  const qty = parseInt(form.quantite) || 1
  const pa = parseFloat(form.prixAchat) || 0
  const pv = parseFloat(form.prixVente) || 0
  const benefice = (pv - pa) * qty
  const marge = pv > 0 ? Math.round((benefice / (pv * qty)) * 100) : 0
  const totalVente = pv * qty

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await axios.post(`${API}/api/ventes`, form, { headers })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setForm({ produitId: '', quantite: 1, prixVente: '', prixAchat: '', modePaiement: 'Cash', clientNom: '', note: '' })
      }, 2500)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const MODES = ['Cash', 'Mobile Money', 'Carte bancaire', 'Crédit client']
  const MODE_ICONS = { 'Cash': '💵', 'Mobile Money': '📱', 'Carte bancaire': '💳', 'Crédit client': '📋' }

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .vente-input { width: 100%; padding: 12px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; font-family: 'Inter',sans-serif; color: #0F172A; background: #fff; outline: none; transition: border .15s, box-shadow .15s; }
        .vente-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
        .mode-btn { flex: 1; padding: 10px 8px; border: 1.5px solid #E2E8F0; border-radius: 10px; cursor: pointer; background: #fff; font-size: 12px; font-weight: 500; color: #64748B; font-family: 'Inter',sans-serif; transition: all .15s; text-align: center; }
        .mode-btn.active { border-color: #2563EB; background: #EFF6FF; color: #2563EB; font-weight: 600; }
        .mode-btn:hover:not(.active) { border-color: #CBD5E1; background: #F8FAFC; }
        .submit-btn { width: 100%; background: #2563EB; color: #fff; border: none; border-radius: 12px; padding: 15px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; box-shadow: 0 4px 14px rgba(37,99,235,.3); letter-spacing: -.01em; }
        .submit-btn:hover:not(:disabled) { background: #1D4ED8; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,.4); }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        @keyframes successPop { 0% { transform: scale(.8); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .success-anim { animation: successPop .4s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div style={{ padding: '28px', maxWidth: 680, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1.5px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-.4px' }}>Nouvelle vente</h1>
            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Enregistrez une transaction rapidement</p>
          </div>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="success-anim" style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border: '1px solid #86EFAC', borderRadius: 16, padding: '24px', textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#15803D', marginBottom: 4 }}>Vente enregistrée !</div>
            <div style={{ fontSize: 13, color: '#16A34A' }}>La transaction a été sauvegardée avec succès</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '24px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              Produit vendu
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Sélectionner un produit</label>
              <select className="vente-input" name="produitId" value={form.produitId} onChange={handleChange} style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}>
                <option value="">— Choisir depuis le stock —</option>
                {produits.map(p => <option key={p.id} value={p.id}>{p.nom} · Stock: {p.stock}</option>)}
                <option value="">Produit non listé</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Prix d'achat (FCFA) *</label>
                <input className="vente-input" name="prixAchat" type="number" value={form.prixAchat} onChange={handleChange} placeholder="0" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Prix de vente (FCFA) *</label>
                <input className="vente-input" name="prixVente" type="number" value={form.prixVente} onChange={handleChange} placeholder="0" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Qté</label>
                <input className="vente-input" name="quantite" type="number" min="1" value={form.quantite} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Calcul marge en temps réel */}
          {pv > 0 && pa > 0 && (
            <div style={{ background: benefice >= 0 ? 'linear-gradient(135deg,#EFF6FF,#F0FDF4)' : 'linear-gradient(135deg,#FEF2F2,#FFF7ED)', border: `1px solid ${benefice >= 0 ? '#BFDBFE' : '#FCA5A5'}`, borderRadius: 14, padding: '18px 22px', marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>Total vente</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{totalVente.toLocaleString('fr-FR')} F</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>Bénéfice net</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: benefice >= 0 ? '#16A34A' : '#DC2626' }}>
                  {benefice >= 0 ? '+' : ''}{benefice.toLocaleString('fr-FR')} F
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginBottom: 4 }}>Marge</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: marge >= 20 ? '#16A34A' : marge >= 0 ? '#D97706' : '#DC2626' }}>{marge}%</div>
              </div>
            </div>
          )}

          {/* Mode paiement */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '24px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Mode de paiement</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {MODES.map(m => (
                <button key={m} type="button" className={`mode-btn ${form.modePaiement === m ? 'active' : ''}`} onClick={() => setForm({ ...form, modePaiement: m })}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{MODE_ICONS[m]}</div>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Note */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '24px', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Informations client <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: 12 }}>(optionnel)</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Nom du client</label>
                <input className="vente-input" name="clientNom" value={form.clientNom} onChange={handleChange} placeholder="Paul Adjonanoun..." />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Note</label>
                <input className="vente-input" name="note" value={form.note} onChange={handleChange} placeholder="Remarque..." />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || success}>
            {loading ? 'Enregistrement...' : success ? '✓ Vente enregistrée !' : '✓ Valider la vente'}
          </button>
        </form>
      </div>
    </Layout>
  )
}