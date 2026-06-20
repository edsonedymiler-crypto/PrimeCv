import React, { useState } from 'react';
import { CVData } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, User, Award, ShieldCheck, XCircle, ChevronRight } from 'lucide-react';

interface SuccessModelsProps {
  onSelectModel: (model: CVData) => void;
  onStartBuilding: () => void;
}

interface DemoModel {
  id: string;
  label: string;
  industry: string;
  hiredAt: string;
  atsScore: number;
  avatar: string;
  accent: string;
  data: CVData;
}

export default function SuccessModels({ onSelectModel, onStartBuilding }: SuccessModelsProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'beforeAfter'>('presets');
  const [selectedDemoId, setSelectedDemoId] = useState<string>('model-dev');

  // Realistic professional CV templates popular in Mozambique
  const DEMO_MODELS: DemoModel[] = [
    {
      id: "model-dev",
      label: "Tecnologia & Programação",
      industry: "Engenharia de Software / IT",
      hiredAt: "Hired @ Vodacom Moçambique",
      atsScore: 98,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      accent: "emerald",
      data: {
        personalInfo: {
          fullName: "Edmilson Jonas Macuácua",
          title: "Desenvolvedor de Software Full-Stack",
          email: "edmilson.macuacua@email.com",
          phone: "+258 84 123 4567",
          location: "Maputo, Moçambique",
          about: "Desenvolvedor de software com experiência comprovada na criação de sistemas transacionais e integrações robustas de pagamentos eletrónicos (M-Pesa e e-Mola) em Moçambique. Especializado em React, Node.js e metodologias ágeis de entrega contínua. Focado no desenvolvimento de código limpo e arquiteturas escaláveis.",
          avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
        },
        experiences: [
          {
            id: "m-dev-exp-1",
            company: "Vodacom Moçambique",
            role: "Engenheiro de Software Júnior",
            startDate: "2023-01",
            endDate: "Presente",
            description: "Colaboração no desenvolvimento de novos módulos de serviços financeiros para aplicações web integradas ao ecossistema M-Pesa. Liderança técnica na migração de endpoints legados para REST APIs de alto desempenho, resultando em diminuição de 30% na latência de resposta."
          },
          {
            id: "m-dev-exp-2",
            company: "Bantu Tech Labs",
            role: "Programador Full-Stack Estagiário",
            startDate: "2021-08",
            endDate: "2022-12",
            description: "Desenho de layouts dinâmicos usando TypeScript e React. Integração bem-sucedida de bases de dados relacionais e otimização de consultas SQL complexas, reduzindo gargalos críticos de relatórios operacionais."
          }
        ],
        educations: [
          {
            id: "m-dev-edu-1",
            institution: "Universidade Eduardo Mondlane (UEM)",
            degree: "Licenciatura em Engenharia Informática",
            startDate: "2018-02",
            endDate: "2022-11",
            description: "Média final de 16 valores. Destaque em Engenharia de Requisitos, Inteligência Artificial e Resolução Algorítmica de Problemas."
          }
        ],
        skills: [
          { id: "m-dev-sk-1", name: "TypeScript / React", level: 5 },
          { id: "m-dev-sk-2", name: "Node.js & Express", level: 5 },
          { id: "m-dev-sk-3", name: "Integração M-Pesa / APIs", level: 5 },
          { id: "m-dev-sk-4", name: "PostgreSQL & NoSQL", level: 4 }
        ],
        languages: [
          "Português (Nativo)",
          "Inglês (Fluente)",
          "Xangana (Conversacional)"
        ]
      }
    },
    {
      id: "model-admin",
      label: "Administração & Finanças",
      industry: "Gestão / Secretariado / RH",
      hiredAt: "Hired @ Banco Comercial e de Investimentos (BCI)",
      atsScore: 96,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      accent: "gold",
      data: {
        personalInfo: {
          fullName: "Fátima Amina Tembe",
          title: "Assistente Administrativa e de Recursos Humanos",
          email: "fatima.tembe@email.com",
          phone: "+258 82 987 6123",
          location: "Beira, Moçambique",
          about: "Profissional extremamente organizada com competências sólidas na gestão de fluxos de trabalho administrativos, agendamentos executivos de alto nível e supervisão de documentação corporativa. Fluência em inglês técnico e facilidade de comunicação interpessoal multissetorial.",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        },
        experiences: [
          {
            id: "m-adm-exp-1",
            company: "BCI - Banco Comercial e de Investimentos",
            role: "Assistente Administrativa Sénior",
            startDate: "2022-05",
            endDate: "Presente",
            description: "Coordenação direta do expediente operacional de apoio à Direção Regional de Créditos. Organização e digitalização de arquivos corporativos sob estritas normas de confidencialidade governamental."
          },
          {
            id: "m-adm-exp-2",
            company: "Moçambique Logística Limitada",
            role: "Oficial Administrativa de Recursos Humanos",
            startDate: "2019-10",
            endDate: "2022-04",
            description: "Gestão do histórico ocupacional de mais de 120 colaboradores. Consolidação mensal das folhas de horas para reporte e processamento de salários da equipa local de distribuição."
          }
        ],
        educations: [
          {
            id: "m-adm-edu-1",
            institution: "Instituto Superior de Ciências e Tecnologias de Moçambique (ISCTEM)",
            degree: "Licenciatura em Gestão de Empresas",
            startDate: "2015-02",
            endDate: "2019-06",
            description: "Foco curricular em Direção Financeira, Gestão Estratégica de Talentos Humanos e Auditoria Interna."
          }
        ],
        skills: [
          { id: "m-adm-sk-1", name: "Gestão Estratégica", level: 5 },
          { id: "m-adm-sk-2", name: "Excel Avançado / ERPs", level: 5 },
          { id: "m-adm-sk-3", name: "Comunicação Corporativa", level: 5 },
          { id: "m-adm-sk-4", name: "Organização de Eventos", level: 4 }
        ],
        languages: [
          "Português (Nativo)",
          "Inglês (Avançado)",
          "Sena (Nativo)"
        ]
      }
    },
    {
      id: "model-eng",
      label: "Construção & Engenharia",
      industry: "Obras Públicas / Projetos Civis",
      hiredAt: "Hired @ Cimentos de Moçambique",
      atsScore: 95,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      accent: "slate",
      data: {
        personalInfo: {
          fullName: "Eng. Cláudio Celestino Sitoe",
          title: "Engenheiro de Planeamento e Obras",
          email: "claudio.sitoe@email.com",
          phone: "+258 85 456 7890",
          location: "Nampula, Moçambique",
          about: "Membro efetivo da Ordem dos Engenheiros de Moçambique especializado na fiscalização e planeamento estrutural de grandes infraestruturas civis e edifícios habitacionais. Focado no estrito cumprimento de orçamentações, prazos cronológicos e as mais elevadas diretivas de segurança técnica.",
          avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
        },
        experiences: [
          {
            id: "m-eng-exp-1",
            company: "Cimentos de Moçambique",
            role: "Coordenador de Planeamento Técnico",
            startDate: "2021-02",
            endDate: "Presente",
            description: "Gestão do plano de manutenção interna da central fabril das instalações do Norte. Supervisão técnica e elaboração de relatórios semanais de estabilidade estrutural com equipas mistas de 40 operários de pista."
          },
          {
            id: "m-eng-exp-2",
            company: "Construtora Horizonte Lda",
            role: "Engenheiro Fiscalizador Júnior",
            startDate: "2018-08",
            endDate: "2021-01",
            description: "Acompanhamento diário no terreno das obras públicas de saneamento municipal de vias públicas. Validação do betão estrutural e garantia de conformidade técnica com o projeto desenhado."
          }
        ],
        educations: [
          {
            id: "m-eng-edu-1",
            institution: "Universidade Lúrio (UniLúrio)",
            degree: "Licenciatura em Engenharia Civil",
            startDate: "2013-02",
            endDate: "2017-12",
            description: "Estudos centrados em Mecânica de Solos, Resistência de Materiais e Cálculo de Pontes de Betão Armado."
          }
        ],
        skills: [
          { id: "m-eng-sk-1", name: "AutoCAD / Civil 3D", level: 5 },
          { id: "m-eng-sk-2", name: "Orçamentação (MS Project)", level: 5 },
          { id: "m-eng-sk-3", name: "Fiscalização de Obras", level: 5 },
          { id: "m-eng-sk-4", name: "Gestão de Segurança (SST)", level: 4 }
        ],
        languages: [
          "Português (Nativo)",
          "Macua (Nativo)",
          "Inglês (Intermédio)"
        ]
      }
    }
  ];

  const currentDemo = DEMO_MODELS.find(m => m.id === selectedDemoId) || DEMO_MODELS[0];

  const handleUsePreset = (modelData: CVData) => {
    // Perform deep copy
    const clonedData = JSON.parse(JSON.stringify(modelData));
    onSelectModel(clonedData);
    onStartBuilding();
    // Scroll smoothly to config bar
    const editorEl = document.getElementById('btn-nav-action');
    if (editorEl) {
      editorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="models" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-zinc-900/40 relative">
      <div className="absolute top-[20%] left-1/4 w-[300px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3 mb-10">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full">
          Garantia de Empregabilidade
        </span>
        <h2 className="font-display font-black text-2.5xl sm:text-3.5xl text-white tracking-tight leading-tight">
          Modelos de Currículo de Sucesso ✨
        </h2>
        <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
          Explore perfis profissionais reais desenhados para ter taxas de conversão de 95%+ em entrevistas em Moçambique. Escolha um para começar o seu preenchimento imediatamente!
        </p>

        {/* View Switcher Tabs */}
        <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl mt-3 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'presets' 
                ? 'bg-zinc-900 text-emerald-400 font-extrabold border border-zinc-850 shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Carregar de Exemplos</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beforeAfter')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'beforeAfter' 
                ? 'bg-zinc-900 text-emerald-400 font-extrabold border border-zinc-850 shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Comparativo Antes / Depois</span>
          </button>
        </div>
      </div>

      {/* Main Tab content rendering */}
      {activeTab === 'presets' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Presets List side column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider pl-1 font-mono">Setores de Alta Demanda</span>
            {DEMO_MODELS.map((item) => {
              const isActive = item.id === selectedDemoId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDemoId(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col gap-1 ${
                    isActive 
                      ? 'bg-zinc-900 border-emerald-500/30 ring-1 ring-emerald-500/30' 
                      : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold font-mono uppercase tracking-wider ${
                      isActive ? 'text-emerald-400' : 'text-zinc-500'
                    }`}>
                      {item.industry}
                    </span>
                    <span className="text-[10px] text-zinc-450 font-medium">ATS {item.atsScore}%</span>
                  </div>
                  <h3 className="font-semibold text-zinc-150 leading-tight mt-1 text-xs">{item.label}</h3>
                  <span className="text-[10px] text-zinc-550 italic mt-0.5">{item.hiredAt}</span>
                </button>
              );
            })}

            {/* AI Custom Hint card */}
            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col gap-2 mt-2">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pronto para usar</span>
              </span>
              <p className="text-[10.5px] text-zinc-400 leading-normal">
                Clique em <strong className="text-zinc-200">"Utilizar este Modelo"</strong> ao lado. Ele carregará todos os dados de forma instantânea para você apenas colocar suas conquistas reais!
              </p>
            </div>
          </div>

          {/* Interactive Previewer Panel (8 cols) */}
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-905 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aprovado por RH Moçambique</span>
            </div>

            <div className="flex flex-col gap-5">
              {/* Header inside the demo preview */}
              <div className="flex items-center gap-4 border-b border-zinc-850/60 pb-5">
                <img 
                  src={currentDemo.avatar} 
                  alt={currentDemo.data.personalInfo.fullName}
                  className="w-12 h-12 rounded-full border border-zinc-800 object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="font-display font-bold text-zinc-100 text-sm">{currentDemo.data.personalInfo.fullName}</h3>
                  <span className="text-xs text-emerald-400 font-medium">{currentDemo.data.personalInfo.title}</span>
                  <div className="text-[10px] text-zinc-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    <span>📍 {currentDemo.data.personalInfo.location}</span>
                    <span>📧 {currentDemo.data.personalInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Bio summary paragraph */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-zinc-455 font-mono uppercase tracking-wider font-bold">Resumo Profissional</span>
                <p className="text-[11px] text-zinc-350 leading-relaxed bg-zinc-900/40 p-3 rounded-lg border border-zinc-900 font-sans">
                  {currentDemo.data.personalInfo.about}
                </p>
              </div>

              {/* Grid split for Experiência and Competências snippet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
                {/* Simulated major experience list */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-zinc-455 font-mono uppercase tracking-wider font-bold">Experiência Destacada</span>
                  {currentDemo.data.experiences.slice(0, 1).map((exp, i) => (
                    <div key={i} className="flex flex-col bg-zinc-900/40 p-3 rounded-lg border border-zinc-900 leading-tight gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-zinc-200 font-bold text-xs">{exp.role}</span>
                        <span className="text-[9px] text-zinc-500 font-mono font-medium">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <span className="text-[10px] text-emerald-450 font-semibold">{exp.company}</span>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans mt-1 line-clamp-3">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Simulated skill levels snippet */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-zinc-455 font-mono uppercase tracking-wider font-bold">Habilidades Calculadas</span>
                  <div className="flex flex-col bg-zinc-900/40 p-3 rounded-lg border border-zinc-900 gap-2.5">
                    {currentDemo.data.skills.map((sk) => (
                      <div key={sk.id} className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-medium">
                          <span className="text-zinc-300">{sk.name}</span>
                          <span className="text-emerald-400 font-semibold">{sk.level}/5 Expert</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${(sk.level / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Action prefill CTA button */}
            <div className="mt-8 pt-4 border-t border-zinc-850/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] text-zinc-500 font-mono leading-none">Status de Validação ATS:</span>
                <p className="text-[11.5px] font-semibold text-white mt-0.5">Pontuação {currentDemo.atsScore}/100 • Excelente Qualificação</p>
              </div>
              <button
                type="button"
                onClick={() => handleUsePreset(currentDemo.data)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/5 animate-pulse"
              >
                <span>Utilizar este Modelo</span>
                <ChevronRight className="w-4 h-4 text-black shrink-0" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Before / After comparative mockup */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* BEFORE: Badly drafted CV */}
          <div className="bg-zinc-900/50 border border-red-950/40 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-red-400 uppercase tracking-widest font-mono">
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorreto</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-red-550 font-mono uppercase tracking-wider">Erros comuns (Rejeitado)</span>
              <h3 className="font-display font-semibold text-zinc-300 text-sm mt-1">O famoso Currículo Amador</h3>
            </div>
            
            <div className="flex flex-col bg-zinc-950 p-4 rounded-xl border border-zinc-900 leading-relaxed text-zinc-400 text-[11px] gap-3">
              <div className="border-b border-zinc-900 pb-2">
                <strong className="text-zinc-200">CURRICULO VITAE DE ORLANDO</strong>
                <p className="text-[10px] text-zinc-500">Email: orlandografo@hotmail.com | Tel: 8234823423</p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-[10px] text-red-450 line-through">SOBRE ME:</span>
                <p className="text-zinc-500 leading-normal text-[10.5px]">
                  Estou a procura de emprego na vossa empresa porisso preciso de uma oportunidade para fasso qualquer coisa. Tenho muita facilidade de aprender.
                </p>
                <span className="text-[9.5px] text-red-400 italic font-mono bg-red-500/[0.03] p-1.5 rounded border border-red-500/10 mt-1">
                  ❌ Erros graves: "SOBRE ME", "porisso" (com certeza separado), gírias desnecessárias e falta de objetividade.
                </span>
              </div>

              <div className="flex flex-col gap-1 border-t border-zinc-900 pt-2">
                <span className="font-bold text-[10px] text-red-450 line-through text-left">EXPERIENÇIA PROFICIONAL:</span>
                <p className="text-zinc-505 leading-normal text-[10px]">
                  * 2021-2022: Trabalhei na Limbo Soluções.<br/>
                  * Atendi clientes de várias formas e fiz ajuda em computadores.
                </p>
                <span className="text-[9.5px] text-red-400 italic font-mono bg-red-500/[0.03] p-1.5 rounded border border-red-500/10 mt-1">
                  ❌ Erros graves: "Experiençia Proficional" (erros ortográficos detectados), descrições vagas sem números de conquista ou impacto técnico.
                </span>
              </div>
            </div>

            <p className="text-[10.5px] text-zinc-450 leading-relaxed">
              Modelos em Word geram caixas de texto invisíveis ou colunas flutuantes que confundem os robôs de leitura ATS das grandes empresas, eliminando seu currículo sem que nenhum humano sequer o veja.
            </p>
          </div>

          {/* AFTER: Perfect PrimeCV template */}
          <div className="bg-zinc-900/50 border border-emerald-950/40 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Otimizado PrimeCV</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-450 font-mono uppercase tracking-wider">Perfeito para o topo (Aprovado)</span>
              <h3 className="font-display font-semibold text-zinc-100 text-sm mt-1">O Currículo Estruturado Profissional</h3>
            </div>

            <div className="flex flex-col bg-zinc-950 p-4 rounded-xl border border-zinc-900 leading-relaxed text-zinc-300 text-[11px] gap-3">
              <div className="border-b border-zinc-900 pb-2">
                <strong className="text-white text-xs">Orlando Chissano</strong>
                <p className="text-[10px] text-emerald-450">Especialista de Vendas e Apoio ao Cliente</p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-[10px] text-emerald-400 uppercase font-mono">Resumo Profissional:</span>
                <p className="text-zinc-300 leading-normal text-[10.5px]">
                  Profissional proativo com mais de 2 anos de experiência direta no atendimento de clientes e gestão de operações comerciais. Foco na resolução rápida de incidentes e retenção de consumidores.
                </p>
                <span className="text-[9.5px] text-emerald-400 font-mono bg-emerald-500/[0.03] p-1.5 rounded border border-emerald-500/10 mt-1">
                  ✓ Alta Performance: Correção ortográfica instantânea, tom assertivo de mercado, dados e competências explícitas.
                </span>
              </div>

              <div className="flex flex-col gap-1 border-t border-zinc-900 pt-2">
                <span className="font-bold text-[10px] text-emerald-400 uppercase font-mono">Experiência Profissional:</span>
                <p className="text-zinc-300 leading-normal text-[10px]">
                  <strong className="text-white">Oficial de Apoio Comercial</strong> - Limbo Soluções Lda<br/>
                  Liderança e execução de suporte técnico especializado a clientes corporativos nacionais. Otimização de tempo médio de espera em 35%.
                </p>
                <span className="text-[9.5px] text-emerald-400 font-mono bg-emerald-500/[0.03] p-1.5 rounded border border-emerald-500/10 mt-1">
                  ✓ Legível por ATS: Hierarquia simples, formatação linear aprovada por robôs internacionais de RH.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-auto">
              <button
                type="button"
                onClick={onStartBuilding}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/5 cursor-pointer"
              >
                <span>Usar Tecnologia PrimeCV agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
