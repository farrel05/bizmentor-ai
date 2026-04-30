import { useLang } from './LanguageContext';
import './LanguageSwitcher.css';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'nl', label: 'NL' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { lang, changeLang } = useLang();

  return (
    <div className={`lang-switcher ${compact ? 'compact' : ''}`}>
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`lang-btn ${lang === l.code ? 'active' : ''}`}
          onClick={() => changeLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
