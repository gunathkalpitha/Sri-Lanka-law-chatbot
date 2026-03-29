import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './locales.json';

const resources = {
  en: { translation: translations.en },
  si: { translation: translations.si },
  ta: { translation: translations.ta },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
