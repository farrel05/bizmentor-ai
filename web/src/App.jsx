import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import LanguageSwitcher from './LanguageSwitcher';
import AuthPage from './AuthPage';
import ChatScreen from './ChatScreen';
import Subsidies from './Subsidies';
import BusinessPlan from './BusinessPlan';
import Dashboard from './Dashboard';
import Simulator from './Simulator';
import './App.css';

const NAV_CONFIG = [
  { id: 'chat',         icon: '💬', labelKey: 'nav.assistant'    },
  { id: 'subsidies',    icon: '💰', labelKey: 'nav.subsidies'    },
  { id: 'businessplan', icon: '📄', labelKey: 'nav.businessPlan' },
  { id: 'dashboard',    icon: '📊', labelKey: 'nav.dashboard'    },
  { id: 'simulator',    icon: '🎯', labelKey: 'nav.simulator'    },
];

export default function App() {
  const { lang }                       = useLang();
  const [session, setSession]          = useState(null);
  const [loading, setLoading]          = useState(true);
  const [activeSection, setActive]     = useState('chat');
  const [profile, setProfile]          = useState(null);

  const loadProfile = async (userId) => {
   const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
   if (data) setProfile({ ...data, id: userId });
   else setProfile({ id: userId });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">B</div>
        <p>BizMentor AI</p>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  const renderSection = () => {
    switch (activeSection) {
      case 'chat':         return <ChatScreen userProfile={profile} />;
      case 'subsidies':    return <Subsidies />;
      case 'businessplan': return <BusinessPlan />;
      case 'dashboard':    return <Dashboard userId={session.user.id} />;
      case 'simulator':    return <Simulator />;
      default:             return <ChatScreen userProfile={profile} />;
    }
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : session.user.email[0].toUpperCase();

  return (
    <div className="app-wrapper">

      {/* ── Sidebar Desktop ───────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">B</div>
          <div>
            <div className="logo-title">BizMentor</div>
            <div className="logo-sub">AI Belge</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_CONFIG.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              {item.icon} {t(item.labelKey, lang)}
            </div>
          ))}
        </nav>
        <LanguageSwitcher />
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{profile?.full_name || 'Mon compte'}</div>
            <div className="user-email">{session.user.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title={t('common.logout', lang)}>↩</button>
        </div>
      </aside>

      {/* ── Header Mobile ─────────────────────────── */}
      <div className="mobile-header">
        <div className="mobile-header-logo">
          <div className="mobile-logo-icon">B</div>
          <span className="mobile-logo-text">BizMentor AI</span>
        </div>
        <div className="mobile-header-actions">
          <LanguageSwitcher compact />
          <div className="mobile-user-avatar">{initials}</div>
          <button className="mobile-logout" onClick={handleLogout}>↩</button>
        </div>
      </div>

      {/* ── Contenu principal ─────────────────────── */}
      <div className="main-content">
        {renderSection()}
      </div>

      {/* ── Navigation Mobile en bas ──────────────── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {NAV_CONFIG.map(item => (
            <div
              key={item.id}
              className={`mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{t(item.labelKey, lang)}</span>
            </div>
          ))}
        </div>
      </nav>

    </div>
  );
}
