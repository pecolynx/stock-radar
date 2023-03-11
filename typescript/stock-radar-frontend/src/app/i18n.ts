import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';

export const initI18n = () => {
  const f = async () => {
    await use(initReactI18next).init({
      resources: {
        en: {
          translation: {
            Delete: 'Delete',
          },
        },
        ja: {
          translation: {
            Delete: '削除する',
          },
        },
      },
      lng: 'ja',
      fallbackLng: 'ja',
      interpolation: { escapeValue: false },
    });
  };
  f().catch(console.error);
};
