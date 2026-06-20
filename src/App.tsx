import React, { useState, useEffect } from 'react';
import { initialCVData } from './data';
import { CVData, CVTheme, CVTemplate } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import PaymentModal from './components/PaymentModal';
import ExpertTips from './components/ExpertTips';
import ATSScore from './components/ATSScore';
import CVImporter from './components/CVImporter';
import CVTranslator from './components/CVTranslator';
import SuccessModels from './components/SuccessModels';
import CVPricingTiers from './components/CVPricingTiers';

import { 
  FileText, Sparkles, Download, CheckCircle2, ArrowRight, ChevronRight, 
  Coins, Lock, Edit3, Heart, Check, Users, ShieldCheck, HelpCircle, 
  Mail, Phone, Clock, ArrowLeft, RefreshCw, Eye, Save, Database, Trash2, Image
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'builder' | 'success'>('landing');
  
  // Safe extraction from localStorage or fall back to initialCVData
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem('primecv_saved_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading primecv_saved_data from localStorage:', e);
    }
    return initialCVData;
  });

  const [cvTheme, setCvTheme] = useState<CVTheme>(() => {
    try {
      const saved = localStorage.getItem('primecv_saved_theme');
      if (saved && ['emerald', 'gold', 'slate'].includes(saved)) {
        return saved as CVTheme;
      }
    } catch (e) {}
    return 'emerald';
  });

  const [cvTemplate, setCvTemplate] = useState<CVTemplate>(() => {
    try {
      const saved = localStorage.getItem('primecv_saved_template');
      if (saved && ['modern', 'minimalist', 'executive'].includes(saved)) {
        return saved as CVTemplate;
      }
    } catch (e) {}
    return 'modern';
  });

  // Saving status tracker
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Debounced auto-save effect
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('primecv_saved_data', JSON.stringify(cvData));
        localStorage.setItem('primecv_saved_theme', cvTheme);
        localStorage.setItem('primecv_saved_template', cvTemplate);
        setSaveStatus('saved');
      } catch (e) {
        console.error('Error auto-saving primecv data:', e);
        setSaveStatus('error');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [cvData, cvTheme, cvTemplate]);
  
  // Reset specifically to the high-impact sample data
  const resetToExample = () => {
    if (window.confirm("Deseja redefinir os campos com os dados de exemplo recomendados?")) {
      setCvData(initialCVData);
      setCvTheme('emerald');
      setCvTemplate('modern');
      setSaveStatus('saved');
    }
  };

  // Perform a clean wipe to build entirely from scratch
  const clearAllData = () => {
    if (window.confirm("Deseja limpar todos os campos do seu currículo para começar um rascunho totalmente novo?")) {
      const emptyData: CVData = {
        personalInfo: {
          fullName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          about: '',
          avatarUrl: '',
        },
        experiences: [],
        educations: [],
        skills: [],
        languages: [],
      };
      setCvData(emptyData);
      setCvTheme('emerald');
      setCvTemplate('modern');
      setSaveStatus('saved');
    }
  };
  
  // Payment Modal state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(455);
  const [selectedPlanName, setSelectedPlanName] = useState('Premium Profissional');
  const [transactionEmail, setTransactionEmail] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleSelectTier = (price: number, name: string) => {
    setSelectedPlanPrice(price);
    setSelectedPlanName(name);
    setIsPaymentOpen(true);
  };

  // Export process state
  const [isExportingPng, setIsExportingPng] = useState(false);

  // Function to export element as high-res PNG image
  const exportToPng = async (elementId: string) => {
    const node = document.getElementById(elementId);
    if (!node) {
      alert("Elemento do currículo não encontrado.");
      return;
    }
    
    setIsExportingPng(true);
    // Wait for the UI thread
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const { toPng } = await import('html-to-image');
      
      const dataUrl = await toPng(node, {
        quality: 0.98,
        pixelRatio: 2.5, // 2.5x high resolution
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0',
          boxShadow: 'none',
        },
        cacheBust: true,
      });

      const formattedName = cvData.personalInfo.fullName
        ? cvData.personalInfo.fullName.trim().replace(/\s+/g, '_')
        : 'Curriculo';

      const downloadLink = document.createElement('a');
      downloadLink.download = `PrimeCV_${formattedName}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();
    } catch (err: any) {
      console.error('Error rendering PNG:', err);
      alert('Não foi possível exportar como imagem PNG devido a restrições do navegador ou de segurança (CORS) da imagem de perfil. Dica: Se o erro persistir, experimente exportar sem a foto de perfil.');
    } finally {
      setIsExportingPng(false);
    }
  };

  // Step helper in success page
  const handlePaymentSuccess = (email: string, txId: string) => {
    setTransactionEmail(email);
    setTransactionId(txId);
    setIsPaymentOpen(false);
    setView('success');
    
    // Automatically trigger browser print prompt after a small timeout
    // to give them the actual premium print interface!
    setTimeout(() => {
      window.print();
    }, 1200);
  };

  // Switch template colors
  const handleThemeChange = (theme: CVTheme) => {
    setCvTheme(theme);
  };

  const handleTemplateChange = (template: CVTemplate) => {
    setCvTemplate(template);
  };

  // Start building process
  const startBuilding = () => {
    setView('builder');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased text-sm">
      
      {/* 1. Global Navigation Bar (no-print) */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/40 px-4 py-3.5 sm:px-8 no-print transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Slogan */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setView('landing')}
          >
            <div className="w-9 h-9 bg-emerald-500 text-black flex items-center justify-center rounded-xl font-bold font-display shadow-md shadow-emerald-500/10">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg text-white leading-none tracking-tight">
                Prime<span className="text-emerald-400">CV</span>
              </span>
              <span className="text-[10px] text-zinc-550 font-medium font-serif italic mt-0.5">
                Currículos que abrem portas
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-450">
            <a href="#benefits" onClick={() => { setView('landing'); }} className="hover:text-emerald-400 transition-colors">Benefícios</a>
            <a href="#models" onClick={() => { setView('landing'); }} className="hover:text-emerald-400 transition-colors">Modelos</a>
            <a href="#mpesa" onClick={() => { setView('landing'); }} className="hover:text-emerald-400 transition-colors font-medium">Como Funciona</a>
          </nav>

          {/* CTA Header Actions */}
          <div className="flex items-center gap-3">
            {view === 'builder' ? (
              <button
                id="btn-back-landing-header"
                onClick={() => setView('landing')}
                className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-2 transition-colors cursor-pointer"
              >
                Voltar à Página Inicial
              </button>
            ) : null}

            <button
              id="btn-nav-action"
              onClick={startBuilding}
              className="bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 font-bold text-xs px-4 py-2.5 rounded-full transition duration-150 cursor-pointer"
            >
              {view === 'builder' ? 'Iniciar do Zero' : 'Criar Meu CV Agora'}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <main className="relative">
        
        {/* ==================== A. LANDING VIEW ==================== */}
        {view === 'landing' && (
          <div className="no-print">
            
            {/* HERO SECTION */}
            <section className="relative pt-10 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
              {/* Decorative radial gradients for high-end tech dark feel */}
              <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left side text columns */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Trust indicator badge */}
                  <div className="inline-flex self-start items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      Otimização ATS Avançada Moçambique
                    </span>
                  </div>

                  {/* Main Headlines */}
                  <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] text-balance">
                    Currículos Profissionais que <span className="text-emerald-450 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Impressionam</span>
                  </h1>

                  <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
                    Crie em minutos um CV moderno, totalmente otimizado para sistemas de triagem informática (ATS) e com o design premium que os recrutadores adoram.
                  </p>

                  {/* Bullet Benefits list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 bg-emerald-500/15 rounded-md text-emerald-455">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-zinc-350 text-xs font-semibold">Designs Premium Exclusivos</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 bg-emerald-500/15 rounded-md text-emerald-455">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-zinc-350 text-xs font-semibold">Foto Inteligente Integrada</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 bg-emerald-500/15 rounded-md text-emerald-455">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-zinc-350 text-xs font-semibold">100% Amigo de Leitura ATS</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 bg-emerald-500/15 rounded-md text-emerald-455">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-zinc-350 text-xs font-semibold">Download em PDF Oficial</span>
                    </div>
                  </div>

                  {/* Call to Action Button group */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                      id="btn-hero-start"
                      onClick={startBuilding}
                      className="bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/15 font-bold text-sm px-8 py-4 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>Criar Meu CV Agora</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <a
                      href="#models"
                      className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 hover:text-white font-bold text-xs px-6 py-4 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2 border-zinc-800"
                    >
                      Ver Modelos de Sucesso
                    </a>
                  </div>

                  {/* Payment Badge Context */}
                  <div className="flex items-center gap-2.5 text-zinc-500 text-[11px] font-medium mt-1">
                    <Coins className="w-4 h-4 text-emerald-500/75 shrink-0" />
                    <span>Desde <strong>CV Grátis</strong> até o <strong>Premium (455 a 600 MZN)</strong>. Qualidades sob medida!</span>
                  </div>

                </div>

                {/* Right side graphical showcase */}
                <div className="lg:col-span-5 relative flex items-center justify-center">
                  
                  {/* Floating abstract CV Card preview behind */}
                  <div className="absolute -top-6 -left-6 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/60 shadow-xl max-w-[200px] backdrop-blur text-[10px] text-zinc-500 flex flex-col gap-2.5 rotate-[-6deg] hidden sm:flex">
                    <div className="w-9 h-9 bg-amber-500 text-black rounded-lg flex items-center justify-center font-bold">OC</div>
                    <div className="font-bold text-zinc-100">Orlando Chissano</div>
                    <div className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full self-start">Gestor de Redes</div>
                    <div className="w-full h-1 bg-zinc-850 rounded"></div>
                    <div className="w-[80%] h-1 bg-zinc-850 rounded"></div>
                  </div>

                  {/* Primary mockup display card of modern CV */}
                  <div className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-2xl shadow-2xl tracking-normal max-w-md w-full relative rotate-[2deg] hover:rotate-0 transition duration-500 hover:scale-[1.03]">
                    {/* Top simulated window bar */}
                    <div className="flex items-center gap-1.5 pb-3 border-b border-zinc-800/80 mb-3 text-zinc-650">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/45"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/45"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/45"></div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider ml-auto">Modelo Emerald Premium</span>
                    </div>

                    {/* Paper Mockup content */}
                    <div className="bg-white text-zinc-800 p-5 rounded-lg flex gap-4 min-h-[350px] text-[10px] select-none">
                      
                      {/* Left bar mockup */}
                      <div className="w-[35%] bg-zinc-50 border-r border-zinc-100 p-2.5 flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 border border-zinc-200 shadow-sm self-center"></div>
                        <div className="w-full bg-zinc-250 h-2 rounded"></div>
                        <div className="w-[60%] bg-zinc-250 h-2 rounded mb-2"></div>
                        <div className="border-t border-zinc-200"></div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded"></div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded"></div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded"></div>
                        <div className="border-t border-zinc-200 mt-1"></div>
                        <div className="w-[80%] bg-zinc-150 h-2 rounded self-start"></div>
                      </div>

                      {/* Right workspace mockup */}
                      <div className="flex-1 p-2 flex flex-col gap-3">
                        <div className="w-[50%] bg-emerald-600/10 h-3 rounded"></div>
                        <div className="w-[90%] bg-zinc-200 h-2.5 rounded"></div>
                        <div className="w-full bg-zinc-200 h-2.5 rounded mb-1"></div>
                        
                        <div className="border-b border-zinc-100 pb-1 font-bold text-[9px] text-emerald-600 uppercase">Experiência</div>
                        <div className="w-full bg-zinc-150 h-2 rounded"></div>
                        <div className="w-[85%] bg-zinc-150 h-2 rounded"></div>
                        <div className="w-[70%] bg-zinc-150 h-2 rounded mb-2"></div>

                        <div className="border-b border-zinc-100 pb-1 font-bold text-[9px] text-emerald-600 uppercase">Educação</div>
                        <div className="w-[95%] bg-zinc-150 h-2 rounded"></div>
                        <div className="w-[80%] bg-zinc-150 h-2 rounded"></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* BENEFITS DETAIL SECTION */}
            <section id="benefits" className="relative bg-zinc-950/40 border-t border-zinc-900/50 py-16 px-4 sm:px-8">
              <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full">
                    Diferenciais PrimeCV
                  </span>
                  <h2 className="font-display font-black text-2.5xl sm:text-3xl text-white tracking-tight">
                    Porquê escolher o PrimeCV?
                  </h2>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Unimos design contemporâneo e exigências tecnológicas de recrutamento para que o seu perfil chegue ao topo das entrevistas em Moçambique.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  
                  {/* Benefit Card 1 */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-zinc-100">Design Executivo Premium</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Desenvolvido sob orientação de especialistas em recolha de talentos corporativos. Suas informações são expostas com hierarquia equilibrada e elegância visual.
                    </p>
                  </div>

                  {/* Benefit Card 2 */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-zinc-100">Leitor Amigo do ATS</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Sistemas automáticos rejeitam currículos com caixas de texto mal configuradas. Nossos modelos geram ficheiros limpos e legíveis pelos softwares das multinacionais.
                    </p>
                  </div>

                  {/* Benefit Card 3 */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-zinc-100">Criação em 5 Minutos</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Esqueça ferramentas difíceis do Word. Basta preencher as caixas de texto estruturadas e ver a sua folha desenhar-se de forma profissional, em tempo real.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* EXPERT TIPS SECTION */}
            <ExpertTips />

            {/* INTERACTIVE SUCCESS MODELS SECTION */}
            <SuccessModels onSelectModel={setCvData} onStartBuilding={startBuilding} />

            {/* CURRICULUM PRICING AND QUALITY TIERS */}
            <CVPricingTiers onSelectTier={handleSelectTier} onStartFree={startBuilding} />

            {/* PROCESS MAP/INSTRUCTIONS (Como Funciona) SECTION */}
            <section id="mpesa" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900/50">
              
              <div className="text-center max-w-xl mx-auto mb-12 flex flex-col items-center gap-3">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full">
                  Sem Cartões de Crédito
                </span>
                <h2 className="font-display font-black text-2.5xl sm:text-3xl text-white tracking-tight">
                  Passo a Passo Rápido
                </h2>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Sem pagamentos difíceis em dólares. Todo o nosso sistema está adaptado para pagamento local por M-Pesa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Step 1 */}
                <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-3 relative">
                  <div className="text-3xl font-black text-emerald-500 bg-emerald-500/5 inline-block self-start p-1 rounded-lg">
                    01
                  </div>
                  <h3 className="font-semibold text-zinc-100 mt-2 text-xs uppercase tracking-wider text-zinc-200">Preencha seus dados</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Insira a sua experiência, estudos e competências através do nosso formulário intuitivo.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-3 relative">
                  <div className="text-3xl font-black text-emerald-500 bg-emerald-500/5 inline-block self-start p-1 rounded-lg">
                    02
                  </div>
                  <h3 className="font-semibold text-zinc-100 mt-2 text-xs uppercase tracking-wider text-zinc-200">Personalize o visual</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Escolha entre os esquemas de cor premium e as 3 variantes de template que melhor combinam consigo.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-3 relative">
                  <div className="text-3xl font-black text-emerald-500 bg-emerald-500/5 inline-block self-start p-1 rounded-lg">
                    03
                  </div>
                  <h3 className="font-semibold text-zinc-100 mt-2 text-xs uppercase tracking-wider text-zinc-200">Activação M-Pesa</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Escolha entre o rascunho Grátis ou active o plano Premium (455 a 600 MZN) correspondente à qualidade que deseja exportar.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-zinc-900 border border-emerald-550/20 bg-emerald-500/[0.01] p-5 rounded-2xl flex flex-col gap-3 relative">
                  <div className="text-3xl font-black text-emerald-450 bg-emerald-500/10 inline-block self-start p-1 rounded-lg">
                    04
                  </div>
                  <h3 className="font-semibold text-emerald-400 mt-2 text-xs uppercase tracking-wider">Baixe e Brilhe</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    O ficheiro final é descarregado instantaneamente e enviado para o seu e-mail pessoal.
                  </p>
                </div>

              </div>

              {/* Botão de conversão ao final */}
              <div className="flex flex-col items-center gap-2 mt-12 pb-6">
                <button
                  id="btn-hero-cta-final"
                  onClick={startBuilding}
                  className="bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10 font-black text-sm px-10 py-4.5 rounded-xl transition duration-150 cursor-pointer"
                >
                  Experimentar Criador de Currículos
                </button>
                <span className="text-zinc-550 text-[10px] uppercase font-mono tracking-wider">Livre para Escrever e Visualizar Antes de Pagar</span>
              </div>
            </section>

          </div>
        )}

        {/* ==================== B. BUILDER VIEW ==================== */}
        {view === 'builder' && (
          <div className="px-4 sm:px-8 max-w-7xl mx-auto py-6">
            
            {/* Header / Config Bar */}
            <div className="no-print bg-zinc-900 border border-zinc-800/80 p-4.5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative">
              
              <div className="flex flex-col">
                <h2 className="font-display font-bold text-lg text-white">Configuração do Layout</h2>
                <p className="text-zinc-500 text-[11px] mt-0.5">Customize a cor e tipo de modelo em tempo real.</p>
              </div>

              {/* Selection controllers */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                
                {/* Template picker */}
                <div className="flex items-center gap-2.5">
                  <span className="text-zinc-400 font-semibold text-[11px]">Template:</span>
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <button
                      id="opt-tpl-modern"
                      onClick={() => handleTemplateChange('modern')}
                      className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer text-[11px] ${
                        cvTemplate === 'modern' ? 'bg-zinc-800 text-white' : 'text-zinc-450 hover:text-zinc-200'
                      }`}
                    >
                      Moderno
                    </button>
                    <button
                      id="opt-tpl-minimalist"
                      onClick={() => handleTemplateChange('minimalist')}
                      className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer text-[11px] ${
                        cvTemplate === 'minimalist' ? 'bg-zinc-800 text-white' : 'text-zinc-455 hover:text-zinc-200'
                      }`}
                    >
                      Minimalista
                    </button>
                    <button
                      id="opt-tpl-executive"
                      onClick={() => handleTemplateChange('executive')}
                      className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer text-[11px] ${
                        cvTemplate === 'executive' ? 'bg-zinc-800 text-white' : 'text-zinc-455 hover:text-zinc-200'
                      }`}
                    >
                      Executivo
                    </button>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="flex items-center gap-2.5">
                  <span className="text-zinc-400 font-semibold text-[11px]">Cor Accent:</span>
                  <div className="flex gap-2">
                    {/* Emerald */}
                    <button
                      id="opt-theme-emerald"
                      onClick={() => handleThemeChange('emerald')}
                      title="Verde Esmeralda"
                      className={`w-6 h-6 rounded-full bg-emerald-500 ring-offset-2 ring-offset-zinc-900 border border-black/35 cursor-pointer ${
                        cvTheme === 'emerald' ? 'ring-2 ring-emerald-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    ></button>

                    {/* Gold */}
                    <button
                      id="opt-theme-gold"
                      onClick={() => handleThemeChange('gold')}
                      title="Dourado Sutil"
                      className={`w-6 h-6 rounded-full bg-amber-500 ring-offset-2 ring-offset-zinc-900 border border-black/35 cursor-pointer ${
                        cvTheme === 'gold' ? 'ring-2 ring-amber-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    ></button>

                    {/* Slate */}
                    <button
                      id="opt-theme-slate"
                      onClick={() => handleThemeChange('slate')}
                      title="Slate Chic"
                      className={`w-6 h-6 rounded-full bg-zinc-400 ring-offset-2 ring-offset-zinc-900 border border-black/35 cursor-pointer ${
                        cvTheme === 'slate' ? 'ring-2 ring-zinc-300' : 'opacity-70 hover:opacity-100'
                      }`}
                    ></button>
                  </div>
                </div>

              </div>

              {/* Global triggers */}
              <button
                id="btn-trigger-payment-top"
                onClick={() => setIsPaymentOpen(true)}
                className="bg-emerald-500 text-black hover:bg-emerald-400 font-black text-xs px-5 py-3 rounded-xl transition duration-150 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Descarregar PDF Premium</span>
              </button>

            </div>

            {/* Principal Splits (Forms Left, Preview Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column forms */}
              <div className="no-print lg:col-span-5 flex flex-col gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-zinc-350 shadow-md">
                  {/* Save Status indicators */}
                  <div className="flex items-center gap-2.5 text-xs">
                    {saveStatus === 'saving' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-zinc-400 flex items-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                          A guardar alterações...
                        </span>
                      </>
                    ) : saveStatus === 'error' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-red-400 font-medium">Erro ao persistir rascunho</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20"></span>
                        <span className="text-emerald-450 font-medium flex items-center gap-1 select-none">
                          <Database className="w-3.5 h-3.5 text-emerald-400" />
                          Progresso auto-guardado
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2.5">
                    <button 
                      id="btn-reset-demo"
                      type="button"
                      onClick={resetToExample}
                      title="Carregar dados de exemplo predefinidos"
                      className="text-zinc-400 hover:text-emerald-400 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer bg-zinc-950/50 border border-zinc-800 hover:border-emerald-500/10 px-2.5 py-1 rounded-md"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-500/70" />
                      <span>Dados Exemplo</span>
                    </button>

                    <button 
                      id="btn-clear-demo"
                      type="button"
                      onClick={clearAllData}
                      title="Apagar dados e reiniciar o rascunho do zero"
                      className="text-zinc-500 hover:text-red-400 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer bg-zinc-950/20 border border-zinc-850 hover:border-red-500/10 px-2 py-1 rounded-md"
                    >
                      <Trash2 className="w-3 h-3 text-zinc-500 group-hover:text-red-500/70" />
                      <span>Limpar Tudo</span>
                    </button>
                  </div>
                </div>

                <CVImporter onImport={setCvData} />

                <CVTranslator cvData={cvData} onUpdate={setCvData} />

                <ATSScore data={cvData} />

                <CVForm data={cvData} onChange={setCvData} />
              </div>

              {/* Right Column preview panel */}
              <div className="lg:col-span-7 flex flex-col gap-5 sticky top-22">
                
                {/* Floating Banner */}
                <div className="no-print bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="font-semibold text-xs text-zinc-200">Plano Actual: <strong className="text-emerald-400">{selectedPlanName} ({selectedPlanPrice} MZN)</strong></span>
                      <span className="text-[10px] text-zinc-500">Download ilimitado PDF + Envio Seguro ATS</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      id="btn-preview-export-png"
                      type="button"
                      onClick={() => exportToPng('cv-preview-paper')}
                      disabled={isExportingPng}
                      title="Exportar pré-visualização rápida do currículo como imagem PNG para partilhar nas redes sociais"
                      className="grow sm:grow-0 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-300 disabled:opacity-50 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isExportingPng ? (
                        <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-emerald-400" />
                      ) : (
                        <Image className="w-3.5 h-3.5 shrink-0 text-emerald-450" />
                      )}
                      <span>{isExportingPng ? 'A Gerar...' : 'Prévia PNG'}</span>
                    </button>

                    <button
                      id="btn-trigger-payment-banner"
                      onClick={() => setIsPaymentOpen(true)}
                      className="grow sm:grow-0 bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 font-bold text-xs px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Desbloquear PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable container wrappers */}
                <div className="print-area shadow-2xl relative">
                  <CVPreview data={cvData} theme={cvTheme} template={cvTemplate} />
                </div>

                {/* Second safety trigger beneath */}
                <div className="no-print text-center py-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center gap-3 px-4">
                  <p className="text-zinc-300 text-xs font-bold leading-normal">
                    Gostou da pré-visualização? Seleccione o seu plano ideal para remover as restrições:
                  </p>

                  {/* Miniature plan toggle pills */}
                  <div className="flex bg-zinc-950 p-1 border border-zinc-850 rounded-xl text-zinc-400 select-none w-full max-w-sm">
                    <button
                      type="button"
                      onClick={() => { setSelectedPlanPrice(455); setSelectedPlanName('Premium Profissional'); }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        selectedPlanPrice === 455 
                          ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 shadow' 
                          : 'hover:text-white'
                      }`}
                    >
                      Profissional (455 MT)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPlanPrice(600); setSelectedPlanName('Premium Executivo'); }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                        selectedPlanPrice === 600 
                          ? 'bg-zinc-900 text-amber-400 border border-zinc-800 shadow' 
                          : 'hover:text-white'
                      }`}
                    >
                      Executivo VIP (600 MT)
                    </button>
                  </div>

                  <button
                    id="btn-trigger-payment-bottom"
                    onClick={() => setIsPaymentOpen(true)}
                    className={`w-full max-w-xs font-black text-xs py-3.5 rounded-xl transition duration-150 cursor-pointer ${
                      selectedPlanPrice === 600
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-405 text-black hover:shadow-lg hover:shadow-amber-500/20'
                        : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10'
                    }`}
                  >
                    Obter PDF - {selectedPlanName} ({selectedPlanPrice} MZN)
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== C. SUCCESS DOWNLOAD VIEW ==================== */}
        {view === 'success' && (
          <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto flex flex-col gap-8">
            
            {/* Top Success Alert Box */}
            <div className="no-print bg-zinc-900 border border-emerald-500/25 p-6 sm:p-8 rounded-2.5xl flex flex-col lg:flex-row gap-6 items-center justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              {/* Alert Left Column: Badges & Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                {/* Checked success graphic */}
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-450 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-500/20 shrink-0 select-none">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    Pagamento Confirmado! 🎉
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Seu código de transação <strong className="font-mono text-emerald-400 font-bold tracking-wider">{transactionId}</strong> foi autenticado com sucesso.
                  </p>
                  
                  {/* Embedded delivery notification */}
                  <div className="flex items-center gap-2 text-zinc-300 font-semibold text-xs mt-1 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850 self-center sm:self-start">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cópia de segurança enviada para: <strong className="text-emerald-350 break-all">{transactionEmail}</strong></span>
                  </div>
                </div>
              </div>

              {/* Alert Right Column: Main actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-zinc-800/80 pt-4 lg:pt-0">
                <button
                  id="btn-success-trigger-print"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/15 font-black text-xs px-6 py-4 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Descarregar PDF Oficial / Imprimir</span>
                </button>

                <button
                  id="btn-success-trigger-png"
                  onClick={() => exportToPng('cv-preview-paper')}
                  disabled={isExportingPng}
                  className="w-full sm:w-auto bg-zinc-850 hover:bg-zinc-800 text-emerald-450 hover:text-white border border-emerald-500/20 px-6 py-4 rounded-xl shadow-md cursor-pointer text-xs font-bold transition duration-150 flex items-center justify-center gap-2"
                >
                  {isExportingPng ? (
                    <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                  ) : (
                    <Image className="w-4 h-4 shrink-0" />
                  )}
                  <span>{isExportingPng ? 'A Processar...' : 'Exportar Imagem PNG HD'}</span>
                </button>

                <button
                  id="btn-success-edit"
                  onClick={() => setView('builder')}
                  className="w-full sm:w-auto text-zinc-400 hover:text-zinc-200 border border-zinc-800 bg-transparent hover:bg-zinc-900 px-6 py-4 rounded-xl transition cursor-pointer text-xs font-semibold"
                >
                  Voltar ao Editor (Editar)
                </button>
              </div>

            </div>

            {/* Quick Helper Instructions */}
            <div className="no-print grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              <div className="md:col-span-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-2 justify-center">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">Status do CV</span>
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  Totalmente Desbloqueado!
                </span>
                <p className="text-[11px] text-zinc-450 leading-relaxed mt-1">Todos os recursos premium, fontes personalizadas, imagem e exportação em alta definição livre de marcas de água.</p>
              </div>

              <div className="md:col-span-8 bg-zinc-900/50 p-5 rounded-2xl border border-dashed border-zinc-800 text-[11px] text-zinc-500 flex flex-col justify-center leading-relaxed">
                <p className="font-bold mb-1 text-zinc-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Instruções Recomendadas para Gravar como PDF:
                </p>
                <div className="flex flex-col gap-1 text-[11px] text-zinc-450 pl-4.5 list-none">
                  <div>1. Ao clicar no botão acima, a janela nativa do browser irá abrir.</div>
                  <div>2. Escolha o destino como <strong className="text-zinc-300">"Guardar como PDF"</strong> ou <strong className="text-zinc-300">"Save as PDF"</strong>.</div>
                  <div>3. Nas Definições Avançadas, <strong>marque obrigatoriamente a caixa "Gráficos de Fundo" (Background graphics)</strong> para conservar as belas cores esmeralda e estilizações do PrimeCV.</div>
                </div>
              </div>

            </div>

            {/* Divider */}
            <div className="no-print flex items-center justify-between border-t border-zinc-900 pt-6">
              <span className="font-display font-medium text-xs text-zinc-400">Pré-visualização do teu Currículo Final Premium:</span>
              <span className="text-[10.5px] text-zinc-500 font-mono">1 página em Formato Standard A4</span>
            </div>

            {/* FULLY SHOWN CV PREVIEW ON THE SCREEN */}
            <div className="print-area shadow-2xl relative overflow-hidden max-w-4xl mx-auto w-full">
              <CVPreview data={cvData} theme={cvTheme} template={cvTemplate} />
            </div>

            {/* Extra call to action below the shown CV as requested */}
            <div className="no-print mt-8 mb-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="btn-success-trigger-print-bottom"
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-emerald-500 text-black hover:bg-emerald-405 hover:shadow-xl font-black text-sm px-10 py-4.5 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2 font-bold"
              >
                <Download className="w-5 h-5 shrink-0" />
                <span>Iniciar Download (PDF)</span>
              </button>

              <button
                id="btn-success-trigger-png-bottom"
                onClick={() => exportToPng('cv-preview-paper')}
                disabled={isExportingPng}
                className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-850 disabled:opacity-50 font-bold text-sm px-10 py-4.5 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center gap-2 font-semibold"
              >
                {isExportingPng ? (
                  <RefreshCw className="w-5 h-5 shrink-0 animate-spin text-emerald-400" />
                ) : (
                  <Image className="w-5 h-5 shrink-0 text-emerald-450" />
                )}
                <span>{isExportingPng ? 'A Processar...' : 'Exportar Imagem PNG'}</span>
              </button>
            </div>
            <div className="no-print text-center w-full mt-2">
              <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest">Tecnologia Profissional PrimeCV • Edson Da C. Rita</span>
            </div>

          </div>
        )}

      </main>

      {/* 3. Global Footer (no-print) */}
      <footer className="bg-zinc-950 border-t border-zinc-900/60 mt-16 py-8 px-4 text-center text-zinc-650 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg font-bold text-xs">
              P
            </div>
            <span>© 2026 PrimeCV. Símbolo de Profissionalismo no Emprego.</span>
          </div>
          
          <div className="text-zinc-500/80 italic flex items-center gap-1.5 text-[11px] max-w-sm text-center md:text-left leading-normal">
            <span>"Tudo o que a mente humana pode conceber e acreditar, ela pode alcançar."</span>
            <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500 shrink-0" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[11px] text-zinc-500">
            <span>Suporte e-Mola: <strong className="text-zinc-300 font-mono">+258 86 278 2268</strong></span>
            <span>E-mail: <strong className="text-zinc-300 font-mono">edsonrita.oficial@gmail.com</strong></span>
            <span>Edson Da C. Rita</span>
          </div>
        </div>
      </footer>

      {/* 4. Payment Portal Dialog Element */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        userEmailInitial={cvData.personalInfo.email}
        onPaymentSuccess={handlePaymentSuccess}
        selectedPrice={selectedPlanPrice}
        packageName={selectedPlanName}
      />

    </div>
  );
}
