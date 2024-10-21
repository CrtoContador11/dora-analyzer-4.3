import React from 'react';
import { PlusCircle, BarChart, List, FileText, Home } from 'lucide-react';

interface MenuProps {
  currentView: 'home' | 'form' | 'report' | 'savedForms' | 'drafts';
  setCurrentView: (view: 'home' | 'form' | 'report' | 'savedForms' | 'drafts') => void;
  language: 'es' | 'pt';
}

const Menu: React.FC<MenuProps> = ({ currentView, setCurrentView, language }) => {
  const menuItems = [
    { view: 'home', icon: Home, label: { es: 'Inicio', pt: 'Início' } },
    { view: 'form', icon: PlusCircle, label: { es: 'Nuevo cuestionario', pt: 'Novo questionário' } },
    { view: 'report', icon: BarChart, label: { es: 'Ver informe', pt: 'Ver relatório' } },
    { view: 'savedForms', icon: List, label: { es: 'Cuestionarios guardados', pt: 'Questionários salvos' } },
    { view: 'drafts', icon: FileText, label: { es: 'Borradores', pt: 'Rascunhos' } },
  ];

  return (
    <nav className="bg-white shadow-md overflow-x-auto">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center sm:justify-start space-x-2 py-2">
          {menuItems.map((item) => (
            <li key={item.view} className="mb-2 sm:mb-0">
              <button
                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentView === item.view 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                }`}
                onClick={() => setCurrentView(item.view as 'home' | 'form' | 'report' | 'savedForms' | 'drafts')}
              >
                <item.icon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium hidden sm:inline">{item.label[language]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;