const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, Edit2, Trash2, AlertCircle, Phone, MapPin, X, ChevronRight, MessageCircle, ShoppingCart, Star } from 'lucide-react'
import Layout from '../components/Layout'
import axios from 'axios'

function Avatar({ nom, size = 42 }) {
  const initials = nom?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const palettes = [['#EFF6FF','#2563EB'],['#F0FDF4','#16A34A'],['#FFF7ED','#EA580C'],['#FDF4FF','#9333EA'],['#FFFBEB','#D97706'],['#F0F9FF','#0284C7']]
  const [bg, color] = palettes[(nom?.charCodeAt(0)||0) % palettes.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, border:`2px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.34, fontWeight:700, color, flexShrink:0 }}>
      {initials}
    </div>
  )
}

const fadeUp = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0,transition:{duration:.3}} }

export default function Clients() {
  const navigate = useNavigate()
  const [clients, setClients]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [search, setSearch]         = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [editClient, setEditClient] = useState(null)
  const [detteModal, setDetteModal] = useState(null)
  const [detteVal, setDetteVal]     = useState('')
  const [form, setForm] = useState({ nom:'', telephone:'', email:'', adresse:'', note:'' })

  const token   = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try { const r = await axios.get(`${API}/api/clients`, { headers }); setClients(r.data) }
    catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const openAdd  = () => { setEditClient(null); setForm({ nom:'', telephone:'', email:'', adresse:'', note:'' }); setShowForm(true) }
  const openEdit = (e, c) => { e.stopPropagation(); setEditClient(c); setForm({ nom:c.nom, telephone:c.telephone||'', email:c.email||'', adresse:c.adresse||'', note:c.note||'' }); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editClient) await axios.put(`${API}/api/clients/${editClient.id}`, form, { headers })
      else await axios.post(`${API}/api/clients`, form, { headers })
      setShowForm(false); setEditClient(null); fetchClients()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Supprimer ce client ?')) return
    try { await axios.delete(`${API}/api/clients/${id}`, { headers }); fetchClients() }
    catch (e) { console.error(e) }
  }

  const handleDette = async () => {
    try {
      await axios.put(`${API}/api/clients/${detteModal.id}`, { ...detteModal, dette: parseFloat(detteVal)||0 }, { headers })
      setDetteModal(null); setDetteVal(''); fetchClients()
    } catch (e) { console.error(e) }
  }

  const openWhatsApp = (e, tel) => {
    e.stopPropagation()
    if (!tel) return alert('Ce client n\'a pas de numéro de téléphone')
    const num = tel.replace(/\s/g,'').replace('+','')
    window.open(`https://wa.me/${num}`, '_blank')
  }

  const filtered    = clients.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()) || (c.telephone||'').includes(search))
  const totalDettes = clients.reduce((s,c) => s+(c.dette||0), 0)
  const avecDette   = clients.filter(c => c.dette > 0).length
  const vipCount    = clients.filter(c => c.isVip).length

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap');
        *{box-sizing:border-box;font-family:'DM Sans',sans-serif}
        .cl-input{width:100%;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;color:#0F172A;outline:none;transition:border .15s,box-shadow .15s;background:#fff;font-family:'DM Sans',sans-serif}
        .cl-input:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,.08)}
        .cl-card{background:#fff;border-radius:16px;border:1.5px solid #E2E8F0;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all .22s cubic-bezier(.4,0,.2,1);cursor:pointer;overflow:hidden}
        .cl-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(15,23,42,.1);border-color:#BFDBFE}
        .action-btn{opacity:0;transition:opacity .15s}
        .cl-card:hover .action-btn{opacity:1}
        .modal-bg{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
        @keyframes modalIn{from{opacity:0;transform:scale(.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .modal-box{animation:modalIn .25s cubic-bezier(.34,1.56,.64,1)}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        .form-anim{animation:slideDown .22s ease}
        @media(max-width:640px){.stats-grid{grid-template-columns:1fr 1fr !important}.cards-grid{grid-template-columns:1fr !important}}
      `}</style>

      <div style={{ padding:'24px 28px 0' }}>

        {/* HEADER */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:'#0F172A', letterSpacing:'-.5px', marginBottom:3 }}>Mes clients</h1>
            <p style={{ fontSize:13, color:'#94A3B8' }}>{clients.length} client{clients.length>1?'s':''} · {vipCount} VIP</p>
          </div>
          <motion.button whileHover={{scale:1.02,y:-1}} whileTap={{scale:.97}} onClick={openAdd}
            style={{ display:'flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:11, padding:'11px 20px', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,.3)', fontFamily:"'DM Sans',sans-serif" }}>
            <Plus size={16} strokeWidth={2.5}/> Ajouter un client
          </motion.button>
        </motion.div>

        {/* STATS */}
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
          {[
            { label:'Total clients',     val:clients.length,                          icon:Users,        bg:'#EFF6FF', color:'#2563EB' },
            { label:'Clients VIP 🔥',    val:vipCount,                                icon:Star,         bg:'#FFFBEB', color:'#D97706' },
            { label:'Dettes totales',    val:totalDettes.toLocaleString('fr-FR')+' F', icon:AlertCircle, bg:'#FEF2F2', color:'#DC2626' },
            { label:'Débiteurs',         val:avecDette,                               icon:AlertCircle,  bg:'#FFF7ED', color:'#EA580C' },
          ].map((s,i) => {
            const Icon = s.icon
            return (
              <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}
                style={{ background:'#fff', borderRadius:14, padding:'16px 18px', border:'1px solid #E2E8F0', boxShadow:'0 1px 4px rgba(0,0,0,.04)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={18} color={s.color} strokeWidth={1.75}/>
                </div>
                <div>
                  <div style={{ fontSize:12, color:'#64748B', fontWeight:500, marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, color:'#0F172A' }}>{s.val}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* FORMULAIRE */}
        <AnimatePresence>
          {showForm && (
            <div className="form-anim" style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:16, padding:'24px', marginBottom:22, boxShadow:'0 4px 24px rgba(0,0,0,.07)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700, color:'#0F172A' }}>{editClient?'Modifier le client':'Nouveau client'}</h3>
                <button onClick={()=>setShowForm(false)} style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94A3B8' }}><X size={15}/></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                  {[
                    { label:'Nom complet *', name:'nom',       placeholder:'Jean Dupont',          required:true },
                    { label:'Téléphone',     name:'telephone', placeholder:'+229 00 00 00 00' },
                    { label:'Email',         name:'email',     placeholder:'client@email.com',    type:'email' },
                    { label:'Adresse',       name:'adresse',   placeholder:'Cotonou, Cadjèhoun...' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:5 }}>{f.label}</label>
                      <input className="cl-input" type={f.type||'text'} name={f.name} value={form[f.name]} onChange={e=>setForm({...form,[e.target.name]:e.target.value})} placeholder={f.placeholder} required={f.required}/>
                    </div>
                  ))}
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:5 }}>Note</label>
                    <input className="cl-input" name="note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Client fidèle, gros acheteur..."/>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <motion.button type="submit" whileTap={{scale:.97}} disabled={saving}
                    style={{ background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:10, padding:'11px 22px', fontSize:14, fontWeight:600, cursor:'pointer', opacity:saving?.6:1, fontFamily:"'DM Sans',sans-serif" }}>
                    {saving?'Enregistrement...':(editClient?'Modifier':'Ajouter')}
                  </motion.button>
                  <button type="button" onClick={()=>setShowForm(false)} style={{ background:'#F8FAFC', color:'#64748B', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'10px 18px', fontSize:14, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Annuler</button>
                </div>
              </form>
            </div>
          )}
        </AnimatePresence>

        {/* SEARCH */}
        {clients.length > 0 && (
          <div style={{ position:'relative', maxWidth:380, marginBottom:20 }}>
            <Search size={15} color="#94A3B8" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }}/>
            <input className="cl-input" style={{ paddingLeft:38 }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par nom ou téléphone..."/>
          </div>
        )}

        {/* LISTE */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
            {[1,2,3].map(i => <div key={i} style={{ height:160, background:'#F8FAFC', borderRadius:16, border:'1px solid #E2E8F0' }}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'70px 20px' }}>
            <div style={{ width:70, height:70, borderRadius:20, background:'#EFF6FF', border:'1px solid #BFDBFE', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Users size={30} color="#93C5FD" strokeWidth={1.5}/>
            </div>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:17, fontWeight:700, color:'#0F172A', marginBottom:6 }}>{search?'Aucun résultat':'Aucun client encore'}</h3>
            <p style={{ color:'#94A3B8', fontSize:13.5, marginBottom:22 }}>{search?`"${search}" introuvable`:'Ajoutez vos premiers clients pour les suivre'}</p>
            {!search && (
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={openAdd}
                style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:11, padding:'11px 20px', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,.3)', fontFamily:"'DM Sans',sans-serif" }}>
                <Plus size={15}/> Ajouter un client
              </motion.button>
            )}
          </div>
        ) : (
          <div className="cards-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14, paddingBottom:32 }}>
            {filtered.map((c,i) => (
              <motion.div key={c.id} className="cl-card"
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}
                onClick={()=>navigate(`/clients/${c.id}`)}>

                {/* Bande gauche */}
                <div style={{ height:4, background: c.isVip ? 'linear-gradient(90deg,#FBBF24,#F59E0B)' : c.dette>0 ? '#FCA5A5' : '#BFDBFE' }}/>

                <div style={{ padding:'16px 18px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                    <Avatar nom={c.nom} size={46}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexWrap:'wrap' }}>
                        <span style={{ fontSize:14.5, fontWeight:700, color:'#0F172A' }}>{c.nom}</span>
                        {c.isVip && (
                          <span style={{ background:'linear-gradient(135deg,#FBBF24,#F59E0B)', color:'#fff', fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:20, display:'flex', alignItems:'center', gap:3 }}>
                            🔥 VIP
                          </span>
                        )}
                        {c.dette > 0 && <span style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', color:'#DC2626', fontSize:10.5, fontWeight:700, padding:'2px 7px', borderRadius:5 }}>⚠ {c.dette.toLocaleString('fr-FR')} F</span>}
                      </div>
                      {c.telephone && <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'#64748B', marginBottom:2 }}><Phone size={11}/>{c.telephone}</div>}
                      {c.adresse   && <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#94A3B8' }}><MapPin size={10}/>{c.adresse}</div>}
                    </div>
                    {/* Actions */}
                    <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                      <button className="action-btn" onClick={e=>openEdit(e,c)} style={{ width:28, height:28, borderRadius:8, background:'#EFF6FF', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563EB' }}><Edit2 size={12}/></button>
                      <button className="action-btn" onClick={e=>handleDelete(e,c.id)} style={{ width:28, height:28, borderRadius:8, background:'#FEF2F2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#EF4444' }}><Trash2 size={12}/></button>
                    </div>
                  </div>

                  {/* Stats business */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
                    {[
                      { label:'Total dépensé', val:(c.totalAchats||0).toLocaleString('fr-FR')+' F', color: c.isVip?'#D97706':'#2563EB' },
                      { label:'Commandes',     val:c.nbCommandes||0 },
                      { label:'Dernier achat', val:c.dernierAchat ? new Date(c.dernierAchat).toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) : '—' },
                    ].map(s => (
                      <div key={s.label} style={{ background:'#F8FAFC', borderRadius:9, padding:'8px 10px', textAlign:'center' }}>
                        <div style={{ fontSize:12.5, fontWeight:700, color:s.color||'#0F172A', marginBottom:2 }}>{s.val}</div>
                        <div style={{ fontSize:10, color:'#94A3B8', fontWeight:500 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Boutons actions */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7 }}>
                    <motion.button whileTap={{scale:.95}} onClick={e=>{e.stopPropagation();setDetteModal(c);setDetteVal(c.dette?.toString()||'0')}}
                      style={{ background:c.dette>0?'#FEF2F2':'#F8FAFC', border:`1px solid ${c.dette>0?'#FCA5A5':'#E2E8F0'}`, borderRadius:8, padding:'8px', fontSize:11.5, fontWeight:600, color:c.dette>0?'#DC2626':'#64748B', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                      {c.dette>0?'💳 Dette':'💳 Créance'}
                    </motion.button>
                    <motion.button whileTap={{scale:.95}} onClick={e=>openWhatsApp(e,c.telephone)}
                      style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, padding:'8px', fontSize:11.5, fontWeight:600, color:'#16A34A', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4, fontFamily:"'DM Sans',sans-serif" }}>
                      <MessageCircle size={12}/> WhatsApp
                    </motion.button>
                    <motion.button whileTap={{scale:.95}} onClick={e=>{e.stopPropagation();navigate('/ventes/new')}}
                      style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'8px', fontSize:11.5, fontWeight:600, color:'#2563EB', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4, fontFamily:"'DM Sans',sans-serif" }}>
                      <ShoppingCart size={12}/> Vente
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DETTE */}
      <AnimatePresence>
        {detteModal && (
          <div className="modal-bg" onClick={()=>setDetteModal(null)}>
            <div className="modal-box" style={{ background:'#fff', borderRadius:18, padding:'28px', width:'100%', maxWidth:380, boxShadow:'0 24px 64px rgba(0,0,0,.16)' }} onClick={e=>e.stopPropagation()}>
              <div style={{ textAlign:'center', marginBottom:20 }}>
                <Avatar nom={detteModal.nom} size={54}/>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:700, color:'#0F172A', marginTop:12, marginBottom:4 }}>{detteModal.nom}</h3>
                <p style={{ fontSize:13, color:'#64748B' }}>Modifier le montant de la dette</p>
              </div>
              <label style={{ fontSize:12, fontWeight:600, color:'#475569', display:'block', marginBottom:6 }}>Montant (FCFA)</label>
              <input className="cl-input" type="number" value={detteVal} onChange={e=>setDetteVal(e.target.value)} style={{ textAlign:'center', fontSize:22, fontWeight:700, marginBottom:18 }}/>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={()=>setDetteModal(null)} style={{ flex:1, background:'#F8FAFC', border:'1.5px solid #E2E8F0', borderRadius:10, padding:'12px', fontSize:14, cursor:'pointer', color:'#64748B', fontFamily:"'DM Sans',sans-serif" }}>Annuler</button>
                <motion.button whileTap={{scale:.97}} onClick={handleDette}
                  style={{ flex:2, background:'linear-gradient(135deg,#2563EB,#1D4ED8)', color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 12px rgba(37,99,235,.3)', fontFamily:"'DM Sans',sans-serif" }}>
                  Enregistrer
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}