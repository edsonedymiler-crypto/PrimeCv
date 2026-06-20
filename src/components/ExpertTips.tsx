import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Lightbulb, UserCheck, PhoneCall, Globe2, BookOpen } from 'lucide-react';

interface Tip {
  id: number;
  icon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  tagline: string;
}

export default function ExpertTips() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tips: Tip[] = [
    {
      id: 1,
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      category: "Apresentação e Imagem",
      title: "Uso Estratégico de Foto de Perfil",
      description: "No mercado moçambicano, a inclusão de uma foto de perfil profissional é amplamente aceite e apreciada por recrutadores, principalmente para cargos administrativos, comerciais ou de atendimento ao público. Opte por um fundo neutro, boa luminosidade e vestuário formal.",
      tagline: "Dica: Evite selfies ou fotos casuais com fundos poluídos."
    },
    {
      id: 2,
      icon: <PhoneCall className="w-5 h-5 text-emerald-400" />,
      category: "Contactabilidade e Canais Rápidos",
      title: "Contactos Sempre Ativos (Telemóvel e WhatsApp)",
      description: "A maioria das agências e recrutadores locais prefere o contacto telefónico direto para triagens rápidas ou agendamento de entrevistas. Sempre inclua pelo menos dois números de telefone ativos (de preferência Vodacom e Tmcel/Movitel) e indique se o número principal tem WhatsApp disponível para agilizar o processo.",
      tagline: "Dica: Garanta que o seu telemóvel tem rede estável e atenda chamadas de números desconhecidos durante a fase de candidaturas."
    },
    {
      id: 3,
      icon: <Globe2 className="w-5 h-5 text-emerald-400" />,
      category: "Línguas e Comunicação Regional",
      title: "Destaque a Fluência em Inglês e Idiomas Nacionais",
      description: "Moçambique acolhe imensas ONGs internacionais, embaixadas, empresas mineiras (em províncias como Tete, Cabo Delgado, Nampula) e operadoras de energia. O domínio técnico do Inglês é frequentemente o fator eliminatório. Caso a vaga envolva trabalho de campo no interior do país, indicar fluência em línguas locais (como Changana, Macua, Sena) trará imensa vantagem.",
      tagline: "Dica: Coloque a sua matriz de proficiência visível e honesta."
    },
    {
      id: 4,
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      category: "Leitura Rápida",
      title: "O Resumo Inicial de 6 Segundos",
      description: "Grandes empresas em Maputo acolhem centenas de currículos por vaga. O 'Resumo Inicial' no topo do seu currículo é a sua oportunidade de agarrar o leitor em escassos segundos. Escreva de forma objetiva, declarando diretamente os seus anos de experiência, especialização chave e uma grande conquista recente.",
      tagline: "Dica: Evite discursos genéricos como 'procuro novos desafios para engrandecer a firma'."
    },
    {
      id: 5,
      icon: <Lightbulb className="w-5 h-5 text-emerald-400" />,
      category: "Competências Digitais Locais",
      title: "Valorize Sistemas Locais de Pagamentos Móveis",
      description: "Para funções ligadas ao comércio, logística, retalho, gestão de caixa ou desenvolvimento de software, ter familiaridade ativa com plataformas de carteiras móveis massivas do país (como M-Pesa, e-Mola, m-Kesh), e conhecimentos de sistemas de faturação locais licenciados pela Autoridade Tributária confere ao seu CV grande valor prático.",
      tagline: "Dica: Mencione competências específicas que aceleram a adaptação às rotinas operacionais locais."
    }
  ];

  // Auto rotate carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [tips.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tips.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <section id="expert-tips" className="py-16 px-4 sm:px-8 border-t border-zinc-900/50 relative bg-zinc-950">
      {/* Decorative gradient sphere background */}
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Module title/header */}
        <div className="text-center max-w-xl mx-auto flex flex-col items-center gap-3">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Conselhos Estratégicos
          </span>
          <h2 className="font-display font-black text-2.5xl sm:text-3xl text-white tracking-tight">
            Dicas de Especialistas Locais
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Conselhos pragmáticos desenhados para destacar o seu currículo nas exigências de recrutamento de Moçambique.
          </p>
        </div>

        {/* Carousel Outer frame with modern border & glassmorphism */}
        <div className="relative bg-zinc-900/40 border border-zinc-800/80 rounded-2.5xl p-6 sm:p-10 backdrop-blur-md overflow-hidden shadow-xl">
          
          <div className="min-h-[220px] sm:min-h-[180px] flex flex-col justify-between transition-all duration-300">
            
            {/* Header: Category Badge and pagination indicator */}
            <div className="flex items-center justify-between gap-2.5 mb-5 select-none">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-md border border-emerald-500/15">
                {tips[currentIndex].category}
              </span>
              <span className="text-[11px] font-mono font-medium text-zinc-550">
                Página {tips[currentIndex].id} de {tips.length}
              </span>
            </div>

            {/* Core Slide Content */}
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl shrink-0 text-emerald-400 shadow-sm">
                {tips[currentIndex].icon}
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-tight leading-snug">
                  {tips[currentIndex].title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed text-zinc-300 text-justify">
                  {tips[currentIndex].description}
                </p>
              </div>
            </div>

            {/* Bottom Highlight box */}
            <div className="mt-6 pt-4.5 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="bg-emerald-500/[0.02] border border-emerald-500/5 px-3.5 py-2 rounded-xl text-emerald-300/90 text-xs font-medium leading-relaxed flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>{tips[currentIndex].tagline}</span>
              </div>

              {/* Navigation triggers */}
              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <button
                  id="btn-tips-prev"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 hover:text-white transition duration-150 cursor-pointer text-zinc-400 active:scale-95"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="btn-tips-next"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 hover:text-white transition duration-150 cursor-pointer text-zinc-400 active:scale-95"
                  title="Próximo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Dots selector indicators */}
          <div className="flex justify-center items-center gap-2 mt-6 select-none">
            {tips.map((tip, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={tip.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                    isActive ? 'w-6 bg-emerald-500' : 'w-1.5 bg-zinc-800 hover:bg-zinc-700'
                  }`}
                  title={`Ir para dica ${index + 1}`}
                ></button>
              );
            })}
          </div>

        </div>

        {/* CTA prompt context bottom */}
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></div>
            <span className="text-zinc-300 text-xs font-semibold">Preencha o seu currículo hoje de acordo com estas diretrizes premiadas!</span>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400">Totalmente Gratuito para Esboçar</span>
        </div>

      </div>
    </section>
  );
}
