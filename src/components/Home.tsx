import React from 'react';

interface HomeProps {
  language: 'es' | 'pt';
  onStartQuestionnaire: (providerName: string, financialEntityName: string, userName: string) => void;
}

const Home: React.FC<HomeProps> = ({ language, onStartQuestionnaire }) => {
  const handleStartQuestionnaire = () => {
    onStartQuestionnaire('', '', '');
  };

  return (
    <div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        {language === 'es' ? 'Bienvenido a DORA Analyzer' : 'Bem-vindo ao DORA Analyzer'}
      </h1>
      <p className="mb-6 text-sm sm:text-base">
        {language === 'es'
          ? 'DORA Analyzer es una herramienta desarrollada por Ozona Consulting para MEO para recopilar y analizar información de las entidades financieras clientes de MEO que deben tener cumplimiento con el reglamento europeo DORA.'
          : 'DORA Analyzer é uma ferramenta desenvolvida pela Ozona Consulting para a MEO para recolher e analisar informação das entidades financeiras clientes da MEO que devem estar em conformidade com o regulamento europeu DORA.'}
      </p>
      <button
        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleStartQuestionnaire}
      >
        {language === 'es' ? 'Iniciar Cuestionario' : 'Iniciar Questionário'}
      </button>
    </div>
  );
};

export default Home;