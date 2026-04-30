import { useState } from 'react';
import { supabase } from './supabase';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode]       = useState('login'); // login | register
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', region: '', sector: ''
  });

  const REGIONS  = ['Bruxelles', 'Wallonie', 'Flandre'];
  const SECTORS  = ['Tech / IT', 'Commerce', 'Horeca', 'Santé', 'Finance', 'Industrie', 'Autre'];

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Email et mot de passe requis.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password
    });
    if (error) setError(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.fullName) { setError('Tous les champs obligatoires doivent être remplis.'); return; }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } }
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Créer le profil
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: form.email,
        full_name: form.fullName,
        region: form.region,
        sector: form.sector
      });
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">B</div>
          <div>
            <div className="auth-brand-name">BizMentor AI</div>
            <div className="auth-brand-sub">Conseiller business belge</div>
          </div>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <span>💰</span>
            <div>
              <strong>Détecteur de subsides</strong>
              <p>Trouvez toutes les aides financières disponibles en Belgique</p>
            </div>
          </div>
          <div className="auth-feature">
            <span>📄</span>
            <div>
              <strong>Générateur de business plan</strong>
              <p>Créez un plan professionnel en quelques minutes</p>
            </div>
          </div>
          <div className="auth-feature">
            <span>📊</span>
            <div>
              <strong>Dashboard financier</strong>
              <p>Suivez vos revenus et dépenses en temps réel</p>
            </div>
          </div>
          <div className="auth-feature">
            <span>🤖</span>
            <div>
              <strong>Assistant IA spécialisé</strong>
              <p>Conseils adaptés à la législation belge</p>
            </div>
          </div>
        </div>
        <div className="auth-flag">🇧🇪 FR · NL · EN</div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>
              Connexion
            </button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setSuccess(''); }}>
              Créer un compte
            </button>
          </div>

          {mode === 'login' && (
            <div className="auth-form">
              <h2>Bon retour 👋</h2>
              <p className="auth-subtitle">Connectez-vous à votre espace BizMentor</p>

              <div className="field">
                <label>Email</label>
                <input type="email" className="auth-input" placeholder="vous@exemple.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
              </div>

              <div className="field">
                <label>Mot de passe</label>
                <input type="password" className="auth-input" placeholder="••••••••" value={form.password} onChange={e => handleChange('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>

              {error && <div className="auth-error">⚠️ {error}</div>}

              <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                {loading ? '⏳ Connexion...' : 'Se connecter →'}
              </button>

              <p className="auth-switch">
                Pas encore de compte ?{' '}
                <span onClick={() => setMode('register')}>Créer un compte gratuit</span>
              </p>
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-form">
              <h2>Créer votre compte 🚀</h2>
              <p className="auth-subtitle">Gratuit — aucune carte bancaire requise</p>

              <div className="field">
                <label>Nom complet *</label>
                <input type="text" className="auth-input" placeholder="Jean Dupont" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} />
              </div>

              <div className="field">
                <label>Email *</label>
                <input type="email" className="auth-input" placeholder="vous@exemple.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
              </div>

              <div className="field">
                <label>Mot de passe * (min. 6 caractères)</label>
                <input type="password" className="auth-input" placeholder="••••••••" value={form.password} onChange={e => handleChange('password', e.target.value)} />
              </div>

              <div className="field">
                <label>Votre région</label>
                <div className="options-row">
                  {REGIONS.map(r => (
                    <button key={r} className={`opt-btn ${form.region === r ? 'selected' : ''}`} onClick={() => handleChange('region', r)}>
                      {r === 'Bruxelles' ? '🏙️' : r === 'Wallonie' ? '🌿' : '🌊'} {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Votre secteur</label>
                <div className="options-row wrap">
                  {SECTORS.map(s => (
                    <button key={s} className={`opt-btn ${form.sector === s ? 'selected' : ''}`} onClick={() => handleChange('sector', s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error   && <div className="auth-error">⚠️ {error}</div>}
              {success && <div className="auth-success">✅ {success}</div>}

              <button className="auth-btn" onClick={handleRegister} disabled={loading}>
                {loading ? '⏳ Création...' : 'Créer mon compte gratuit →'}
              </button>

              <p className="auth-switch">
                Déjà un compte ?{' '}
                <span onClick={() => setMode('login')}>Se connecter</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
