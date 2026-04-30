import { useLang } from './LanguageContext';
import './LanguageSwitcher.css';

const LANGS = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'nl', label: 'NL', flag: '🇳🇱' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLang();

  return (
    <div className="lang-switcher">
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`lang-btn ${lang === l.code ? 'active' : ''}`}
          onClick={() => changeLang(l.code)}
          title={l.flag}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
