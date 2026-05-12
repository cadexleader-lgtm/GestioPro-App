import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, Receipt, Users2, Shield, BarChart3, History, Settings, CreditCard, Bell, Lock, Database, Tag, Heart, MessageCircle, Gift, Share2, QrCode, FileText, Upload, BookOpen, Code, Headphones, X, ChevronRight, Sparkles, Layers, TrendingUp, Zap } from 'lucide-react'
import Layout from '../components/Layout'

const SECTIONS = [
  {
    title: 'Gestion Business', color: '#2563EB', bg: 'rgba(37,99,235,0.08)', icon: Layers,
    items: [
      { icon: Truck,      label: 'Fournisseurs',       path: '/fournisseurs',  soon: true },
      { icon: Receipt,    label: 'Dépenses',            path: '/depenses',      soon: true },
      { icon: Users2,     label: 'Employés',            path: '/employes',      soon: true },
      { icon: Shield,     label: 'Rôles & permissions', path: '/roles',         soon: true },
      { icon: BarChart3,  label: 'Rapports',            path: '/rapports',      soon: false },
      { icon: History,    label: 'Historique activité', path: '/historique',    soon: true },
    ]
  },
  {
    title: 'Administration', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', icon: Settings,
    items: [
      { icon: Settings,   label: 'Paramètres',    path: '/parametres',   soon: false },
      { icon: CreditCard, label: 'Abonnement',    path: '/abonnement',   soon: true },
      { icon: Bell,       label: 'Notifications', path: '/notifications', soon: true },
      { icon: Lock,       label: 'Sécurité',      path: '/securite',     soon: true },
      { icon: Database,   label: 'Sauvegardes',   path: '/sauvegardes',  soon: true },
    ]
  },
  {
    title: 'Croissance', color: '#16A34A', bg: 'rgba(22,163,74,0.08)', icon: TrendingUp,
    items: [
      { icon: Tag,          label: 'Promotions',          path: '/promotions',  soon: true },
      { icon: Heart,        label: 'Fidélité client',     path: '/fidelite',    soon: true },
      { icon: MessageCircle,label: 'Campagnes WhatsApp',  path: '/campagnes',   soon: true },
      { icon: Gift,         label: 'Cartes cadeaux',      path: '/cadeaux',     soon: true },
      { icon: Share2,       label: 'Parrainage',          path: '/parrainage',  soon: true },
    ]
  },
  {
    title: 'Outils', color: '#D97706', bg: 'rgba(217,119,6,0.08)', icon: Zap,
    items: [
      { icon: QrCode,    label: 'Scanner QR',       path: '/scanner',   soon: true },
      { icon: Upload,    label: 'Import / Export',  path: '/import',    soon: true },
      { icon: BookOpen,  label: 'Journal système',  path: '/journal',   soon: true },
      { icon: Code,      label: 'API',              path: '/api',       soon: true },
      { icon: Headphones,label: 'Support',          path: '/support',   soon: true },
    ]
  },
]

function Card({ item, color, bg, onClick }) {
  const Icon = item.icon
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: '24px 20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <Icon size={22} color={color} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#0F172A',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 4
        }}>
          {item.label}
        </div>
        {item.soon && (
          <div style={{
            fontSize: 12,
            color: '#64748B',
            fontWeight: 500,
            background: 'rgba(100,116,139,0.1)',
            padding: '2px 8px',
            borderRadius: 8,
            display: 'inline-block',
            border: '1px solid rgba(100,116,139,0.2)'
          }}>
            Bientôt disponible
          </div>
        )}
        {!item.soon && (
          <div style={{
            fontSize: 12,
            color: '#64748B',
            fontWeight: 500
          }}>
            Fonctionnalité active
          </div>
        )}
      </div>
      {!item.soon && (
        <motion.div
          whileHover={{ x: 2 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 12,
            background: 'rgba(37,99,235,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(37,99,235,0.2)'
          }}
        >
          <ChevronRight size={16} color="#2563EB" />
        </motion.div>
      )}
      {item.soon && (
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#CBD5E1',
          flexShrink: 0
        }} />
      )}
    </motion.div>
  )
}

export default function Plus() {
  const navigate = useNavigate()

  const handleClick = (item) => {
    if (!item.soon) navigate(item.path)
  }

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap');

        * {
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        .plus-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 80%, rgba(37,99,235,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(124,58,237,0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(22,163,74,0.02) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        .plus-header {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 32px;
          padding: 40px 32px;
          margin-bottom: 48px;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.04),
            0 0 0 1px rgba(255,255,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px 0;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .plus-header {
            padding: 32px 20px;
            margin-bottom: 32px;
            border-radius: 24px;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .section-header {
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* Background premium */}
      <div className="plus-background" />

      <div style={{ padding: '32px 32px 64px', position: 'relative', zIndex: 1 }}>
        {/* Header premium */}
        <motion.div
          className="plus-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              <Sparkles size={28} color="#fff" />
            </motion.div>
            <div>
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-.5px',
                margin: 0,
                marginBottom: 4
              }}>
                Plus
              </h1>
              <div style={{
                fontSize: 14,
                color: '#64748B',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 8px rgba(34,197,94,0.5)'
                }} />
                Fonctionnalités avancées de GestioPro
              </div>
            </div>
          </div>
          <p style={{
            fontSize: 16,
            color: '#475569',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '600px'
          }}>
            Découvrez toutes les fonctionnalités premium pour optimiser votre gestion d'entreprise.
            Modules avancés, outils d'analyse et fonctionnalités de croissance.
          </p>
        </motion.div>

        {/* Sections */}
        {SECTIONS.map((section, si) => {
          const SectionIcon = section.icon
          return (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ marginBottom: 48 }}
            >
              <div className="section-header">
                <div
                  className="section-icon"
                  style={{ background: section.bg, border: `1px solid ${section.color}20` }}
                >
                  <SectionIcon size={20} color={section.color} />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0,
                    marginBottom: 2
                  }}>
                    {section.title}
                  </h2>
                  <p style={{
                    fontSize: 13,
                    color: '#64748B',
                    fontWeight: 500,
                    margin: 0
                  }}>
                    {section.title === 'Gestion Business' && 'Gérez vos opérations quotidiennes'}
                    {section.title === 'Administration' && 'Contrôlez et sécurisez votre plateforme'}
                    {section.title === 'Croissance' && 'Développez votre activité'}
                    {section.title === 'Outils' && 'Optimisez votre productivité'}
                  </p>
                </div>
              </div>
              <div className="cards-grid">
                {section.items.map((item, ii) => (
                  <motion.div
                    key={ii}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (si * 0.1) + (ii * 0.05), duration: 0.3 }}
                  >
                    <Card
                      item={item}
                      color={section.color}
                      bg={section.bg}
                      onClick={() => handleClick(item)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Layout>
  )
}

// ── BOTTOM SHEET MOBILE (à intégrer dans Layout.jsx) ──────────────
// Exporte aussi ce composant pour l'utiliser dans Layout
export function PlusBottomSheet({ open, onClose }) {
  const navigate = useNavigate()

  const ALL_ITEMS = SECTIONS.flatMap(s => s.items.map(i => ({ ...i, color: s.color, bg: s.bg, sectionTitle: s.title })))

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP PREMIUM */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.6)',
              backdropFilter: 'blur(20px)',
              zIndex: 300,
            }}
          />

          {/* BOTTOM SHEET ULTRA MODERN */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 35,
              mass: 0.8
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(event, info) => {
              if (info.offset.y > 100) {
                onClose()
              }
            }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '85vh',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px 32px 0 0',
              zIndex: 301,
              display: 'flex',
              flexDirection: 'column',
              boxShadow:
                '0 -8px 40px rgba(0,0,0,0.15), ' +
                '0 0 0 1px rgba(255,255,255,0.2), ' +
                'inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {/* DRAG HANDLE PREMIUM */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 20px 8px',
              position: 'relative'
            }}>
              <motion.div
                style={{
                  width: 48,
                  height: 6,
                  borderRadius: 3,
                  background: 'rgba(148,163,184,0.4)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 16,
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  zIndex: 10
                }}
              >
                <X size={18} color="#64748B" />
              </motion.button>
            </div>

            {/* HEADER PREMIUM */}
            <div style={{
              padding: '0 24px 24px',
              borderBottom: '1px solid rgba(226,232,240,0.5)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Sparkles size={24} color="#fff" />
                </motion.div>
                <div>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-.3px'
                  }}>
                    Plus
                  </h3>
                  <p style={{
                    fontSize: 14,
                    color: '#64748B',
                    fontWeight: 500,
                    margin: 0,
                    marginTop: 2
                  }}>
                    Fonctionnalités avancées
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT SCROLLABLE */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 20px 32px',
              WebkitOverflowScrolling: 'touch'
            }}>
              {SECTIONS.map((section, si) => {
                const SectionIcon = section.icon
                return (
                  <motion.div
                    key={si}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: si * 0.08, duration: 0.4 }}
                    style={{ marginBottom: 32 }}
                  >
                    {/* SECTION HEADER */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 16,
                      padding: '8px 0'
                    }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          background: section.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          border: `1px solid ${section.color}20`
                        }}
                      >
                        <SectionIcon size={18} color={section.color} />
                      </div>
                      <div>
                        <h4 style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#0F172A',
                          margin: 0,
                          marginBottom: 2
                        }}>
                          {section.title}
                        </h4>
                        <p style={{
                          fontSize: 12,
                          color: '#64748B',
                          fontWeight: 500,
                          margin: 0
                        }}>
                          {section.title === 'Gestion Business' && 'Opérations quotidiennes'}
                          {section.title === 'Administration' && 'Contrôle & sécurité'}
                          {section.title === 'Croissance' && 'Développement'}
                          {section.title === 'Outils' && 'Productivité'}
                        </p>
                      </div>
                    </div>

                    {/* MODULES GRID */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 12
                    }}>
                      {section.items.map((item, ii) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={ii}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: (si * 0.08) + (ii * 0.03),
                              duration: 0.3,
                              type: 'spring',
                              stiffness: 300
                            }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => {
                              if (!item.soon) {
                                navigate(item.path)
                                onClose()
                              }
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 8,
                              padding: '16px 8px',
                              borderRadius: 16,
                              background: item.soon ? 'rgba(241,245,249,0.6)' : 'rgba(255,255,255,0.8)',
                              backdropFilter: 'blur(12px)',
                              border: item.soon ? '1px solid rgba(226,232,240,0.5)' : '1px solid rgba(255,255,255,0.3)',
                              cursor: item.soon ? 'default' : 'pointer',
                              opacity: item.soon ? 0.7 : 1,
                              position: 'relative',
                              boxShadow: item.soon ? 'none' : '0 4px 16px rgba(0,0,0,0.04)',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          >
                            {/* ICON CONTAINER */}
                            <div style={{
                              width: 48,
                              height: 48,
                              borderRadius: 14,
                              background: item.soon ? 'rgba(148,163,184,0.1)' : section.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: item.soon ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
                              border: item.soon ? '1px solid rgba(148,163,184,0.2)' : `1px solid ${section.color}20`,
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                              <Icon size={22} color={item.soon ? '#94A3B8' : section.color} strokeWidth={1.5} />

                              {/* SUBTLE GLOW */}
                              {!item.soon && (
                                <div style={{
                                  position: 'absolute',
                                  inset: -2,
                                  borderRadius: 16,
                                  background: `linear-gradient(135deg, ${section.color}10, transparent)`,
                                  zIndex: -1
                                }} />
                              )}
                            </div>

                            {/* LABEL */}
                            <span style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: item.soon ? '#94A3B8' : '#334155',
                              textAlign: 'center',
                              lineHeight: 1.3,
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {item.label}
                            </span>

                            {/* BADGE FOR SOON */}
                            {item.soon && (
                              <div style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#CBD5E1',
                                border: '1px solid rgba(255,255,255,0.5)'
                              }} />
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}