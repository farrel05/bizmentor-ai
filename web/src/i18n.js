// Système de traductions BizMentor AI
// FR = Français | NL = Nederlands | EN = English

export const translations = {

  // ── Navigation ────────────────────────────────────────────
  nav: {
    assistant:    { fr: 'Assistant IA',   nl: 'AI Assistent',    en: 'AI Assistant'    },
    subsidies:    { fr: 'Subsides',        nl: 'Subsidies',       en: 'Subsidies'       },
    businessPlan: { fr: 'Business Plan',   nl: 'Businessplan',    en: 'Business Plan'   },
    dashboard:    { fr: 'Dashboard',       nl: 'Dashboard',       en: 'Dashboard'       },
    simulator:    { fr: 'Simulateur',      nl: 'Simulator',       en: 'Simulator'       },
  },

  // ── Auth ──────────────────────────────────────────────────
  auth: {
    login:          { fr: 'Connexion',              nl: 'Inloggen',              en: 'Login'                },
    register:       { fr: 'Créer un compte',        nl: 'Account aanmaken',      en: 'Create account'       },
    welcome:        { fr: 'Bon retour 👋',           nl: 'Welkom terug 👋',        en: 'Welcome back 👋'      },
    createAccount:  { fr: 'Créer votre compte 🚀',  nl: 'Maak uw account aan 🚀', en: 'Create your account 🚀'},
    free:           { fr: 'Gratuit — aucune carte bancaire requise', nl: 'Gratis — geen creditcard vereist', en: 'Free — no credit card required' },
    email:          { fr: 'Email',                  nl: 'E-mail',                en: 'Email'                },
    password:       { fr: 'Mot de passe',           nl: 'Wachtwoord',            en: 'Password'             },
    fullName:       { fr: 'Nom complet',            nl: 'Volledige naam',         en: 'Full name'            },
    region:         { fr: 'Votre région',           nl: 'Uw regio',              en: 'Your region'          },
    sector:         { fr: 'Votre secteur',          nl: 'Uw sector',             en: 'Your sector'          },
    loginBtn:       { fr: 'Se connecter →',         nl: 'Inloggen →',            en: 'Sign in →'            },
    registerBtn:    { fr: 'Créer mon compte gratuit →', nl: 'Gratis account aanmaken →', en: 'Create free account →' },
    alreadyAccount: { fr: 'Déjà un compte ?',       nl: 'Al een account?',       en: 'Already have an account?' },
    noAccount:      { fr: 'Pas encore de compte ?', nl: 'Nog geen account?',     en: "Don't have an account?" },
    signIn:         { fr: 'Se connecter',           nl: 'Inloggen',              en: 'Sign in'              },
    createFree:     { fr: 'Créer un compte gratuit', nl: 'Gratis account aanmaken', en: 'Create free account' },
  },

  // ── Assistant IA ──────────────────────────────────────────
  chat: {
    title:       { fr: 'Assistant IA',                        nl: 'AI Assistent',                      en: 'AI Assistant'                      },
    subtitle:    { fr: 'Conseiller business belge · en ligne', nl: 'Belgische business adviseur · online', en: 'Belgian business advisor · online' },
    placeholder: { fr: 'Posez votre question business...',    nl: 'Stel uw bedrijfsvraag...',           en: 'Ask your business question...'     },
    send:        { fr: 'Envoyer →',                           nl: 'Versturen →',                       en: 'Send →'                            },
    newChat:     { fr: '+ Nouvelle conversation',             nl: '+ Nieuw gesprek',                   en: '+ New conversation'                },
    welcome:     { fr: 'Bonjour ! Je suis BizMentor AI, votre conseiller business belge. Comment puis-je vous aider ?',
                   nl: 'Hallo! Ik ben BizMentor AI, uw Belgische bedrijfsadviseur. Hoe kan ik u helpen?',
                   en: 'Hello! I am BizMentor AI, your Belgian business advisor. How can I help you?' },
    suggestions: {
      fr: ['💰 Subsides pour startup à Bruxelles', '🏢 Créer une SRL en Belgique', '📄 Générer mon business plan', '📊 Optimiser ma TVA belge'],
      nl: ['💰 Subsidies voor startup in Brussel', '🏢 Een BV oprichten in België', '📄 Mijn businessplan genereren', '📊 Mijn BTW optimaliseren'],
      en: ['💰 Subsidies for startup in Brussels', '🏢 Create a company in Belgium', '📄 Generate my business plan', '📊 Optimize my Belgian VAT'],
    }
  },

  // ── Subsides ──────────────────────────────────────────────
  subsidies: {
    title:       { fr: 'Détecteur de Subsides',    nl: 'Subsidiedetector',         en: 'Subsidy Detector'          },
    subtitle:    { fr: 'Trouvez les aides financières disponibles pour votre projet en Belgique',
                   nl: 'Vind de beschikbare financiële steun voor uw project in België',
                   en: 'Find the available financial support for your project in Belgium' },
    yourRegion:  { fr: 'Votre région *',           nl: 'Uw regio *',               en: 'Your region *'             },
    yourSector:  { fr: 'Votre secteur *',          nl: 'Uw sector *',              en: 'Your sector *'             },
    yourStage:   { fr: 'Stade de votre projet *',  nl: 'Stadium van uw project *', en: 'Stage of your project *'   },
    employees:   { fr: "Nombre d'employés",        nl: 'Aantal werknemers',        en: 'Number of employees'       },
    describe:    { fr: 'Décrivez brièvement votre projet', nl: 'Beschrijf kort uw project', en: 'Briefly describe your project' },
    search:      { fr: '🔍 Détecter mes subsides', nl: '🔍 Mijn subsidies detecteren', en: '🔍 Detect my subsidies'  },
    newSearch:   { fr: '← Nouvelle recherche',    nl: '← Nieuwe zoekopdracht',    en: '← New search'              },
    analyzing:   { fr: 'Analyse des subsides disponibles pour votre profil...', nl: 'Beschikbare subsidies analyseren...', en: 'Analyzing available subsidies for your profile...' },
  },

  // ── Business Plan ─────────────────────────────────────────
  businessPlan: {
    title:      { fr: 'Générateur de Business Plan', nl: 'Businessplan Generator',   en: 'Business Plan Generator'  },
    subtitle:   { fr: 'Créez un business plan professionnel prêt pour les banques et investisseurs belges',
                  nl: 'Maak een professioneel businessplan klaar voor Belgische banken en investeerders',
                  en: 'Create a professional business plan ready for Belgian banks and investors' },
    generate:   { fr: '✨ Générer mon Business Plan', nl: '✨ Mijn businessplan genereren', en: '✨ Generate my Business Plan' },
    newPlan:    { fr: '← Nouveau plan',            nl: '← Nieuw plan',             en: '← New plan'               },
    print:      { fr: '🖨️ Imprimer',               nl: '🖨️ Afdrukken',             en: '🖨️ Print'                 },
    generating: { fr: 'Génération de votre business plan en cours...', nl: 'Uw businessplan wordt gegenereerd...', en: 'Generating your business plan...' },
  },

  // ── Dashboard ─────────────────────────────────────────────
  dashboard: {
    title:       { fr: 'Dashboard Financier',       nl: 'Financieel Dashboard',     en: 'Financial Dashboard'      },
    addTx:       { fr: '+ Ajouter transaction',     nl: '+ Transactie toevoegen',   en: '+ Add transaction'        },
    cancel:      { fr: '✕ Annuler',                 nl: '✕ Annuleren',              en: '✕ Cancel'                 },
    aiAnalysis:  { fr: '🤖 Analyse IA',             nl: '🤖 AI Analyse',            en: '🤖 AI Analysis'           },
    analyzing:   { fr: '⏳ Analyse...',              nl: '⏳ Analyseren...',          en: '⏳ Analyzing...'           },
    revenue:     { fr: 'Revenus ce mois',           nl: 'Omzet deze maand',         en: 'Revenue this month'       },
    expenses:    { fr: 'Dépenses',                  nl: 'Uitgaven',                 en: 'Expenses'                 },
    margin:      { fr: 'Marge nette',               nl: 'Nettomarge',               en: 'Net margin'               },
    profit:      { fr: 'Bénéfice net',              nl: 'Nettowinst',               en: 'Net profit'               },
    save:        { fr: '✓ Enregistrer dans Supabase', nl: '✓ Opslaan in Supabase', en: '✓ Save to Supabase'       },
    saving:      { fr: '⏳ Sauvegarde...',           nl: '⏳ Opslaan...',            en: '⏳ Saving...'              },
    transactions:{ fr: 'Transactions',              nl: 'Transacties',              en: 'Transactions'             },
    noTx:        { fr: 'Aucune transaction encore', nl: 'Nog geen transacties',     en: 'No transactions yet'      },
    addFirst:    { fr: 'Cliquez sur "+ Ajouter transaction" pour commencer', nl: 'Klik op "+ Transactie toevoegen" om te beginnen', en: 'Click "+ Add transaction" to get started' },
    income:      { fr: '💚 Revenu',                 nl: '💚 Inkomsten',             en: '💚 Income'                },
    expense:     { fr: '🔴 Dépense',                nl: '🔴 Uitgave',               en: '🔴 Expense'               },
    label:       { fr: 'Libellé *',                 nl: 'Omschrijving *',           en: 'Label *'                  },
    amount:      { fr: 'Montant (€) *',             nl: 'Bedrag (€) *',             en: 'Amount (€) *'             },
    category:    { fr: 'Catégorie *',               nl: 'Categorie *',              en: 'Category *'               },
    date:        { fr: 'Date',                      nl: 'Datum',                    en: 'Date'                     },
    seeAll:      { fr: 'Voir tout',                 nl: 'Alles bekijken',           en: 'See all'                  },
    seeLess:     { fr: 'Voir moins',                nl: 'Minder weergeven',         en: 'See less'                 },
  },

  // ── Simulateur ────────────────────────────────────────────
  simulator: {
    title:    { fr: 'Simulateur de Décision',  nl: 'Beslissingssimulator',    en: 'Decision Simulator'      },
    subtitle: { fr: 'Analysez vos dilemmes stratégiques avec l\'IA — contexte belge garanti',
                nl: 'Analyseer uw strategische dilemma\'s met AI — Belgische context gegarandeerd',
                en: 'Analyze your strategic dilemmas with AI — Belgian context guaranteed' },
    choose:   { fr: 'Choisissez un dilemme stratégique à analyser :',
                nl: 'Kies een strategisch dilemma om te analyseren:',
                en: 'Choose a strategic dilemma to analyze:' },
    analyze:  { fr: 'Analyser →',  nl: 'Analyseren →', en: 'Analyze →'   },
    launch:   { fr: '🔍 Lancer l\'analyse', nl: '🔍 Analyse starten', en: '🔍 Launch analysis' },
    newSim:   { fr: '🎯 Nouveau scénario',  nl: '🎯 Nieuw scenario',  en: '🎯 New scenario'    },
    back:     { fr: '← Nouveau scénario',  nl: '← Nieuw scenario',   en: '← New scenario'    },
    context:  { fr: 'Contexte de votre situation (optionnel)', nl: 'Context van uw situatie (optioneel)', en: 'Context of your situation (optional)' },
    analyzing:{ fr: 'Analyse en cours...', nl: 'Analyseren...', en: 'Analyzing...' },
  },

  // ── Commun ────────────────────────────────────────────────
  common: {
    loading:     { fr: 'Chargement...',    nl: 'Laden...',         en: 'Loading...'       },
    error:       { fr: 'Erreur de connexion. Vérifiez votre réseau.', nl: 'Verbindingsfout. Controleer uw netwerk.', en: 'Connection error. Check your network.' },
    logout:      { fr: 'Déconnexion',      nl: 'Uitloggen',        en: 'Logout'           },
    save:        { fr: 'Enregistrer',      nl: 'Opslaan',          en: 'Save'             },
    cancel:      { fr: 'Annuler',          nl: 'Annuleren',        en: 'Cancel'           },
    back:        { fr: 'Retour',           nl: 'Terug',            en: 'Back'             },
    excellent:   { fr: '↑ Excellente',     nl: '↑ Uitstekend',     en: '↑ Excellent'      },
    correct:     { fr: '→ Correcte',       nl: '→ Correct',        en: '→ Correct'        },
    improve:     { fr: '↓ À améliorer',    nl: '↓ Te verbeteren',  en: '↓ To improve'     },
    positive:    { fr: '↑ Positif',        nl: '↑ Positief',       en: '↑ Positive'       },
    negative:    { fr: '↓ Négatif',        nl: '↓ Negatief',       en: '↓ Negative'       },
    noData:      { fr: '→ Aucune donnée',  nl: '→ Geen gegevens',  en: '→ No data'        },
    firstMonth:  { fr: '→ Premier mois',   nl: '→ Eerste maand',   en: '→ First month'    },
    thisMonth:   { fr: '→ Ce mois',        nl: '→ Deze maand',     en: '→ This month'     },
  }
};

// Fonction helper pour récupérer une traduction
export function t(key, lang = 'fr') {
  const keys = key.split('.');
  let value = translations;
  for (const k of keys) {
    value = value?.[k];
  }
  return value?.[lang] || value?.['fr'] || key;
}
