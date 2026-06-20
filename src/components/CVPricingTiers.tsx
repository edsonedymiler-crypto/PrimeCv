import React from 'react';
import { Check, X, Shield, Sparkles, Award, Zap, ArrowRight, HelpCircle } from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  quality: string;
  recommended: boolean;
  tagline: string;
  features: {text: string; included: boolean}[];
  cta: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  accentText: string;
}

interface CVPricingTiersProps {
  onSelectTier: (price: number, name: string) => void;
  onStartFree: () => void;
}

export default function CVPricingTiers({ onSelectTier, onStartFree }: CVPricingTiersProps) {
  const TIERS: PricingTier[] = [
    {
      id: "free",
      name: "CV Grátis",
      price: 0,
      quality: "Rascunho Básico",
      recommended: false,
      tagline: "Ideal para começar a esboçar suas primeiras experiências",
      colorClass: "from-zinc-900 to-zinc-950",
      borderClass: "border-zinc-850",
      bgClass: "bg-zinc-950/20",
      accentText: "text-zinc-400",
      cta: "Começar de Graça",
      features: [
        { text: "Preenchimento manual de dados", included: true },
        { text: "Edição simples de campos", included: true },
        { text: "Visualização rápida em tela", included: true },
        { text: "Cópia em texto livre", included: true },
        { text: "Tradução automática EN/PT", included: false },
        { text: "Importação inteligente de CV antigo", included: false },
        { text: "Remoção de marcas d'água", included: false },
        { text: "Download PDF em alta definição", included: false }
      ]
    },
    {
      id: "professional",
      name: "Premium Profissional",
      price: 455,
      quality: "Otimizado com Inteligência Artificial",
      recommended: true,
      tagline: "O prato perfeito para quem busca entrevistas reais imediatas",
      colorClass: "from-emerald-950/20 to-zinc-950",
      borderClass: "border-emerald-500/35 ring-1 ring-emerald-500/30",
      bgClass: "bg-zinc-900/30",
      accentText: "text-emerald-400",
      cta: "Adquirir Premium Profissional",
      features: [
        { text: "Sem marcas de água impressas", included: true },
        { text: "Download PDF Executivo de Alta Qualidade", included: true },
        { text: "Tradução Automática de 1-Clique (PT/EN)", included: true },
        { text: "Importador Inteligente de CV com Gemini", included: true },
        { text: "Adicione foto real ou avatares executivos", included: true },
        { text: "Revisão e Otimização ATS em tempo real", included: true },
        { text: "Análise de Score ATS para triagem", included: true },
        { text: "Suporte prioritário via WhatsApp/M-Pesa", included: true }
      ]
    },
    {
      id: "executive",
      name: "Premium Executivo",
      price: 600,
      quality: "Excelência Corporativa Máxima",
      recommended: false,
      tagline: "Feito para líderes, diretores e engenheiros seniores",
      colorClass: "from-amber-950/20 to-zinc-950",
      borderClass: "border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/40",
      bgClass: "bg-zinc-900/20",
      accentText: "text-amber-400",
      cta: "Adquirir Premium Executivo",
      features: [
        { text: "Tudo do plano Profissional incluído", included: true },
        { text: "Cabeçalhos VIP com assinaturas formais", included: true },
        { text: "Esquemas de cores executivos de luxo", included: true },
        { text: "Refinamento aprofundado de habilidades por IA", included: true },
        { text: "Geração de Carta de Apresentação combinada", included: true },
        { text: "Acesso vitalício a futuras atualizações", included: true },
        { text: "Canal VIP de destaque com recrutadores locais", included: true },
        { text: "Selo exclusivo 'Perfil Verificado' de excelência", included: true }
      ]
    }
  ];

  const handleAction = (tier: PricingTier) => {
    if (tier.price === 0) {
      onStartFree();
    } else {
      onSelectTier(tier.price, tier.name);
    }
  };

  return (
    <section id="pricing" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900/40 relative">
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-emerald-500/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header section text */}
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3 mb-12">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full select-none">
          Qualidade do Currículo & Planos
        </span>
        <h2 className="font-display font-black text-2.5xl sm:text-3.5xl text-white tracking-tight leading-tight select-none">
          Planos sob Medida para o Seu Sucesso 💼
        </h2>
        <p className="text-zinc-400 text-xs leading-relaxed max-w-lg select-none">
          Inicie gratuitamente para experimentar e esboçar, e escolha entre nossos pacotes premium de <strong className="text-zinc-200">455 MZN a 600 MZN</strong> para descarregar um currículo com qualidade internacional que passa nos testes de inteligência artificial (ATS).
        </p>
      </div>

      {/* Plans comparison cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {TIERS.map((tier) => {
          return (
            <div
              key={tier.id}
              className={`rounded-2xl border bg-gradient-to-br ${tier.colorClass} ${tier.borderClass} ${tier.bgClass} p-6 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden`}
            >
              {/* Highlight ribbon for recommended */}
              {tier.recommended && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full select-none flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-black" />
                  <span>Recomendado</span>
                </div>
              )}

              {/* Highlight ribbon for executive VIP */}
              {tier.id === 'executive' && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full select-none flex items-center gap-1 shadow-lg shadow-amber-500/20">
                  <Award className="w-3 h-3 fill-black animate-pulse" />
                  <span>VIP Elite</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* Plan labels */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold font-mono text-zinc-550 uppercase tracking-widest select-none">
                    {tier.quality}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    {tier.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-normal min-h-[32px]">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className="py-2 flex items-baseline gap-1 border-y border-zinc-850/60 my-1">
                  {tier.price === 0 ? (
                    <span className="text-2.5xl font-black text-zinc-200 font-display">Grátis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-white font-display">{tier.price}</span>
                      <span className="text-xs font-bold text-zinc-500 font-mono">MZN</span>
                    </>
                  )}
                  <span className="text-[9.5px] text-zinc-550 ml-1">Pagamento Único</span>
                </div>

                {/* Features Checklist */}
                <div className="flex flex-col gap-2 pt-1 font-sans">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      {feat.included ? (
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.accentText}`} />
                      ) : (
                        <X className="w-4 h-4 shrink-0 mt-0.5 text-zinc-700" />
                      )}
                      <span className={`${feat.included ? 'text-zinc-350' : 'text-zinc-600 line-through'}`}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleAction(tier)}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    tier.price === 0
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      : tier.id === 'executive'
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black hover:from-amber-405 hover:hover:to-yellow-405 hover:shadow-lg hover:shadow-amber-500/30'
                      : tier.recommended
                      ? 'bg-emerald-500 text-black hover:bg-emerald-450 hover:shadow-emerald-500/15'
                      : 'bg-zinc-150 text-black hover:bg-white'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* M-Pesa secure notice footer */}
      <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl mt-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
        <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15 shrink-0">
          <Shield className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-zinc-200 select-none">Qualidade de dados de segurança total</h4>
          <p className="text-[10.5px] text-zinc-450 leading-relaxed mt-0.5">
            Processado via rede móvel local M-Pesa. Todos os ficheiros premium são gerados com fontes licenciadas integradas necessárias para aprovação pelo sistema eletrónico de currículos das gigantes industriais e multinacionais em Moçambique.
          </p>
        </div>
      </div>
    </section>
  );
}
