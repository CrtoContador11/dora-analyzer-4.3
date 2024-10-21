import React, { useState, useEffect } from 'react';
import { Question, Category, FormDataType, Draft } from '../types';
import ProgressBar from './ProgressBar';

interface FormProps {
  onSubmit: (data: FormDataType) => void;
  onSaveDraft: (draft: Draft) => void;
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
  userName: string;
  providerName: string;
  financialEntityName: string;
  currentDraft: Draft | null;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  onSaveDraft,
  questions,
  categories,
  language,
  userName,
  providerName,
  financialEntityName,
  currentDraft
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [observations, setObservations] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const [localUserName, setLocalUserName] = useState(userName);
  const [localProviderName, setLocalProviderName] = useState(providerName);
  const [localFinancialEntityName, setLocalFinancialEntityName] = useState(financialEntityName);

  useEffect(() => {
    if (currentDraft) {
      setAnswers(currentDraft.answers);
      setObservations(currentDraft.observations);
      setCurrentQuestionIndex(currentDraft.lastQuestionIndex);
      setLocalUserName(currentDraft.userName);
      setLocalProviderName(currentDraft.providerName);
      setLocalFinancialEntityName(currentDraft.financialEntityName);
    }
  }, [currentDraft]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentQuestionIndex >= 0 
    ? ((currentQuestionIndex + (answers[currentQuestion?.id] !== undefined ? 1 : 0)) / questions.length) * 100 
    : 0;

  const handleStartQuestionnaire = () => {
    if (!localProviderName.trim() || !localFinancialEntityName.trim() || !localUserName.trim()) {
      setError(language === 'es' 
        ? 'Por favor, complete todos los campos.' 
        : 'Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleObservation = (value: string) => {
    setObservations({ ...observations, [currentQuestion.id]: value });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentQuestionIndex(-1);
    }
  };

  const handleSubmit = () => {
    const formData: FormDataType = {
      providerName: localProviderName,
      financialEntityName: localFinancialEntityName,
      userName: localUserName,
      answers,
      observations,
      date: currentDraft ? currentDraft.date : new Date().toISOString(),
    };
    onSubmit(formData);
  };

  const handleSaveDraft = () => {
    const draft: Draft = {
      providerName: localProviderName,
      financialEntityName: localFinancialEntityName,
      userName: localUserName,
      answers,
      observations,
      date: currentDraft ? currentDraft.date : new Date().toISOString(),
      lastQuestionIndex: currentQuestionIndex,
      isCompleted: false,
    };
    onSaveDraft(draft);
  };

  const replaceVariables = (text: string) => {
    return text
      .replace('{providerName}', localProviderName)
      .replace('{financialEntityName}', localFinancialEntityName);
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isLastQuestionAnswered = isLastQuestion && answers[currentQuestion?.id] !== undefined;

  return (
    <div className="bg-white shadow-lg rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        {language === 'es' ? 'Cuestionario DORA' : 'Questionário DORA'}
      </h2>
      {currentQuestionIndex >= 0 && <ProgressBar progress={progress} />}
      {currentQuestionIndex === -1 ? (
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="providerName">
              {language === 'es' ? 'Nombre del Proveedor TIC/Departamento' : 'Nome do Provedor TIC/Departamento'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="providerName"
              type="text"
              value={localProviderName}
              onChange={(e) => setLocalProviderName(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese el nombre del proveedor' : 'Digite o nome do provedor'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="financialEntityName">
              {language === 'es' ? 'Nombre de la Entidad Financiera' : 'Nome da Entidade Financeira'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="financialEntityName"
              type="text"
              value={localFinancialEntityName}
              onChange={(e) => setLocalFinancialEntityName(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese el nombre de la entidad financiera' : 'Digite o nome da entidade financeira'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
              {language === 'es' ? 'Nombre de usuario' : 'Nome de usuário'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="userName"
              type="text"
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese su nombre de usuario' : 'Digite seu nome de usuário'}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleStartQuestionnaire}
          >
            {language === 'es' ? 'Comenzar cuestionario' : 'Iniciar questionário'}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {replaceVariables(currentQuestion.text[language])}
            </h3>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`block w-full text-left p-2 mb-2 rounded transition-colors duration-200 ${
                  answers[currentQuestion.id] === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                {option.text[language]}
              </button>
            ))}
            <textarea
              className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={language === 'es' ? 'Observaciones (opcional)' : 'Observações (opcional)'}
              value={observations[currentQuestion.id] || ''}
              onChange={(e) => handleObservation(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between">
            <button
              className="mb-2 sm:mb-0 w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handlePrevious}
            >
              {language === 'es' ? 'Anterior' : 'Anterior'}
            </button>
            {isLastQuestionAnswered ? (
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
              >
                {language === 'es' ? 'Enviar' : 'Enviar'}
              </button>
            ) : (
              <button
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSaveDraft}
              >
                {language === 'es' ? 'Guardar borrador' : 'Salvar rascunho'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Form;