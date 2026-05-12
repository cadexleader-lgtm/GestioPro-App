import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  ArchiveX, BarChart3, Settings, LogOut, Bell,
  ChevronLeft, ChevronRight, Menu, X, Plus,
  TrendingUp, Zap
} from 'lucide-react'
import { PlusBottomSheet } from '../pages/Plus'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/ventes',    label: 'Ventes',          icon: ShoppingCart },
  { path: '/produits',  label: 'Produits',         icon: Package },
  { path: '/clients',   label: 'Clients',          icon: Users },
  { path: '/stock',     label: 'Stock',            icon: ArchiveX },
  { path: '/rapports',  label: 'Rapports',         icon: BarChart3 },
  { path: '/settings',  label: 'Paramètres',       icon: Settings },
  { path: '/plus',      label: 'Plus',             icon: Plus },
]

const BOTTOM_NAV = [
  { path: '/dashboard', label: 'Accueil',  icon: LayoutDashboard },
  { path: '/ventes',    label: 'Ventes',   icon: ShoppingCart },
  { path: '/produits',  label: 'Produits', icon: Package },
  { path: '/clients',   label: 'Clients',  icon: Users },
  { path: '/stock',     label: 'Stock',    icon: ArchiveX },
  { path: '/settings',  label: 'Paramètres', icon: Settings },
  { path: '/plus',      label: 'Plus',     icon: Plus },
]

export default function Layout({ children }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [user, setUser]           = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [plusOpen, setPlusOpen]   = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) { navigate('/login'); return }
    setUser(JSON.parse(u))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu mobile au changement de page
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const logout = () => { localStorage.clear(); navigate('/login') }
  const isActive = (p) => location.pathname === p
  const initials = user?.nom?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'GP'

  if (!user) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4FA', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }

        /* Sidebar desktop */
        .gp-sidebar { display: flex !important; }
        .gp-bottom  { display: none !important; }

        /* Hover nav items */
        .nav-item:hover {
          background: rgba(37,99,235,.07) !important;
          color: #2563EB !important;
        }
        .nav-item:hover .nav-icon-wrap {
          background: rgba(37,99,235,.12) !important;
          color: #2563EB !important;
        }

        /* Hover boutons */
        .btn-primary:hover { background: #1D4ED8 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,.4) !important; }
        .btn-primary:active { transform: translateY(0) !important; }
        .logout-btn:hover { background: rgba(239,68,68,.08) !important; color: #EF4444 !important; }
        .collapse-btn:hover { background: #EFF6FF !important; color: #2563EB !important; }
        .nav-settings:hover { background: rgba(100,116,139,.07) !important; color: #475569 !important; }

        /* Mobile */
        @media (max-width: 768px) {
          .gp-sidebar { display: none !important; }
          .gp-bottom  { display: flex !important; }
          .gp-main    { margin-left: 0 !important; }
          .topbar-new-sale { display: flex !important; }
        }
        @media (min-width: 769px) {
          .topbar-new-sale { display: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          SIDEBAR DESKTOP
      ══════════════════════════════════════════════ */}
      <motion.aside
        className="gp-sidebar"
        animate={{ width: collapsed ? 68 : 248 }}
        transition={{ duration: .22, ease: [.4, 0, .2, 1] }}
        style={{
          background: '#fff',
          borderRight: '1px solid #E2E8F0',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', boxShadow: '4px 0 24px rgba(15,23,42,.04)',
        }}
      >
        {/* Décor haut */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #2563EB, #38BDF8, #2563EB)', backgroundSize: '200% 100%' }}/>

        {/* Logo */}
        <div style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '0' : '0 14px 0 16px', borderBottom: '1px solid #F1F5F9', flexShrink: 0, marginTop: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400 }}
              style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563EB,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,.35)' }}>
              G
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .18 }}
                  style={{ fontFamily: "'Outfit',sans-serif", fontSize: 19, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', letterSpacing: '-.3px' }}>
                  Gestio<span style={{ color: '#2563EB' }}>Pro</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: .9 }}
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: 28, height: 28, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', flexShrink: 0, transition: 'all .15s' }}>
            {collapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
          </motion.button>
        </div>

        {/* Carte entreprise */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .2 }}
              style={{ margin: '12px 12px 4px', background: 'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border: '1px solid #BFDBFE', borderRadius: 12, padding: '10px 13px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,.5)' }}/>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B', letterSpacing: '.06em' }}>EN LIGNE</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.entreprise || 'Mon Entreprise'}</div>
              <div style={{ fontSize: 11.5, color: '#2563EB', fontWeight: 500, marginTop: 2 }}>{user.secteur || 'Commerce'}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: collapsed ? '14px 6px' : '14px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#94A3B8', padding: '0 8px', marginBottom: 8 }}>
                MENU PRINCIPAL
              </motion.div>
            )}
          </AnimatePresence>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path)
            const Icon   = item.icon
            return (
              <motion.button key={item.path} className="nav-item"
                onClick={() => {
                  if (item.path === '/plus') {
                    navigate(item.path)
                  } else {
                    navigate(item.path)
                  }
                }}
                title={collapsed ? item.label : ''}
                whileTap={{ scale: .97 }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 10, padding: collapsed ? '10px 0' : '9px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(37,99,235,.08)' : 'transparent',
                  color: active ? '#2563EB' : '#64748B',
                  fontSize: 13.5, fontWeight: active ? 600 : 500,
                  fontFamily: "'DM Sans',sans-serif",
                  marginBottom: 2, position: 'relative', textAlign: 'left',
                  transition: 'color .14s, background .14s',
                }}>
                {active && (
                  <motion.div layoutId="activeBar"
                    style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, background: '#2563EB', borderRadius: '0 4px 4px 0' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}/>
                )}
                <div className="nav-icon-wrap" style={{ width: 32, height: 32, borderRadius: 9, background: active ? 'rgba(37,99,235,.1)' : '#F8FAFC', border: `1px solid ${active ? 'rgba(37,99,235,.2)' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .14s', color: active ? '#2563EB' : '#94A3B8' }}>
                  <Icon size={16} strokeWidth={active ? 2 : 1.75}/>
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && !collapsed && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', marginLeft: 'auto' }}/>
                )}
              </motion.button>
            )
          })}

        </nav>

        {/* Plan upgrade */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ margin: '0 10px 12px', background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1px solid #BFDBFE', borderRadius: 13, padding: '14px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Zap size={13} color="#FACC15" fill="#FACC15"/>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8' }}>Plan Gratuit</span>
              </div>
              <p style={{ fontSize: 11.5, color: '#3B82F6', lineHeight: 1.5, marginBottom: 10 }}>Débloquez tous les modules avec le Plan Pro</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
                style={{ width: '100%', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', border: 'none', borderRadius: 9, padding: '8px', color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 12px rgba(37,99,235,.3)' }}>
                Passer au Pro →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User */}
        <motion.div whileTap={{ scale: .97 }} className="logout-btn" onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, padding: collapsed ? '14px 0' : '12px 14px', justifyContent: collapsed ? 'center' : 'flex-start', borderTop: '1px solid #F1F5F9', cursor: 'pointer', transition: 'all .15s', flexShrink: 0 }}
          title="Se déconnecter">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials}</div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.nom}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Se déconnecter</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && <LogOut size={15} color="#CBD5E1"/>}
        </motion.div>
      </motion.aside>

      {/* ══════════════════════════════════════════════
          OVERLAY MOBILE
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.4)', backdropFilter: 'blur(4px)', zIndex: 60 }}/>
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, background: '#fff', borderRight: '1px solid #E2E8F0', zIndex: 70, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ height: 3, background: 'linear-gradient(90deg,#2563EB,#38BDF8)' }}/>
              <div style={{ height: 65, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#2563EB,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff' }}>G</div>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Gestio<span style={{ color: '#2563EB' }}>Pro</span></span>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  <X size={16}/>
                </button>
              </div>
              <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
                {[...NAV_ITEMS, { path: '/parametres', label: 'Paramètres', icon: Settings }].map((item) => {
                  const active = isActive(item.path)
                  const Icon   = item.icon
                  return (
                    <button key={item.path} onClick={() => navigate(item.path)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11, border: 'none', cursor: 'pointer', background: active ? 'rgba(37,99,235,.08)' : 'transparent', color: active ? '#2563EB' : '#64748B', fontSize: 14, fontWeight: active ? 600 : 500, fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>
                      <Icon size={18} strokeWidth={active ? 2 : 1.75}/>
                      {item.label}
                    </button>
                  )
                })}
              </nav>
              <div style={{ padding: '12px 14px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{user.nom}</div>
                  <button onClick={logout} style={{ fontSize: 11, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans',sans-serif" }}>Se déconnecter</button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════ */}
      <div className="gp-main" style={{ flex: 1, marginLeft: collapsed ? 68 : 248, transition: 'margin-left .22s cubic-bezier(.4,0,.2,1)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* TOPBAR */}
        <motion.header
          style={{ height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 40, transition: 'all .2s', background: scrolled ? 'rgba(240,244,250,.9)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid rgba(226,232,240,.8)' : '1px solid transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Burger mobile */}
            <motion.button whileTap={{ scale: .9 }} onClick={() => setMobileOpen(true)}
              style={{ display: 'none', width: 36, height: 36, borderRadius: 9, background: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}
              className="mobile-burger">
              <Menu size={18}/>
            </motion.button>
            {/* Page title */}
            <div>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#0F172A', letterSpacing: '-.3px' }}>
                {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'GestioPro'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Indicateur en ligne */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 100, padding: '5px 12px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 2px rgba(34,197,94,.25)' }}/>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>En ligne</span>
            </div>

            {/* Bell */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .93 }}
              style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <Bell size={17} strokeWidth={1.75}/>
              <div style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#EF4444', border: '1.5px solid #F0F4FA' }}/>
            </motion.button>

            {/* CTA Nouvelle vente */}
            <motion.button whileHover={{ scale: 1.02, translateY: -1 }} whileTap={{ scale: .97 }}
              className="btn-primary"
              onClick={() => navigate('/ventes/new')}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 14px rgba(37,99,235,.3)', transition: 'all .15s' }}>
              <Plus size={15} strokeWidth={2.5}/> Nouvelle vente
            </motion.button>

            {/* Bouton + mobile */}
            <motion.button whileTap={{ scale: .9 }} className="topbar-new-sale"
              onClick={() => navigate('/ventes/new')}
              style={{ display: 'none', width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', border: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,.35)' }}>
              <Plus size={18}/>
            </motion.button>
          </div>
        </motion.header>

        {/* PAGE CONTENT */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: [.4,0,.2,1] }} key={location.pathname}
          style={{ flex: 1, paddingBottom: 90 }}>
          {children}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM NAV MOBILE
      ══════════════════════════════════════════════ */}
      <nav className="gp-bottom"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E2E8F0', zIndex: 100, boxShadow: '0 -4px 20px rgba(15,23,42,.06)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item.path)
          const Icon   = item.icon
          return (
            <motion.button key={item.path} className="bottom-nav-btn"
              onClick={() => {
                if (item.path === '/plus') {
                  setPlusOpen(true)
                } else {
                  navigate(item.path)
                }
              }}
              whileTap={{ scale: .88 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: active ? '#2563EB' : '#94A3B8', position: 'relative', fontFamily: "'DM Sans',sans-serif" }}>
              {/* Indicateur haut */}
              <AnimatePresence>
                {active && (
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                    style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 2.5, background: '#2563EB', borderRadius: '0 0 4px 4px' }}/>
                )}
              </AnimatePresence>
              {/* Icône */}
              <motion.div animate={{ y: active ? -2 : 0, scale: active ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                <div style={{ width: 34, height: 28, borderRadius: 8, background: active ? 'rgba(37,99,235,.1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}>
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.75}/>
                </div>
              </motion.div>
              <span style={{ fontSize: 10, marginTop: 2, fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      {/* Fix mobile burger display */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-burger { display: flex !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          BOTTOM SHEET PLUS MOBILE
      ══════════════════════════════════════════════ */}
      <PlusBottomSheet open={plusOpen} onClose={() => setPlusOpen(false)} />
    </div>
  )
}
