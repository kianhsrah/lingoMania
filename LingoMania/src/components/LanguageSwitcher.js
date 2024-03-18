import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).catch(error => console.error("Error changing language:", error.message, error.stack));
    console.log(`Language changed to: ${lng}`);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('es')}>ES</button>
      <button onClick={() => changeLanguage('fr')}>FR</button>
    </div>
  );
};

export default LanguageSwitcher;