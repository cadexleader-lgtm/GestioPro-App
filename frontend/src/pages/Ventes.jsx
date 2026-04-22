import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'

export default function Ventes() {
  const navigate = useNavigate()
  const [ventes, setVentes] = useState([])
  const [stats, setStats] = useState({ totalVentes: 0, totalRevenus: 0, totalBenefice: 0, margeMoyenne: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    Promise.all([
      axios.get('http://localhost:5000/api/ventes', { headers }),
      axios.get('http://localhost:5000/api/ventes/stats', { headers }),
    ]).then(([v, s]) => { setVentes(v.data); setStats(s.data) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  const PAYMENT_STYLES = {
    'Cash': { bg: '#F0FDF4', text: '#16A34A', border: '#86EFAC' },
    'Mobile Money': { bg: '#EFF6FF', text: '#2563EB', border: '#93C5FD' },
    'Carte bancaire': { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    'Crédit client': { bg: '#FDF4FF', text: '#9333EA', border: '#D8B4FE' },
  }

  const filtered = filter === 'all' ? ventes : ventes.filter(v => v.modePaiement === filter)

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .vente-row { display: grid; grid-template-columns: 2fr 1.4fr 1fr 1fr 1.2fr; align-items: center; padding: 14px 22px; border-bottom: 1px solid #F1F5F9; transition: background .12s; cursor: default; }
        .vente-row:hover { background: #F8FAFC; }
        .vente-row:last-child { border-bottom: none; }
        .stat-card { background: #fff; border-radius: 14px; padding: 20px 22px; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(0,0,0,.04); transition: all .18s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.07); }
        .filter-btn { padding: 7px 14px; border-radius: 8px; border: 1.5px solid #E2E8F0; background: #fff; font-size: 12.5px; font-weight: 500; color: #64748B; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; }
        .filter-btn.active { border-color: #2563EB; background: #EFF6FF; color: #2563EB; font-weight: 600; }
        .filter-btn:hover:not(.active) { border-color: #CBD5E1; }
        .new-btn { display: flex; align-items: center; gap: 8px; background: #2563EB; color: #fff; border: none; border-radius: 10px; padding: 11px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; box-shadow: 0 4px 12px rgba(37,99,235,.3); }
        .new-btn:hover { background: #1D4ED8; transform: translateY(-1px); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp .3s ease both; }
      `}</style>

      <div style={{ padding: '28px 28px 0' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-.4px', marginBottom: 3 }}>Historique des ventes</h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>{ventes.length} transaction{ventes.length > 1 ? 's' : ''} au total</p>
          </div>
          <button className="new-btn" onClick={() => navigate('/ventes/new')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouvelle vente
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }} className="stats-responsive">
          {[
            { label: "Ventes aujourd'hui", value: stats.totalVentes, suffix: '', color: '#2563EB', bg: '#EFF6FF', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
            { label: 'Revenus du jour', value: stats.totalRevenus?.toLocaleString('fr-FR') + ' F', color: '#16A34A', bg: '#F0FDF4', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
            { label: 'Bénéfice net', value: '+' + stats.totalBenefice?.toLocaleString('fr-FR') + ' F', color: '#D97706', bg: '#FFFBEB', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.75"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
            { label: 'Marge moyenne', value: stats.margeMoyenne + '%', color: '#9333EA', bg: '#FDF4FF', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="1.75"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
          ].map((s, i) => (
            <div key={i} className="stat-card fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: '#64748B' }}>{s.label}</span>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['all', 'Cash', 'Mobile Money', 'Carte bancaire', 'Crédit client'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Toutes' : f}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,.04)', overflow: 'hidden', marginBottom: 32 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              <p style={{ color: '#64748B', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Aucune vente trouvée</p>
              <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 20 }}>
                {filter === 'all' ? 'Enregistrez votre première vente' : `Aucune vente par ${filter}`}
              </p>
              {filter === 'all' && (
                <button onClick={() => navigate('/ventes/new')}
                  style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  + Nouvelle vente
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Header table */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1.2fr', padding: '11px 22px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Produit', 'Client', 'Paiement', 'Date', 'Montant'].map(h => (
                  <span key={h} style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '.05em' }}>{h}</span>
                ))}
              </div>
              {filtered.map((v, i) => {
                const ps = PAYMENT_STYLES[v.modePaiement] || { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' }
                return (
                  <div key={v.id} className="vente-row fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.75"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{v.produit?.nom || 'Vente directe'}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>Qté : {v.quantite}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: '#64748B' }}>{v.clientNom || '—'}</span>
                    <span style={{ fontSize: 11.5, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}`, padding: '3px 8px', borderRadius: 6, fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap' }}>{v.modePaiement}</span>
                    <span style={{ fontSize: 12, color: '#64748B' }}>
                      {new Date(v.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}<br/>
                      <span style={{ fontSize: 11 }}>{new Date(v.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{(v.prixVente * v.quantite).toLocaleString('fr-FR')} F</div>
                      <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>+{v.benefice?.toLocaleString('fr-FR')} F · {v.marge}%</div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-responsive { grid-template-columns: repeat(2,1fr) !important; }
          .vente-row { grid-template-columns: 2fr 1fr 1fr !important; }
          .vente-row > :nth-child(2), .vente-row > :nth-child(4) { display: none; }
        }
      `}</style>
    </Layout>
  )
}