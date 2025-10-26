
import React, { useState, useCallback } from 'react';
import { SentimentResult } from './types';
import { analyzeSentiments } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import SentimentCard from './components/SentimentCard';
import { SparklesIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [comments, setComments] = useState<string>('');
  const [brands, setBrands] = useState<string>('');
  const [results, setResults] = useState<SentimentResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!comments.trim()) {
      setError('Por favor, insira alguns comentários para analisar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const analysisResults = await analyzeSentiments(comments, brands);
      if (analysisResults.length === 0) {
        setError("Nenhuma marca foi encontrada ou analisada a partir dos comentários fornecidos. Tente ser mais específico.");
      } else {
        setResults(analysisResults);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, brands]);
  
  const exampleComments = `A ração Royal Canin é ótima, meu gato adora, mas é muito cara. Já a Golden, tem um bom custo-benefício e meu cachorro come bem. Testei a Purina e meu cão passou mal, não recomendo.`;
  const exampleBrands = `Royal Canin, Golden, Purina`;
  
  const handleExample = () => {
    setComments(exampleComments);
    setBrands(exampleBrands);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-brand-secondary">
            Analisador de Sentimento de Marcas
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Cole os comentários, especifique as marcas (ou deixe em branco para detecção automática) e obtenha uma análise de sentimento com a tecnologia Gemini.
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <div>
              <label htmlFor="comments" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Comentários dos Clientes
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Ex: Meu cachorro adora a ração X, mas a ração Y fez mal para ele..."
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary dark:bg-gray-700 transition duration-200"
                disabled={isLoading}
              ></textarea>
            </div>
            <div>
              <label htmlFor="brands" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Marcas para Analisar (Opcional)
              </label>
              <input
                type="text"
                id="brands"
                value={brands}
                onChange={(e) => setBrands(e.target.value)}
                placeholder="Ex: Marca A, Marca B, Marca C"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary dark:bg-gray-700 transition duration-200"
                disabled={isLoading}
              />
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Separe as marcas por vírgula. Se deixado em branco, a IA tentará identificá-las.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !comments.trim()}
                className="w-full flex-grow inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <SparklesIcon className="w-6 h-6 mr-3" />
                {isLoading ? 'Analisando...' : 'Analisar Sentimentos'}
              </button>
               <button
                onClick={handleExample}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors duration-300"
              >
                Usar Exemplo
              </button>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          {isLoading && <LoadingSpinner />}
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
              <p className="font-bold">Erro</p>
              <p>{error}</p>
            </div>
          }
          {results && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center mb-6">Resultados da Análise</h2>
              {results.map((result, index) => (
                <SentimentCard key={index} result={result} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
