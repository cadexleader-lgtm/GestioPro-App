import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { path: '/ventes', label: 'Ventes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg> },
  { path: '/produits', label: 'Produits', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg> },
  { path: '/clients', label: 'Clients', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { path: '/stock', label: 'Stock', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg> },
  { path: '/rapports', label: 'Rapports', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { navigate('/login'); return }
    setUser(JSON.parse(u))
  }, [])

  const logout = () => { localStorage.clear(); navigate('/login') }
  const isActive = (p) => location.pathname === p
  const initials = user?.nom?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'GP'

  if (!user) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .gp-sidebar { display: flex !important; }
        .gp-bottom { display: none !important; }
        @media (max-width: 768px) {
          .gp-sidebar { display: none !important; }
          .gp-bottom { display: flex !important; }
          .gp-main { margin-left: 0 !important; }
        }
        .nav-btn:hover { background: rgba(255,255,255,.07) !important; color: rgba(255,255,255,.9) !important; }
        .nav-btn.active { background: rgba(37,99,235,.18) !important; color: #93C5FD !important; }
        .plan-upgrade:hover { background: #1D4ED8 !important; }
        .collapse-btn:hover { background: rgba(255,255,255,.12) !important; color: #fff !important; }
        .sidebar-user:hover { background: rgba(255,255,255,.04) !important; }
        .bottom-btn { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 0 8px; border: none; background: transparent; cursor: pointer; transition: color .15s; position: relative; }
        .bottom-icon-wrap { transition: transform .22s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      {/* SIDEBAR */}
      <aside className="gp-sidebar" style={{
        width: collapsed ? 64 : 248, background: '#0F172A',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        transition: 'width .22s cubic-bezier(.4,0,.2,1)',
        boxShadow: '1px 0 0 rgba(255,255,255,.05)', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', minHeight: 64 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#2563EB,#FACC15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>G</div>
          {!collapsed && <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-.3px' }}>Gestio<span style={{ color: '#FACC15' }}>Pro</span></span>}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.07)', border: 'none', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.4)', flexShrink: 0, transition: 'all .15s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}</svg>
          </button>
        </div>

        {/* Entreprise */}
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 10px 4px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }}/>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.entreprise || 'Mon Entreprise'}</div>
              <div style={{ fontSize: 11, color: '#FACC15', marginTop: 1 }}>{user.secteur || 'Commerce'}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflow: 'hidden' }}>
          {!collapsed && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', color: 'rgba(255,255,255,.22)', padding: '0 6px', marginBottom: 6 }}>NAVIGATION</div>}
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path)
            return (
              <button key={item.path} className={`nav-btn ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)} title={collapsed ? item.label : ''}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? '10px 0' : '9px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(37,99,235,.18)' : 'transparent',
                  color: active ? '#93C5FD' : 'rgba(255,255,255,.5)',
                  fontSize: 13.5, fontWeight: active ? 600 : 400,
                  fontFamily: "'Inter',sans-serif",
                  transition: 'all .14s', marginBottom: 2,
                  position: 'relative', textAlign: 'left',
                }}>
                {active && <div style={{ position: 'absolute', left: 0, top: '22%', bottom: '22%', width: 3, background: '#2563EB', borderRadius: '0 3px 3px 0' }}/>}
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Plan */}
        {!collapsed && (
          <div style={{ margin: '0 10px 12px', background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.22)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FACC15', marginBottom: 5 }}>⚡ Plan Gratuit</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.5, marginBottom: 10 }}>Passez au Pro pour débloquer tous les modules</p>
            <button className="plan-upgrade" onClick={() => navigate('/upgrade')}
              style={{ width: '100%', background: '#2563EB', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'background .15s' }}>
              Passer au Pro →
            </button>
          </div>
        )}

        {/* User */}
        <div className="sidebar-user" onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, padding: collapsed ? '14px 0' : '12px 14px', justifyContent: collapsed ? 'center' : 'flex-start', borderTop: '1px solid rgba(255,255,255,.06)', cursor: 'pointer', transition: 'background .15s' }}
          title="Se déconnecter">
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#FACC15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{initials}</div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.nom}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 1 }}>Se déconnecter</div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="gp-main" style={{ flex: 1, marginLeft: collapsed ? 64 : 248, transition: 'margin-left .22s cubic-bezier(.4,0,.2,1)', paddingBottom: 80, minHeight: '100vh' }}>
        {children}
      </main>

      {/* BOTTOM NAV MOBILE */}
      <nav className="gp-bottom" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E2E8F0', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,.06)' }}>
        {NAV_ITEMS.slice(0, 5).map(item => {
          const active = isActive(item.path)
          return (
            <button key={item.path} className="bottom-btn" onClick={() => navigate(item.path)}
              style={{ color: active ? '#2563EB' : '#94A3B8' }}>
              {active && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 2.5, background: '#FACC15', borderRadius: '0 0 3px 3px' }}/>}
              <div className="bottom-icon-wrap" style={{ transform: active ? 'translateY(-3px) scale(1.12)' : 'translateY(0) scale(1)' }}>{item.icon}</div>
              <span style={{ fontSize: 10, marginTop: 3, fontWeight: active ? 600 : 400, fontFamily: "'Inter',sans-serif" }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}