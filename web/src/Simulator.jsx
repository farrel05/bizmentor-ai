import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import './Simulator.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SCENARIOS = {
  fr: [
    { id: 'recruit',   icon: '👥', title: 'Recruter vs Sous-traiter',      description: 'Analyser le coût et les avantages de recruter un employé vs faire appel à un freelance', color: '#2D6A4F' },
    { id: 'status',    icon: '🏢', title: 'Indépendant vs SRL',             description: 'Comparer les avantages fiscaux entre rester indépendant ou créer une SRL', color: '#5C4033' },
    { id: 'associate', icon: '🤝', title: "S'associer vs Rester seul",      description: "Peser les avantages d'un partenariat contre les risques", color: '#1565C0' },
    { id: 'invest',    icon: '💸', title: 'Investir vs Économiser',         description: "Décider si le moment est bon pour investir dans la croissance", color: '#6A1B9A' },
    { id: 'office',    icon: '🏠', title: 'Bureau vs Télétravail',          description: 'Évaluer les coûts et avantages fiscaux de chaque option', color: '#E65100' },
    { id: 'custom',    icon: '✏️', title: 'Ma propre question',             description: 'Posez votre propre dilemme stratégique', color: '#37474F' },
  ],
  nl: [
    { id: 'recruit',   icon: '👥', title: 'Aanwerven vs Uitbesteden',       description: 'Analyseer de kosten en voordelen van een werknemer aanwerven vs freelancer', color: '#2D6A4F' },
    { id: 'status',    icon: '🏢', title: 'Zelfstandige vs BV',             description: 'Vergelijk de fiscale voordelen van zelfstandige blijven of een BV oprichten', color: '#5C4033' },
    { id: 'associate', icon: '🤝', title: 'Samenwerken vs Alleen blijven',  description: 'Weeg de voordelen van een partnerschap af tegen de risico\'s', color: '#1565C0' },
    { id: 'invest',    icon: '💸', title: 'Investeren vs Sparen',           description: 'Beslissen of het moment goed is om te investeren in groei', color: '#6A1B9A' },
    { id: 'office',    icon: '🏠', title: 'Kantoor vs Thuiswerk',           description: 'Evalueer de kosten en fiscale voordelen van elke optie', color: '#E65100' },
    { id: 'custom',    icon: '✏️', title: 'Mijn eigen vraag',               description: 'Stel uw eigen strategisch dilemma', color: '#37474F' },
  ],
  en: [
    { id: 'recruit',   icon: '👥', title: 'Hire vs Outsource',              description: 'Analyze the cost and benefits of hiring an employee vs using a freelancer', color: '#2D6A4F' },
    { id: 'status',    icon: '🏢', title: 'Sole trader vs Company',         description: 'Compare the tax advantages of staying self-employed or creating a company', color: '#5C4033' },
    { id: 'associate', icon: '🤝', title: 'Partner up vs Go solo',          description: 'Weigh the benefits of a partnership against the risks', color: '#1565C0' },
    { id: 'invest',    icon: '💸', title: 'Invest vs Save',                 description: 'Decide if now is the right time to invest in growth', color: '#6A1B9A' },
    { id: 'office',    icon: '🏠', title: 'Office vs Remote work',          description: 'Evaluate the costs and tax benefits of each option', color: '#E65100' },
    { id: 'custom',    icon: '✏️', title: 'My own question',                description: 'Ask your own strategic dilemma', color: '#37474F' },
  ],
};

export default function Simulator() {
  const { lang } = useLang();
  const [step, setStep]               = useState('scenarios');
  const [selected, setSelected]       = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [context, setContext]         = useState('');
  const [result, setResult]           = useState('');

  const scenarios = SCENARIOS[lang] || SCENARIOS.fr;

  const handleSelect = (scenario) => { setSelected(scenario); setStep('form'); };

  const handleSimulate = async () => {
    setStep('loading');
    const question = selected.id === 'custom' ? customQuestion : selected.title;

    const prompts = {
      fr: `Tu es un conseiller business expert en Belgique. Fais une analyse stratégique complète de ce dilemme: "${question}"${context ? `. Contexte: ${context}` : ''}. Structure: comparaison des 2 options (avantages, inconvénients, coûts belges), recommandation claire, 3 prochaines étapes, astuce belge (fiscale/légale). Réponds en français.`,
      nl: `Je bent een expert bedrijfsadviseur in België. Maak een volledige strategische analyse van dit dilemma: "${question}"${context ? `. Context: ${context}` : ''}. Structuur: vergelijking van 2 opties (voordelen, nadelen, Belgische kosten), duidelijke aanbeveling, 3 volgende stappen, Belgische tip (fiscaal/juridisch). Antwoord in het Nederlands.`,
      en: `You are an expert business advisor in Belgium. Make a complete strategic analysis of this dilemma: "${question}"${context ? `. Context: ${context}` : ''}. Structure: comparison of 2 options (pros, cons, Belgian costs), clear recommendation, 3 next steps, Belgian tip (tax/legal). Reply in English.`,
    };

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompts[lang] }],
          userProfile: { language: lang }
        })
      });
      const data = await res.json();
      setResult(data.reply);
      setStep('results');
    } catch {
      setResult(t('common.error', lang));
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('scenarios');
    setSelected(null);
    setCustomQuestion('');
    setContext('');
    setResult('');
  };

  const contextPlaceholder = {
    fr: 'Ex: Je suis indépendant depuis 2 ans, CA annuel 80 000€, secteur tech à Bruxelles...',
    nl: 'Bijv: Ik ben 2 jaar zelfstandige, jaaromzet 80.000€, tech sector in Brussel...',
    en: 'Ex: I have been self-employed for 2 years, annual revenue €80,000, tech sector in Brussels...',
  };

  const customPlaceholder = {
    fr: 'Ex: Dois-je lancer mon produit maintenant ou attendre 6 mois ?',
    nl: 'Bijv: Moet ik mijn product nu lanceren of 6 maanden wachten?',
    en: 'Ex: Should I launch my product now or wait 6 months?',
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <div className="sim-header-left">
          <span className="sim-icon">🎯</span>
          <div>
            <h1>{t('simulator.title', lang)}</h1>
            <p>{t('simulator.subtitle', lang)}</p>
          </div>
        </div>
        {step !== 'scenarios' && (
          <button className="reset-btn" onClick={handleReset}>{t('simulator.back', lang)}</button>
        )}
      </div>

      {step === 'scenarios' && (
        <div className="scenarios-grid-wrapper">
          <p className="scenarios-intro">{t('simulator.choose', lang)}</p>
          <div className="scenarios-grid">
            {scenarios.map(s => (
              <div key={s.id} className="scenario-card" onClick={() => handleSelect(s)} style={{ '--accent-color': s.color }}>
                <div className="scenario-icon">{s.icon}</div>
                <div className="scenario-title">{s.title}</div>
                <div className="scenario-desc">{s.description}</div>
                <div className="scenario-arrow">{t('simulator.analyze', lang)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'form' && selected && (
        <div className="sim-form">
          <div className="sim-form-header">
            <span className="sim-form-icon">{selected.icon}</span>
            <div>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
          </div>

          {selected.id === 'custom' && (
            <div className="sim-field">
              <label>{t('simulator.title', lang)} *</label>
              <textarea className="sim-input" placeholder={customPlaceholder[lang]} value={customQuestion} onChange={e => setCustomQuestion(e.target.value)} rows={3} />
            </div>
          )}

          <div className="sim-field">
            <label>{t('simulator.context', lang)}</label>
            <textarea className="sim-input" placeholder={contextPlaceholder[lang]} value={context} onChange={e => setContext(e.target.value)} rows={4} />
          </div>

          <button className="simulate-btn" onClick={handleSimulate} disabled={selected.id === 'custom' && !customQuestion.trim()}>
            {t('simulator.launch', lang)}
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="sim-loading">
          <div className="sim-spinner" />
          <p>{t('simulator.analyzing', lang)}</p>
        </div>
      )}

      {step === 'results' && (
        <div className="sim-results">
          <div className="sim-result-header">
            <span>{selected.icon}</span>
            <strong>{selected.title}</strong>
          </div>
          <div className="sim-result-content">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          <button className="new-sim-btn" onClick={handleReset}>{t('simulator.newSim', lang)}</button>
        </div>
      )}
    </div>
  );
}
