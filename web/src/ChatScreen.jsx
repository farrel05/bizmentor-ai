import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useBizMentor } from './useBizMentor';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import './ChatScreen.css';

export default function ChatScreen({ userProfile }) {
  const { lang }                                          = useLang();
  const { messages, loading, error, sendMessage, clearChat } = useBizMentor(userProfile, lang);
  const [input, setInput]                                 = useState('');
  const bottomRef                                         = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = t('chat.suggestions', lang);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <span className="status-dot" />
          <div>
            <h1>{t('chat.title', lang)}</h1>
            <p>{t('chat.subtitle', lang)}</p>
          </div>
        </div>
        <button className="clear-btn" onClick={clearChat}>{t('chat.newChat', lang)}</button>
      </div>

      <div className="messages-list">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role}`}>
            <div className="avatar">{msg.role === 'assistant' ? '🤖' : '👤'}</div>
            <div className="bubble">
              {msg.role === 'assistant'
                ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="avatar">🤖</div>
            <div className="bubble typing"><span /><span /><span /></div>
          </div>
        )}

        {error && <div className="error-banner">⚠️ {t('common.error', lang)}</div>}

        {messages.length === 1 && !loading && (
          <div className="suggestions-grid">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-card" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder', lang)}
          rows={2}
          disabled={loading}
        />
        <button className="send-button" onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? '⏳' : t('chat.send', lang)}
        </button>
      </div>
    </div>
  );
}
