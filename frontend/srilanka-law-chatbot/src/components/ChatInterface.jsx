import { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../api/client';

function TypingIndicator() {
  return (
    <div className="msg-row msg-row-bot">
      <div className="avatar avatar-ai">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 0v4m0 14v-4M2 12h4m14 0h-4"/>
        </svg>
      </div>
      <div className="bubble bubble-bot typing-bubble">
        <span className="dot" style={{animationDelay:'0s'}}/>
        <span className="dot" style={{animationDelay:'0.18s'}}/>
        <span className="dot" style={{animationDelay:'0.36s'}}/>
      </div>
    </div>
  );
}

function Message({ message }) {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';
  const timeStr = message.id === 'welcome'
    ? ''
    : new Date(Number(message.id)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`msg-row ${isUser ? 'msg-row-user' : 'msg-row-bot'}`}>
      {!isUser && (
        <div className={`avatar ${isError ? 'avatar-err' : 'avatar-ai'}`}>
          {isError ? (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 0v4m0 14v-4M2 12h4m14 0h-4"/>
            </svg>
          )}
        </div>
      )}

      <div className="msg-body">
        <div className={`bubble ${isUser ? 'bubble-user' : isError ? 'bubble-err' : 'bubble-bot'}`}>
          {message.content}
        </div>
        {timeStr && <div className={`msg-time ${isUser ? 'msg-time-right' : ''}`}>{timeStr}</div>}
      </div>

      {isUser && (
        <div className="avatar avatar-user">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z"/>
          </svg>
        </div>
      )}
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      content: 'Welcome to LexCeylon — your Sri Lankan legal assistant. Upload official legal PDFs, then ask questions in plain language. I will retrieve grounded, document-cited answers.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue.trim();
    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askQuestion(text);
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer || response.result || 'I could not find an answer to your question.',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${error.message}`,
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const suggestions = [
    'What are fundamental rights under the Constitution?',
    'Explain the law on defamation in Sri Lanka.',
    'How does bail work under the Code of Criminal Procedure?',
  ];

  const showSuggestions = messages.length === 1 && !isLoading;

  return (
    <div className="chat-root">
      {/* Chat header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-icon">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div className="chat-title">Legal Assistant</div>
            <div className="chat-subtitle">Powered by retrieval-augmented generation</div>
          </div>
        </div>
        <div className="chat-badge">
          <span className="chat-badge-dot" />
          Active Session
        </div>
      </div>

      {/* Message area */}
      <div className="chat-messages">
        {messages.map(msg => <Message key={msg.id} message={msg} />)}
        {isLoading && <TypingIndicator />}

        {showSuggestions && (
          <div className="suggestions">
            <div className="suggestions-label">Suggested questions</div>
            <div className="suggestions-list">
              {suggestions.map((s, i) => (
                <button key={i} className="suggestion-btn" onClick={() => {
                  setInputValue(s);
                  inputRef.current?.focus();
                }}>
                  {s}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <div className="chat-input-inner">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
            placeholder="Ask a legal question about Sri Lankan law…"
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
            aria-label="Send"
          >
            {isLoading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin-icon">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
        <div className="input-hint">Press Enter to send · Answers are sourced from uploaded documents only</div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .chat-root {
          display: flex; flex-direction: column;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid rgba(15,30,58,0.10);
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(15,30,58,0.12), 0 2px 8px rgba(15,30,58,0.06);
          overflow: hidden;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── Header ── */
        .chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px;
          background: linear-gradient(135deg, #0F1E3A 0%, #1C3563 60%, #2A4A82 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .chat-header-left { display: flex; align-items: center; gap: 12px; }
        .chat-header-icon {
          width: 40px; height: 40px;
          background: rgba(201,168,76,0.2);
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #F0D98A;
        }
        .chat-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #FFFFFF; }
        .chat-subtitle { font-size: 11.5px; color: rgba(255,255,255,0.42); margin-top: 1px; }
        .chat-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(27,122,90,0.18);
          border: 1px solid rgba(27,122,90,0.35);
          border-radius: 999px;
          font-size: 11px; font-weight: 600; color: #6EE7B7;
        }
        .chat-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6EE7B7;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Messages ── */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex; flex-direction: column; gap: 16px;
          background: #F8F7F4;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(15,30,58,0.15); border-radius: 4px; }

        .msg-row { display: flex; align-items: flex-end; gap: 10px; animation: fadeUp 0.25s ease; }
        .msg-row-user { flex-direction: row-reverse; }
        .msg-row-bot { flex-direction: row; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .avatar {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .avatar-ai {
          background: linear-gradient(135deg, #0F1E3A, #2A4A82);
          color: #C9A84C;
          box-shadow: 0 2px 8px rgba(15,30,58,0.25);
        }
        .avatar-user {
          background: linear-gradient(135deg, #C9A84C, #E8C76A);
          color: #0F1E3A;
          box-shadow: 0 2px 8px rgba(201,168,76,0.35);
        }
        .avatar-err {
          background: #FFF5F5;
          color: #C53030;
          border: 1px solid rgba(197,48,48,0.2);
        }

        .msg-body { display: flex; flex-direction: column; max-width: 76%; }
        .bubble {
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px; line-height: 1.65;
          word-break: break-word;
        }
        .bubble-user {
          background: linear-gradient(135deg, #0F1E3A, #1C3563);
          color: #FFFFFF;
          border-bottom-right-radius: 5px;
          box-shadow: 0 4px 14px rgba(15,30,58,0.22);
        }
        .bubble-bot {
          background: #FFFFFF;
          color: #0F1E3A;
          border: 1px solid rgba(15,30,58,0.10);
          border-bottom-left-radius: 5px;
          box-shadow: 0 2px 8px rgba(15,30,58,0.07);
        }
        .bubble-err {
          background: #FFF5F5;
          color: #9B2C2C;
          border: 1px solid rgba(197,48,48,0.18);
          border-bottom-left-radius: 5px;
        }
        .msg-time {
          font-size: 10.5px; color: #8898AA;
          margin-top: 5px; padding: 0 4px;
        }
        .msg-time-right { text-align: right; }

        /* ── Typing ── */
        .typing-bubble {
          display: flex; align-items: center; gap: 5px;
          padding: 14px 18px;
        }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #C9A84C;
          display: inline-block;
          animation: bounce 1.2s ease infinite;
        }
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        /* ── Suggestions ── */
        .suggestions { margin-top: 8px; }
        .suggestions-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.09em; color: #8898AA; margin-bottom: 10px;
        }
        .suggestions-list { display: flex; flex-direction: column; gap: 7px; }
        .suggestion-btn {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 11px 14px;
          background: #FFFFFF;
          border: 1px solid rgba(15,30,58,0.10);
          border-radius: 12px;
          font-size: 13px; color: #1C3563; font-weight: 500;
          text-align: left; cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .suggestion-btn:hover {
          border-color: #C9A84C;
          box-shadow: 0 3px 12px rgba(201,168,76,0.15);
          transform: translateX(2px);
        }
        .suggestion-btn svg { flex-shrink: 0; color: #C9A84C; }

        /* ── Input area ── */
        .chat-input-area {
          padding: 14px 18px 12px;
          background: #FFFFFF;
          border-top: 1px solid rgba(15,30,58,0.08);
          flex-shrink: 0;
        }
        .chat-input-inner {
          display: flex; align-items: center; gap: 10px;
          background: #F8F7F4;
          border: 1.5px solid rgba(15,30,58,0.12);
          border-radius: 14px;
          padding: 6px 6px 6px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .chat-input-inner:focus-within {
          border-color: #C9A84C;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
          background: #FFFFFF;
        }
        .chat-input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 14px; color: #0F1E3A;
          font-family: 'DM Sans', system-ui, sans-serif;
          padding: 6px 0;
        }
        .chat-input::placeholder { color: #8898AA; }
        .chat-input:disabled { cursor: not-allowed; opacity: 0.5; }

        .send-btn {
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg, #0F1E3A, #2A4A82);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #F0D98A;
          transition: opacity 0.2s, transform 0.1s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { transform: scale(1.06); }
        .send-btn:active:not(:disabled) { transform: scale(0.96); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .spin-icon { animation: spin 1s linear infinite; }

        .input-hint {
          margin-top: 8px;
          font-size: 10.5px; color: #8898AA; text-align: center;
        }
      `}</style>
    </div>
  );
}
