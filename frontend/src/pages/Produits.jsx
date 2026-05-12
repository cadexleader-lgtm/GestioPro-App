const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import axios from 'axios'

const EmptyIllustration = () => (
  <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
    <rect x="20" y="20" width="140" height="100" rx="12" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5"/>
    <rect x="40" y="40" width="60" height="8" rx="4" fill="#BFDBFE"/>
    <rect x="40" y="56" width="100" height="6" rx="3" fill="#DBEAFE"/>
    <rect x="40" y="70" width="80" height="6" rx="3" fill="#DBEAFE"/>
    <rect x="40" y="84" width="90" height="6" rx="3" fill="#DBEAFE"/>
    <circle cx="148" cy="112" r="22" fill="#2563EB"/>
    <path d="M140 112h16M148 104v16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

export default function Produits() {
  const navigate = useNavigate()
  const [produits, setProduits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nom: '', prixAchat: '', prixVente: '', categorie: '', stock: '', description: '' })

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchProduits()
  }, [])

  const fetchProduits = async () => {
    try {
      const res = await axios.get(`${API}/api/produits`, { headers })
      setProduits(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await axios.post(`${API}/api/produits`, form, { headers })
      setForm({ nom: '', prixAchat: '', prixVente: '', categorie: '', stock: '', description: '' })
      setShowForm(false)
      fetchProduits()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try { await axios.delete(`${API}/api/produits/${id}`, { headers }); fetchProduits() }
    catch (e) { console.error(e) }
  }

  const marge = (a, v) => !a || !v ? 0 : Math.round(((v - a) / v) * 100)
  const benefice = (a, v) => !a || !v ? 0 : v - a

  const filtered = produits.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()) || (p.categorie || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .prod-input { width: 100%; padding: 11px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13.5px; font-family: 'Inter',sans-serif; color: #0F172A; background: #fff; outline: none; transition: border .15s, box-shadow .15s; }
        .prod-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
        .prod-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 20px; transition: all .18s; cursor: default; }
        .prod-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.07); transform: translateY(-2px); border-color: #CBD5E1; }
        .del-btn { opacity: 0; transition: opacity .15s; }
        .prod-card:hover .del-btn { opacity: 1; }
        .search-input { width: 100%; padding: 10px 14px 10px 40px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; font-family: 'Inter',sans-serif; outline: none; background: #fff; transition: border .15s; }
        .search-input:focus { border-color: #2563EB; }
        .save-btn { background: #2563EB; color: #fff; border: none; border-radius: 10px; padding: 11px 22px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; }
        .save-btn:hover:not(:disabled) { background: #1D4ED8; transform: translateY(-1px); }
        .save-btn:disabled { opacity: .6; cursor: not-allowed; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #2563EB; color: #fff; border: none; border-radius: 10px; padding: 11px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; box-shadow: 0 4px 12px rgba(37,99,235,.3); }
        .add-btn:hover { background: #1D4ED8; transform: translateY(-1px); }
        .cancel-btn { background: #F8FAFC; color: #64748B; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 11px 20px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; }
        .cancel-btn:hover { background: #F1F5F9; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .form-animate { animation: slideDown .2s ease; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card-animate { animation: fadeInUp .25s ease both; }
      `}</style>

      <div style={{ padding: '28px 28px 0' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-.4px', marginBottom: 3 }}>Produits & Services</h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>{produits.length} produit{produits.length > 1 ? 's' : ''} dans votre catalogue</p>
          </div>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {showForm ? 'Annuler' : 'Ajouter un produit'}
          </button>
        </div>

        {/* FORMULAIRE */}
        {showForm && (
          <div className="form-animate" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px', marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Nouveau produit</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Nom du produit *</label>
                  <input className="prod-input" name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: Riz 25kg, Toyota Corolla..." required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Catégorie</label>
                  <input className="prod-input" name="categorie" value={form.categorie} onChange={handleChange} placeholder="Alimentaire, Électronique..." />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Prix d'achat (FCFA) *</label>
                  <input className="prod-input" name="prixAchat" type="number" value={form.prixAchat} onChange={handleChange} placeholder="0" required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Prix de vente (FCFA) *</label>
                  <input className="prod-input" name="prixVente" type="number" value={form.prixVente} onChange={handleChange} placeholder="0" required />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Stock initial</label>
                  <input className="prod-input" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Description</label>
                  <input className="prod-input" name="description" value={form.description} onChange={handleChange} placeholder="Détails du produit..." />
                </div>
              </div>

              {/* Preview marge */}
              {form.prixAchat && form.prixVente && (
                <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)', border: '1px solid #DBEAFE', borderRadius: 12, padding: '14px 18px', marginBottom: 18, display: 'flex', gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 3 }}>Bénéfice par unité</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A' }}>+{benefice(+form.prixAchat, +form.prixVente).toLocaleString('fr-FR')} F</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 3 }}>Marge</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#2563EB' }}>{marge(+form.prixAchat, +form.prixVente)}%</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="save-btn" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer le produit'}</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH */}
        {produits.length > 0 && (
          <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." />
          </div>
        )}

        {/* LISTE */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 140, background: '#F8FAFC', borderRadius: 14, animation: 'pulse 1.5s infinite' }}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <EmptyIllustration />
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginTop: 20, marginBottom: 8 }}>
              {search ? 'Aucun résultat' : 'Votre catalogue est vide'}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 24 }}>
              {search ? `Aucun produit ne correspond à "${search}"` : 'Ajoutez votre premier produit pour commencer'}
            </p>
            {!search && <button className="add-btn" onClick={() => setShowForm(true)} style={{ display: 'inline-flex' }}>+ Ajouter un produit</button>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, paddingBottom: 32 }}>
            {filtered.map((p, i) => {
              const m = marge(p.prixAchat, p.prixVente)
              const margeColor = m >= 30 ? '#16A34A' : m >= 15 ? '#D97706' : '#DC2626'
              const stockColor = p.stock <= 2 ? '#DC2626' : p.stock <= 5 ? '#D97706' : '#16A34A'
              return (
                <div key={p.id} className="prod-card card-animate" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.75"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{p.nom}</div>
                        {p.categorie && <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{p.categorie}</div>}
                      </div>
                    </div>
                    <button className="del-btn" onClick={() => handleDelete(p.id)}
                      style={{ background: '#FEF2F2', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div style={{ background: '#F8FAFC', borderRadius: 9, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginBottom: 3 }}>ACHAT</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{p.prixAchat.toLocaleString('fr-FR')} F</div>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: 9, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginBottom: 3 }}>VENTE</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{p.prixVente.toLocaleString('fr-FR')} F</div>
                    </div>
                    <div style={{ background: '#F8FAFC', borderRadius: 9, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginBottom: 3 }}>MARGE</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: margeColor }}>{m}%</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: stockColor }}/>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Stock : <strong style={{ color: stockColor }}>{p.stock}</strong></span>
                      {p.stock <= 2 && <span style={{ fontSize: 10, background: '#FEF2F2', color: '#DC2626', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>Rupture</span>}
                    </div>
                    <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>+{(p.prixVente - p.prixAchat).toLocaleString('fr-FR')} F</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}