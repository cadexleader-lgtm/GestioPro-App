import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, AlertTriangle, XCircle, DollarSign, Search, Plus, Filter, ArrowUp, ArrowDown, Edit3, Trash2, RefreshCw, X, ChevronDown } from 'lucide-react'
import Layout from '../components/Layout'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STATUT = (stock) => {
  if (stock === 0) return { label: 'Rupture',  color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', dot: '#DC2626' }
  if (stock <= 5)  return { label: 'Faible',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B' }
  return              { label: 'En stock', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', dot: '#22C55E' }
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .3 } } }

export default function Stock() {
  const navigate = useNavigate()
  const [data, setData]         = useState({ produits: [], stats: {} })
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterCat, setFilterCat]       = useState('tous')
  const [mvtModal, setMvtModal] = useState(null)
  const [mvtType, setMvtType]   = useState('add')
  const [mvtQty, setMvtQty]     = useState('')
  const [saving, setSaving]     = useState(false)

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchStock()
  }, [])

  const fetchStock = async () => {
    try {
      const r = await axios.get(`${API}/api/stock`, { headers })
      setData(r.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleMouvement = async () => {
    if (!mvtModal || !mvtQty) return
    setSaving(true)
    try {
      await axios.put(`${API}/api/stock/${mvtModal.id}`, { quantite: mvtQty, type: mvtType }, { headers })
      setMvtModal(null); setMvtQty(''); fetchStock()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const categories = ['tous', ...new Set(data.produits.map(p => p.categorie).filter(Boolean))]

  const filtered = data.produits.filter(p => {
    const matchSearch  = p.nom.toLowerCase().includes(search.toLowerCase()) || (p.categorie||'').toLowerCase().includes(search.toLowerCase())
    const s            = STATUT(p.stock)
    const matchStatut  = filterStatut === 'tous' || s.label.toLowerCase() === filterStatut
    const matchCat     = filterCat === 'tous' || (p.categorie||'') === filterCat
    return matchSearch && matchStatut && matchCat
  })

  const { stats } = data

  const KPI = [
    { label: 'Total produits',  val: stats.totalProduits || 0,                                     icon: Package,       bg: '#EFF6FF', color: '#2563EB', suffix: '' },
    { label: 'Stock faible',    val: stats.alertesFaibles || 0,                                    icon: AlertTriangle, bg: '#FFFBEB', color: '#D97706', suffix: '' },
    { label: 'Ruptures',        val: stats.ruptures || 0,                                          icon: XCircle,       bg: '#FEF2F2', color: '#DC2626', suffix: '' },
    { label: 'Valeur du stock', val: (stats.valeurTotale || 0).toLocaleString('fr-FR') + ' F',     icon: DollarSign,    bg: '#F0FDF4', color: '#16A34A', suffix: '' },
  ]

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap');
        *{box-sizing:border-box;font-family:'DM Sans',sans-serif}
        .st-input{width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:13.5px;color:#0F172A;outline:none;transition:border .15s;background:#fff;font-family:'DM Sans',sans-serif}
        .st-input:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,.08)}
        .tr:hover{background:#F8FAFC !important}
        .filter-btn{padding:8px 14px;border-radius:9px;border:1.5px solid #E2E8F0;background:#fff;font-size:12.5px;font-weight:500;color:#64748B;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
        .filter-btn.active{border-color:#2563EB;background:#EFF6FF;color:#2563EB;font-weight:600}
        .filter-btn:hover:not(.active){border-color:#CBD5E1;background:#F8FAFC}
        .modal-bg{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
        @keyframes modalIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        .modal-box{animation:modalIn .22s cubic-bezier(.34,1.56,.64,1)}
        @media(max-width:640px){.kpi-grid{grid-template-columns:1fr 1fr !important}.hide-sm{display:none !important}}
      `}</style>

      <div style={{ padding: '24px 28px 0' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:3 }}>Gestion du Stock</h1>
            <p style={{ fontSize:13, color:'#94A3B8' }}>{data.produits.length} produit{data.produits.length>1?'s':''} · {stats.totalUnites || 0} unités au total</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={() => navigate('/produits')}
              style={{ display:'flex', alignItems:'center', gap:7, background:'#fff', border:'1.5px solid #E2E8F0', color:'#475569', borderRadius:10, padding:'10px 16px', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              <RefreshCw size={14}/> Actualiser
            </motion.button>
            <motion.button whileHover={{scale:1.02,y:-1}} whileTap={{scale:.97}} onClick={() => navigate('/produits')}
              style={{ display:'flex', alignItems:'center', gap:7, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:10, padding:'10px 18px', fontSize:13.5, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,.3)', fontFamily:"'DM Sans',sans-serif" }}>
              <Plus size={15} strokeWidth={2.5}/> Ajouter produit
            </motion.button>
          </div>
        </motion.div>

        {/* ── KPI CARDS ── */}
        <div className="kpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
          {KPI.map((k,i) => {
            const Icon = k.icon
            return (
              <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
                whileHover={{y:-2,boxShadow:'0 10px 28px rgba(0,0,0,.08)'}}
                style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #E2E8F0', boxShadow:'0 1px 4px rgba(0,0,0,.04)', cursor:'default' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontSize:12.5, fontWeight:500, color:'#64748B' }}>{k.label}</span>
                  <div style={{ width:36, height:36, borderRadius:10, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={17} color={k.color} strokeWidth={1.75}/>
                  </div>
                </div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:'#0F172A', letterSpacing:'-.3px' }}>{loading ? '—' : k.val}</div>
              </motion.div>
            )
          })}
        </div>

        {/* ── ALERTES ── */}
        <AnimatePresence>
          {!loading && (stats.ruptures > 0 || stats.alertesFaibles > 0) && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{ background:'linear-gradient(135deg,#FFFBEB,#FEF2F2)', border:'1px solid #FDE68A', borderRadius:14, padding:'14px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <AlertTriangle size={18} color="#D97706"/>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13.5, fontWeight:700, color:'#92400E' }}>Attention — action requise</span>
                <span style={{ fontSize:13, color:'#92400E', marginLeft:8 }}>
                  {stats.ruptures > 0 && `${stats.ruptures} produit${stats.ruptures>1?'s':''} en rupture`}
                  {stats.ruptures > 0 && stats.alertesFaibles > 0 && ' · '}
                  {stats.alertesFaibles > 0 && `${stats.alertesFaibles} produit${stats.alertesFaibles>1?'s':''} en stock faible`}
                </span>
              </div>
              <button onClick={() => setFilterStatut('rupture')}
                style={{ background:'#D97706', color:'#fff', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12.5, fontWeight:600, cursor:'pointer' }}>
                Voir les ruptures
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FILTRES & SEARCH ── */}
        <div style={{ display:'flex', gap:12, marginBottom:18, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:220 }}>
            <Search size={14} color="#94A3B8" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
            <input className="st-input" style={{ paddingLeft:36 }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un produit..."/>
          </div>

          {/* Filtre statut */}
          <div style={{ display:'flex', gap:6 }}>
            {[['tous','Tous'],['en stock','✅ Stock'],['faible','⚠️ Faible'],['rupture','🔴 Rupture']].map(([v,l]) => (
              <button key={v} className={`filter-btn ${filterStatut===v?'active':''}`} onClick={() => setFilterStatut(v)}>{l}</button>
            ))}
          </div>

          {/* Filtre catégorie */}
          {categories.length > 2 && (
            <select className="st-input" style={{ width:'auto', paddingRight:32 }} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c === 'tous' ? 'Toutes catégories' : c}</option>)}
            </select>
          )}
        </div>

        {/* ── TABLEAU ── */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.2}}
          style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', boxShadow:'0 1px 4px rgba(0,0,0,.04)', overflow:'hidden', marginBottom:32 }}>

          {/* En-tête tableau */}
          <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 1fr 1fr', padding:'11px 20px', background:'#F8FAFC', borderBottom:'1px solid #F1F5F9' }}>
            {['Produit','Catégorie','Stock actuel','Seuil min.','Statut','Valeur','Actions'].map((h,i) => (
              <span key={h} className={i>1?'hide-sm':''} style={{ fontSize:10.5, color:'#94A3B8', fontWeight:600, letterSpacing:'.06em' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding:'40px', textAlign:'center', color:'#94A3B8' }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:'60px 24px', textAlign:'center' }}>
              <Package size={40} color="#CBD5E1" style={{ margin:'0 auto 14px', display:'block' }}/>
              <p style={{ color:'#64748B', fontWeight:500, fontSize:14, marginBottom:8 }}>
                {search ? `Aucun résultat pour "${search}"` : 'Aucun produit en stock'}
              </p>
              <button onClick={()=>navigate('/produits')}
                style={{ background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:9, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer', marginTop:8 }}>
                + Ajouter un produit
              </button>
            </div>
          ) : filtered.map((p, i) => {
            const st = STATUT(p.stock)
            const valeur = (p.prixAchat * p.stock).toLocaleString('fr-FR')
            return (
              <motion.div key={p.id} className="tr"
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.04}}
                style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1fr 1fr 1fr', padding:'13px 20px', borderBottom: i<filtered.length-1?'1px solid #F1F5F9':'none', alignItems:'center', transition:'background .12s' }}>

                {/* Produit */}
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'#EFF6FF', border:'1px solid #DBEAFE', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Package size={16} color="#2563EB" strokeWidth={1.75}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:'#0F172A' }}>{p.nom}</div>
                    <div style={{ fontSize:11, color:'#94A3B8' }}>{p.prixVente?.toLocaleString('fr-FR')} F · vente</div>
                  </div>
                </div>

                {/* Catégorie */}
                <span className="hide-sm" style={{ fontSize:12.5, color:'#64748B' }}>{p.categorie || '—'}</span>

                {/* Stock actuel */}
                <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:800, color: p.stock === 0 ? '#DC2626' : p.stock <= 5 ? '#D97706' : '#0F172A' }}>
                  {p.stock}
                </span>

                {/* Seuil min */}
                <span className="hide-sm" style={{ fontSize:13, color:'#94A3B8' }}>5</span>

                {/* Statut badge */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:st.bg, border:`1px solid ${st.border}`, color:st.color, padding:'4px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, width:'fit-content' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:st.dot }}/>
                  {st.label}
                </span>

                {/* Valeur */}
                <span className="hide-sm" style={{ fontSize:13, fontWeight:600, color:'#475569' }}>{valeur} F</span>

                {/* Actions */}
                <div style={{ display:'flex', gap:'6px' }}>
                  <motion.button whileTap={{scale:.9}}
                    onClick={() => { setMvtModal(p); setMvtType('add'); setMvtQty('') }}
                    style={{ width:30, height:30, borderRadius:8, background:'#F0FDF4', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#16A34A' }}
                    title="Ajouter stock">
                    <ArrowUp size={13}/>
                  </motion.button>
                  <motion.button whileTap={{scale:.9}}
                    onClick={() => { setMvtModal(p); setMvtType('remove'); setMvtQty('') }}
                    style={{ width:30, height:30, borderRadius:8, background:'#FEF2F2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#DC2626' }}
                    title="Retirer stock">
                    <ArrowDown size={13}/>
                  </motion.button>
                  <motion.button whileTap={{scale:.9}}
                    onClick={() => navigate('/produits')}
                    style={{ width:30, height:30, borderRadius:8, background:'#EFF6FF', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563EB' }}
                    title="Modifier">
                    <Edit3 size={13}/>
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* ── MODAL MOUVEMENT ── */}
      <AnimatePresence>
        {mvtModal && (
          <div className="modal-bg" onClick={() => setMvtModal(null)}>
            <div className="modal-box" style={{ background:'#fff', borderRadius:18, padding:'28px', width:'100%', maxWidth:400, boxShadow:'0 24px 64px rgba(0,0,0,.15)' }} onClick={e=>e.stopPropagation()}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:3 }}>Mouvement de stock</h3>
                  <p style={{ fontSize:13, color:'#64748B' }}>{mvtModal.nom}</p>
                </div>
                <button onClick={() => setMvtModal(null)} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8' }}><X size={15}/></button>
              </div>

              {/* Stock actuel */}
              <div style={{ background:'#F8FAFC', borderRadius:12, padding:'12px 16px', marginBottom:18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, color:'#64748B' }}>Stock actuel</span>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, color:'#0F172A' }}>{mvtModal.stock}</span>
              </div>

              {/* Type mouvement */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
                {[
                  { val:'add',    label:'➕ Entrée',    color:'#16A34A', bg:'#F0FDF4' },
                  { val:'remove', label:'➖ Sortie',    color:'#DC2626', bg:'#FEF2F2' },
                  { val:'set',    label:'✏️ Définir',   color:'#2563EB', bg:'#EFF6FF' },
                ].map(t => (
                  <button key={t.val} onClick={() => setMvtType(t.val)}
                    style={{ padding:'10px 8px', borderRadius:10, border:`1.5px solid ${mvtType===t.val?t.color:'#E2E8F0'}`, background:mvtType===t.val?t.bg:'#fff', color:mvtType===t.val?t.color:'#64748B', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s', fontFamily:"'DM Sans',sans-serif" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:6 }}>
                {mvtType === 'add' ? 'Quantité à ajouter' : mvtType === 'remove' ? 'Quantité à retirer' : 'Nouveau stock'}
              </label>
              <input className="st-input" type="number" min="0" value={mvtQty} onChange={e=>setMvtQty(e.target.value)}
                style={{ textAlign:'center', fontSize:22, fontWeight:700, marginBottom:18 }} placeholder="0"/>

              {mvtQty && (
                <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#15803D', fontWeight:500 }}>
                  Stock après : {mvtType==='set' ? mvtQty : mvtType==='add' ? mvtModal.stock + parseInt(mvtQty||0) : Math.max(0, mvtModal.stock - parseInt(mvtQty||0))} unités
                </div>
              )}

              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setMvtModal(null)} style={{ flex:1, background:'#F8FAFC', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'12px', fontSize:14, cursor:'pointer', color:'#64748B', fontFamily:"'DM Sans',sans-serif" }}>Annuler</button>
                <motion.button whileTap={{scale:.97}} onClick={handleMouvement} disabled={!mvtQty || saving}
                  style={{ flex:2, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,.3)', opacity:!mvtQty||saving?.6:1, fontFamily:"'DM Sans',sans-serif" }}>
                  {saving ? 'Mise à jour...' : 'Confirmer'}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}