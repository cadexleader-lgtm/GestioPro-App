import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import {
  TrendingUp, ShoppingCart, Users, Package,
  AlertTriangle, Download, Calendar, ArrowUpRight, Star
} from 'lucide-react'
import Layout from '../components/Layout'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const PERIODES = [
  { val: '1',   label: "Aujourd'hui" },
  { val: '7',   label: '7 jours' },
  { val: '30',  label: '30 jours' },
  { val: '365', label: 'Cette année' },
]

const PIE_COLORS = ['#2563EB', '#16A34A', '#D97706', '#9333EA', '#DC2626']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.1)' }}>
      <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 2 }}>
          {p.name} : {p.value?.toLocaleString('fr-FR')} F
        </p>
      ))}
    </div>
  )
}

export default function Rapports() {
  const navigate = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [periode, setPeriode] = useState('7')

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchRapport()
  }, [periode])

  const fetchRapport = async () => {
    setLoading(true)
    try {
      const r = await axios.get(`${API}/api/rapports?periode=${periode}`, { headers })
      setData(r.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const exportPDF = () => {
    alert('Export PDF — fonctionnalité bientôt disponible')
  }

  const exportExcel = () => {
    if (!data) return
    const rows = [
      ['Rapport GestioPro'],
      ['Période', PERIODES.find(p => p.val === periode)?.label],
      [],
      ['STATS GLOBALES'],
      ['Revenus', data.stats.totalRevenus],
      ['Bénéfice', data.stats.totalBenefice],
      ['Ventes', data.stats.totalVentes],
      ['Marge moyenne', data.stats.margeMoyenne + '%'],
      [],
      ['TOP PRODUITS'],
      ['Produit', 'Quantité', 'Revenus', 'Bénéfice'],
      ...data.topProduits.map(p => [p.nom, p.quantite, p.revenus, p.benefice]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `rapport-gestiopro-${periode}j.csv`; a.click()
  }

  const { stats = {}, graphData = [], topProduits = [], topClients = [], paiements = [], alertesStock = [] } = data || {}

  const KPI = [
    { label: 'Revenus totaux',  val: (stats.totalRevenus||0).toLocaleString('fr-FR') + ' F', icon: TrendingUp,  bg: '#EFF6FF', color: '#2563EB' },
    { label: 'Bénéfice net',    val: (stats.totalBenefice||0).toLocaleString('fr-FR') + ' F', icon: ArrowUpRight, bg: '#F0FDF4', color: '#16A34A' },
    { label: 'Nombre de ventes', val: stats.totalVentes || 0,                                  icon: ShoppingCart, bg: '#FFF7ED', color: '#EA580C' },
    { label: 'Total clients',   val: stats.totalClients || 0,                                  icon: Users,       bg: '#FDF4FF', color: '#9333EA' },
    { label: 'Marge moyenne',   val: (stats.margeMoyenne || 0) + '%',                          icon: Package,     bg: '#FFFBEB', color: '#D97706' },
    { label: 'Dettes clients',  val: (stats.totalDettes||0).toLocaleString('fr-FR') + ' F',    icon: AlertTriangle, bg: '#FEF2F2', color: '#DC2626' },
  ]

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap');
        *{box-sizing:border-box;font-family:'DM Sans',sans-serif}
        .periode-btn{padding:8px 14px;border-radius:9px;border:1.5px solid #E2E8F0;background:#fff;font-size:13px;font-weight:500;color:#64748B;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
        .periode-btn.active{border-color:#2563EB;background:#EFF6FF;color:#2563EB;font-weight:600}
        .periode-btn:hover:not(.active){border-color:#CBD5E1}
        .export-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:9px;border:1.5px solid #E2E8F0;background:#fff;font-size:13px;font-weight:600;color:#475569;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
        .export-btn:hover{border-color:#2563EB;color:#2563EB;background:#EFF6FF}
        .section-title{font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;color:#0F172A;margin-bottom:16px}
        @media(max-width:768px){.kpi-grid{grid-template-columns:1fr 1fr !important}.main-grid{grid-template-columns:1fr !important}.top-grid{grid-template-columns:1fr !important}}
      `}</style>

      <div style={{ padding: '24px 28px 0' }}>

        {/* HEADER */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:14 }}>
          <div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:3 }}>
              Rapports & Analytics
            </h1>
            <p style={{ fontSize:13, color:'#94A3B8' }}>Vue d'ensemble de votre activité</p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button className="export-btn" onClick={exportExcel}><Download size={14}/> Excel</button>
            <button className="export-btn" onClick={exportPDF}><Download size={14}/> PDF</button>
          </div>
        </motion.div>

        {/* FILTRES PERIODE */}
        <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }}>
          {PERIODES.map(p => (
            <button key={p.val} className={`periode-btn ${periode===p.val?'active':''}`} onClick={() => setPeriode(p.val)}>
              {p.label}
            </button>
          ))}
        </div>

        {/* KPI CARDS */}
        <div className="kpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {KPI.map((k,i) => {
            const Icon = k.icon
            return (
              <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}
                whileHover={{y:-2,boxShadow:'0 10px 28px rgba(0,0,0,.08)'}}
                style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #E2E8F0', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:12.5, fontWeight:500, color:'#64748B' }}>{k.label}</span>
                  <div style={{ width:34, height:34, borderRadius:9, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={16} color={k.color} strokeWidth={1.75}/>
                  </div>
                </div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:22, fontWeight:800, color:'#0F172A', letterSpacing:'-.3px' }}>
                  {loading ? <div style={{ height:28, width:80, background:'#F1F5F9', borderRadius:6 }}/> : k.val}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* GRAPHIQUE PRINCIPAL */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.2}}
          style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', padding:'22px', marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div>
              <h3 className="section-title" style={{ marginBottom:2 }}>Évolution Revenus & Bénéfices</h3>
              <p style={{ fontSize:12, color:'#94A3B8' }}>{PERIODES.find(p=>p.val===periode)?.label}</p>
            </div>
            <div style={{ display:'flex', gap:14 }}>
              {[['#2563EB','Revenus'],['#16A34A','Bénéfices']].map(([c,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
                  <span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {loading || graphData.length === 0 ? (
            <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8', fontSize:13 }}>
              {loading ? 'Chargement...' : 'Pas encore de données pour cette période'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={graphData} margin={{top:0,right:0,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563EB" stopOpacity=".15"/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16A34A" stopOpacity=".15"/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="jour" tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${Math.floor(v/1000)}k`:v}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="revenus"   name="Revenus"   stroke="#2563EB" strokeWidth={2} fill="url(#gR)" dot={false} activeDot={{r:5,strokeWidth:0}}/>
                <Area type="monotone" dataKey="benefices" name="Bénéfices" stroke="#16A34A" strokeWidth={2} fill="url(#gB)" dot={false} activeDot={{r:5,strokeWidth:0}}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* GRILLE TOP PRODUITS + TOP CLIENTS */}
        <div className="top-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

          {/* Top Produits */}
          <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:.28}}
            style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', padding:'22px', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
            <h3 className="section-title">🔥 Top Produits</h3>
            {loading ? <div style={{ color:'#94A3B8', fontSize:13 }}>Chargement...</div>
            : topProduits.length === 0 ? <div style={{ color:'#94A3B8', fontSize:13, textAlign:'center', padding:'20px 0' }}>Pas encore de ventes</div>
            : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={topProduits} layout="vertical" margin={{top:0,right:0,left:0,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
                    <XAxis type="number" tick={{fontSize:10,fill:'#94A3B8'}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${Math.floor(v/1000)}k`:v}/>
                    <YAxis type="category" dataKey="nom" tick={{fontSize:11,fill:'#475569'}} axisLine={false} tickLine={false} width={90}/>
                    <Tooltip formatter={(v) => v.toLocaleString('fr-FR') + ' F'}/>
                    <Bar dataKey="revenus" fill="#2563EB" radius={[0,6,6,0]} name="Revenus"/>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop:12 }}>
                  {topProduits.map((p,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:i<topProduits.length-1?'1px solid #F1F5F9':'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:22, height:22, borderRadius:6, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#2563EB' }}>{i+1}</div>
                        <span style={{ fontSize:13, fontWeight:500, color:'#0F172A' }}>{p.nom}</span>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'#2563EB' }}>{p.revenus.toLocaleString('fr-FR')} F</div>
                        <div style={{ fontSize:11, color:'#94A3B8' }}>{p.quantite} vendus</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Top Clients */}
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:.32}}
            style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', padding:'22px', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
            <h3 className="section-title">👥 Top Clients</h3>
            {loading ? <div style={{ color:'#94A3B8', fontSize:13 }}>Chargement...</div>
            : topClients.length === 0 ? <div style={{ color:'#94A3B8', fontSize:13, textAlign:'center', padding:'20px 0' }}>Pas encore de clients avec achats</div>
            : topClients.map((c,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<topClients.length-1?'1px solid #F1F5F9':'none' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border:'1px solid #BFDBFE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'#2563EB', flexShrink:0 }}>
                  {c.nom?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:13.5, fontWeight:600, color:'#0F172A' }}>{c.nom}</span>
                    {c.depenses >= 200000 && <span style={{ background:'linear-gradient(135deg,#FBBF24,#F59E0B)', color:'#fff', fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:20 }}>🔥 VIP</span>}
                  </div>
                  <div style={{ fontSize:11, color:'#94A3B8' }}>{c.commandes} commande{c.commandes>1?'s':''}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#16A34A' }}>{c.depenses.toLocaleString('fr-FR')} F</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RÉPARTITION PAIEMENTS + ALERTES STOCK */}
        <div className="top-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 }}>

          {/* Répartition paiements */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.36}}
            style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', padding:'22px', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
            <h3 className="section-title">💳 Modes de paiement</h3>
            {loading || paiements.length === 0 ? (
              <div style={{ color:'#94A3B8', fontSize:13, textAlign:'center', padding:'20px 0' }}>Pas de données</div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={paiements} dataKey="montant" nameKey="mode" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                      {paiements.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip formatter={v => v.toLocaleString('fr-FR') + ' F'}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex:1 }}>
                  {paiements.map((p,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:PIE_COLORS[i%PIE_COLORS.length], flexShrink:0 }}/>
                        <span style={{ fontSize:12.5, color:'#475569' }}>{p.mode}</span>
                      </div>
                      <span style={{ fontSize:12.5, fontWeight:600, color:'#0F172A' }}>{p.montant.toLocaleString('fr-FR')} F</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Alertes stock */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.4}}
            style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', padding:'22px', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }}>
            <h3 className="section-title">⚠️ Alertes Stock</h3>
            {loading ? <div style={{ color:'#94A3B8', fontSize:13 }}>Chargement...</div>
            : alertesStock.length === 0 ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                <p style={{ color:'#16A34A', fontSize:13, fontWeight:600 }}>Tous les stocks sont OK</p>
              </div>
            ) : alertesStock.map((p,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:i<alertesStock.length-1?'1px solid #F1F5F9':'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:p.stock===0?'#DC2626':'#F59E0B', flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:'#0F172A', fontWeight:500 }}>{p.nom}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:p.stock===0?'#DC2626':'#D97706', background:p.stock===0?'#FEF2F2':'#FFFBEB', padding:'3px 10px', borderRadius:6 }}>
                  {p.stock === 0 ? 'Rupture' : `${p.stock} restants`}
                </span>
              </div>
            ))}
            {alertesStock.length > 0 && (
              <button onClick={() => navigate('/stock')}
                style={{ width:'100%', marginTop:12, background:'#EFF6FF', border:'none', borderRadius:9, padding:'9px', fontSize:13, color:'#2563EB', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                Gérer le stock →
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}