import React, { useState } from 'react';
import { CVData, Experience, Education, Skill } from '../types';
import { avatarPresets } from '../data';
import SpellCheckedTextarea from './SpellCheckedTextarea';
import { 
  User, Briefcase, GraduationCap, Code, Globe, Plus, Trash2, 
  ChevronDown, ChevronUp, Sparkles, AlertCircle, Check, X, Lightbulb, Upload
} from 'lucide-react';

interface CVFormProps {
  data: CVData;
  onChange: (newData: CVData) => void;
}

export default function CVForm({ data, onChange }: CVFormProps) {
  const { personalInfo, experiences, educations, skills, languages } = data;
  
  // Accordion Toggles
  const [activeSection, setActiveSection] = useState<string>('personal');

  // AI-powered states for Professional Summary
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summarySuggestions, setSummarySuggestions] = useState<string[] | null>(null);
  const [summaryAdvice, setSummaryAdvice] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // AI-powered states for Work Experiences (keyed by experience ID)
  const [loadingExp, setLoadingExp] = useState<{ [id: string]: boolean }>({});
  const [expSuggestions, setExpSuggestions] = useState<{ [id: string]: string[] | null }>({});
  const [expAdvice, setExpAdvice] = useState<{ [id: string]: string | null }>({});
  const [expErrors, setExpErrors] = useState<{ [id: string]: string | null }>({});

  // Call Gemini API /api/gemini/summary
  const generateSummaryIdeas = async () => {
    if (!personalInfo.fullName || !personalInfo.fullName.trim() || !personalInfo.title || !personalInfo.title.trim()) {
      setSummaryError("Por favor, preencha primeiro o Nome Completo e o Título Profissional/Cargo para o Gemini conseguir estruturar a sua Bio.");
      setSummarySuggestions(null);
      setSummaryAdvice(null);
      return;
    }
    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const response = await fetch("/api/gemini/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: personalInfo.fullName,
          title: personalInfo.title,
          draft: personalInfo.about,
          skills: skills.map(s => s.name).filter(Boolean)
        })
      });
      if (!response.ok) {
        throw new Error("Não foi possível aceder ao servidor de Inteligência Artificial.");
      }
      const result = await response.json();
      if (result.suggestions && result.suggestions.length > 0) {
        setSummarySuggestions(result.suggestions);
        setSummaryAdvice(result.contextualAdvice || "");
      } else {
        throw new Error("Não foi possível gerar propostas de texto válidas.");
      }
    } catch (err: any) {
      setSummaryError(err.message || "Ocorreu um erro ao comunicar com a API Gemini.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const applySummary = (text: string) => {
    handlePersonalChange("about", text);
    setSummarySuggestions(null);
    setSummaryAdvice(null);
  };

  // Call Gemini API /api/gemini/experience
  const generateExperienceIdeas = async (id: string, role: string, company: string, draft: string) => {
    setLoadingExp(prev => ({ ...prev, [id]: true }));
    setExpErrors(prev => ({ ...prev, [id]: null }));
    try {
      const response = await fetch("/api/gemini/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, draft })
      });
      if (!response.ok) {
        throw new Error("Ocorreu um erro no servidor de Inteligência Artificial.");
      }
      const result = await response.json();
      if (result.suggestions && result.suggestions.length > 0) {
        setExpSuggestions(prev => ({ ...prev, [id]: result.suggestions }));
        setExpAdvice(prev => ({ ...prev, [id]: result.contextualAdvice || "" }));
      } else {
        throw new Error("Ocorreu um erro ao gerar propostas.");
      }
    } catch (err: any) {
      setExpErrors(prev => ({ ...prev, [id]: err.message || "Erro na comunicação com a API Gemini." }));
    } finally {
      setLoadingExp(prev => ({ ...prev, [id]: false }));
    }
  };

  const applyExperienceDescription = (id: string, text: string) => {
    updateExperience(id, "description", text);
    setExpSuggestions(prev => ({ ...prev, [id]: null }));
    setExpAdvice(prev => ({ ...prev, [id]: null }));
  };

  const toggleSection = (sectionName: string) => {
    setActiveSection(activeSection === sectionName ? '' : sectionName);
  };

  // Update Personal Info
  const handlePersonalChange = (field: keyof typeof personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...personalInfo,
        [field]: value
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 3 * 1024 * 1024) {
        alert("A imagem selecionada é muito grande. Escolha uma foto com menos de 3 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handlePersonalChange('avatarUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add/Update/Remove Experience
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({
      ...data,
      experiences: [...experiences, newExp]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updated = experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange({ ...data, experiences: updated });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: experiences.filter(exp => exp.id !== id)
    });
  };

  // Add/Update/Remove Education
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({
      ...data,
      educations: [...educations, newEdu]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = educations.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange({ ...data, educations: updated });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      educations: educations.filter(edu => edu.id !== id)
    });
  };

  // Add/Update/Remove Skill
  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: '',
      level: 4
    };
    onChange({
      ...data,
      skills: [...skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    const updated = skills.map(skill => {
      if (skill.id === id) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    onChange({ ...data, skills: updated });
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: skills.filter(skill => skill.id !== id)
    });
  };

  // Languages Handling
  const handleLanguageChange = (index: number, value: string) => {
    const updated = [...languages];
    updated[index] = value;
    onChange({ ...data, languages: updated });
  };

  const addLanguage = () => {
    onChange({ ...data, languages: [...languages, ''] });
  };

  const removeLanguage = (index: number) => {
    onChange({
      ...data,
      languages: languages.filter((_, idx) => idx !== index)
    });
  };

  return (
    <div className="flex flex-col gap-4 text-sm">
      
      {/* 1. Personal Info Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-200">
        <button 
          id="btn-accordion-personal"
          className="w-full px-5 py-4 flex items-center justify-between font-semibold text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/20 text-left cursor-pointer"
          onClick={() => toggleSection('personal')}
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
              <User className="w-4 h-4" />
            </span>
            <span>Dados Pessoais & Foto</span>
          </div>
          {activeSection === 'personal' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {activeSection === 'personal' && (
          <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/20 flex flex-col gap-4">
            {/* Full Name & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 text-xs font-medium">Nome Completo</label>
                <input 
                  type="text" 
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  placeholder="e.g. Edson Da C. Rita"
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2 text-zinc-200 placeholder:text-zinc-650 transition-colors duration-150 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 text-xs font-medium">Título Profissional / Cargo</label>
                <input 
                  type="text" 
                  value={personalInfo.title}
                  onChange={(e) => handlePersonalChange('title', e.target.value)}
                  placeholder="e.g. Engenheiro de Redes"
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2 text-zinc-200 placeholder:text-zinc-650 transition-colors duration-150 outline-none"
                />
              </div>
            </div>

            {/* AI Generator Button for ATS-optimized Bio */}
            <div className="flex justify-end -mt-1.5 -mb-0.5">
              <button
                id="btn-gerar-bio-ia"
                type="button"
                onClick={generateSummaryIdeas}
                disabled={loadingSummary}
                title="Gerar 3 alternativas de resumo profissional otimizadas para ATS a partir do seu Nome e Cargo"
                className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/15 rounded-lg px-3.5 py-2 font-bold flex items-center gap-1.5 transition duration-150 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-450" />
                {loadingSummary ? 'A gerar Bio com Gemini...' : 'Gerar Bio com IA'}
              </button>
            </div>

            {/* Email, Phone, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 text-xs font-medium">E-mail</label>
                <input 
                  type="email" 
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  placeholder="e.g. edson@dominio.com"
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2 text-zinc-200 placeholder:text-zinc-650 transition-colors duration-150 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 text-xs font-medium">Telemóvel</label>
                <input 
                  type="text" 
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  placeholder="e.g. +258 84 123 4567"
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2 text-zinc-200 placeholder:text-zinc-650 transition-colors duration-150 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-zinc-450 text-xs font-medium">Localização</label>
                <input 
                  type="text" 
                  value={personalInfo.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  placeholder="e.g. Maputo, Moçambique"
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2 text-zinc-200 placeholder:text-zinc-650 transition-colors duration-150 outline-none"
                />
              </div>
            </div>

            {/* Photo Preset Selector */}
            <div className="flex flex-col gap-1.5 border-t border-zinc-800/80 pt-3">
              <label className="text-zinc-400 text-xs font-medium">Foto de Perfil (Avatar Inteligente)</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
                {avatarPresets.map((preset, idx) => {
                  const isSelected = personalInfo.avatarUrl === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePersonalChange('avatarUrl', preset.url)}
                      className={`p-2 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-[11px] font-medium cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' 
                          : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {preset.url ? (
                        <img 
                          src={preset.url} 
                          alt="Preset avatar" 
                          referrerPolicy="no-referrer"
                          className={`w-8 h-8 rounded-full object-cover ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-dashed border border-zinc-600 flex items-center justify-center text-zinc-400 font-bold">
                          X
                        </div>
                      )}
                      <span className="truncate max-w-full text-center">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
              {/* Photo Upload and Custom Link options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2 border-t border-zinc-850/60">
                {/* Real photo file upload */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-medium select-none">Carregar foto real do computador:</span>
                  <label className="flex items-center justify-center gap-2 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/35 rounded-lg text-xs font-bold text-zinc-300 hover:text-white cursor-pointer transition duration-150 shadow-sm h-[34px]">
                    <Upload className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Importar foto local...</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                
                {/* Manual URL input fallback */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-medium select-none">Ou colar link (URL) de uma foto:</span>
                  <input 
                    type="text"
                    value={personalInfo.avatarUrl.startsWith('data:image') ? '' : personalInfo.avatarUrl}
                    onChange={(e) => handlePersonalChange('avatarUrl', e.target.value)}
                    placeholder="e.g. https://imagens.com/minha-foto.jpg"
                    className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2 text-zinc-200 placeholder:text-zinc-600 text-xs outline-none h-[34px] transition duration-150"
                  />
                </div>
              </div>
            </div>

            {/* About / Resumo */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-zinc-400 text-xs font-medium flex items-center gap-1.5">
                  Resumo Profissional / Perfil
                </label>
                <button
                  type="button"
                  onClick={generateSummaryIdeas}
                  disabled={loadingSummary}
                  className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-55 active:scale-95 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-sm ml-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {loadingSummary ? 'A processar...' : ' ✨ Redigir com IA / Ideias'}
                </button>
              </div>
              
              <SpellCheckedTextarea 
                rows={4}
                value={personalInfo.about}
                onChangeValue={(val) => handlePersonalChange('about', val)}
                placeholder="Breve resumo da tua trajetória profissional e principais pontos fortes..."
              />

              {/* Summary AI Suggestions Panel */}
              {(summarySuggestions || summaryAdvice || summaryError) && (
                <div className="bg-zinc-950/90 border border-zinc-850 p-4 rounded-xl flex flex-col gap-3 mt-1.5 relative shadow-xl overflow-hidden animate-fade-in">
                  <button 
                    type="button"
                    onClick={() => {
                      setSummarySuggestions(null);
                      setSummaryAdvice(null);
                      setSummaryError(null);
                    }}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-350 p-1 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                    title="Fechar sugestões"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-emerald-400 select-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ideias de Resumo Profissional</span>
                  </div>

                  {summaryError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-lg text-red-400 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{summaryError}</span>
                    </div>
                  )}

                  {summaryAdvice && (
                    <div className="p-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg text-[11px] text-zinc-400 leading-relaxed">
                      <strong className="text-emerald-300 font-medium block mb-0.5 flex items-center gap-1.5 select-none">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-450" /> Dica de Especialista Local:
                      </strong>
                      {summaryAdvice}
                    </div>
                  )}

                  {summarySuggestions && summarySuggestions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[9.5px] uppercase font-mono font-bold tracking-widest text-zinc-550 select-none">Selecione uma opção para carregar:</span>
                      {summarySuggestions.map((suggestion, opIdx) => (
                        <button
                          key={opIdx}
                          type="button;button"
                          onClick={() => applySummary(suggestion)}
                          className="text-left bg-zinc-900 hover:bg-zinc-850/80 active:bg-zinc-900 text-xs text-zinc-300 hover:text-white p-3 rounded-lg border border-zinc-800 hover:border-emerald-500/20 transition duration-150 cursor-pointer leading-relaxed shadow-sm relative group block"
                        >
                          <span className="block italic pr-10">"{suggestion}"</span>
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold tracking-wide text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 select-none">
                            <Check className="w-3 h-3" /> Usar
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* 2. Professional Experiences */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <button 
          id="btn-accordion-experiences"
          type="button"
          className="w-full px-5 py-4 flex items-center justify-between font-semibold text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/20 text-left cursor-pointer"
          onClick={() => toggleSection('experiences')}
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
              <Briefcase className="w-4 h-4" />
            </span>
            <span>Experiência Profissional ({experiences.length})</span>
          </div>
          {activeSection === 'experiences' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {activeSection === 'experiences' && (
          <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/20 flex flex-col gap-4">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-zinc-950/50 border border-zinc-850 rounded-lg flex flex-col gap-3 relative">
                <button 
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  title="Remover Experiência"
                  className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-zinc-800 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="font-semibold text-xs uppercase tracking-wider text-emerald-400">
                  Experiência #{index + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Empresa / Instituição</label>
                    <input 
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="e.g. Vodacom Moçambique"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Cargo Ocupado</label>
                    <input 
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      placeholder="e.g. Técnico Júnior M-Pesa"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Data de Início</label>
                    <input 
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="e.g. 2022-01"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Data de Fim</label>
                    <input 
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="e.g. Presente, ou 2023-10"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-zinc-450 text-[11px] font-medium">Principais Responsabilidades</label>
                    <button
                      type="button"
                      onClick={() => generateExperienceIdeas(exp.id, exp.role, exp.company, exp.description)}
                      disabled={loadingExp[exp.id]}
                      className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-55 active:scale-95 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-xs ml-auto"
                    >
                      <Sparkles className="w-3 h-3" />
                      {loadingExp[exp.id] ? 'A redigir...' : ' ✨ Redigir com IA'}
                    </button>
                  </div>
                  
                  <SpellCheckedTextarea 
                    rows={4}
                    value={exp.description}
                    onChangeValue={(val) => updateExperience(exp.id, 'description', val)}
                    placeholder="Quais foram as tuas atribuições, conquistas e tecnologias utilizadas..."
                  />

                  {/* Experience AI Box Suggestions */}
                  {(expSuggestions[exp.id] || expAdvice[exp.id] || expErrors[exp.id]) && (
                    <div className="bg-zinc-950/90 border border-zinc-850 p-3.5 rounded-xl flex flex-col gap-2.5 mt-1 relative shadow-lg text-xs animate-fade-in">
                      <button 
                        type="button"
                        onClick={() => {
                          setExpSuggestions(prev => ({ ...prev, [exp.id]: null }));
                          setExpAdvice(prev => ({ ...prev, [exp.id]: null }));
                          setExpErrors(prev => ({ ...prev, [exp.id]: null }));
                        }}
                        className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                        title="Fechar sugestões"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1 font-bold text-[10.5px] uppercase tracking-wider text-emerald-400 select-none">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ideias Geradas por IA ({exp.role || "Cargo"})</span>
                      </div>

                      {expErrors[exp.id] && (
                        <div className="p-2.5 bg-red-500/10 border border-red-500/15 rounded-lg text-red-400 text-[11px] flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{expErrors[exp.id]}</span>
                        </div>
                      )}

                      {expAdvice[exp.id] && (
                        <div className="p-2.5 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg text-[10.5px] text-zinc-400 leading-relaxed">
                          <strong className="text-emerald-300 font-medium block mb-0.5 flex items-center gap-1 select-none">
                            <Lightbulb className="w-3 h-3 text-emerald-450" /> Conselhos de Recrutamento:
                          </strong>
                          {expAdvice[exp.id]}
                        </div>
                      )}

                      {expSuggestions[exp.id] && expSuggestions[exp.id]!.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1">
                          <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-zinc-550 select-none">Escolha uma proposta para inserir:</span>
                          {expSuggestions[exp.id]!.map((suggestion, opIdx) => (
                            <button
                              key={opIdx}
                              type="button"
                              onClick={() => applyExperienceDescription(exp.id, suggestion)}
                              className="text-left bg-zinc-900 hover:bg-zinc-850/80 active:bg-zinc-900 text-xs text-zinc-350 hover:text-white p-3 rounded-lg border border-zinc-800 hover:border-emerald-500/20 transition duration-150 cursor-pointer leading-relaxed relative group block whitespace-pre-wrap"
                            >
                              <span className="block pr-10">{suggestion}</span>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold tracking-wide text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 select-none font-sans font-bold">
                                <Check className="w-3 h-3" /> Usar
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              id="btn-add-experience"
              type="button"
              onClick={addExperience}
              className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 p-3.5 rounded-xl text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold text-xs">Adicionar Experiência</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Education Profile */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <button 
          id="btn-accordion-education"
          type="button"
          className="w-full px-5 py-4 flex items-center justify-between font-semibold text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/20 text-left cursor-pointer"
          onClick={() => toggleSection('education')}
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span>Formação Académica ({educations.length})</span>
          </div>
          {activeSection === 'education' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {activeSection === 'education' && (
          <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/20 flex flex-col gap-4">
            {educations.map((edu, index) => (
              <div key={edu.id} className="p-4 bg-zinc-950/50 border border-zinc-850 rounded-lg flex flex-col gap-3 relative">
                <button 
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  title="Remover Formação"
                  className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-zinc-800 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="font-semibold text-xs uppercase tracking-wider text-emerald-400">
                  Formação #{index + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Instituição de Ensino</label>
                    <input 
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="e.g. Instituto Politécnico de Maputo"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Curso / Grau Comercial</label>
                    <input 
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="e.g. Médio Técnico em Informática"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Data de Início</label>
                    <input 
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      placeholder="e.g. 2019"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-450 text-[11px]">Data de Fim</label>
                    <input 
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      placeholder="e.g. 2022"
                      className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-455 text-[11px]">Observações / Detalhes (Opcional)</label>
                  <input 
                    type="text"
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    placeholder="Média final, projetos de destaque, etc..."
                    className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 placeholder:text-zinc-600 text-xs outline-none"
                  />
                </div>
              </div>
            ))}

            <button
              id="btn-add-education"
              type="button"
              onClick={addEducation}
              className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 p-3.5 rounded-xl text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold text-xs">Adicionar Formação</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Skills Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <button 
          id="btn-accordion-skills"
          type="button"
          className="w-full px-5 py-4 flex items-center justify-between font-semibold text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/20 text-left cursor-pointer"
          onClick={() => toggleSection('skills')}
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
              <Code className="w-4 h-4" />
            </span>
            <span>Competências / Skills ({skills.length})</span>
          </div>
          {activeSection === 'skills' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {activeSection === 'skills' && (
          <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/20 flex flex-col gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="flex gap-2 items-center bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
                <input 
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  placeholder="Nome do Skill"
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 text-xs outline-none"
                />
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">Nível:</span>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2 py-1.5 text-xs outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}/5</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  title="Apagar Skill"
                  className="text-zinc-500 hover:text-red-400 p-1.5 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              id="btn-add-skill"
              type="button"
              onClick={addSkill}
              className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 p-2.5 rounded-xl text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">Adicionar Competência</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Languages Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <button 
          id="btn-accordion-languages"
          type="button"
          className="w-full px-5 py-4 flex items-center justify-between font-semibold text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/20 text-left cursor-pointer"
          onClick={() => toggleSection('languages')}
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md">
              <Globe className="w-4 h-4" />
            </span>
            <span>Idiomas Falados</span>
          </div>
          {activeSection === 'languages' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {activeSection === 'languages' && (
          <div className="p-5 border-t border-zinc-800/80 bg-zinc-900/20 flex flex-col gap-2.5">
            {languages.map((lang, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input 
                  type="text"
                  value={lang}
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                  placeholder="e.g. Português (Nativo), Inglês (Básico)"
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-zinc-200 text-xs outline-none"
                />
                <button 
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-zinc-650 hover:text-red-400 p-1.5 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              id="btn-add-language"
              type="button"
              onClick={addLanguage}
              className="flex items-center justify-center gap-2 border border-dashed border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 p-2 rounded-xl text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">Adicionar Idioma</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
