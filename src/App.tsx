import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Menu from './components/Menu';
import Form from './components/Form';
import Report from './components/Report';
import SavedForms from './components/SavedForms';
import Drafts from './components/Drafts';
import Home from './components/Home';
import { FormDataType, Draft, Question, Category } from './types';
import { questions, categories } from './data';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Telegram Bot Token and Chat ID
const TELEGRAM_BOT_TOKEN = '7979728776:AAF37aFpjmflfHrW0ykXbbIUTcd57X1X-rc';
const TELEGRAM_CHAT_ID = '763968348';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'report' | 'savedForms' | 'drafts'>('home');
  const [language, setLanguage] = useState<'es' | 'pt'>('es');
  const [formData, setFormData] = useState<FormDataType[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [userName, setUserName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [financialEntityName, setFinancialEntityName] = useState('');
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);

  const generatePDF = (data: FormDataType): Uint8Array => {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.text('Informe DORA', 105, 15, { align: 'center' });
    doc.text(`Proveedor: ${data.providerName}`, 20, 30);
    doc.text(`Entidad Financiera: ${data.financialEntityName}`, 20, 40);
    doc.text(`Usuario: ${data.userName}`, 20, 50);
    doc.text(`Fecha: ${new Date(data.date).toLocaleDateString()}`, 20, 60);

    // Add more content as needed...

    return doc.output('arraybuffer');
  };

  const handleFormSubmit = async (data: FormDataType) => {
    setFormData([...formData, data]);
    
    const pdfArrayBuffer = generatePDF(data);

    try {
      const message = `Nuevo informe DORA:\nProveedor: ${data.providerName}\nEntidad Financiera: ${data.financialEntityName}\nUsuario: ${data.userName}\nFecha: ${new Date(data.date).toLocaleDateString()}`;
      
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      });

      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('document', new Blob([pdfArrayBuffer], { type: 'application/pdf' }), 'informe_dora.pdf');

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Mensaje y PDF enviados a Telegram con éxito');
      setCurrentView('report');
    } catch (error) {
      console.error('Error al enviar mensaje y PDF a Telegram:', error);
    }
  };

  const handleStartQuestionnaire = (providerName: string, financialEntityName: string, userName: string) => {
    setProviderName(providerName);
    setFinancialEntityName(financialEntityName);
    setUserName(userName);
    setCurrentView('form');
  };

  const handleSaveDraft = (draft: Draft) => {
    setDrafts([...drafts, draft]);
    setCurrentView('drafts');
  };

  const handleContinueDraft = (draft: Draft) => {
    setCurrentDraft(draft);
    setCurrentView('form');
  };

  const handleDeleteDraft = (date: string) => {
    setDrafts(drafts.filter(draft => draft.date !== date));
  };

  const handleUpdateForm = (updatedForm: FormDataType) => {
    setFormData(formData.map(form => form.date === updatedForm.date ? updatedForm : form));
  };

  const handleDeleteForm = (dateToDelete: string) => {
    setFormData(formData.filter(form => form.date !== dateToDelete));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header version="v 4.1" userName={userName} language={language} setLanguage={setLanguage} />
      <Menu currentView={currentView} setCurrentView={setCurrentView} language={language} />
      <main className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        {currentView === 'home' && (
          <Home language={language} onStartQuestionnaire={handleStartQuestionnaire} />
        )}
        {currentView === 'form' && (
          <Form
            onSubmit={handleFormSubmit}
            onSaveDraft={handleSaveDraft}
            questions={questions}
            categories={categories}
            language={language}
            userName={userName}
            providerName={providerName}
            financialEntityName={financialEntityName}
            currentDraft={currentDraft}
          />
        )}
        {currentView === 'report' && (
          <Report formData={formData} questions={questions} categories={categories} language={language} />
        )}
        {currentView === 'savedForms' && (
          <SavedForms
            formData={formData}
            questions={questions}
            categories={categories}
            language={language}
            onUpdateForm={handleUpdateForm}
            onDeleteForm={handleDeleteForm}
          />
        )}
        {currentView === 'drafts' && (
          <Drafts
            drafts={drafts}
            language={language}
            onContinueDraft={handleContinueDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        )}
      </main>
    </div>
  );
};

export default App;