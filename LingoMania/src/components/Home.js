import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      {/* Additional UI elements could be placed here */}
    </div>
  );
};

export default Home;