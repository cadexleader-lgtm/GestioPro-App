import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'

// Compteur animé
function Counter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!end) return
    let start = 0
    const duration = 1200
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end])
  return <>{prefix}{count.toLocaleString('fr-FR')}{suffix}</>
}

function StatCard({ label, value, suffix = '', prefix = '', change, icon, iconBg, loading }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 22px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,.04)',
      transition: 'box-shadow .2s, transform .2s', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', marginBottom: 6 }}>
        {loading ? <span style={{ color: '#E2E8F0' }}>—</span> : <Counter end={typeof value === 'number' ? value : 0} suffix={suffix} prefix={prefix} />}
      </div>
      {change && <div style={{ fontSize: 12, color: change.startsWith('+') ? '#16A34A' : '#DC2626', fontWeight: 500 }}>{change}</div>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ totalVentes: 0, totalRevenus: 0, totalBenefice: 0, margeMoyenne: 0 })
  const [ventes, setVentes] = useState([])
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { navigate('/login'); return }
    setUser(JSON.parse(u))
    const headers = { Authorization: `Bearer ${t}` }
    Promise.all([
      axios.get('http://localhost:5000/api/ventes/stats', { headers }),
      axios.get('http://localhost:5000/api/ventes', { headers }),
      axios.get('http://localhost:5000/api/produits', { headers }),
    ]).then(([s, v, p]) => {
      setStats(s.data)
      setVentes(v.data.slice(0, 6))
      setProduits(p.data.slice(0, 4))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (!user) return null

  const heure = new Date().getHours()
  const salut = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir'
  const firstName = user.nom?.split(' ')[0] || 'vous'

  const PAYMENT_COLORS = {
    'Cash': { bg: '#F0FDF4', text: '#16A34A' },
    'Mobile Money': { bg: '#EFF6FF', text: '#2563EB' },
    'Carte bancaire': { bg: '#FFF7ED', text: '#EA580C' },
    'Crédit client': { bg: '#FDF4FF', text: '#9333EA' },
  }

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .dash-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px; }
        .vente-row:hover { background: #F8FAFC !important; }
        @media (max-width: 1100px) { .dash-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div style={{ padding: '28px 28px 0' }}>

        {/* ── TOPBAR ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-.4px', marginBottom: 3 }}>
              {salut}, {firstName} 👋
            </h1>
            <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={() => navigate('/ventes/new')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,.3)', transition: 'all .15s', letterSpacing: '-.01em' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouvelle vente
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="stats-grid">
          <StatCard label="Revenus du jour" value={stats.totalRevenus} suffix=" F" loading={loading}
            change={stats.totalBenefice > 0 ? `+${stats.totalBenefice?.toLocaleString('fr-FR')} F bénéfice` : null}
            iconBg="#EFF6FF" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.75"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
          <StatCard label="Ventes du jour" value={stats.totalVentes} loading={loading}
            change={stats.totalVentes > 0 ? `${stats.totalVentes} transaction${stats.totalVentes > 1 ? 's' : ''}` : 'Aucune vente'}
            iconBg="#F0FDF4" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
          <StatCard label="Marge nette" value={stats.margeMoyenne} suffix="%" loading={loading}
            change="Moyenne du jour"
            iconBg="#FFF7ED" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.75"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>} />
          <StatCard label="Produits" value={produits.length} loading={loading}
            change="en catalogue"
            iconBg="#F5F3FF" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.75"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>} />
        </div>

        {/* ── GRILLE PRINCIPALE ── */}
        <div className="dash-grid">

          {/* Transactions */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Dernières transactions</h3>
              <button onClick={() => navigate('/ventes')}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Voir tout
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {ventes.length === 0 ? (
              <div style={{ padding: '52px 24px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
                </div>
                <p style={{ color: '#64748B', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Aucune vente enregistrée</p>
                <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 20 }}>Commencez par enregistrer votre première vente</p>
                <button onClick={() => navigate('/ventes/new')}
                  style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  + Nouvelle vente
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', padding: '10px 22px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                  {['Produit', 'Client', 'Paiement', 'Montant'].map(h => (
                    <span key={h} style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '.05em' }}>{h}</span>
                  ))}
                </div>
                {ventes.map((v, i) => {
                  const pc = PAYMENT_COLORS[v.modePaiement] || { bg: '#F8FAFC', text: '#64748B' }
                  return (
                    <div key={v.id} className="vente-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', padding: '13px 22px', borderBottom: i < ventes.length - 1 ? '1px solid #F1F5F9' : 'none', alignItems: 'center', transition: 'background .12s', cursor: 'default' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.75"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                        </div>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{v.produit?.nom || 'Vente directe'}</span>
                      </div>
                      <span style={{ fontSize: 13, color: '#64748B' }}>{v.clientNom || '—'}</span>
                      <span style={{ fontSize: 11.5, background: pc.bg, color: pc.text, padding: '3px 8px', borderRadius: 6, fontWeight: 600, display: 'inline-block' }}>{v.modePaiement}</span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{(v.prixVente * v.quantite).toLocaleString('fr-FR')} F</div>
                        <div style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 500 }}>+{v.benefice?.toLocaleString('fr-FR')} F</div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>

          {/* Colonne droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Top produits */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,.04)', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Mes produits</h3>
                <button onClick={() => navigate('/produits')} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Voir tout</button>
              </div>

              {produits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 12 }}>Aucun produit ajouté</p>
                  <button onClick={() => navigate('/produits')}
                    style={{ background: '#FACC15', color: '#0F172A', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    + Ajouter
                  </button>
                </div>
              ) : produits.map((p, i) => {
                const marge = Math.round(((p.prixVente - p.prixAchat) / p.prixVente) * 100)
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: i < produits.length - 1 ? 12 : 0, marginBottom: i < produits.length - 1 ? 12 : 0, borderBottom: i < produits.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.75"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nom}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>Stock : {p.stock}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: marge >= 20 ? '#16A34A' : '#EA580C' }}>{marge}%</div>
                  </div>
                )
              })}

              <button onClick={() => navigate('/produits')}
                style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 9, padding: '10px', fontSize: 13, color: '#2563EB', fontWeight: 600, cursor: 'pointer', marginTop: 14, transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}>
                + Ajouter un produit
              </button>
            </div>

            {/* Actions rapides */}
            <div style={{ background: '#0F172A', borderRadius: 14, padding: '18px 20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Actions rapides</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '+ Nouvelle vente', path: '/ventes/new', bg: '#FACC15', color: '#0F172A' },
                  { label: '+ Ajouter un produit', path: '/produits', bg: 'rgba(255,255,255,.08)', color: '#fff' },
                  { label: 'Voir les rapports', path: '/rapports', bg: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)' },
                ].map(a => (
                  <button key={a.path} onClick={() => navigate(a.path)}
                    style={{ background: a.bg, border: 'none', borderRadius: 9, padding: '11px 14px', fontSize: 13.5, fontWeight: 600, color: a.color, cursor: 'pointer', textAlign: 'left', fontFamily: "'Inter',sans-serif", transition: 'opacity .15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}