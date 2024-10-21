import React from 'react';
import { Draft } from '../types';

interface DraftsProps {
  drafts: Draft[];
  language: 'es' | 'pt';
  onContinueDraft: (draft: Draft) => void;
  onDeleteDraft: (date: string) => void;
}

const Drafts: React.FC<DraftsProps> = ({ drafts, language, onContinueDraft, onDeleteDraft }) => {
  return (
    <div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        {language === 'es' ? 'Borradores' : 'Rascunhos'}
      </h2>
      <div className="space-y-4">
        {drafts.map((draft, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <p className="text-sm sm:text-base">
              <strong>{language === 'es' ? 'Proveedor' : 'Provedor'}:</strong> {draft.providerName}
            </p>
            <p className="text-sm sm:text-base">
              <strong>{language === 'es' ? 'Entidad Financiera' : 'Entidade Financeira'}:</strong> {draft.financialEntityName}
            </p>
            <p className="text-sm sm:text-base">
              <strong>{language === 'es' ? 'Usuario' : 'Usuário'}:</strong> {draft.userName}
            </p>
            <p className="text-sm sm:text-base">
              <strong>{language === 'es' ? 'Fecha' : 'Data'}:</strong>{' '}
              {new Date(draft.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}
            </p>
            <p className="text-sm sm:text-base">
              <strong>{language === 'es' ? 'Estado' : 'Estado'}:</strong>{' '}
              {draft.isCompleted 
                ? (language === 'es' ? 'Finalizado' : 'Finalizado')
                : (language === 'es' ? 'En progreso' : 'Em andamento')}
            </p>
            <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {!draft.isCompleted && (
                <button
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => onContinueDraft(draft)}
                >
                  {language === 'es' ? 'Continuar' : 'Continuar'}
                </button>
              )}
              <button
                className="w-full sm:w-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => onDeleteDraft(draft.date)}
              >
                {language === 'es' ? 'Eliminar' : 'Excluir'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drafts;