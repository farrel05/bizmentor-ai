import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from './supabase';
import { useLang } from './LanguageContext';
import { t } from './i18n';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MONTHS = {
  fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  nl: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const CATEGORIES = {
  income: {
    fr: ['Abonnement', 'Vente', 'Prestation', 'Subside', 'Remboursement', 'Autre'],
    nl: ['Abonnement', 'Verkoop', 'Dienst', 'Subsidie', 'Terugbetaling', 'Andere'],
    en: ['Subscription', 'Sale', 'Service', 'Subsidy', 'Reimbursement', 'Other'],
  },
  expense: {
    fr: ['Hébergement', 'Marketing', 'Salaire', 'Logiciels', 'Bureau', 'TVA', 'Cotisations', 'Autre'],
    nl: ['Hosting', 'Marketing', 'Salaris', 'Software', 'Kantoor', 'BTW', 'Bijdragen', 'Andere'],
    en: ['Hosting', 'Marketing', 'Salary', 'Software', 'Office', 'VAT', 'Contributions', 'Other'],
  }
};

export default function Dashboard({ userId }) {
  const { lang } = useLang();
  const months   = MONTHS[lang] || MONTHS.fr;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [aiTip, setAiTip]               = useState('');
  const [loadingTip, setLoadingTip]     = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [showAll, setShowAll]           = useState(false);
  const [form, setForm] = useState({
    type: 'income', label: '', amount: '', category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadTransactions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false });
    if (!error && data) setTransactions(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const now       = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();

  const ofMonth = (t, m, y) => { const d = new Date(t.date); return d.getMonth() === m && d.getFullYear() === y; };

  const revenue  = transactions.filter(t => t.type === 'income'  && ofMonth(t, thisMonth, thisYear)).reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.type === 'expense' && ofMonth(t, thisMonth, thisYear)).reduce((s, t) => s + Number(t.amount), 0);
  const profit   = revenue - expenses;
  const margin   = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(thisYear, thisMonth - 5 + i, 1);
    return { month: months[d.getMonth()], year: d.getFullYear(), m: d.getMonth() };
  });

  const chartData = last6.map(({ month, m, year }) => ({
    month,
    value: transactions.filter(t => t.type === 'income' && ofMonth(t, m, year)).reduce((s, t) => s + Number(t.amount), 0)
  }));

  const maxVal      = Math.max(...chartData.map(d => d.value), 1);
  const prevMonth   = thisMonth === 0 ? 11 : thisMonth - 1;
  const prevYear    = thisMonth === 0 ? thisYear - 1 : thisYear;
  const prevRevenue = transactions.filter(t => t.type === 'income' && ofMonth(t, prevMonth, prevYear)).reduce((s, t) => s + Number(t.amount), 0);
  const growthPct   = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : null;

  const handleAdd = async () => {
    if (!form.label || !form.amount || !form.category) return;
    setSaving(true);
    const { data, error } = await supabase.from('transactions').insert({
      user_id: userId, type: form.type, label: form.label,
      amount: parseFloat(form.amount), category: form.category, date: form.date
    }).select().single();
    if (!error && data) {
      setTransactions(prev => [data, ...prev]);
      setForm({ type: 'income', label: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from('transactions').delete().eq('id', id);
    setTransactions(prev => prev.filter(tr => tr.id !== id));
  };

  const getAiAnalysis = async () => {
    setLoadingTip(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Analyze these financial figures for a Belgian entrepreneur and give 3 concrete tips: Revenue: ${revenue}€, Expenses: ${expenses}€, Net profit: ${profit}€, Net margin: ${margin}%` }],
          userProfile: { language: lang }
        })
      });
      const data = await res.json();
      setAiTip(data.reply);
    } catch { setAiTip(t('common.error', lang)); }
    finally { setLoadingTip(false); }
  };

  const displayed = showAll ? transactions : transactions.slice(0, 8);

  if (loading) return (
    <div className="dashboard-container">
      <div className="dash-loading"><div className="bp-spinner" /><p>{t('common.loading', lang)}</p></div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="dashboard-icon">📊</span>
          <div>
            <h1>{t('dashboard.title', lang)}</h1>
            <p>{months[thisMonth]} {thisYear} · ☁️</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? t('dashboard.cancel', lang) : t('dashboard.addTx', lang)}
          </button>
          <button className="ai-btn" onClick={getAiAnalysis} disabled={loadingTip || transactions.length === 0}>
            {loadingTip ? t('dashboard.analyzing', lang) : t('dashboard.aiAnalysis', lang)}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-panel">
          <div className="form-row">
            <div className="form-group">
              <label>{t('dashboard.date', lang)}</label>
              <div className="type-toggle">
                <button className={form.type === 'income' ? 'active income' : ''} onClick={() => setForm(f => ({ ...f, type: 'income', category: '' }))}>{t('dashboard.income', lang)}</button>
                <button className={form.type === 'expense' ? 'active expense' : ''} onClick={() => setForm(f => ({ ...f, type: 'expense', category: '' }))}>{t('dashboard.expense', lang)}</button>
              </div>
            </div>
            <div className="form-group">
              <label>{t('dashboard.label', lang)}</label>
              <input className="form-input" placeholder="Ex: Client A" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t('dashboard.amount', lang)}</label>
              <input className="form-input" type="number" placeholder="490" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>{t('dashboard.category', lang)}</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">...</option>
                {CATEGORIES[form.type][lang].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('dashboard.date', lang)}</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <button className="save-btn" onClick={handleAdd} disabled={saving || !form.label || !form.amount || !form.category}>
            {saving ? t('dashboard.saving', lang) : t('dashboard.save', lang)}
          </button>
        </div>
      )}

      <div className="dashboard-body">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">{t('dashboard.revenue', lang)}</div>
            <div className="kpi-value">{revenue.toLocaleString('fr-BE')} €</div>
            <div className={`kpi-trend ${growthPct === null ? 'neutral' : growthPct >= 0 ? 'positive' : 'negative'}`}>
              {growthPct === null ? t('common.firstMonth', lang) : `${growthPct >= 0 ? '↑' : '↓'} ${growthPct > 0 ? '+' : ''}${growthPct}%`}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{t('dashboard.expenses', lang)}</div>
            <div className="kpi-value">{expenses.toLocaleString('fr-BE')} €</div>
            <div className="kpi-trend neutral">{t('common.thisMonth', lang)}</div>
          </div>
          <div className={`kpi-card ${revenue > 0 ? 'accent' : ''}`}>
            <div className="kpi-label">{t('dashboard.margin', lang)}</div>
            <div className="kpi-value">{margin}%</div>
            <div className="kpi-trend positive">{margin >= 60 ? t('common.excellent', lang) : margin >= 30 ? t('common.correct', lang) : revenue > 0 ? t('common.improve', lang) : t('common.noData', lang)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{t('dashboard.profit', lang)}</div>
            <div className="kpi-value">{profit.toLocaleString('fr-BE')} €</div>
            <div className={`kpi-trend ${profit >= 0 ? 'positive' : 'negative'}`}>{profit >= 0 ? t('common.positive', lang) : t('common.negative', lang)}</div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="chart-card">
            <div className="card-title">
              {{ fr: 'Évolution des revenus (6 mois)', nl: 'Omzetevolutie (6 maanden)', en: 'Revenue evolution (6 months)' }[lang]}
            </div>
            {chartData.every(d => d.value === 0) ? (
              <div className="empty-chart">📈</div>
            ) : (
              <div className="bar-chart">
                {chartData.map((d, i) => (
                  <div key={i} className="bar-col">
                    <div className="bar-label-top">{d.value > 0 ? (d.value >= 1000 ? `${(d.value/1000).toFixed(1)}k` : d.value) + '€' : ''}</div>
                    <div className={`bar ${i === chartData.length - 1 ? 'current' : ''}`} style={{ height: `${Math.max((d.value / maxVal) * 150, d.value > 0 ? 8 : 2)}px` }} />
                    <div className="bar-label">{d.month}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="alerts-card">
            <div className="card-title">⚡ {{ fr: 'Alertes & Rappels', nl: 'Meldingen', en: 'Alerts & Reminders' }[lang]}</div>
            <div className="alerts-list">
              <div className="alert-item"><span className="alert-dot orange" /><div><div className="alert-title">{{ fr: 'TVA trimestrielle', nl: 'Kwartaal BTW', en: 'Quarterly VAT' }[lang]}</div><div className="alert-sub">{{ fr: 'Vérifiez votre échéance', nl: 'Controleer uw deadline', en: 'Check your deadline' }[lang]}</div></div></div>
              <div className="alert-item"><span className="alert-dot green" /><div><div className="alert-title">{{ fr: 'Subside Brustart', nl: 'Brustart subsidie', en: 'Brustart subsidy' }[lang]}</div><div className="alert-sub">{{ fr: "Jusqu'à 250 000€", nl: 'Tot 250.000€', en: 'Up to 250,000€' }[lang]}</div></div></div>
              <div className="alert-item"><span className="alert-dot blue" /><div><div className="alert-title">{{ fr: 'Cotisations sociales', nl: 'Sociale bijdragen', en: 'Social contributions' }[lang]}</div><div className="alert-sub">{{ fr: 'Provisionnez 20-25%', nl: 'Voorzie 20-25%', en: 'Provision 20-25%' }[lang]}</div></div></div>
            </div>
          </div>
        </div>

        {aiTip && (
          <div className="ai-analysis-card">
            <div className="card-title">🤖 {{ fr: 'Analyse IA', nl: 'AI Analyse', en: 'AI Analysis' }[lang]}</div>
            <div className="ai-analysis-content"><ReactMarkdown>{aiTip}</ReactMarkdown></div>
          </div>
        )}

        <div className="transactions-card">
          <div className="transactions-header">
            <div className="card-title" style={{ margin: 0 }}>
              {t('dashboard.transactions', lang)}
              {transactions.length > 0 && <span className="count-badge">{transactions.length}</span>}
            </div>
            {transactions.length > 8 && (
              <button className="show-all-btn" onClick={() => setShowAll(v => !v)}>
                {showAll ? t('dashboard.seeLess', lang) : `${t('dashboard.seeAll', lang)} (${transactions.length})`}
              </button>
            )}
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <p>{t('dashboard.noTx', lang)}</p>
              <span>{t('dashboard.addFirst', lang)}</span>
            </div>
          ) : (
            <div className="transactions-list">
              {displayed.map(tr => (
                <div key={tr.id} className="transaction-item">
                  <div className="transaction-icon">{tr.type === 'income' ? '💚' : '🔴'}</div>
                  <div className="transaction-info">
                    <div className="transaction-label">{tr.label}</div>
                    <div className="transaction-meta">
                      <span className="transaction-category">{tr.category}</span>
                      <span className="transaction-date">{new Date(tr.date).toLocaleDateString('fr-BE')}</span>
                    </div>
                  </div>
                  <div className={`transaction-amount ${tr.type}`}>
                    {tr.type === 'income' ? '+' : '-'}{Number(tr.amount).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(tr.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
