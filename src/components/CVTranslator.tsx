import React, { useState } from 'react';
import { CVData } from '../types';
import { Languages, RefreshCw, Check, AlertCircle, RotateCcw, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CVTranslatorProps {
  cvData: CVData;
  onUpdate: (translatedData: CVData) => void;
}

export default function CVTranslator({ cvData, onUpdate }: CVTranslatorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<CVData | null>(null);

  const handleTranslate = async (targetLang: 'en' | 'pt') => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Save history backup to allow one-click recovery/undo
    const backupCopy = JSON.parse(JSON.stringify(cvData));

    try {
      const response = await fetch('/api/gemini/translate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, targetLanguage: targetLang })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do serviço de tradução.');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setHistory(backupCopy);
      onUpdate(result);
      setSuccess(`Traduzido com sucesso para o ${targetLang === 'en' ? 'Inglês' : 'Português'}!`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao traduzir usando o Gemini AI. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (history) {
      onUpdate(history);
      setHistory(null);
      setSuccess('Tradução desfeita com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg p-5 flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15">
            <Languages className="w-4 h-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 leading-none">
              Tradução Automática IA
              <span className="bg-emerald-500/15 border border-emerald-500/25 text-[8.5px] text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                1-CLIQUE
              </span>
            </span>
            <span className="text-[10px] text-zinc-455 mt-1">Gere versões em inglês ou português para expandir suas chances!</span>
          </div>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleTranslate('en')}
          className="flex-1 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/30 text-zinc-250 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Traduzir todos os campos de texto do currículo para Inglês profissional"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          ) : (
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span>Traduzir para Inglês (US/UK)</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleTranslate('pt')}
          className="flex-1 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/30 text-zinc-250 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Traduzir todos os campos do currículo para Português de Moçambique/Europeu"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          ) : (
            <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center leading-none">PT</span>
          )}
          <span>Traduzir para Português</span>
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-zinc-400 flex items-center gap-1.5 self-center bg-zinc-950 px-3 py-1 rounded-full border border-zinc-900 shadow-inner mt-1"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>O Gemini está traduzindo cargos, descrições e competências...</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-400"
          >
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span>{success}</span>
            </div>
            {history && (
              <button
                type="button"
                onClick={handleUndo}
                className="text-[10px] font-bold text-zinc-400 hover:text-white underline flex items-center gap-1 cursor-pointer bg-zinc-900 border border-zinc-800 px-2 py-1 rounded hover:bg-zinc-850 transition"
                title="Voltar ao idioma e textos anteriores"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Desfazer</span>
              </button>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className="bg-red-500/[0.03] border border-red-500/10 rounded-lg p-2.5 text-xs text-red-400 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
