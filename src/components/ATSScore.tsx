import React, { useState } from 'react';
import { CVData } from '../types';
import { 
  Sparkles, CheckCircle2, Check, ChevronDown, ChevronUp, 
  Lightbulb, Award, BookOpen, Briefcase, TrendingUp, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ATSScoreProps {
  data: CVData;
}

export default function ATSScore({ data }: ATSScoreProps) {
  const [isOpen, setIsOpen] = useState(true);

  // 1. Calculate Score details
  let score = 0;
  const checks: { id: string; label: string; done: boolean; value: number }[] = [];

  // Personal Info checks (Max 25 pts)
  const hasName = !!data.personalInfo.fullName?.trim();
  const hasTitle = !!data.personalInfo.title?.trim();
  const hasContact = !!data.personalInfo.email?.trim() && !!data.personalInfo.location?.trim();

  checks.push({
    id: 'name',
    label: 'Nome Completo preenchido',
    done: hasName,
    value: 8
  });
  checks.push({
    id: 'title',
    label: 'Título Profissional ou Cargo definido',
    done: hasTitle,
    value: 8
  });
  checks.push({
    id: 'contact',
    label: 'Email e Localização informados',
    done: hasContact,
    value: 9
  });

  if (hasName) score += 8;
  if (hasTitle) score += 8;
  if (hasContact) score += 9;

  // Bio / About checks (Max 20 pts)
  const bioLength = data.personalInfo.about?.trim().length || 0;
  const isBioFilled = bioLength > 10;
  const isBioRobust = bioLength >= 100;

  checks.push({
    id: 'bio_presence',
    label: 'Resumo Profissional / Bio preenchida',
    done: isBioFilled,
    value: 10
  });
  checks.push({
    id: 'bio_robust',
    label: 'Resumo com profundidade mínima (>= 100 caracteres)',
    done: isBioRobust,
    value: 10
  });

  if (isBioFilled) score += 10;
  if (isBioRobust) score += 10;

  // Experiences (Max 25 pts)
  const experienceCount = data.experiences ? data.experiences.length : 0;
  const hasExp = experienceCount > 0;
  const hasMultipleExp = experienceCount >= 2;
  const experiencesHaveDetails = experienceCount > 0 && data.experiences.every(exp => (exp.description?.trim().length || 0) >= 40);

  checks.push({
    id: 'has_exp',
    label: 'Garante pelo menos 1 experiência de trabalho',
    done: hasExp,
    value: 10
  });
  checks.push({
    id: 'multiple_exp',
    label: 'Demonstra evolução de carreira (2+ cargos ou funções)',
    done: hasMultipleExp,
    value: 8
  });
  checks.push({
    id: 'exp_details',
    label: 'Detalhamento rico das atividades das experiências',
    done: experiencesHaveDetails,
    value: 7
  });

  if (hasExp) score += 10;
  if (hasMultipleExp) score += 8;
  if (experiencesHaveDetails) score += 7;

  // Education (Max 15 pts)
  const educationCount = data.educations ? data.educations.length : 0;
  const hasEducation = educationCount > 0;
  const hasRobustEducation = educationCount >= 2 || (educationCount === 1 && !!data.educations[0].description?.trim());

  checks.push({
    id: 'has_education',
    label: 'Possui Formação Acadêmica declarada',
    done: hasEducation,
    value: 10
  });
  checks.push({
    id: 'robust_education',
    label: 'Formação com detalhes ou histórico completo',
    done: hasRobustEducation,
    value: 5
  });

  if (hasEducation) score += 10;
  if (hasRobustEducation) score += 5;

  // Skills & Languages (Max 15 pts)
  const skillCount = data.skills ? data.skills.length : 0;
  const hasEnoughSkills = skillCount >= 4;
  const hasLanguages = data.languages && data.languages.length > 0;

  checks.push({
    id: 'enough_skills',
    label: 'Competências técnicas declaradas (mínimo de 4 para indexar)',
    done: hasEnoughSkills,
    value: 10
  });
  checks.push({
    id: 'has_languages',
    label: 'Idiomas ou competências linguísticas',
    done: hasLanguages,
    value: 5
  });

  if (hasEnoughSkills) score += 10;
  if (hasLanguages) score += 5;

  // Cap score to 100 just in case
  score = Math.min(100, Math.max(0, score));

  // Determine score color classes & status
  let scoreColor = "text-red-500 bg-red-500/10 border-red-500/20";
  let scoreBarColor = "bg-red-500";
  let ratingLabel = "Insuficiente para ATS";
  let adviceText = "O seu currículo precisa de mais dados essenciais. Os recrutadores e os robôs de pesquisa (ATS) descartarão este rascunho muito rapidamente se não tiver competências estruturadas ou descrições profissionais completas.";

  if (score >= 40 && score < 70) {
    scoreColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    scoreBarColor = "bg-amber-500";
    ratingLabel = "Regular - Precisa Polimento";
    adviceText = "Rascunho razoável! No entanto, adicionar descrições ricas, indicar os seus idiomas ou usar o gerador de resumos por Inteligência Artificial (Gemini) elevará o documento ao nível dos 15% melhores candidatos locais.";
  } else if (score >= 70 && score < 85) {
    scoreColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    scoreBarColor = "bg-emerald-500";
    ratingLabel = "Elevado - Altamente Recomendado";
    adviceText = "Excelente nível de detalhamento profissional! Este currículo está maduro e estruturado de forma ideal para triagens de RH e postulação sénior em canais de recrutamento nacionais e multinacionais.";
  } else if (score >= 85) {
    scoreColor = "text-purple-400 bg-purple-500/10 border-purple-500/20";
    scoreBarColor = "bg-gradient-to-r from-emerald-500 to-purple-500 animate-pulse";
    ratingLabel = "Excelente / Estrela ATS 🌟";
    adviceText = "Parabéns! O seu perfil cumpre plenamente os standards internacionais de legibilidade informática e humana. Está pronto para submissão ou para partilhar como imagem de alta resolução (PNG) nas suas redes corporativas!";
  }

  // Action suggestions (Pending ones)
  const pendingChecks = checks.filter(c => !c.done);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between font-semibold text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/20 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold flex items-center gap-1.5">
              Análise de Score ATS & LinkedIn
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${scoreColor} font-bold tracking-wide transition duration-300`}>
                {score}%
              </span>
            </span>
            <span className="text-[10px] text-zinc-450 font-normal">Métrica dinâmica de aceitação em triagens informáticas</span>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-800/80 bg-zinc-900/10"
          >
            <div className="p-5 flex flex-col gap-4">
              
              {/* Score visual indicator */}
              <div className="flex items-center gap-4 bg-zinc-950/40 p-4 border border-zinc-850 rounded-xl">
                {/* Gauge ring/numeric display */}
                <div className="relative w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin opacity-20 duration-1000"></div>
                  <span className="text-lg font-black text-white">{score}</span>
                </div>
                
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-zinc-200 select-none">{ratingLabel}</span>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">Score Alvo {'>'}=75%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-750 ${scoreBarColor}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 leading-relaxed mt-1 select-none">
                    Dica: Use palavras-chave reais das vagas locais na secção de competências.
                  </span>
                </div>
              </div>

              {/* Expert Advice Text */}
              <div className="bg-zinc-950/30 border border-zinc-850 p-3 rounded-lg text-zinc-350 text-[11px] leading-relaxed flex gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-200 block mb-0.5 select-none">Avaliação do Currículo:</span>
                  {adviceText}
                </div>
              </div>

              {/* Dynamic Checklists split */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="text-[10px] uppercase tracking-widest font-mono text-zinc-500 mb-1 font-bold select-none">Lista de Confirmação para ATS</div>
                
                {checks.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 text-xs text-zinc-350">
                    <div className="mt-0.5 shrink-0">
                      {item.done ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-650">
                          <span className="text-[8px] font-mono font-bold">-{item.value}</span>
                        </div>
                      )}
                    </div>
                    <span className={`leading-tight select-none ${item.done ? 'text-zinc-400 line-through decoration-zinc-800 opacity-60' : 'text-zinc-200 font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action advice for LinkedIn optimization */}
              {score >= 70 && (
                <div className="border-t border-dashed border-zinc-800 pt-3 mt-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dicas de Otimização no LinkedIn</span>
                  </div>
                  <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-3 text-[10.5px] leading-relaxed text-zinc-400 flex flex-col gap-2.5">
                    <p>
                      <strong>📥 Compartilhe no feed:</strong> Exporte o seu currículo como 
                      <strong className="text-zinc-200"> Imagem PNG HD</strong> através de nosso botão no visualizador e anexe-o diretamente no LinkedIn! Posts com imagens nítidas aumentam em <strong className="text-emerald-400">até 4x o engajamento</strong> de recrutadores locais.
                    </p>
                    <p>
                      <strong>🔑 Combinação de Palavras:</strong> Copie as competências técnicas que escolheu e adicione-as diretamente à seção nativa "Competências" do LinkedIn. Isso maximiza sua aparição em pesquisas refinadas do Recruiter.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
