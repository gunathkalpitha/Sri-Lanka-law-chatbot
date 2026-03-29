import { useState, useEffect } from 'react'
import DocumentUpload from './components/DocumentUpload'
import ChatInterface from './components/ChatInterface'
import { checkHealth } from './api/client'
import './i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [isBackendReady, setIsBackendReady] = useState(false)
  const [backendError, setBackendError] = useState(null)
  const [documentsUploaded, setDocumentsUploaded] = useState([])
  const [activeTab, setActiveTab] = useState('chat')

  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      await checkHealth()
      setIsBackendReady(true)
      setBackendError(null)
    } catch (error) {
      setIsBackendReady(false)
      setBackendError('Backend is not running. Please start the backend server on port 8000.')
    }
  }

  const handleUploadSuccess = (fileName) => {
    setDocumentsUploaded((prev) => [...prev, fileName])
  }

  return (
    <div className="app-root">
      {/* Decorative ambient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* ── Header with hero background ── */}
      <header className="site-header hero-bg">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="11" height="11" rx="2.5" fill="currentColor" opacity="0.9"/>
                <rect x="15" y="2" width="11" height="11" rx="2.5" fill="currentColor" opacity="0.55"/>
                <rect x="2" y="15" width="11" height="11" rx="2.5" fill="currentColor" opacity="0.55"/>
                <rect x="15" y="15" width="11" height="11" rx="2.5" fill="currentColor" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <div className="brand-label">Legal Knowledge System</div>
              <h1 className="brand-title">LexCeylon</h1>
            </div>
          </div>

          <div className="header-meta">
            <div className={`status-pill ${isBackendReady ? 'status-online' : 'status-offline'}`}>
              <span className="status-dot" />
              {isBackendReady ? 'System Online' : 'Offline'}
            </div>
            <div className="header-stats">
              <div className="stat-chip">
                <span className="stat-num">{documentsUploaded.length}</span>
                <span className="stat-label">Documents</span>
              </div>
              <div className="stat-chip">
                <span className="stat-num">RAG</span>
                <span className="stat-label">Mode</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-tagline">
          <p>{t('welcome')}</p>
        </div>

        {backendError && (
          <div className="backend-error">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{backendError}</span>
            <button onClick={checkBackendHealth} className="retry-btn">Retry</button>
          </div>
        )}
      </header>

      {/* ── Mobile tab bar ── */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Legal Assistant
        </button>
        <button
          className={`mobile-tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          Documents {documentsUploaded.length > 0 && <span className="tab-badge">{documentsUploaded.length}</span>}
        </button>
      </div>

      {/* ── Main layout ── */}
      <main className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${activeTab === 'docs' ? 'mobile-active' : ''}`}>
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />

          {documentsUploaded.length > 0 && (
            <div className="doc-list-card">
              <div className="doc-list-header">
                <div className="doc-list-title">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Ingested Sources
                </div>
                <span className="doc-count">{documentsUploaded.length}</span>
              </div>
              <ul className="doc-list">
                {documentsUploaded.map((doc, idx) => (
                  <li key={idx} className="doc-item">
                    <div className="doc-item-icon">PDF</div>
                    <span className="doc-item-name">{doc}</span>
                    <div className="doc-item-check">
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feature cards */}
          <div className="feature-grid">
            {[
              { icon: '⚖', label: 'Constitutional Law', sub: 'Sri Lanka Constitution 1978', link: 'https://www.parliament.lk/constitution' },
              { icon: '📋', label: 'Civil Procedure', sub: 'Code of Civil Procedure', link: 'https://www.lawnet.gov.lk/act/civil-procedure-code/' },
              { icon: '🏛', label: 'Penal Code', sub: 'Offences & Penalties', link: 'https://www.lawnet.gov.lk/act/penal-code/' },
              { icon: '🏛', label: 'Parliament Acts', sub: 'Legislative Documents', link: 'https://www.parliament.lk' }
            ].map((f, i) => {
              const chipContent = (
                <>
                  <span className="feature-chip-icon">{f.icon}</span>
                  <div>
                    <div className="feature-chip-label">{f.label}</div>
                    <div className="feature-chip-sub">{f.sub}</div>
                  </div>
                </>
              );
              return f.link ? (
                <a
                  key={i}
                  className="feature-chip"
                  href={f.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {chipContent}
                </a>
              ) : (
                <div key={i} className="feature-chip">
                  {chipContent}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Chat panel with decorative watermark */}
        <section className={`chat-panel ${activeTab === 'chat' ? 'mobile-active' : ''} chat-bg-watermark`}>
          <ChatInterface t={t} />
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2026 LexCeylon · Sri Lanka Law Chatbot</span>
        <span className="footer-dot">·</span>
        <span>React + FastAPI · Retrieval-Augmented Generation</span>
        <span className="footer-dot">·</span>
        <span>Secure &amp; Auditable</span>
      </footer>

      <style>{`
        /* ── Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #C9A84C;
          --gold-light: #F0D98A;
          --gold-pale: #FBF5E0;
          --navy: #0F1E3A;
          --navy-mid: #1C3563;
          --navy-light: #2A4A82;
          --slate: #4A5568;
          --slate-light: #718096;
          --surface: #FFFFFF;
          --surface-2: #F8F7F4;
          --surface-3: #F2F0EB;
          --border: rgba(15,30,58,0.10);
          --border-med: rgba(15,30,58,0.18);
          --text-primary: #0F1E3A;
          --text-secondary: #4A5568;
          --text-muted: #8898AA;
          --green: #1B7A5A;
          --green-bg: #EBF7F3;
          --red: #C53030;
          --red-bg: #FFF5F5;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 18px;
          --radius-xl: 24px;
          --shadow-sm: 0 1px 3px rgba(15,30,58,0.08), 0 1px 2px rgba(15,30,58,0.04);
          --shadow-md: 0 4px 16px rgba(15,30,58,0.10), 0 2px 6px rgba(15,30,58,0.06);
          --shadow-lg: 0 12px 40px rgba(15,30,58,0.14), 0 4px 12px rgba(15,30,58,0.08);
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }

        body { font-family: var(--font-body); background: var(--surface-2); color: var(--text-primary); }

        /* ── Root ── */
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Blobs ── */
        .blob {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(80px);
          opacity: 0.35;
        }
        .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, #C9A84C33, transparent 70%); top: -120px; right: -100px; }
        .blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, #2A4A8222, transparent 70%); bottom: 100px; left: -120px; }
        .blob-3 { width: 300px; height: 300px; background: radial-gradient(circle, #1B7A5A18, transparent 70%); top: 40%; left: 40%; }

        /* ── Header ── */
        .site-header {
          position: relative;
          z-index: 10;
          background: var(--navy);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 0;
        }
        .header-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 20px 24px 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .header-brand { display: flex; align-items: center; gap: 16px; }
        .brand-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, var(--gold), #E8C76A);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: var(--navy);
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(201,168,76,0.4);
        }
        .brand-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin-bottom: 4px;
        }
        .brand-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .header-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .status-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px; font-weight: 600;
          border: 1px solid;
        }
        .status-online { background: rgba(27,122,90,0.18); border-color: rgba(27,122,90,0.4); color: #6EE7B7; }
        .status-offline { background: rgba(197,48,48,0.18); border-color: rgba(197,48,48,0.4); color: #FCA5A5; }
        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .header-stats { display: flex; gap: 8px; }
        .stat-chip {
          display: flex; flex-direction: column; align-items: center;
          padding: 6px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: var(--radius-sm);
          min-width: 64px;
        }
        .stat-num { font-size: 16px; font-weight: 700; color: var(--gold-light); line-height: 1; }
        .stat-label { font-size: 10px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
        .header-tagline {
          max-width: 1320px; margin: 0 auto;
          padding: 0 24px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 12px;
        }
        .header-tagline p {
          font-size: 12.5px;
          color: rgba(255,255,255,0.42);
          letter-spacing: 0.03em;
        }
        .backend-error {
          max-width: 1320px; margin: 0 auto;
          padding: 10px 24px 12px;
          display: flex; align-items: center; gap: 10px;
          color: #FCA5A5; font-size: 13px;
          border-top: 1px solid rgba(197,48,48,0.25);
        }
        .retry-btn {
          margin-left: auto;
          padding: 5px 14px;
          border-radius: var(--radius-sm);
          background: rgba(197,48,48,0.25);
          border: 1px solid rgba(197,48,48,0.5);
          color: #FCA5A5;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .retry-btn:hover { background: rgba(197,48,48,0.4); }

        /* ── Mobile tabs ── */
        .mobile-tabs {
          display: none;
          position: relative; z-index: 10;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .mobile-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 14px;
          font-size: 13px; font-weight: 500;
          color: var(--text-muted);
          background: none; border: none; cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .mobile-tab.active { color: var(--navy-mid); border-bottom-color: var(--gold); }
        .tab-badge {
          background: var(--gold); color: var(--navy);
          font-size: 10px; font-weight: 700;
          padding: 1px 6px; border-radius: 999px; margin-left: 2px;
        }

        /* ── Main layout ── */
        .main-layout {
          position: relative; z-index: 5;
          flex: 1;
          max-width: 1320px; width: 100%; margin: 0 auto;
          padding: 28px 24px;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 20px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .doc-list-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        .doc-list-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-3);
        }
        .doc-list-title {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: var(--text-secondary);
        }
        .doc-count {
          background: var(--navy);
          color: var(--gold-light);
          font-size: 11px; font-weight: 700;
          padding: 2px 8px; border-radius: 999px;
        }
        .doc-list { list-style: none; padding: 8px; }
        .doc-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px;
          border-radius: var(--radius-sm);
          transition: background 0.15s;
        }
        .doc-item:hover { background: var(--surface-3); }
        .doc-item-icon {
          font-size: 9px; font-weight: 800; letter-spacing: 0.04em;
          padding: 3px 6px;
          background: var(--navy);
          color: var(--gold-light);
          border-radius: 4px;
          flex-shrink: 0;
        }
        .doc-item-name {
          flex: 1; font-size: 12.5px; color: var(--text-primary);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .doc-item-check {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--green-bg);
          color: var(--green);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Feature chips ── */
        .feature-grid { display: flex; flex-direction: column; gap: 8px; }
        .feature-chip {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          cursor: default;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.18s cubic-bezier(.4,1.4,.6,1), background 0.18s;
        }
        .feature-chip:hover { border-color: var(--border-med); box-shadow: var(--shadow-md); }
        /* Animation for clickable feature chips (links) */
        a.feature-chip {
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        a.feature-chip::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius-md);
          background: rgba(201,168,76,0.08);
          opacity: 0;
          transition: opacity 0.18s;
          z-index: -1;
        }
        a.feature-chip:hover {
          transform: scale(1.045) translateY(-2px) rotate(-0.5deg);
          box-shadow: 0 8px 32px rgba(201,168,76,0.13), 0 2px 8px rgba(15,30,58,0.10);
          border-color: var(--gold);
          background: var(--surface);
        }
        a.feature-chip:hover::after {
          opacity: 1;
        }
        .feature-chip-icon { font-size: 20px; flex-shrink: 0; }
        .feature-chip-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .feature-chip-sub { font-size: 11px; color: var(--text-muted); margin-top: 1px; }

        /* ── Chat panel ── */
        .chat-panel { height: calc(100vh - 200px); min-height: 600px; }

        /* ── Footer ── */
        .site-footer {
          position: relative; z-index: 5;
          border-top: 1px solid var(--border);
          background: var(--surface);
          padding: 14px 24px;
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          font-size: 12px; color: var(--text-muted);
          max-width: 100%;
        }
        .footer-dot { color: var(--border-med); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .main-layout { grid-template-columns: 1fr; padding: 16px; }
          .sidebar, .chat-panel { display: none; }
          .sidebar.mobile-active, .chat-panel.mobile-active { display: flex; flex-direction: column; }
          .chat-panel { height: calc(100vh - 160px); }
          .mobile-tabs { display: flex; }
          .brand-title { font-size: 24px; }
          .header-inner { padding: 16px; }
        }
        @media (max-width: 500px) {
          .header-stats { display: none; }
          .header-tagline { display: none; }
        }
      `}</style>
    </div>
  );
}

export default App
