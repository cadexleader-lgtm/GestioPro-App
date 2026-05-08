const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
import { useState } from 'react'
import axios from 'axios'

const SECTEURS = ['Commerce / Retail', 'Agriculture', 'Santé / Clinique', 'Restauration', 'Éducation', 'Transport', 'BTP / Construction', 'Services / Salons', 'Hôtellerie', 'Assurance']
const SECTEUR_ICONS = { 'Commerce / Retail': '🛒', 'Agriculture': '🌱', 'Santé / Clinique': '🏥', 'Restauration': '🍽️', 'Éducation': '🎓', 'Transport': '🚚', 'BTP / Construction': '🏗️', 'Services / Salons': '✂️', 'Hôtellerie': '🏨', 'Assurance': '🛡️' }

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ nom: '', email: '', password: '', telephone: '', entreprise: '', secteur: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${API}/api/auth/register`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/dashboard'
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la création du compte')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC', fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .reg-input { width: 100%; padding: 12px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; font-family: 'Inter',sans-serif; color: #0F172A; background: #fff; outline: none; transition: border .15s, box-shadow .15s; }
        .reg-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
        .sector-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1.5px solid #E2E8F0; border-radius: 12px; cursor: pointer; background: #fff; font-size: 13.5px; font-weight: 500; color: #475569; font-family: 'Inter',sans-serif; transition: all .15s; text-align: left; width: 100%; }
        .sector-btn:hover { border-color: #CBD5E1; background: #F8FAFC; }
        .sector-btn.selected { border-color: #2563EB; background: #EFF6FF; color: #1D4ED8; font-weight: 600; }
        .next-btn { width: 100%; background: #2563EB; color: #fff; border: none; border-radius: 10px; padding: 13px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; box-shadow: 0 4px 12px rgba(37,99,235,.3); }
        .next-btn:hover:not(:disabled) { background: #1D4ED8; transform: translateY(-1px); }
        .next-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in { animation: slideIn .25s ease; }
      `}</style>

      {/* GAUCHE DÉCO */}
      <div style={{ flex: '0 0 42%', background: '#0F172A', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '52px' }} className="reg-left">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(37,99,235,.15)' }}/>
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,.06) 0%, transparent 70%)' }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#FACC15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#fff' }}>G</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-.4px' }}>Gestio<span style={{ color: '#FACC15' }}>Pro</span></span>
        </div>

        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-.4px' }}>
          Rejoignez des<br/>milliers de PME<br/><span style={{ color: '#FACC15' }}>qui progressent.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, lineHeight: 1.7, maxWidth: 280, marginBottom: 36 }}>
          Créez votre compte gratuitement et commencez à gérer votre business comme un pro.
        </p>

        {/* Steps indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['1', 'Vos informations', 'Nom, email et mot de passe'], ['2', 'Votre secteur', 'Choisissez votre activité'], ['3', 'Votre entreprise', 'Nom et numéro']].map(([n, t, s], i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i + 1 ? '#16A34A' : step === i + 1 ? '#2563EB' : 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .3s' }}>
                {step > i + 1
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize: 13, fontWeight: 700, color: step === i + 1 ? '#fff' : 'rgba(255,255,255,.3)' }}>{n}</span>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: step === i + 1 ? '#fff' : 'rgba(255,255,255,.4)' }}>{t}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DROITE — FORMULAIRE */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Progress bar */}
          <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#2563EB', borderRadius: 2, width: `${(step / 3) * 100}%`, transition: 'width .4s cubic-bezier(.4,0,.2,1)' }}/>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="slide-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 6, letterSpacing: '-.4px' }}>Créer votre compte</h2>
              <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24 }}>Gratuit pour toujours · Aucune carte requise</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Nom complet *</label>
                  <input className="reg-input" name="nom" value={form.nom} onChange={handleChange} placeholder="HAZOUME Clarence Alvin" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Adresse email *</label>
                  <input className="reg-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Mot de passe *</label>
                  <input className="reg-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 caractères" />
                </div>
              </div>
              <button className="next-btn" disabled={!form.nom || !form.email || !form.password} onClick={() => setStep(2)} style={{ marginTop: 24 }}>
                Continuer →
              </button>
            </div>
          )}

          {/* STEP 2 — Secteur */}
          {step === 2 && (
            <div className="slide-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 6, letterSpacing: '-.4px' }}>Votre secteur d'activité</h2>
              <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 20 }}>L'interface s'adaptera à votre métier</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
                {SECTEURS.map(s => (
                  <button key={s} className={`sector-btn ${form.secteur === s ? 'selected' : ''}`} onClick={() => setForm({ ...form, secteur: s })}>
                    <span style={{ fontSize: 20 }}>{SECTEUR_ICONS[s]}</span>
                    <span style={{ fontSize: 12.5 }}>{s}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>← Retour</button>
                <button className="next-btn" disabled={!form.secteur} onClick={() => setStep(3)} style={{ flex: 2 }}>Continuer →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Entreprise */}
          {step === 3 && (
            <div className="slide-in">
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 6, letterSpacing: '-.4px' }}>Votre entreprise</h2>
              <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24 }}>Presque terminé !</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Nom de l'entreprise *</label>
                  <input className="reg-input" name="entreprise" value={form.entreprise} onChange={handleChange} placeholder="Super Marché Gbéto, GestioPro..." />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>Téléphone</label>
                  <input className="reg-input" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+229 56 50 13 48" />
                </div>
                {/* Récap */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 10, letterSpacing: '.05em' }}>RÉCAPITULATIF</div>
                  {[['Nom', form.nom], ['Email', form.email], ['Secteur', `${SECTEUR_ICONS[form.secteur]} ${form.secteur}`]].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: '#64748B' }}>{l}</span>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: '#F8FAFC', color: '#64748B', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>← Retour</button>
                <button className="next-btn" disabled={!form.entreprise || loading} onClick={handleSubmit} style={{ flex: 2 }}>
                  {loading ? 'Création...' : '🎉 Créer mon compte'}
                </button>
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 24 }}>
            Déjà un compte ? <a href="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Se connecter</a>
          </p>
        </div>
      </div>

      <style>{`.reg-left { display: flex !important; } @media (max-width: 768px) { .reg-left { display: none !important; } }`}</style>
    </div>
  )
}