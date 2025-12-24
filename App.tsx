
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, History, Trash2, Send, Quote, Info } from 'lucide-react';
import { translateMoodToEmojis } from './services/geminiService';
import { EmojiTranslation } from './types';
import { HistoryItem } from './components/HistoryItem';

const App: React.FC = () => {
  const [mood, setMood] = useState('');
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<EmojiTranslation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodji_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it updates
  useEffect(() => {
    localStorage.setItem('moodji_history', JSON.stringify(history));
  }, [history]);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    const result = await translateMoodToEmojis(mood);

    if (result.error) {
      setError(result.error);
    } else {
      const newEntry: EmojiTranslation = {
        id: crypto.randomUUID(),
        mood: mood.trim(),
        emojis: result.emojis,
        timestamp: Date.now()
      };
      
      setCurrentResult(result.emojis);
      setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
    }
    
    setIsLoading(false);
    setMood('');
  };

  const clearHistory = () => {
    if (window.confirm("Delete all your beautiful chaotic memories?")) {
      setHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8 min-h-screen">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-6xl sm:text-8xl font-bungee drop-shadow-lg mb-2">
          MOODJI
        </h1>
        <p className="text-indigo-100 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          The world's most <span className="font-bold underline decoration-yellow-400">useless</span> AI translator. 
          Tell me your feelings, I'll give you a random emoji fever dream.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input & Result Area */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={120} className="text-indigo-900" />
            </div>
            
            <form onSubmit={handleTranslate} className="relative z-10 space-y-6">
              <div className="space-y-2">
                <label htmlFor="mood" className="text-indigo-900 font-bold text-lg flex items-center gap-2">
                  How are you feeling right now?
                </label>
                <textarea
                  id="mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="e.g., I'm feeling like a toasted bagel in a rainstorm..."
                  className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 text-indigo-900 focus:outline-none focus:border-indigo-500 transition-all min-h-[120px] resize-none text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !mood.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl ${
                  isLoading 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Translating...</span>
                  </div>
                ) : (
                  <>
                    <Send size={24} />
                    <span>EMOJI-FY ME!</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current Result / Error */}
          {(currentResult || error) && (
            <div className={`rounded-3xl p-8 text-center animate-bounce-in shadow-2xl border-4 ${error ? 'bg-red-50 border-red-200' : 'bg-yellow-100 border-yellow-300'}`}>
              {error ? (
                <div className="text-red-600 flex flex-col items-center gap-2">
                  <Info size={40} />
                  <p className="font-bold text-xl">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-indigo-900/60 uppercase tracking-widest font-black text-sm flex items-center justify-center gap-2">
                    <Quote size={16} /> The Prophet Says <Quote size={16} className="rotate-180" />
                  </p>
                  <div className="text-6xl sm:text-8xl tracking-tight leading-none drop-shadow-md py-4">
                    {currentResult}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentResult || '');
                      alert("Copied your chaos to clipboard! 🫡");
                    }}
                    className="text-indigo-600 font-bold hover:underline text-sm uppercase tracking-wider"
                  >
                    Copy these hieroglyphics
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* History Area */}
        <section className="lg:col-span-5 flex flex-col max-h-[700px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <History size={24} />
              Recent Nonsense
            </h2>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold"
              >
                <Trash2 size={16} />
                Forget Everything
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {history.length > 0 ? (
              history.map((item) => (
                <HistoryItem key={item.id} item={item} />
              ))
            ) : (
              <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-12 text-center">
                <p className="text-white/40 italic">No historical chaos yet. Start translating!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer Fun */}
      <footer className="mt-auto pt-12 pb-6 text-center text-white/50 text-sm">
        <p>© {new Date().getFullYear()} MOODJI Labs • Powered by Gemini & Absolute Randomness</p>
        <p className="mt-2 text-[10px] uppercase tracking-widest">Accuracy is strictly prohibited.</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}} />
    </div>
  );
};

export default App;
