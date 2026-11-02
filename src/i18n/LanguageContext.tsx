import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (path: string, fallback?: string) => string;
  formatPrice: (amount: number, currency?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('daratelier_lang') as Language;
    return saved && ['fr', 'ar', 'en'].includes(saved) ? saved : 'fr';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('daratelier_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language, isRTL]);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to French if translation is missing in Arabic or English
        let fallbackVal: any = translations['fr'];
        for (const fKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fKey in fallbackVal) {
            fallbackVal = fallbackVal[fKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  const formatPrice = (amount: number, currency: string = 'MAD'): string => {
    if (amount === undefined || amount === null) return '';

    if (language === 'ar') {
      const formatted = new Intl.NumberFormat('ar-MA').format(amount);
      return `${formatted} درهم`;
    }

    if (language === 'en') {
      const formatted = new Intl.NumberFormat('en-US').format(amount);
      return `${currency} ${formatted}`;
    }

    // Default French
    const formatted = new Intl.NumberFormat('fr-FR').format(amount);
    return `${formatted} DH`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
