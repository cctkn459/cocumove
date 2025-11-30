import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import esCommon from './locales/es/common.json';
import enCommon from './locales/en/common.json';
import ptCommon from './locales/pt/common.json';
import frCommon from './locales/fr/common.json';

const resources = {
  es: { common: esCommon },
  en: { common: enCommon },
  pt: { common: ptCommon },
  fr: { common: frCommon },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

