import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from './supabase';
import { useLang } from './LanguageContext';
import { t } from './i18n';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const QUICK_SUGGESTIONS = {
  fr: ['💰 Subsides pour startup à Bruxelles', '🏢 Créer une SRL en Belgique', '📄 Générer mon business plan', '📊 Optimiser ma TVA belge'],
  nl: ['💰 Subsidies voor startup in Brussel', '🏢 Een BV oprichten in België', '📄 Mijn businessplan genereren', '📊 Mijn BTW optimaliseren'],
  en: ['💰 Subsidies for startup in Brussels', '🏢 Create a company in Belgium', '📄 Generate my business plan', '📊 Optimize my Belgian VAT'],
};

export default function ChatScreen({ userProfile }) {
  const { lang } = useLang();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t('chat.welcome', lang) }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const bottomRef = useRef(null);
  const userId = userProfile?.id;

  // ── Charger les conversations ──────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!userId) { setLoadingConvs(false); return; }
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    setConversations(data || []);
    setLoadingConvs(false);
  }, [userId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Charger une conversation ───────────────────────────────
  const loadConversation = async (convId) => {
    setActiveConvId(convId);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setMessages(data.map(m => ({ role: m.role, content: m.content })));
    }
  };

  // ── Nouvelle conversation ──────────────────────────────────
  const newConversation = () => {
    setActiveConvId(null);
    setMessages([{ role: 'assistant', content: t('chat.welcome', lang) }]);
    setError(null);
  };

  // ── Supprimer une conversation ─────────────────────────────
  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    await supabase.from('conversations').delete().eq('id', convId);
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConvId === convId) newConversation();
  };

  // ── Envoyer un message ─────────────────────────────────────
  const sendMessage = async (userText) => {
    if (!userText.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      // Créer ou récupérer la conversation
      let convId = activeConvId;
      if (!convId && userId) {
        const title = userText.slice(0, 60) + (userText.length > 60 ? '...' : '');
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ user_id: userId, title })
          .select()
          .single();
        if (newConv) {
          convId = newConv.id;
          setActiveConvId(convId);
          // Sauvegarder le message de bienvenue
          await supabase.from('messages').insert({
            conversation_id: convId, user_id: userId,
            role: 'assistant', content: messages[0].content
          });
          setConversations(prev => [newConv, ...prev]);
        }
      }

      // Sauvegarder le message utilisateur
      if (convId && userId) {
        await supabase.from('messages').insert({
          conversation_id: convId, user_id: userId,
          role: 'user', content: userText
        });
      }

      // Appel API
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, userProfile: { ...userProfile, language: lang } })
      });

      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      const reply = data.reply;

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      // Sauvegarder la réponse IA
      if (convId && userId) {
        await supabase.from('messages').insert({
          conversation_id: convId, user_id: userId,
          role: 'assistant', content: reply
        });
        // Mettre à jour updated_at
        await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);
        loadConversations();
      }

    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const suggestions = QUICK_SUGGESTIONS[lang] || QUICK_SUGGESTIONS.fr;

  // Formater la date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    if (diff < 86400000) return 'Aujourd\'hui';
    if (diff < 172800000) return 'Hier';
    return date.toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Sidebar historique ───────────────────────────── */}
      <div style={{
        width: '260px', background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden'
      }}>
        {/* Header sidebar */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <button onClick={newConversation} style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px',
            background: 'var(--accent)', color: 'white', border: 'none',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center',
            gap: '8px', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(45,106,79,0.25)',
          }}>
            ✏️ Nouvelle conversation
          </button>
        </div>

        {/* Liste des conversations */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loadingConvs ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
              Chargement...
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
              Aucune conversation<br />Commencez à discuter !
            </div>
          ) : (
            conversations.map(conv => (
              <div key={conv.id}
                onClick={() => loadConversation(conv.id)}
                style={{
                  padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                  background: activeConvId === conv.id ? 'var(--accent-light)' : 'transparent',
                  border: `1px solid ${activeConvId === conv.id ? 'var(--accent)' : 'transparent'}`,
                  marginBottom: '4px', display: 'flex', alignItems: 'flex-start',
                  gap: '8px', transition: 'all 0.15s', position: 'relative',
                }}>
                <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>💬</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: activeConvId === conv.id ? 600 : 400,
                    color: activeConvId === conv.id ? 'var(--accent)' : 'var(--text-1)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{conv.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                    {formatDate(conv.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', fontSize: '13px', padding: '2px 4px',
                    borderRadius: '4px', flexShrink: 0, opacity: 0,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0}
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Zone de chat principale ──────────────────────── */}
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <span className="status-dot" />
            <div>
              <h1>{t('chat.title', lang)}</h1>
              <p>{t('chat.subtitle', lang)}</p>
            </div>
          </div>
          <button className="clear-btn" onClick={newConversation}>{t('chat.newChat', lang)}</button>
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
    </div>
  );
}
