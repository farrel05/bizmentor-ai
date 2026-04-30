import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import './Subsidies.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const REGIONS = ['Bruxelles', 'Wallonie', 'Flandre'];

const SECTORS = {
  fr: ['Tech / IT', 'Commerce', 'Horeca', 'Santé', 'Education', 'Finance', 'Industrie', 'Autre'],
  nl: ['Tech / IT', 'Handel', 'Horeca', 'Gezondheidszorg', 'Onderwijs', 'Financiën', 'Industrie', 'Andere'],
  en: ['Tech / IT', 'Commerce', 'Horeca', 'Healthcare', 'Education', 'Finance', 'Industry', 'Other'],
};

const STAGES = {
  fr: ['Idée', 'Démarrage (0-1 an)', 'Croissance (1-3 ans)', 'Expansion (3+ ans)'],
  nl: ['Idee', 'Opstartfase (0-1 jaar)', 'Groei (1-3 jaar)', 'Expansie (3+ jaar)'],
  en: ['Idea', 'Startup (0-1 year)', 'Growth (1-3 years)', 'Expansion (3+ years)'],
};

export default function Subsidies() {
  const { lang } = useLang();
  const [step, setStep]     = useState('form');
  const [results, setResults] = useState('');
  const [form, setForm]     = useState({ region: '', sector: '', stage: '', employees: '', description: '' });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSearch = async () => {
    if (!form.region || !form.sector || !form.stage) return;
    setStep('loading');
    try {
      const prompts = {
        fr: `Tu es un expert en subsides belges. Liste tous les subsides disponibles pour: Région: ${form.region}, Secteur: ${form.sector}, Stade: ${form.stage}, Employés: ${form.employees || 0}. Pour chaque subside: nom, organisme, montant max, conditions, délai, contact. Réponds en français.`,
        nl: `Je bent een expert in Belgische subsidies. Lijst alle beschikbare subsidies voor: Regio: ${form.region}, Sector: ${form.sector}, Stadium: ${form.stage}, Werknemers: ${form.employees || 0}. Voor elke subsidie: naam, organisatie, max bedrag, voorwaarden, termijn, contact. Antwoord in het Nederlands.`,
        en: `You are a Belgian subsidies expert. List all available subsidies for: Region: ${form.region}, Sector: ${form.sector}, Stage: ${form.stage}, Employees: ${form.employees || 0}. For each subsidy: name, organization, max amount, conditions, deadline, contact. Reply in English.`,
      };

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompts[lang] }],
          userProfile: { language: lang }
        })
      });
      const data = await res.json();
      setResults(data.reply);
      setStep('results');
    } catch {
      setResults(t('common.error', lang));
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('form');
    setResults('');
    setForm({ region: '', sector: '', stage: '', employees: '', description: '' });
  };

  return (
    <div className="subsidies-container">
      <div className="subsidies-header">
        <div className="subsidies-header-left">
          <span className="subsidies-icon">💰</span>
          <div>
            <h1>{t('subsidies.title', lang)}</h1>
            <p>{t('subsidies.subtitle', lang)}</p>
          </div>
        </div>
        {step === 'results' && (
          <button className="reset-btn" onClick={handleReset}>{t('subsidies.newSearch', lang)}</button>
        )}
      </div>

      {step === 'form' && (
        <div className="form-container">
          <div className="form-grid">
            <div className="form-group">
              <label>{t('subsidies.yourRegion', lang)}</label>
              <div className="options-row">
                {REGIONS.map(r => (
                  <button key={r} className={`option-btn ${form.region === r ? 'selected' : ''}`} onClick={() => handleChange('region', r)}>
                    {r === 'Bruxelles' ? '🏙️' : r === 'Wallonie' ? '🌿' : '🌊'} {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('subsidies.yourSector', lang)}</label>
              <div className="options-row wrap">
                {SECTORS[lang].map(s => (
                  <button key={s} className={`option-btn ${form.sector === s ? 'selected' : ''}`} onClick={() => handleChange('sector', s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('subsidies.yourStage', lang)}</label>
              <div className="options-row wrap">
                {STAGES[lang].map(s => (
                  <button key={s} className={`option-btn ${form.stage === s ? 'selected' : ''}`} onClick={() => handleChange('stage', s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('subsidies.employees', lang)}</label>
              <input type="number" className="text-input" placeholder="Ex: 3" value={form.employees} onChange={e => handleChange('employees', e.target.value)} min="0" />
            </div>

            <div className="form-group full">
              <label>{t('subsidies.describe', lang)}</label>
              <textarea className="text-input" placeholder="Ex: Application mobile..." value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
            </div>
          </div>

          <button className="search-btn" onClick={handleSearch} disabled={!form.region || !form.sector || !form.stage}>
            {t('subsidies.search', lang)}
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>{t('subsidies.analyzing', lang)}</p>
          <span>🇧🇪</span>
        </div>
      )}

      {step === 'results' && (
        <div className="results-container">
          <div className="results-profile">
            <span>🏷️ {form.region}</span>
            <span>🏢 {form.sector}</span>
            <span>📈 {form.stage}</span>
          </div>
          <div className="results-content">
            <ReactMarkdown>{results}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
