import { useState, useCallback, useEffect } from 'react';
import { t } from './i18n';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useBizMentor(userProfile = null, lang = 'fr') {
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: t('chat.welcome', lang) }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Met à jour le message de bienvenue quand la langue change
  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('chat.welcome', lang) }]);
  }, [lang]);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const profile = { ...userProfile, language: lang };

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, userProfile: profile })
      });

      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [messages, userProfile, lang]);

  const clearChat = useCallback(() => {
    setMessages([{ role: 'assistant', content: t('chat.welcome', lang) }]);
  }, [lang]);

  return { messages, loading, error, sendMessage, clearChat };
}

export async function fetchSubsidies(profile) {
  const res = await fetch(`${API_URL}/api/subsidies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Erreur');
  return res.json();
}

export async function generateBusinessPlan(data) {
  const res = await fetch(`${API_URL}/api/business-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erreur');
  return res.json();
}
