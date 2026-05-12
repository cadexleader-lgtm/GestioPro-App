import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Phone, Mail, MapPin, Upload, Globe,
  Moon, Sun, Bell, BellOff, Shield, Users,
  CreditCard, Key, LogOut, ChevronRight, Save,
  CheckCircle, AlertCircle, Loader2, Camera
} from 'lucide-react'
import Layout from '../components/Layout'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

export default function Settings() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({
    companyName: '',
    companyPhone: '',
    companyEmail: '',
    companyAddress: '',
    companyLogo: '',
    sector: 'Commerce',
    currency: 'XAF',
    darkMode: false,
    stockAlert: true,
    whatsappNotifications: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) return

    setUser(JSON.parse(u))
    loadSettings(t)
  }, [])

  const loadSettings = async (token) => {
    try {
      const response = await axios.get(`${API}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSettings(response.data)
    } catch (error) {
      console.error('Erreur chargement paramètres:', error)
      showToast('Erreur lors du chargement des paramètres', 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API}/api/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSettings(response.data.settings)
      showToast('Paramètres sauvegardés avec succès', 'success')

      // Mettre à jour le nom d'entreprise dans le localStorage si changé
      if (settings.companyName !== user.entreprise) {
        const updatedUser = { ...user, entreprise: settings.companyName }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      showToast(error.response?.data?.message || 'Erreur lors de la sauvegarde', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Simulation d'upload - en production, utiliser un service comme Cloudinary
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('companyLogo', e.target.result)
        showToast('Logo mis à jour', 'success')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap');

        * {
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        .settings-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 25% 25%, rgba(37,99,235,0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(22,163,74,0.03) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(147,51,234,0.02) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }

        .settings-card {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 24px;
          padding: 24px;
          box-shadow:
            0 4px 20px rgba(0,0,0,0.04),
            0 0 0 1px rgba(255,255,255,0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .settings-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 20px 40px rgba(0,0,0,0.08),
            0 0 0 1px rgba(255,255,255,0.1),
            0 8px 24px rgba(0,0,0,0.04);
          border-color: rgba(255,255,255,0.3);
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(203,213,225,0.6);
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
        }

        .input-field:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: rgba(255,255,255,0.95);
        }

        .select-field {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(203,213,225,0.6);
          border-radius: 24px;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        input:checked + .toggle-slider {
          background: #2563EB;
          box-shadow: 0 0 0 1px rgba(37,99,235,0.2);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(37,99,235,0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.4);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          color: #475569;
          border: 1px solid rgba(203,213,225,0.6);
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(37,99,235,0.3);
          color: #2563EB;
        }

        .toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .toast.success {
          background: rgba(22,163,74,0.9);
          color: white;
        }

        .toast.error {
          background: rgba(239,68,68,0.9);
          color: white;
        }

        .logo-upload {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: rgba(241,245,249,0.6);
          border: 2px dashed rgba(203,213,225,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .logo-upload:hover {
          border-color: #2563EB;
          background: rgba(37,99,235,0.05);
        }

        .logo-upload img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .skeleton {
          background: linear-gradient(90deg, rgba(241,245,249,0.6) 25%, rgba(241,245,249,0.3) 50%, rgba(241,245,249,0.6) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Mobile First */
        @media (max-width: 768px) {
          .settings-card {
            padding: 20px;
            border-radius: 20px;
          }

          .input-field {
            padding: 14px 16px;
            font-size: 16px; /* Prevent zoom on iOS */
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* Background premium */}
      <div className="settings-background" />

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast ${toast.type}`}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ padding: '24px 20px 80px', position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: 32 }}
        >
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 32,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-.5px',
            marginBottom: 8
          }}>
            Paramètres
          </h1>
          <p style={{
            fontSize: 16,
            color: '#64748B',
            marginBottom: 24
          }}>
            Gérez les paramètres de votre entreprise et de votre compte
          </p>

          {/* Bouton sauvegarder */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveSettings}
            disabled={saving}
            className="btn-primary"
            style={{
              background: saving ? 'rgba(203,213,225,0.6)' : undefined,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : undefined
            }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </motion.button>
        </motion.div>

        {loading ? (
          <motion.div
            className="settings-grid"
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 400px',
              gap: 24
            }}
          >
            {/* Skeleton loading */}
            {[1,2,3,4,5].map(i => (
              <motion.div key={i} variants={fadeUp} className="settings-card">
                <div style={{ height: 24, width: 120 }} className="skeleton mb-4" />
                <div style={{ height: 16, width: '100%' }} className="skeleton mb-3" />
                <div style={{ height: 16, width: '80%' }} className="skeleton mb-3" />
                <div style={{ height: 16, width: '60%' }} className="skeleton" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="settings-grid"
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 400px',
              gap: 24
            }}
          >

            {/* Colonne principale */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Informations entreprise */}
              <motion.div variants={fadeUp} className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(37,99,235,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building2 size={20} color="#2563EB" strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#0F172A'
                  }}>
                    Informations entreprise
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 8
                    }}>
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Mon Entreprise"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 8
                    }}>
                      Secteur d'activité
                    </label>
                    <select
                      className="input-field select-field"
                      value={settings.sector}
                      onChange={(e) => handleInputChange('sector', e.target.value)}
                    >
                      <option value="Commerce">Commerce</option>
                      <option value="Services">Services</option>
                      <option value="Industrie">Industrie</option>
                      <option value="Technologie">Technologie</option>
                      <option value="Santé">Santé</option>
                      <option value="Éducation">Éducation</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 8
                    }}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      value={settings.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 8
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      value={settings.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                      placeholder="contact@monentreprise.com"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 8
                  }}>
                    Adresse
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={settings.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    placeholder="123 Rue de l'Entreprise, Ville, Pays"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 12
                  }}>
                    Logo de l'entreprise
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="logo-upload">
                      {settings.companyLogo ? (
                        <img src={settings.companyLogo} alt="Logo entreprise" />
                      ) : (
                        <Camera size={24} color="#94A3B8" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>
                        Formats acceptés: JPG, PNG, SVG
                      </p>
                      <p style={{ fontSize: 12, color: '#94A3B8' }}>
                        Taille recommandée: 200x200px
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Préférences */}
              <motion.div variants={fadeUp} className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(147,51,234,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Globe size={20} color="#9333EA" strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#0F172A'
                  }}>
                    Préférences
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 8
                    }}>
                      Devise
                    </label>
                    <select
                      className="input-field select-field"
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="XAF">Franc CFA (XAF)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                      <option value="GBP">Livre (£)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: 8
                    }}>
                      Mode sombre
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.darkMode}
                          onChange={(e) => handleInputChange('darkMode', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span style={{ fontSize: 14, color: '#64748B' }}>
                        {settings.darkMode ? 'Activé' : 'Désactivé'}
                      </span>
                      {settings.darkMode ? <Moon size={16} color="#64748B" /> : <Sun size={16} color="#64748B" />}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
                        Alertes de stock
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748B' }}>
                        Recevoir des notifications quand le stock est faible
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.stockAlert}
                        onChange={(e) => handleInputChange('stockAlert', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
                        Notifications WhatsApp
                      </h3>
                      <p style={{ fontSize: 12, color: '#64748B' }}>
                        Recevoir des rappels via WhatsApp
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.whatsappNotifications}
                        onChange={(e) => handleInputChange('whatsappNotifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Gestion employés */}
              <motion.div variants={fadeUp} className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(22,163,74,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={20} color="#16A34A" strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#0F172A'
                  }}>
                    Gestion des employés
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Users size={18} />
                      <span>Gérer les employés</span>
                    </div>
                    <ChevronRight size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Shield size={18} />
                      <span>Gérer les rôles et permissions</span>
                    </div>
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Colonne latérale */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Sécurité */}
              <motion.div variants={fadeUp} className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(239,68,68,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield size={20} color="#EF4444" strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#0F172A'
                  }}>
                    Sécurité
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Key size={18} />
                      <span>Changer le mot de passe</span>
                    </div>
                    <ChevronRight size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <LogOut size={18} />
                      <span>Déconnexion appareils</span>
                    </div>
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Abonnement */}
              <motion.div variants={fadeUp} className="settings-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(250,204,21,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CreditCard size={20} color="#D97706" strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#0F172A'
                  }}>
                    Abonnement
                  </h2>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(234,88,12,0.1))',
                  border: '1px solid rgba(250,204,21,0.2)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Plan actuel</span>
                    <span style={{
                      background: 'rgba(250,204,21,0.9)',
                      color: '#1E3A8A',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      Gratuit
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
                    Fonctionnalités de base incluses. Upgrade pour plus de fonctionnalités.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>✓</span>
                    <span style={{ fontSize: 13, color: '#64748B' }}>Jusqu'à 100 produits</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>✓</span>
                    <span style={{ fontSize: 13, color: '#64748B' }}>Gestion des ventes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>✓</span>
                    <span style={{ fontSize: 13, color: '#64748B' }}>Rapports basiques</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CreditCard size={16} />
                  Upgrade vers Pro
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}