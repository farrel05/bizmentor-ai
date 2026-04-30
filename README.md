# BizMentor AI 🇧🇪

Conseiller business intelligent pour entrepreneurs belges.
Assistant IA calibré sur la législation, les subsides et la fiscalité belge.

---

## Structure du projet

```
bizmentor/
├── backend/          ← API Node.js + Express
│   ├── server.js     ← Serveur principal (routes chat, subsidies, business plan)
│   ├── package.json
│   └── .env.example
├── shared/
│   └── useBizMentor.js  ← Hook React partagé web + mobile
├── web/              ← Frontend React.js
│   └── src/
│       ├── ChatScreen.jsx
│       └── ChatScreen.css
└── mobile/           ← Frontend React Native
    └── screens/
        └── ChatScreen.js
```

---

## Installation

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Ajoute ta clé API Anthropic dans .env
npm run dev
```

### 2. Web

```bash
npx create-react-app web
cd web
# Copie src/ChatScreen.jsx et src/ChatScreen.css dans web/src/
# Copie shared/useBizMentor.js dans web/src/shared/
echo "REACT_APP_API_URL=http://localhost:3001" > .env
npm start
```

### 3. Mobile

```bash
npx create-expo-app mobile
cd mobile
# Copie screens/ChatScreen.js
# Copie shared/useBizMentor.js dans le projet
npx expo start
```

---

## Obtenir ta clé API Anthropic

1. Va sur https://console.anthropic.com
2. Crée un compte
3. Génère une clé API
4. Colle-la dans `backend/.env`

---

## Fonctionnalités actuelles (v1.0)

- [x] Chat IA avec contexte belge (législation, TVA, subsides)
- [x] Réponses multilingues FR / NL / EN
- [x] Suggestions rapides
- [x] Historique de conversation

## Prochaines étapes (roadmap)

- [ ] Authentification utilisateur (JWT)
- [ ] Profil entrepreneur (région, secteur, stade)
- [ ] Détecteur de subsides automatique
- [ ] Générateur de business plan PDF
- [ ] Dashboard financier
- [ ] Simulateur de décision

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| IA | Claude claude-opus-4 (Anthropic) |
| Backend | Node.js + Express |
| Web | React.js |
| Mobile | React Native (Expo) |
| Base de données | Supabase (à ajouter) |
| Paiements | Stripe (à ajouter) |

---

Créé pour les entrepreneurs belges 🇧🇪
