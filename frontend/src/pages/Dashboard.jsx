const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, ShoppingCart, Percent, Package, ArrowUpRight, ChevronRight, AlertTriangle } from 'lucide-react'
import Layout from '../components/Layout'
import axios from 'axios'

// ── Compteur animé ──────────────────────────────────
function Counter({ end, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    if (!end) return
    const t0 = performance.now()
    const dur = 1400
    const run = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 4)
      setVal(Math.floor(e * end))
      if (p < 1) raf.current = requestAnimationFrame(run)
      else setVal(end)
    }
    raf.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf.current)
  }, [end])
  return <>{prefix}{val.toLocaleString('fr-FR')}{suffix}</>
}

// ── Tooltip graphique ────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.1)' }}>
      <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#2563EB' }}>{payload[0].value?.toLocaleString('fr-FR')} F</p>
    </div>
  )
}

const PAYMENT_BADGES = {
  'Cash':          { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  'Mobile Money':  { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  'Carte bancaire':{ bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
  'Crédit client': { bg: '#FDF4FF', color: '#9333EA', border: '#E9D5FF' },
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: .08 } } }

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [stats, setStats]     = useState({ totalVentes: 0, totalRevenus: 0, totalBenefice: 0, margeMoyenne: 0 })
  const [ventes, setVentes]   = useState([])
  const [produits, setProduits] = useState([])
  const [alertes, setAlertes] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { navigate('/login'); return }
    setUser(JSON.parse(u))
    const headers = { Authorization: `Bearer ${t}` }
    Promise.all([
      axios.get(`${API}/api/ventes/stats`, { headers }),
axios.get(`${API}/api/ventes`, { headers }),
axios.get(`${API}/api/produits`, { headers }),
    ]).then(([s, v, p]) => {
      setStats(s.data)
      setVentes(v.data.slice(0, 6))
      setProduits(p.data.slice(0, 5))
      // Alertes stock bas
      setAlertes(p.data.filter(x => x.stock <= 3))
      // Graphique 7 jours simulé depuis vraies ventes
      const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      const base  = s.data.totalRevenus || 50000
      setChartData(jours.map((j, i) => ({
        jour: j,
        revenus:   Math.floor(base * (.4 + Math.random() * .8)),
        benefices: Math.floor(base * (.15 + Math.random() * .3)),
      })))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (!user) return null

  const heure  = new Date().getHours()
  const salut  = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir'
  const prenom = user.nom?.split(' ')[0] || 'vous'

  const METRICS = [
    { label: 'Revenus du jour',  val: stats.totalRevenus,  suffix: ' F',  icon: TrendingUp, color: '#2563EB', bg: '#EFF6FF', change: '+12%' },
    { label: 'Ventes du jour',   val: stats.totalVentes,   suffix: '',    icon: ShoppingCart, color: '#16A34A', bg: '#F0FDF4', change: '+8%' },
    { label: 'Marge nette',      val: stats.margeMoyenne,  suffix: '%',   icon: Percent,    color: '#D97706', bg: '#FFFBEB', change: '+3%' },
    { label: 'Bénéfice net',     val: stats.totalBenefice, suffix: ' F',  icon: Package,    color: '#9333EA', bg: '#FDF4FF', change: '+5%' },
  ]

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap');
        * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .vrow:hover { background: #F8FAFC !important; }
        .prow:hover { background: #F8FAFC !important; }
        .recharts-tooltip-wrapper { outline: none; }
        @media (max-width: 900px) {
          .dash-grid  { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .table-cols { grid-template-columns: 2fr 1fr 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      <div style={{ padding: '24px 28px 0' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', marginBottom: 4 }}>
              {salut}, {prenom} 👋
            </h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · {user.entreprise || 'Mon Entreprise'}
            </p>
          </div>

          {alertes.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}
              onClick={() => navigate('/stock')}>
              <AlertTriangle size={15} color="#D97706" fill="#FDE68A"/>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#D97706' }}>{alertes.length} alerte{alertes.length > 1 ? 's' : ''} stock</span>
              <ChevronRight size={14} color="#D97706"/>
            </motion.div>
          )}
        </motion.div>

        {/* ── MÉTRIQUES ── */}
        <motion.div className="stats-grid" variants={stagger} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {METRICS.map((m, i) => {
            const Icon = m.icon
            return (
              <motion.div key={i} variants={fadeUp} transition={{ duration: .35 }}
                whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,.09)' }}
                style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,.04)', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: '#64748B' }}>{m.label}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={m.color} strokeWidth={1.75}/>
                  </div>
                </div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-.5px', marginBottom: 6 }}>
                  {loading ? <div style={{ height: 34, width: 90, background: '#F1F5F9', borderRadius: 8 }}/> : <Counter end={m.val} suffix={m.suffix}/>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ArrowUpRight size={13} color="#16A34A"/>
                  <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>{m.change}</span>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>ce mois</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ── GRILLE PRINCIPALE ── */}
        <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, paddingBottom: 32 }}>

          {/* Colonne gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Graphique */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .4 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>Ventes & Revenus</h3>
                  <p style={{ fontSize: 12, color: '#94A3B8' }}>7 derniers jours</p>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  {[['#2563EB','Revenus'],['#34D399','Bénéfices']].map(([c,l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563EB" stopOpacity=".15"/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="gBen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#34D399" stopOpacity=".15"/>
                      <stop offset="95%" stopColor="#34D399" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                  <XAxis dataKey="jour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${Math.floor(v/1000)}k` : v}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="revenus"   stroke="#2563EB" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#2563EB' }}/>
                  <Area type="monotone" dataKey="benefices" stroke="#34D399" strokeWidth={2} fill="url(#gBen)" dot={false} activeDot={{ r: 5, strokeWidth: 0, fill: '#34D399' }}/>
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Tableau transactions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .4 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,.04)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Dernières transactions</h3>
                <button onClick={() => navigate('/ventes')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Voir tout <ChevronRight size={14}/>
                </button>
              </div>

              {ventes.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <ShoppingCart size={40} color="#CBD5E1" style={{ margin: '0 auto 14px', display: 'block' }}/>
                  <p style={{ color: '#64748B', fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Aucune vente enregistrée</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
                    onClick={() => navigate('/ventes/new')}
                    style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,.3)' }}>
                    + Enregistrer une vente
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="table-cols" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.3fr 1fr 1fr 1.2fr', padding: '10px 22px', background: '#F8FAFC' }}>
                    {['Produit','Client','Mode','Date','Montant'].map(h => (
                      <span key={h} className={['Client','Date'].includes(h) ? 'hide-mobile' : ''} style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, letterSpacing: '.06em' }}>{h}</span>
                    ))}
                  </div>
                  {ventes.map((v, i) => {
                    const b = PAYMENT_BADGES[v.modePaiement] || { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' }
                    return (
                      <div key={v.id} className="vrow table-cols" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.3fr 1fr 1fr 1.2fr', padding: '13px 22px', borderBottom: i < ventes.length-1 ? '1px solid #F1F5F9' : 'none', alignItems: 'center', transition: 'background .12s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Package size={14} color="#2563EB" strokeWidth={1.75}/>
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{v.produit?.nom || 'Vente directe'}</div>
                            <div style={{ fontSize: 11, color: '#94A3B8' }}>×{v.quantite}</div>
                          </div>
                        </div>
                        <span className="hide-mobile" style={{ fontSize: 13, color: '#64748B' }}>{v.clientNom || '—'}</span>
                        <span style={{ fontSize: 11, background: b.bg, color: b.color, border: `1px solid ${b.border}`, padding: '3px 8px', borderRadius: 6, fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap' }}>{v.modePaiement}</span>
                        <span className="hide-mobile" style={{ fontSize: 11.5, color: '#94A3B8' }}>{new Date(v.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{(v.prixVente*v.quantite).toLocaleString('fr-FR')} F</div>
                          <div style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 600 }}>+{v.benefice?.toLocaleString('fr-FR')} F</div>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </motion.div>
          </div>

          {/* Colonne droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Produits */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .22, duration: .4 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 700, color: '#0F172A' }}>Mes produits</h3>
                <button onClick={() => navigate('/produits')} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Voir tout</button>
              </div>
              {produits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 10 }}>Aucun produit</p>
                  <button onClick={() => navigate('/produits')} style={{ background: '#FACC15', color: '#0F172A', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>+ Ajouter</button>
                </div>
              ) : produits.map((p, i) => {
                const m = Math.round(((p.prixVente-p.prixAchat)/p.prixVente)*100)
                const mc = m >= 25 ? '#16A34A' : m >= 10 ? '#D97706' : '#DC2626'
                return (
                  <div key={p.id} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0', borderBottom: i < produits.length-1 ? '1px solid #F1F5F9' : 'none', borderRadius: 6, transition: 'background .12s' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={15} color="#64748B" strokeWidth={1.5}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nom}</div>
                      <div style={{ fontSize: 11, color: p.stock <= 3 ? '#DC2626' : '#94A3B8' }}>Stock : {p.stock} {p.stock <= 3 ? '⚠' : ''}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: mc }}>{m}%</div>
                      <div style={{ fontSize: 10, color: '#94A3B8' }}>marge</div>
                    </div>
                  </div>
                )
              })}
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: .98 }}
                onClick={() => navigate('/produits')}
                style={{ width: '100%', background: '#F8FAFC', border: '1.5px dashed #CBD5E1', borderRadius: 10, padding: '10px', fontSize: 13, color: '#64748B', fontWeight: 500, cursor: 'pointer', marginTop: 12, transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.borderColor='#93C5FD'; e.currentTarget.style.color='#2563EB' }}
                onMouseLeave={e => { e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#CBD5E1'; e.currentTarget.style.color='#64748B' }}>
                + Ajouter un produit
              </motion.button>
            </motion.div>

            {/* Actions rapides */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3, duration: .4 }}
              style={{ background: 'linear-gradient(135deg,#1E40AF,#2563EB)', borderRadius: 16, padding: '20px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }}/>
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }}/>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14, position: 'relative' }}>Actions rapides</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                {[
                  { label: '+ Nouvelle vente',    path: '/ventes/new', primary: true },
                  { label: '+ Ajouter un produit', path: '/produits',   primary: false },
                  { label: '👥 Gérer les clients', path: '/clients',    primary: false },
                  { label: '📊 Voir les rapports', path: '/rapports',   primary: false },
                ].map(a => (
                  <motion.button key={a.path} whileHover={{ x: 4 }} whileTap={{ scale: .97 }}
                    onClick={() => navigate(a.path)}
                    style={{ background: a.primary ? '#FACC15' : 'rgba(255,255,255,.1)', border: 'none', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontWeight: 600, color: a.primary ? '#1E3A8A' : 'rgba(255,255,255,.85)', cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans',sans-serif", transition: 'background .15s', boxShadow: a.primary ? '0 4px 12px rgba(250,204,21,.3)' : 'none' }}>
                    {a.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Résumé du jour */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .36, duration: .4 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Résumé du jour</h3>
              {[
                ['Total ventes',    stats.totalVentes + ' transaction' + (stats.totalVentes > 1 ? 's' : ''), '#64748B'],
                ['Revenus',         stats.totalRevenus.toLocaleString('fr-FR') + ' F',  '#2563EB'],
                ['Bénéfice net',    '+' + stats.totalBenefice?.toLocaleString('fr-FR') + ' F', '#16A34A'],
                ['Marge moyenne',   stats.margeMoyenne + '%',   '#D97706'],
              ].map(([l, v, c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontSize: 13, color: '#64748B', fontWeight: 400 }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{loading ? '—' : v}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}