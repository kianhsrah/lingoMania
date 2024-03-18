import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure this import path matches your project structure
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

console.log('i18n initialized and React app mounted.');