import { useState, useRef } from 'react'
import { ingestPDF } from '../api/client'

export default function DocumentUpload({ onUploadSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setMessageType('error');
      setMessage('Only PDF files are accepted.');
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setProgress(0);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 18, 88));
    }, 220);

    try {
      const result = await ingestPDF(file);
      clearInterval(interval);
      setProgress(100);
      setMessageType('success');
      setMessage(result.message || `"${file.name}" ingested successfully.`);
      onUploadSuccess?.(file.name);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => { setMessage(null); setProgress(0); }, 5000);
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      setMessageType('error');
      setMessage(error.message || 'Upload failed. Please try again.');
      setTimeout(() => setMessage(null), 7000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => uploadFile(e.target.files?.[0]);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); uploadFile(e.dataTransfer?.files?.[0]); };

  return (
    <div className="upload-root">
      {/* Card header */}
      <div className="upload-header">
        <div className="upload-header-left">
          <div className="upload-icon-wrap">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <div>
            <div className="upload-tag">Document Ingestion</div>
            <h2 className="upload-title">Upload Legal PDFs</h2>
          </div>
        </div>
      </div>

      <div className="upload-body">
        <p className="upload-desc">
          Add official judgments, acts, circulars, or regulations. The system will index them for grounded, cited answers.
        </p>

        {/* Drop zone */}
        <input
          ref={fileInputRef}
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          style={{ display: 'none' }}
        />

        <label
          htmlFor="pdf-upload"
          className={`drop-zone ${isDragging ? 'drop-zone-active' : ''} ${isLoading ? 'drop-zone-loading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <>
              <div className="upload-spinner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin-icon">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.15"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="drop-zone-loading-text">Processing document…</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-pct">{Math.round(progress)}%</div>
            </>
          ) : (
            <>
              <div className={`drop-icon ${isDragging ? 'drop-icon-active' : ''}`}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div className="drop-primary">
                {isDragging ? 'Release to upload' : 'Drag & drop a PDF here'}
              </div>
              <div className="drop-secondary">or <span className="drop-browse">click to browse files</span></div>
              <div className="drop-formats">
                <span className="format-tag">PDF</span>
                <span className="drop-size">· Max 50 MB recommended</span>
              </div>
            </>
          )}
        </label>

        {/* Status message */}
        {message && (
          <div className={`upload-message ${messageType === 'success' ? 'msg-success' : 'msg-error'}`}>
            {messageType === 'success' ? (
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
              </svg>
            ) : (
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Info strip */}
        <div className="upload-info-strip">
          {[
            { icon: '🔒', text: 'Encrypted at rest' },
            { icon: '⚖', text: 'Legal source indexing' },
            { icon: '📍', text: 'Citation grounding' },
          ].map((item, i) => (
            <div key={i} className="info-item">
              <span className="info-icon">{item.icon}</span>
              <span className="info-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }

        .upload-root {
          background: #FFFFFF;
          border: 1px solid rgba(15,30,58,0.10);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15,30,58,0.08), 0 1px 4px rgba(15,30,58,0.04);
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* Header */
        .upload-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
          background: linear-gradient(135deg, #0F1E3A 0%, #1C3563 60%, #2A4A82 100%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .upload-header-left { display: flex; align-items: center; gap: 13px; }
        .upload-icon-wrap {
          width: 42px; height: 42px; border-radius: 10px;
          background: rgba(201,168,76,0.18);
          border: 1px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #F0D98A;
        }
        .upload-tag {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.11em;
          color: rgba(255,255,255,0.45); margin-bottom: 3px;
        }
        .upload-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #FFFFFF;
        }

        /* Body */
        .upload-body { padding: 18px 18px 16px; }
        .upload-desc {
          font-size: 12.5px; color: #718096; line-height: 1.6;
          margin-bottom: 14px;
        }

        /* Drop zone */
        .drop-zone {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 28px 20px;
          border: 2px dashed rgba(15,30,58,0.15);
          border-radius: 14px;
          cursor: pointer;
          text-align: center;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          background: #F8F7F4;
          gap: 6px;
        }
        .drop-zone:hover { border-color: #C9A84C; background: #FFFDF4; }
        .drop-zone-active { border-color: #C9A84C; background: #FFFDF4; transform: scale(1.01); }
        .drop-zone-loading { cursor: default; pointer-events: none; border-style: solid; border-color: rgba(201,168,76,0.4); }

        .drop-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: #FFFFFF;
          border: 1px solid rgba(15,30,58,0.10);
          display: flex; align-items: center; justify-content: center;
          color: #4A5568;
          box-shadow: 0 2px 8px rgba(15,30,58,0.06);
          margin-bottom: 6px;
          transition: color 0.2s, border-color 0.2s;
        }
        .drop-icon-active { color: #C9A84C; border-color: rgba(201,168,76,0.4); }
        .drop-zone:hover .drop-icon { color: #C9A84C; border-color: rgba(201,168,76,0.4); }

        .drop-primary {
          font-size: 14px; font-weight: 600; color: #0F1E3A; margin-top: 4px;
        }
        .drop-secondary { font-size: 12.5px; color: #8898AA; }
        .drop-browse { color: #C9A84C; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
        .drop-formats { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .format-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
          padding: 2px 8px;
          background: #0F1E3A; color: #C9A84C;
          border-radius: 5px;
        }
        .drop-size { font-size: 11px; color: #8898AA; }

        /* Loading */
        .upload-spinner { color: #C9A84C; margin-bottom: 6px; }
        .spin-icon { animation: spin 1s linear infinite; }
        .drop-zone-loading-text { font-size: 14px; font-weight: 600; color: #1C3563; }
        .progress-bar-wrap {
          width: 100%; max-width: 200px;
          height: 4px; border-radius: 999px;
          background: rgba(201,168,76,0.18);
          overflow: hidden;
          margin-top: 10px;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #C9A84C, #E8C76A);
          border-radius: 999px;
          transition: width 0.3s ease;
        }
        .progress-pct { font-size: 11px; color: #8898AA; margin-top: 5px; }

        /* Messages */
        .upload-message {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px; font-weight: 500;
          margin-top: 12px;
          animation: fadeIn 0.25s ease;
        }
        .msg-success { background: #EBF7F3; color: #1B7A5A; border: 1px solid rgba(27,122,90,0.2); }
        .msg-error { background: #FFF5F5; color: #9B2C2C; border: 1px solid rgba(197,48,48,0.2); }

        /* Info strip */
        .upload-info-strip {
          display: flex; justify-content: space-between;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(15,30,58,0.07);
        }
        .info-item { display: flex; align-items: center; gap: 5px; }
        .info-icon { font-size: 13px; }
        .info-text { font-size: 10.5px; color: #8898AA; font-weight: 500; }
      `}</style>
    </div>
  );
}
