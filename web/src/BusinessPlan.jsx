import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import './BusinessPlan.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SECTORS = {
  fr: ['Tech / IT', 'Commerce', 'Horeca', 'Santé', 'Education', 'Finance', 'Industrie', 'Autre'],
  nl: ['Tech / IT', 'Handel', 'Horeca', 'Gezondheidszorg', 'Onderwijs', 'Financiën', 'Industrie', 'Andere'],
  en: ['Tech / IT', 'Commerce', 'Horeca', 'Healthcare', 'Education', 'Finance', 'Industry', 'Other'],
};

const REGIONS = ['Bruxelles', 'Wallonie', 'Flandre'];

const PLACEHOLDERS = {
  companyName: { fr: 'Ex: BizMentor AI', nl: 'Bijv: BizMentor AI', en: 'Ex: BizMentor AI' },
  description: { fr: 'Décrivez votre idée, produit ou service...', nl: 'Beschrijf uw idee, product of dienst...', en: 'Describe your idea, product or service...' },
  target:      { fr: 'Ex: PME belges, particuliers 25-40 ans...', nl: 'Bijv: Belgische KMO\'s, particulieren 25-40...', en: 'Ex: Belgian SMEs, individuals 25-40...' },
  revenue:     { fr: 'Ex: 50 000 €', nl: 'Bijv: 50.000 €', en: 'Ex: 50,000 €' },
  investment:  { fr: 'Ex: 20 000 €', nl: 'Bijv: 20.000 €', en: 'Ex: 20,000 €' },
};

const LABELS = {
  companyName: { fr: 'Nom de votre entreprise / projet *', nl: 'Naam van uw bedrijf / project *', en: 'Company / project name *' },
  sector:      { fr: 'Secteur *', nl: 'Sector *', en: 'Sector *' },
  region:      { fr: 'Région *', nl: 'Regio *', en: 'Region *' },
  description: { fr: 'Description de votre projet *', nl: 'Beschrijving van uw project *', en: 'Project description *' },
  target:      { fr: 'Client cible', nl: 'Doelklant', en: 'Target customer' },
  revenue:     { fr: "Revenus estimés (an 1)", nl: 'Geschatte inkomsten (jaar 1)', en: 'Estimated revenue (year 1)' },
  investment:  { fr: 'Investissement initial', nl: 'Initiële investering', en: 'Initial investment' },
};

export default function BusinessPlan() {
  const { lang } = useLang();
  const [step, setStep]   = useState('form');
  const [plan, setPlan]   = useState('');
  const [form, setForm]   = useState({ companyName: '', sector: '', region: '', description: '', target: '', revenue: '', investment: '' });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleGenerate = async () => {
    if (!form.companyName || !form.sector || !form.region || !form.description) return;
    setStep('loading');

    const prompts = {
      fr: `Génère un business plan professionnel et complet en français pour: Nom: ${form.companyName}, Secteur: ${form.sector}, Région belge: ${form.region}, Description: ${form.description}, Cible: ${form.target || 'Non précisé'}, Revenus an 1: ${form.revenue || 'À définir'}, Investissement: ${form.investment || 'À définir'}. Structure: Résumé exécutif, Problème & Solution, Marché cible, Modèle économique, Avantage concurrentiel, Prévisions financières 3 ans, Plan d'action 6 mois, Risques, Subsides belges recommandés.`,
      nl: `Genereer een professioneel en volledig businessplan in het Nederlands voor: Naam: ${form.companyName}, Sector: ${form.sector}, Belgische regio: ${form.region}, Beschrijving: ${form.description}, Doelgroep: ${form.target || 'Niet opgegeven'}, Omzet jaar 1: ${form.revenue || 'Te bepalen'}, Investering: ${form.investment || 'Te bepalen'}. Structuur: Samenvatting, Probleem & Oplossing, Doelmarkt, Businessmodel, Concurrentievoordeel, Financiële prognoses 3 jaar, Actieplan 6 maanden, Risico's, Aanbevolen Belgische subsidies.`,
      en: `Generate a professional and complete business plan in English for: Name: ${form.companyName}, Sector: ${form.sector}, Belgian region: ${form.region}, Description: ${form.description}, Target: ${form.target || 'Not specified'}, Year 1 revenue: ${form.revenue || 'To be defined'}, Investment: ${form.investment || 'To be defined'}. Structure: Executive summary, Problem & Solution, Target market, Business model, Competitive advantage, 3-year financial projections, 6-month action plan, Risks, Recommended Belgian subsidies.`,
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
      setPlan(data.reply);
      setStep('results');
    } catch {
      setPlan(t('common.error', lang));
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('form');
    setPlan('');
    setForm({ companyName: '', sector: '', region: '', description: '', target: '', revenue: '', investment: '' });
  };

  return (
    <div className="bp-container">
      <div className="bp-header">
        <div className="bp-header-left">
          <span className="bp-icon">📄</span>
          <div>
            <h1>{t('businessPlan.title', lang)}</h1>
            <p>{t('businessPlan.subtitle', lang)}</p>
          </div>
        </div>
        <div className="bp-header-actions">
          {step === 'results' && (
            <>
              <button className="print-btn" onClick={() => window.print()}>{t('businessPlan.print', lang)}</button>
              <button className="reset-btn" onClick={handleReset}>{t('businessPlan.newPlan', lang)}</button>
            </>
          )}
        </div>
      </div>

      {step === 'form' && (
        <div className="bp-form">
          <div className="bp-form-grid">
            <div className="bp-field full">
              <label>{LABELS.companyName[lang]}</label>
              <input type="text" className="bp-input" placeholder={PLACEHOLDERS.companyName[lang]} value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} />
            </div>

            <div className="bp-field">
              <label>{LABELS.sector[lang]}</label>
              <div className="options-row wrap">
                {SECTORS[lang].map(s => (
                  <button key={s} className={`option-btn ${form.sector === s ? 'selected' : ''}`} onClick={() => handleChange('sector', s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="bp-field">
              <label>{LABELS.region[lang]}</label>
              <div className="options-row">
                {REGIONS.map(r => (
                  <button key={r} className={`option-btn ${form.region === r ? 'selected' : ''}`} onClick={() => handleChange('region', r)}>
                    {r === 'Bruxelles' ? '🏙️' : r === 'Wallonie' ? '🌿' : '🌊'} {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="bp-field full">
              <label>{LABELS.description[lang]}</label>
              <textarea className="bp-input" placeholder={PLACEHOLDERS.description[lang]} value={form.description} onChange={e => handleChange('description', e.target.value)} rows={4} />
            </div>

            <div className="bp-field">
              <label>{LABELS.target[lang]}</label>
              <input type="text" className="bp-input" placeholder={PLACEHOLDERS.target[lang]} value={form.target} onChange={e => handleChange('target', e.target.value)} />
            </div>

            <div className="bp-field">
              <label>{LABELS.revenue[lang]}</label>
              <input type="text" className="bp-input" placeholder={PLACEHOLDERS.revenue[lang]} value={form.revenue} onChange={e => handleChange('revenue', e.target.value)} />
            </div>

            <div className="bp-field">
              <label>{LABELS.investment[lang]}</label>
              <input type="text" className="bp-input" placeholder={PLACEHOLDERS.investment[lang]} value={form.investment} onChange={e => handleChange('investment', e.target.value)} />
            </div>
          </div>

          <button className="generate-btn" onClick={handleGenerate} disabled={!form.companyName || !form.sector || !form.region || !form.description}>
            {t('businessPlan.generate', lang)}
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="bp-loading">
          <div className="bp-spinner" />
          <p>{t('businessPlan.generating', lang)}</p>
        </div>
      )}

      {step === 'results' && (
        <div className="bp-results">
          <div className="bp-profile">
            <span>🏢 {form.companyName}</span>
            <span>📍 {form.region}</span>
            <span>🏭 {form.sector}</span>
          </div>
          <div className="bp-content">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
