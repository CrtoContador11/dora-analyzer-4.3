import React from 'react';

interface LanguageSelectorProps {
  language: 'es' | 'pt';
  setLanguage: (lang: 'es' | 'pt') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex space-x-2">
      <button
        className={`p-1 rounded ${language === 'es' ? 'bg-blue-500' : 'bg-gray-600'}`}
        onClick={() => setLanguage('es')}
      >
        <img src="https://flagcdn.com/w20/es.png" alt="Español" className="w-4 h-3 sm:w-5 sm:h-3" />
      </button>
      <button
        className={`p-1 rounded ${language === 'pt' ? 'bg-blue-500' : 'bg-gray-600'}`}
        onClick={() => setLanguage('pt')}
      >
        <img src="https://flagcdn.com/w20/pt.png" alt="Português" className="w-4 h-3 sm:w-5 sm:h-3" />
      </button>
    </div>
  );
};

export default LanguageSelector;