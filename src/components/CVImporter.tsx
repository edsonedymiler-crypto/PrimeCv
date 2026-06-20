import React, { useState } from 'react';
import { CVData } from '../types';
import { 
  Sparkles, FileText, Upload, RefreshCw, Check, 
  AlertCircle, ArrowUpRight, HelpCircle, FileJson, Linkedin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CVImporterProps {
  onImport: (importedData: CVData) => void;
}

export default function CVImporter({ onImport }: CVImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'linkedin'>('text');
  const [pastedText, setPastedText] = useState('');
  const [linkedinJsonText, setLinkedinJsonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Parse using Gemini AI for standard text
  const handleAIParsing = async (textToParse: string) => {
    if (!textToParse.trim()) {
      setError("Por favor, cole ou carregue algum texto primeiro.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/gemini/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParse })
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o reconstrutor Gemini.");
      }

      const parsedData = await response.json();
      if (parsedData.error) {
        throw new Error(parsedData.error);
      }

      // Check if data feels structured
      if (!parsedData.personalInfo || !parsedData.personalInfo.fullName) {
        throw new Error("Não foi possível identificar informações mínimas estruturadas no texto provido.");
      }

      // Apply imported data
      onImport(parsedData);
      setSuccess(true);
      setPastedText('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao tentar ler e estruturar o currículo. Verifique se o texto está legível.");
    } finally {
      setLoading(false);
    }
  };

  // Parse standard LinkedIn JSON structure using advanced Gemini Mapping
  const handleLinkedInParsing = async (jsonText: string) => {
    if (!jsonText.trim()) {
      setError("Por favor, cole ou carregue os dados JSON do LinkedIn primeiro.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate that it's actually valid JSON formatting
      try {
        JSON.parse(jsonText);
      } catch (e) {
        throw new Error("O conteúdo fornecido não é um JSON válido. Verifique se copiou o JSON completo com brackets { }.");
      }

      const response = await fetch('/api/gemini/parse-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedinJson: jsonText })
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o reconstrutor LinkedIn-Gemini.");
      }

      const parsedData = await response.json();
      if (parsedData.error) {
        throw new Error(parsedData.error);
      }

      if (!parsedData.personalInfo || !parsedData.personalInfo.fullName) {
        throw new Error("Não foi possível extrair dados estruturados legítimos do JSON do LinkedIn.");
      }

      onImport(parsedData);
      setSuccess(true);
      setLinkedinJsonText('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao mapear o ficheiro JSON do LinkedIn.");
    } finally {
      setLoading(false);
    }
  };

  // Process uploaded or dropped files
  const processFile = (file: File) => {
    const reader = new FileReader();
    
    if (file.name.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const jsonText = e.target?.result as string;
          const json = JSON.parse(jsonText);
          if (json.personalInfo) {
            onImport(json as CVData);
            setSuccess(true);
            setError(null);
            setTimeout(() => setSuccess(false), 5000);
          } else {
            // Native profile structure not detected, let's treat it as LinkedIn JSON
            setActiveTab('linkedin');
            setLinkedinJsonText(jsonText);
            handleLinkedInParsing(jsonText);
          }
        } catch (err) {
          setError("Erro ao ler o ficheiro JSON. Certifique-se de que é um formato válido.");
        }
      };
      reader.readAsText(file);
    } else {
      // Normal unstructured text parser using Gemini
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setPastedText(text);
        setActiveTab('text');
        handleAIParsing(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header Banner Button */}
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-emerald-500/10 text-emerald-405 rounded-xl border border-emerald-500/10 animate-pulse animate-duration-3000">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 select-none">
              Importador Inteligente de Currículos
              <span className="bg-emerald-500/15 border border-emerald-500/25 text-[9px] text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Com Gemini AI
              </span>
            </span>
            <span className="text-[10px] text-zinc-450 font-normal select-none">Copie e cole, carregue ficheiros ou importe o seu perfil do LinkedIn!</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 text-xs font-bold text-zinc-200 hover:text-white rounded-lg transition duration-150 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          {isOpen ? 'Fechar Importador' : 'Importar & Preencher'}
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-850 bg-zinc-900/10 overflow-hidden"
          >
            {/* Interactive Tab bar */}
            <div className="flex border-b border-zinc-850 bg-zinc-950/20 px-4">
              <button
                type="button"
                onClick={() => { setActiveTab('text'); setError(null); }}
                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'text'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Texto Livre ou Ficheiros</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('linkedin'); setError(null); }}
                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'linkedin'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-blue-400'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>Exportação LinkedIn (JSON)</span>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              
              {activeTab === 'text' ? (
                /* Tab 1: Normal Pasting & Uploading */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Visual drag & drop area */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                      dragActive 
                        ? 'border-emerald-500 bg-emerald-500/5' 
                        : 'border-zinc-850 bg-zinc-950/20 hover:border-zinc-800'
                    }`}
                  >
                    <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-2xl mb-3 text-zinc-450">
                      <Upload className="w-6 h-6 text-zinc-400" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-200 select-none">Carregue qualquer arquivo</h4>
                    <p className="text-[10px] text-zinc-550 leading-normal mt-1 max-w-xs select-none">
                      Arraste ou selecione um arquivo de texto de seu currículo (<code className="font-mono text-zinc-300">.txt</code>), arquivo nativo ou exportado do LinkedIn (<code className="font-mono text-zinc-300">.json</code>).
                    </p>
                    
                    <label className="mt-4 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] font-bold text-zinc-300 hover:text-white rounded-lg cursor-pointer transition">
                      Procurar no Computador
                      <input 
                        type="file" 
                        accept=".txt,.json" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Text paste area for AI rebuilding */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-200 select-none">Ou cole o texto livre aqui:</label>
                      <span className="text-[9px] text-zinc-550 select-none">Qualquer formato (PDF, Texto, Word...)</span>
                    </div>
                    <textarea
                      rows={5}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Cole aqui o texto desorganizado ou inteiro do seu currículo atual, ou perfil social..."
                      className="bg-zinc-950 border border-zinc-850 rounded-xl p-3 text-xs text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleAIParsing(pastedText)}
                      disabled={loading || !pastedText.trim()}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-450 disabled:bg-zinc-800 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/5"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Reconstruindo e Otimizando com Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-black" />
                          <span>Otimizar & Preencher com IA ✨</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ) : (
                /* Tab 2: LinkedIn JSON parser */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Informational Guidelines on how to export */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-2.5">
                        <Linkedin className="w-4 h-4 fill-blue-405/10" />
                        <span>Mapeamento Inteligente LinkedIn-Gemini</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                        Nosso sistema extrai de forma inteligente os blocos de dados de qualquer ficheiro ou texto JSON de perfil exportado do LinkedIn, poupando todo o seu esforço.
                      </p>
                      
                      <div className="flex flex-col gap-2 text-[10px] text-zinc-500">
                        <div className="flex gap-2">
                          <span className="font-extrabold text-blue-400">1.</span>
                          <span>Use ferramentas de exportação de dados do LinkedIn ou extensões de terceiros (<code className="font-mono text-zinc-400">LinkedIn to JSON</code>) para extrair o ficheiro do seu perfil.</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-extrabold text-blue-400">2.</span>
                          <span>Copie o conteúdo textual do JSON e cole-o na área ao lado, ou deite o arquivo <code className="font-mono text-zinc-400">.json</code> na aba anterior.</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-extrabold text-blue-400">3.</span>
                          <span>Nossos algoritmos do Gemini IA irão interpretar todos os campos e otimizar os cargos e realizações automaticamente!</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-850 mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-600">Suporta múltiplos formatos de scrapers</span>
                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-bold uppercase select-none">Alta Precisão</span>
                    </div>
                  </div>

                  {/* LinkedIn JSON box input */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-200 select-none">Cole os dados JSON do seu LinkedIn aqui:</label>
                      <span className="text-[9px] text-blue-400 font-semibold select-none flex items-center gap-1">
                        <FileJson className="w-3 h-3" /> JSON Format
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={linkedinJsonText}
                      onChange={(e) => setLinkedinJsonText(e.target.value)}
                      placeholder='Ex: { "firstName": "Edson", "lastName": "Rita", "headline": "Engenheiro de Software", "positions": [...] }'
                      className="bg-zinc-950 border border-zinc-855 rounded-xl p-3 text-xs font-mono text-blue-300/90 placeholder:text-zinc-700 outline-none focus:border-blue-500/50 resize-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleLinkedInParsing(linkedinJsonText)}
                      disabled={loading || !linkedinJsonText.trim()}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-550 disabled:bg-zinc-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/5"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Mapeando LinkedIn com Gemini IA...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white fill-white" />
                          <span>Mapear do LinkedIn com IA ✨</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

              {/* Status messages indicator */}
              {error && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-red-400 text-xs flex items-start gap-2 animate-fade-in select-none">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold select-none">Falha na importação:</strong> {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-emerald-400 text-xs flex items-start gap-2 animate-fade-in select-none">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium select-none">Excelente!</strong> O seu perfil do LinkedIn foi importado, traduzido e estruturado perfeitamente. Explore e refine o currículo abaixo!
                  </div>
                </div>
              )}

              {/* Guide Note */}
              <div className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-lg text-zinc-400 text-[10.5px] leading-relaxed flex gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-200 select-none">Quer facilidade máxima?</span> Se arrastar um arquivo <code className="font-mono text-zinc-300">.json</code> em qualquer aba, o sistema detecta se é uma importação nativa ou um perfil LinkedIn desestruturado e mapeia de forma autónoma.
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
