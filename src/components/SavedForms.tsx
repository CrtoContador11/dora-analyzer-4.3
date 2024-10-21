import React, { useState, useRef } from 'react';
import { FormDataType, Question, Category } from '../types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SavedFormsProps {
  formData: FormDataType[];
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
  onUpdateForm: (updatedForm: FormDataType) => void;
  onDeleteForm: (dateToDelete: string) => void;
}

const SavedForms: React.FC<SavedFormsProps> = ({ formData, questions, categories, language, onUpdateForm, onDeleteForm }) => {
  const [selectedFormIndex, setSelectedFormIndex] = useState<number | null>(null);
  const [editedAnswers, setEditedAnswers] = useState<Record<number, number>>({});
  const [editedObservations, setEditedObservations] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const chartRef = useRef<ChartJS>(null);

  const handleSelectForm = (index: number) => {
    setSelectedFormIndex(index);
    setEditedAnswers(formData[index].answers);
    setEditedObservations(formData[index].observations);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setEditedAnswers({ ...editedAnswers, [questionId]: value });
  };

  const handleObservationChange = (questionId: number, value: string) => {
    setEditedObservations({ ...editedObservations, [questionId]: value });
  };

  const handleSaveChanges = () => {
    if (selectedFormIndex !== null) {
      const updatedForm = {
        ...formData[selectedFormIndex],
        answers: editedAnswers,
        observations: editedObservations,
      };
      onUpdateForm(updatedForm);
      setIsEditing(false);
    }
  };

  const generateChartData = (selectedData: FormDataType) => {
    return {
      labels: categories.map((category) => category.name[language]),
      datasets: [
        {
          label: language === 'es' ? 'Puntuación' : 'Pontuação',
          data: categories.map((category) => {
            const categoryQuestions = questions.filter((q) => q.categoryId === category.id);
            const categoryScores = categoryQuestions.map((q) => selectedData.answers[q.id] || 0);
            return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: language === 'es' ? 'Puntuación por categoría' : 'Pontuação por categoria',
      },
    },
  };

  const generatePDF = (selectedForm: FormDataType) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Informe DORA', 105, 15, { align: 'center' });
    
    // Form details
    doc.setFontSize(12);
    doc.text(`Proveedor TIC/Departamento: ${selectedForm.providerName}`, 20, 30);
    doc.text(`Entidad Financiera: ${selectedForm.financialEntityName}`, 20, 40);
    doc.text(`Usuario: ${selectedForm.userName}`, 20, 50);
    doc.text(`Fecha: ${new Date(selectedForm.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}`, 20, 60);

    // Chart
    if (chartRef.current) {
      const chartImage = chartRef.current.toBase64Image();
      doc.addImage(chartImage, 'PNG', 15, 70, 180, 100);
    }

    // Questions and Answers
    doc.addPage();
    const tableData = questions.map((q) => [
      q.text[language]
        .replace('{providerName}', selectedForm.providerName)
        .replace('{financialEntityName}', selectedForm.financialEntityName),
      q.options.find((opt) => opt.value === selectedForm.answers[q.id])?.text[language] || '',
      selectedForm.observations[q.id] || ''
    ]);

    doc.autoTable({
      head: [[language === 'es' ? 'Pregunta' : 'Pergunta', language === 'es' ? 'Respuesta' : 'Resposta', language === 'es' ? 'Observaciones' : 'Observações']],
      body: tableData,
      startY: 10,
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 50 }, 2: { cellWidth: 60 } }
    });

    doc.save('informe_dora.pdf');
  };

  return (
    <div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        {language === 'es' ? 'Cuestionarios guardados' : 'Questionários salvos'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {formData.map((data, index) => (
            <div
              key={index}
              className={`mb-2 p-2 border rounded cursor-pointer text-sm ${
                selectedFormIndex === index ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelectForm(index)}
            >
              <p className="font-semibold">{data.providerName}</p>
              <p className="text-xs text-gray-600">{new Date(data.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}</p>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          {selectedFormIndex !== null && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">
                  {language === 'es' ? 'Detalles del cuestionario' : 'Detalhes do questionário'}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-end">
                  <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    onClick={handleEditToggle}
                  >
                    {isEditing
                      ? language === 'es'
                        ? 'Cancelar edición'
                        : 'Cancelar edição'
                      : language === 'es'
                      ? 'Editar respuestas'
                      : 'Editar respostas'}
                  </button>
                  {isEditing && (
                    <button
                      className="m-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                      onClick={handleSaveChanges}
                    >
                      {language === 'es' ? 'Guardar cambios' : 'Salvar alterações'}
                    </button>
                  )}
                  <button
                    className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                    onClick={() => onDeleteForm(formData[selectedFormIndex].date)}
                  >
                    {language === 'es' ? 'Eliminar' : 'Excluir'}
                  </button>
                  <button
                    className="m-1 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
                    onClick={() => generatePDF(formData[selectedFormIndex])}
                  >
                    {language === 'es' ? 'Generar PDF' : 'Gerar PDF'}
                  </button>
                </div>
              </div>
              <div className="mb-8 overflow-x-auto h-64 sm:h-96">
                <Bar ref={chartRef} data={generateChartData(formData[selectedFormIndex])} options={chartOptions} />
              </div>
              <div className="text-sm">
                {categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h4 className="text-base font-semibold mb-2">{category.name[language]}</h4>
                    {questions
                      .filter((q) => q.categoryId === category.id)
                      .map((question) => (
                        <div key={question.id} className="mb-2">
                          <p className="font-medium">
                            {question.text[language]
                              .replace('{providerName}', formData[selectedFormIndex].providerName)
                              .replace('{financialEntityName}', formData[selectedFormIndex].financialEntityName)}
                          </p>
                          {isEditing ? (
                            <select
                              value={editedAnswers[question.id]}
                              onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                              {question.options.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.text[language]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-gray-600">
                              {
                                question.options.find(
                                  (option) => option.value === formData[selectedFormIndex].answers[question.id]
                                )?.text[language]
                              }
                            </p>
                          )}
                          {isEditing ? (
                            <textarea
                              value={editedObservations[question.id] || ''}
                              onChange={(e) => handleObservationChange(question.id, e.target.value)}
                              className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder={language === 'es' ? 'Observaciones' : 'Observações'}
                            />
                          ) : (
                            <p className="text-gray-600 mt-2">
                              <strong>{language === 'es' ? 'Observaciones:' : 'Observações:'}</strong>{' '}
                              {formData[selectedFormIndex].observations[question.id] || '-'}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedForms;