const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app       = express();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// CORS ouvert pour tous les domaines
app.use(cors());
app.use(express.json());

// Système de prompt multilingue
const SYSTEM_PROMPTS = {
  fr: `Tu es BizMentor AI, un conseiller business expert spécialisé dans l'écosystème belge.
Tu connais parfaitement la législation belge, la fiscalité (TVA, ISOC, IPP), les subsides régionaux (Brustart, Impulse.brussels, Sowalfin, VLAIO), et le marché belge.
IMPORTANT: Réponds TOUJOURS en français. Sois concis, pratique et orienté action. Propose toujours une prochaine étape concrète.`,

  nl: `Je bent BizMentor AI, een expertadviseur gespecialiseerd in het Belgische ecosysteem.
Je kent de Belgische wetgeving, belastingen (BTW, VenB), regionale subsidies (VLAIO, PMV, Brustart) en de Belgische markt perfect.
BELANGRIJK: Antwoord ALTIJD in het Nederlands. Wees beknopt, praktisch en actiegericht. Stel altijd een concrete volgende stap voor.`,

  en: `You are BizMentor AI, an expert business advisor specialized in the Belgian ecosystem.
You know Belgian legislation, taxes (VAT, corporate tax), regional subsidies (Brustart, Impulse.brussels, VLAIO), and the Belgian market perfectly.
IMPORTANT: Always respond in English. Be concise, practical and action-oriented. Always suggest a concrete next step.`
};

// Route chat principal
app.post('/api/chat', async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages requis' });

  try {
    const lang       = userProfile?.language || 'fr';
    let systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.fr;

    if (userProfile) {
      const profileInfo = {
        fr: `\nProfil utilisateur:\n- Région: ${userProfile.region || 'Non précisée'}\n- Secteur: ${userProfile.sector || 'Non précisé'}`,
        nl: `\nGebruikersprofiel:\n- Regio: ${userProfile.region || 'Niet opgegeven'}\n- Sector: ${userProfile.sector || 'Niet opgegeven'}`,
        en: `\nUser profile:\n- Region: ${userProfile.region || 'Not specified'}\n- Sector: ${userProfile.sector || 'Not specified'}`
      };
      systemPrompt += profileInfo[lang] || profileInfo.fr;
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     systemPrompt,
      messages:   messages
    });

    res.json({ reply: response.content[0].text, usage: response.usage });
  } catch (error) {
    console.error('Erreur API Anthropic:', error);
    res.status(500).json({ error: 'Erreur lors de la génération' });
  }
});

// Route business plan
app.post('/api/business-plan', async (req, res) => {
  const { companyName, sector, region, description, lang = 'fr' } = req.body;
  try {
    const prompts = {
      fr: `Génère un business plan professionnel en français pour: ${companyName}, secteur: ${sector}, région belge: ${region}. Description: ${description}. Inclus: résumé exécutif, analyse marché belge, modèle économique, plan financier 3 ans, risques, subsides éligibles.`,
      nl: `Genereer een professioneel businessplan in het Nederlands voor: ${companyName}, sector: ${sector}, Belgische regio: ${region}. Beschrijving: ${description}. Inclusief: samenvatting, Belgische marktanalyse, businessmodel, financieel plan 3 jaar, risico's, subsidiemogelijkheden.`,
      en: `Generate a professional business plan in English for: ${companyName}, sector: ${sector}, Belgian region: ${region}. Description: ${description}. Include: executive summary, Belgian market analysis, business model, 3-year financial plan, risks, eligible subsidies.`
    };

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages:   [{ role: 'user', content: prompts[lang] || prompts.fr }]
    });

    res.json({ plan: response.content[0].text });
  } catch (error) {
    console.error('Erreur business plan:', error);
    res.status(500).json({ error: 'Erreur génération business plan' });
  }
});

// Route subsides
app.post('/api/subsidies', async (req, res) => {
  const { region, sector, stage, employees, lang = 'fr' } = req.body;
  try {
    const prompts = {
      fr: `Liste les subsides belges disponibles pour: région ${region}, secteur ${sector}, stade ${stage}, ${employees || 0} employés. Pour chaque subside: nom, organisme, montant max, conditions, délai, contact.`,
      nl: `Lijst de beschikbare Belgische subsidies voor: regio ${region}, sector ${sector}, stadium ${stage}, ${employees || 0} werknemers. Voor elke subsidie: naam, organisatie, maximaal bedrag, voorwaarden, termijn, contact.`,
      en: `List available Belgian subsidies for: region ${region}, sector ${sector}, stage ${stage}, ${employees || 0} employees. For each subsidy: name, organization, max amount, conditions, deadline, contact.`
    };

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages:   [{ role: 'user', content: prompts[lang] || prompts.fr }]
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('Erreur subsides:', error);
    res.status(500).json({ error: 'Erreur détection subsides' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`BizMentor API démarrée sur le port ${PORT}`));
