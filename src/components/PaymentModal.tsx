import React, { useState, useEffect } from 'react';
import { Mail, Shield, Check, Copy, AlertCircle, Loader2, Award, Download, Smartphone } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmailInitial: string;
  onPaymentSuccess: (email: string, txId: string) => void;
  selectedPrice?: number;
  packageName?: string;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  userEmailInitial, 
  onPaymentSuccess,
  selectedPrice = 455,
  packageName = "Premium Profissional"
}: PaymentModalProps) {
  const [email, setEmail] = useState('');
  const [txId, setTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stepText, setStepText] = useState('');

  const mpesaNumber = "+258 86 278 2268";
  const mpesaName = "Edson Da C. Rita";
  const supportEmail = "edsonrita.oficial@gmail.com";

  useEffect(() => {
    if (userEmailInitial) {
      setEmail(userEmailInitial);
    }
  }, [userEmailInitial, isOpen]);

  if (!isOpen) return null;

  // Copy number helper
  const handleCopy = () => {
    navigator.clipboard.writeText(mpesaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, informe o seu e-mail para receber o currículo.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Introduza um endereço de e-mail válido.');
      return;
    }
    if (!txId || txId.trim().length < 4) {
      setError('Insira um código de transação TxID/ID de transação e-Mola / M-Pesa válido.');
      return;
    }

    // Trigger simulation sequence
    setIsLoading(true);
    
    const steps = [
      'A contactar rede móvel e-Mola...',
      'Validando a transação do ID informado...',
      'Verificando recebimento de Edson Da C. Rita...',
      `Pagamento Confirmado no valor de ${selectedPrice} MZN!`,
      'Injetando fontes premium no seu ficheiro...',
      'A enviar cópia PDF final para o seu email...',
      'Pronto! A descarregar ficheiro...'
    ];

    let currentStep = 0;
    setStepText(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStepText(steps[currentStep]);
      } else {
        clearInterval(interval);
        setIsLoading(false);
        onPaymentSuccess(email, txId);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in no-print">
      
      {/* Absolute background click closure if not loading */}
      <div className="absolute inset-0" onClick={() => !isLoading && onClose()}></div>

      {/* Modal Container */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Banner with secure indicators */}
        <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-6 py-4 flex items-center justify-between text-emerald-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-xs uppercase tracking-wider">Servidor de Pagamento Seguro</span>
          </div>
          <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
            e-Mola Moçambique
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Main loader screen */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[300px]"
              >
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <h3 className="font-display font-bold text-lg text-zinc-100">A processar o seu pedido</h3>
                <p className="text-zinc-400 text-xs mt-2 max-w-xs">{stepText}</p>
                <div className="w-48 bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-6">
                  <div className="bg-emerald-500 h-full rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '60%' }}></div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-5"
              >
                
                {/* Title and pricing info */}
                <div className="text-center">
                  <h3 className="font-display text-xl font-bold text-zinc-100">
                    Finalizar Download - {packageName}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1">
                    Tenha acesso vitalício para editar e descarregar o seu currículo em alta definição.
                  </p>
                  
                  {/* Price display tag */}
                  <div className="mt-4 bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl inline-flex flex-col items-center px-6">
                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Preço Único</span>
                    <span className="text-2xl font-black text-emerald-450 font-display">{selectedPrice} MZN</span>
                  </div>
                </div>

                <hr className="border-zinc-900" />

                {/* Step e-Mola Instructions Block */}
                <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-zinc-350 text-xs font-semibold">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instruções de Pagamento e-Mola:</span>
                  </div>
                  
                  <div className="text-xs text-zinc-400 pl-6 flex flex-col gap-1.5 leading-relaxed">
                    <div>1. Transfira <strong className="text-zinc-200">{selectedPrice} MT</strong> para o seguinte número e-Mola:</div>
                    
                    {/* Copyable Widget */}
                    <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg flex items-center justify-between mt-1 mb-1 pl-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-emerald-300 font-bold text-sm tracking-widest">{mpesaNumber}</span>
                        <span className="text-[10px] text-zinc-500">Beneficiário: <strong className="text-zinc-300">{mpesaName}</strong></span>
                      </div>
                      <button
                        id="btn-copy-mpesa"
                        type="button"
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          copied 
                            ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    <div>2. Após concluir a transferência, preencha os campos de verificação abaixo:</div>
                  </div>
                </div>

                {/* Actual form */}
                <form id="form-payment" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-2.5 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-350 text-xs font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      E-mail do Usuário
                    </label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. edsonrita.oficial@gmail.com"
                      className="bg-zinc-955 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-3 text-zinc-200 placeholder:text-zinc-650 text-xs outline-none"
                    />
                    <span className="text-[10px] text-zinc-500 ml-1 font-sans">Enviaremos uma cópia em PDF oficial com segurança ATS para o seu e-mail. Para suporte directo: <strong className="text-zinc-300 font-mono">{supportEmail}</strong></span>
                  </div>

                  {/* Transaction ID field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-350 text-xs font-semibold">
                      Código da Transação (TxID)
                    </label>
                    <input 
                      type="text"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value.toUpperCase())}
                      placeholder="Introduza o código do SMS e-Mola ou M-Pesa (e.g. 8G10A94C7)"
                      className="bg-zinc-955 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-3 text-zinc-250 font-mono tracking-widest placeholder:text-zinc-600 placeholder:font-sans text-xs outline-none"
                    />
                    <span className="text-[10px] text-zinc-500 ml-1">Proíbe-se fraudes. Todos os TxID são conferidos instantaneamente.</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      id="btn-cancel-payment"
                      type="button"
                      onClick={onClose}
                      className="sm:w-1/3 bg-transparent border border-zinc-850 hover:bg-zinc-900 border-zinc-800 text-zinc-400 p-3.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      id="btn-confirm-payment"
                      type="submit"
                      className="flex-1 bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 font-bold text-xs p-3.5 rounded-xl transition duration-150 cursor-pointer text-center"
                    >
                      Confirmar Pagamento e Baixar CV
                    </button>
                  </div>
                </form>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Modal footer trust label */}
        {!isLoading && (
          <div className="bg-zinc-950/40 p-3 border-t border-zinc-900 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1">
            <span>© 2026 PrimeCV • Todos os dados pessoais estão cifrados • Edson Da C. Rita</span>
          </div>
        )}

      </div>
    </div>
  );
}
