import React from 'react';
import { CVData, CVTheme, CVTemplate } from '../types';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Compass, Star } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
  theme: CVTheme;
  template: CVTemplate;
}

export default function CVPreview({ data, theme, template }: CVPreviewProps) {
  const { personalInfo, experiences, educations, skills, languages } = data;

  // Primary Theme classes
  const getThemeColorClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-500 border-emerald-500 bg-emerald-500';
      case 'gold': return 'text-amber-500 border-amber-500 bg-amber-500';
      case 'slate': return 'text-zinc-300 border-zinc-400 bg-zinc-600';
      default: return 'text-emerald-500 border-emerald-500 bg-emerald-500';
    }
  };

  const getAccentText = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-600';
      case 'gold': return 'text-amber-600';
      case 'slate': return 'text-zinc-700';
      default: return 'text-emerald-600';
    }
  };

  const getBadgeClass = () => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'gold': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'slate': return 'bg-zinc-100 text-zinc-800 border-zinc-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  // Base fonts
  const headingFont = template === 'executive' ? 'font-serif' : 'font-display';

  // Render Modern (Two-Column Layout)
  if (template === 'modern') {
    return (
      <div id="cv-preview-paper" className="bg-white text-zinc-800 w-full min-h-[1100px] shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row text-[13px] leading-relaxed transition-all duration-300 print:shadow-none print:rounded-none">
        
        {/* Left Column (Accent Sidebar) */}
        <div className="w-full md:w-[35%] bg-zinc-50 border-r border-zinc-100 p-6 flex flex-col gap-6 print:bg-zinc-50">
          
          {/* Avatar and Profile Title */}
          <div className="flex flex-col items-center text-center gap-3">
            {personalInfo.avatarUrl ? (
              <img 
                src={personalInfo.avatarUrl} 
                alt={personalInfo.fullName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover border-2 shadow-sm border-zinc-200" 
              />
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white ${theme === 'emerald' ? 'bg-emerald-600' : theme === 'gold' ? 'bg-amber-500' : 'bg-zinc-500'} font-bold text-3xl shadow-sm`}>
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'CV'}
              </div>
            )}
            
            <div className="mt-1">
              <h2 className={`${headingFont} text-lg font-bold text-zinc-900 tracking-tight`}>
                {personalInfo.fullName || 'Seu Nome Completo'}
              </h2>
              <p className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${getAccentText()}`}>
                {personalInfo.title || 'Cargo Alvo'}
              </p>
            </div>
          </div>

          <hr className="border-zinc-200/60" />

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5`}>
              <Compass className="w-3.5 h-3.5 opacity-70" /> Contacto
            </h3>
            <div className="flex flex-col gap-2 text-xs text-zinc-600">
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-zinc-200/60" />

          {/* Skills Grid */}
          <div className="flex flex-col gap-3">
            <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5`}>
              <Award className="w-3.5 h-3.5 opacity-70" /> Competências
            </h3>
            <div className="flex flex-col gap-2.5">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div key={skill.id} className="text-xs">
                    <div className="flex justify-between items-center mb-1 text-zinc-700 font-medium">
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-zinc-400">{skill.level}/5</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          theme === 'emerald' ? 'bg-emerald-500' : theme === 'gold' ? 'bg-amber-500' : 'bg-zinc-500'
                        }`}
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">Nenhuma competência adicionada.</p>
              )}
            </div>
          </div>

          <hr className="border-zinc-200/60" />

          {/* Languages */}
          <div className="flex flex-col gap-2">
            <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5`}>
              Idiomas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {languages.length > 0 ? (
                languages.map((lang, index) => (
                  <span 
                    key={index} 
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${getBadgeClass()}`}
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">Nenhum idioma listado.</p>
              )}
            </div>
          </div>

          {/* ATS Compliant Footer Indicator */}
          <div className="mt-auto pt-6 text-[10px] text-zinc-400 font-mono flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Otimizado ATS & M-Pesa | PrimeCV
          </div>

        </div>

        {/* Right Column (Core Details) */}
        <div className="flex-1 p-8 flex flex-col gap-6">
          
          {/* Professional Statement / About */}
          {personalInfo.about && (
            <div className="flex flex-col gap-2">
              <h3 className={`${headingFont} text-sm font-bold uppercase tracking-wider ${getAccentText()} border-b pb-1`}>
                Sobre Mim
              </h3>
              <p className="text-zinc-600 leading-relaxed text-xs text-justify">
                {personalInfo.about}
              </p>
            </div>
          )}

          {/* Experience Timeline */}
          <div className="flex flex-col gap-4">
            <h3 className={`${headingFont} text-sm font-bold uppercase tracking-wider ${getAccentText()} border-b pb-1 flex items-center gap-2`}>
              <Briefcase className="w-4 h-4 text-zinc-400" /> Experiência Profissional
            </h3>
            <div className="flex flex-col gap-5">
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-zinc-100 flex flex-col gap-1 hover:border-emerald-300 transition-colors">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-300 border-2 border-white"></div>
                    <div className="flex flex-wrap justify-between items-start gap-1">
                      <h4 className="font-bold text-zinc-800 text-xs">
                        {exp.role || 'Cargo'} <span className="font-normal text-zinc-400">em</span> {exp.company || 'Empresa'}
                      </h4>
                      <span className="text-[10px] font-medium bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-500 shrink-0">
                        {exp.startDate || 'Início'} — {exp.endDate || 'Fim'}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-xs text-justify whitespace-pre-line leading-relaxed">
                      {exp.description || 'Descrição das funções e conquistas realizadas.'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">Nenhuma experiência profissional adicionada.</p>
              )}
            </div>
          </div>

          {/* Education Timeline */}
          <div className="flex flex-col gap-4">
            <h3 className={`${headingFont} text-sm font-bold uppercase tracking-wider ${getAccentText()} border-b pb-1 flex items-center gap-2`}>
              <GraduationCap className="w-4 h-4 text-zinc-400" /> Formação Académica
            </h3>
            <div className="flex flex-col gap-5">
              {educations.length > 0 ? (
                educations.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-zinc-100 flex flex-col gap-1">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-300 border-2 border-white"></div>
                    <div className="flex flex-wrap justify-between items-start gap-1">
                      <h4 className="font-bold text-zinc-800 text-xs">
                        {edu.degree || 'Curso / Especialização'}
                      </h4>
                      <span className="text-[10px] font-medium bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-500 shrink-0">
                        {edu.startDate || 'Início'} — {edu.endDate || 'Fim'}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">
                      {edu.institution || 'Instituição de Ensino'}
                    </span>
                    {edu.description && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 italic">Nenhuma formação académica adicionada.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Render Minimalist (One-Column Centered Layout)
  if (template === 'minimalist') {
    return (
      <div id="cv-preview-paper" className="bg-white text-zinc-800 w-full min-h-[1100px] shadow-2xl rounded-sm p-10 flex flex-col gap-6 text-[13px] leading-relaxed transition-all duration-300 print:shadow-none print:rounded-none">
        
        {/* Simple Centered Header */}
        <div className="text-center flex flex-col items-center gap-3 border-b-2 pb-6 border-zinc-100">
          {personalInfo.avatarUrl && (
            <img 
              src={personalInfo.avatarUrl} 
              alt={personalInfo.fullName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border shadow-sm border-zinc-100 mb-2" 
            />
          )}
          <div>
            <h2 className={`${headingFont} text-2xl font-bold text-zinc-950 tracking-tight`}>
              {personalInfo.fullName || 'Seu Nome Completo'}
            </h2>
            <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${getAccentText()}`}>
              {personalInfo.title || 'Cargo Alvo'}
            </p>
          </div>

          {/* Contact Row */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-zinc-500 mt-2 font-medium">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-zinc-400" /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-400" /> {personalInfo.email}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {personalInfo.location}
              </span>
            )}
          </div>
        </div>

        {/* Profile Bio */}
        {personalInfo.about && (
          <div className="flex flex-col gap-2">
            <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider ${getAccentText()} flex items-center gap-2`}>
              Resumo Profissional
            </h3>
            <p className="text-zinc-600 text-xs text-justify">
              {personalInfo.about}
            </p>
          </div>
        )}

        {/* Job Experience */}
        <div className="flex flex-col gap-3 mt-2">
          <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider ${getAccentText()} border-b pb-1.5 flex items-center gap-2`}>
            Experiência Profissional
          </h3>
          <div className="flex flex-col gap-4">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-zinc-900 text-xs">
                      {exp.role} <span className="font-normal text-zinc-400 font-sans">|</span> {exp.company}
                    </h4>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-xs text-justify whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">Nenhuma experiência profissional adicionada.</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="flex flex-col gap-3 mt-2">
          <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider ${getAccentText()} border-b pb-1.5 flex items-center gap-2`}>
            Formação Académica
          </h3>
          <div className="flex flex-col gap-4">
            {educations.length > 0 ? (
              educations.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-zinc-900 text-xs">
                      {edu.degree}
                    </h4>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {edu.institution}
                  </span>
                  {edu.description && (
                    <p className="text-zinc-500 text-xs mt-1 italic">{edu.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">Nenhuma formação académica adicionada.</p>
            )}
          </div>
        </div>

        {/* Grid of Skills + Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-2 border-t border-zinc-100">
          
          {/* Skills with bullet tags */}
          <div className="flex flex-col gap-2">
            <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider ${getAccentText()}`}>
              Competências Principais
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-zinc-100 text-zinc-800 text-xs px-2.5 py-1 rounded-md border border-zinc-200 font-medium">
                  {skill.name} ({skill.level}/5)
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-col gap-2">
            <h3 className={`${headingFont} text-xs font-bold uppercase tracking-wider ${getAccentText()}`}>
              Idiomas
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <span key={index} className={`text-xs px-2.5 py-1 rounded-md border ${getBadgeClass()}`}>
                  {lang}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ATS Footer */}
        <div className="mt-auto pt-8 border-t border-zinc-100 text-center text-[10px] text-zinc-400 font-mono tracking-wider">
          Ficheiro Processado via Algoritmo ATS do PrimeCV • Maputo, Moçambique
        </div>

      </div>
    );
  }

  // Render Executive Layout (Elegant Serif, Sophisticated Headers)
  return (
    <div id="cv-preview-paper" className="bg-white text-zinc-900 w-full min-h-[1100px] shadow-2xl rounded-sm p-12 flex flex-col gap-6 text-[13px] leading-relaxed transition-all duration-300 print:shadow-none print:rounded-none">
      
      {/* Heavy Classic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b-4 border-zinc-800">
        <div>
          <h2 className="font-serif text-3xl font-black text-zinc-950 tracking-tight leading-none mb-1">
            {personalInfo.fullName || 'Seu Nome Completo'}
          </h2>
          <p className={`text-xs font-extrabold uppercase tracking-widest font-sans ${getAccentText()}`}>
            {personalInfo.title || 'Cargo Alvo'}
          </p>
        </div>

        {/* Contacts aligned stacked right */}
        <div className="flex flex-col text-xs text-zinc-600 gap-1 font-sans text-left md:text-right shrink-0">
          {personalInfo.phone && <div className="font-semibold">{personalInfo.phone}</div>}
          {personalInfo.email && <div className="text-zinc-500">{personalInfo.email}</div>}
          {personalInfo.location && <div className="text-zinc-400 text-[11px]">{personalInfo.location}</div>}
        </div>
      </div>

      {/* Profil Executive Summary */}
      {personalInfo.about && (
        <div className="flex flex-col gap-1.5">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
            Resumo Executivo
          </h3>
          <p className="text-zinc-750 text-xs italic tracking-wide text-justify font-serif">
            "{personalInfo.about}"
          </p>
        </div>
      )}

      {/* Primary Experience (no-bullet executive outline) */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
          Evolução Profesional
        </h3>
        <div className="flex flex-col gap-4">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp.id} className="flex flex-col">
                <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                  <span className="font-sans text-xs font-bold">{exp.role}</span>
                  <span className="text-xs text-zinc-500 font-mono font-normal">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-xs text-zinc-500 font-medium italic mb-1.5">
                  {exp.company}
                </div>
                <p className="text-zinc-600 text-xs text-justify">
                  {exp.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic">Nenhuma experiência profissional adicionada.</p>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
          Formação de Base
        </h3>
        <div className="flex flex-col gap-3">
          {educations.length > 0 ? (
            educations.map((edu) => (
              <div key={edu.id} className="flex flex-col">
                <div className="flex justify-between items-baseline text-zinc-900">
                  <span className="font-serif font-bold text-xs">{edu.degree}</span>
                  <span className="text-xs text-zinc-400 font-mono">{edu.startDate} — {edu.endDate}</span>
                </div>
                <span className="text-xs text-zinc-500 font-medium">{edu.institution}</span>
                {edu.description && <p className="text-zinc-500 text-xs italic mt-0.5">{edu.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic">Nenhuma formação académica adicionada.</p>
          )}
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
          Quadro de Competências
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-1.5 font-sans font-medium text-zinc-700">
              <span className={`w-1.5 h-1.5 rounded-full ${theme === 'emerald' ? 'bg-emerald-500' : theme === 'gold' ? 'bg-amber-500' : 'bg-zinc-600'}`}></span>
              <span>{skill.name}</span>
              <span className="text-[10px] text-zinc-400">({skill.level}/5)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Languages (Executive Classic) */}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
          Idiomas Registados
        </h3>
        <p className="text-xs text-zinc-600 font-serif italic">
          {languages.join(', ') || 'Nenhum idioma listado.'}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-zinc-200 text-center text-[10px] font-sans text-zinc-400 uppercase tracking-widest font-semibold">
        Selo de Validação PrimeCV • Documento Certificado para Exportação
      </div>

    </div>
  );
}
