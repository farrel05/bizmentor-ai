// Hook partagé entre React.js (web) et React Native (mobile)
// Gère toute la logique de communication avec le backend

import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useBizMentor(userProfile = null) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis BizMentor AI, votre conseiller business belge. Je connais la législation, les subsides et la fiscalité en Belgique. Comment puis-je vous aider ?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: userText }
    ];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      // On envoie uniquement les messages user/assistant à l'API
      const apiMessages = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, userProfile })
      });

      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ]);
    } catch (err) {
      setError('Connexion impossible. Vérifiez votre réseau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [messages, userProfile]);

  const clearChat = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: 'Nouvelle conversation démarrée. Comment puis-je vous aider ?'
    }]);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}

export async function fetchSubsidies(profile) {
  const res = await fetch(`${API_URL}/api/subsidies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Erreur lors de la récupération des subsides');
  return res.json();
}

export async function generateBusinessPlan(data) {
  const res = await fetch(`${API_URL}/api/business-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erreur lors de la génération du business plan');
  return res.json();
}
