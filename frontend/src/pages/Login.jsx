const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/dashboard'
    } catch {
      setError('Email ou mot de passe incorrect')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-input { width: 100%; padding: 12px 16px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; font-family: 'Inter',sans-serif; color: #0F172A; background: #fff; outline: none; transition: border .15s, box-shadow .15s; }
        .login-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
        .login-btn { width: 100%; background: #2563EB; color: #fff; border: none; border-radius: 10px; padding: 13px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .15s; letter-spacing: .01em; }
        .login-btn:hover:not(:disabled) { background: #1D4ED8; box-shadow: 0 4px 14px rgba(37,99,235,.35); transform: translateY(-1px); }
        .login-btn:disabled { opacity: .6; cursor: not-allowed; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 26px; font-weight: 800; color: #FACC15; margin-bottom: 4px; }
        .stat-label { font-size: 11px; color: rgba(255,255,255,.45); line-height: 1.4; }
        @media (max-width: 768px) { .login-left { display: none !important; } }
      `}</style>

      {/* GAUCHE — Bleu nuit */}
      <div className="login-left" style={{ flex: '0 0 44%', background: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px', position: 'relative', overflow: 'hidden' }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(37,99,235,.15)' }}/>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(250,204,21,.08)' }}/>
        <div style={{ position: 'absolute', bottom: -140, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,.08) 0%, transparent 70%)' }}/>

        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#FACC15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#fff' }}>G</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-.4px' }}>Gestio<span style={{ color: '#FACC15' }}>Pro</span></span>
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 18, letterSpacing: '-.5px' }}>
            Votre business,<br/>maîtrisé à la<br/><span style={{ color: '#FACC15' }}>perfection.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
            Gérez vos ventes, stock et clients depuis un seul outil pensé pour les PME d'Afrique de l'Ouest.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Tableau de bord en temps réel', 'Calcul automatique des marges', 'Rapports PDF en 1 clic', 'Fonctionne sans Internet'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(37,99,235,.3)', border: '1px solid rgba(37,99,235,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bas */}
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 28 }}>
          {[['90%', 'des PME sans\nlogiciel adapté'], ['10+', 'secteurs\ncouverts'], ['2026', 'lancement\nau Bénin']].map(([n, l], i) => (
            <div key={n} className="stat-item" style={{ flex: 1, paddingRight: i < 2 ? 24 : 0, borderRight: i < 2 ? '1px solid rgba(255,255,255,.08)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l.split('\n').map((line, j) => <span key={j} style={{ display: 'block' }}>{line}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DROITE — Formulaire */}
      <div style={{ flex: 1, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header mobile */}
          <div style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 32 }} className="mobile-logo">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#FACC15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#fff' }}>G</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Gestio<span style={{ color: '#2563EB' }}>Pro</span></span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 6, letterSpacing: '-.4px' }}>Bon retour 👋</h2>
            <p style={{ color: '#64748B', fontSize: 14, fontWeight: 400 }}>Connectez-vous à votre espace</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Adresse email</label>
              <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com" required />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Mot de passe</label>
                <a href="/forgot" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>Oublié ?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input className="login-input" type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ paddingRight: 46 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                  {showPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Connexion en cours...' : 'Se connecter →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#64748B', marginTop: 24 }}>
            Pas encore de compte ?{' '}
            <a href="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Créer un compte gratuit</a>
          </p>

          {/* Badge sécurité */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32, color: '#94A3B8' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Connexion sécurisée SSL · Données chiffrées</span>
          </div>
        </div>
      </div>
    </div>
  )
}