
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.politics': 'Politics',
    'nav.sports': 'Sports',
    'nav.business': 'Business',
    'nav.entertainment': 'Entertainment',
    'nav.technology': 'Technology',
    'nav.videos': 'Videos',
    'nav.live': 'Live',
    'breaking.label': 'BREAKING',
    'search.placeholder': 'Search news...',
    'newsletter.title': 'Newsletter',
    'newsletter.description': 'Subscribe to get latest news updates',
    'newsletter.button': 'Subscribe',
    'admin.dashboard': 'Admin Dashboard',
    'latest.news': 'Latest News',
    'featured.articles': 'Featured Articles',
    'live.streams': 'Live Streams',
    'categories': 'Categories',
    'date.format': 'en-US'
  },
  hi: {
    'nav.home': 'होम',
    'nav.politics': 'राजनीति',
    'nav.sports': 'खेल',
    'nav.business': 'व्यापार',
    'nav.entertainment': 'मनोरंजन',
    'nav.technology': 'तकनीक',
    'nav.videos': 'वीडियो',
    'nav.live': 'लाइव',
    'breaking.label': 'ब्रेकिंग',
    'search.placeholder': 'समाचार खोजें...',
    'newsletter.title': 'न्यूज़लेटर',
    'newsletter.description': 'नवीनतम समाचार अपडेट के लिए सब्सक्राइब करें',
    'newsletter.button': 'सब्सक्राइब करें',
    'admin.dashboard': 'एडमिन डैशबोर्ड',
    'latest.news': 'ताज़ा खबरें',
    'featured.articles': 'फीचर्ड आर्टिकल्स',
    'live.streams': 'लाइव स्ट्रीम',
    'categories': 'श्रेणियां',
    'date.format': 'hi-IN'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
