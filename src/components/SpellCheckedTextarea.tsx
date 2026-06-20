import React, { useRef, useEffect, useState } from 'react';
import { scanTextForErrors, applyCorrection, DetectedIssue } from '../utils/spellChecker';
import { AlertCircle, Check, HelpCircle } from 'lucide-react';

interface SpellCheckedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChangeValue: (val: string) => void;
  label?: string;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export default function SpellCheckedTextarea({ 
  value, 
  onChangeValue, 
  label, 
  rows = 4,
  placeholder,
  className = '',
  ...props 
}: SpellCheckedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [issues, setIssues] = useState<DetectedIssue[]>([]);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  // Sync validation on value changes
  useEffect(() => {
    const detected = scanTextForErrors(value);
    setIssues(detected);
  }, [value]);

  // Sync scroll positions
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Keep scroll in sync even on mount/updates
  useEffect(() => {
    handleScroll();
  }, [value]);

  // Format background overlay text with transparent characters and red-underlined misspelled spans
  const renderOverlaySpans = () => {
    if (!value) return null;
    if (issues.length === 0) {
      // Just plain text (which will be fully transparent)
      return <span className="opacity-0">{value}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    issues.forEach((issue, index) => {
      // 1. Text before typo
      if (issue.startIndex > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`} className="opacity-0">
            {value.substring(lastIndex, issue.startIndex)}
          </span>
        );
      }

      // 2. Misspelled word with nice under-border
      segments.push(
        <span 
          key={`issue-${index}`} 
          className="border-b-2 border-red-500 border-dotted bg-red-500/10 text-transparent select-none cursor-pointer rounded-xs"
          onClick={() => {
            // Apply correction on overlay click
            handleFixIssue(issue);
          }}
          title={`${issue.badWord} ➔ ${issue.goodWord}: ${issue.reason}`}
        >
          {value.substring(issue.startIndex, issue.endIndex)}
        </span>
      );

      lastIndex = issue.endIndex;
    });

    // 3. Trailing text
    if (lastIndex < value.length) {
      segments.push(
        <span key={`text-trail`} className="opacity-0">
          {value.substring(lastIndex)}
        </span>
      );
    }

    return segments;
  };

  const handleFixIssue = (issue: DetectedIssue) => {
    const correctedText = applyCorrection(value, issue);
    onChangeValue(correctedText);
  };

  const handleFixAll = () => {
    let currentText = value;
    // We apply corrections from right-to-left (reverse) to preserve index mappings
    const sortedReverse = [...issues].sort((a, b) => b.startIndex - a.startIndex);
    sortedReverse.forEach(issue => {
      currentText = applyCorrection(currentText, issue);
    });
    onChangeValue(currentText);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-zinc-450 text-[11px] font-medium leading-none">{label}</span>
      )}

      {/* Editor stack panel */}
      <div className="relative w-full rounded-lg bg-zinc-950 border border-zinc-800 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 overflow-hidden transition-all duration-150">
        
        {/* Underlay / Backdrop highlighting */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none select-none z-0 overflow-auto whitespace-pre-wrap break-words border border-transparent px-3.5 py-2.5 text-xs leading-relaxed font-sans font-normal text-transparent"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {renderOverlaySpans()}
        </div>

        {/* Real typing container */}
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false} // Disable default browser checker to avoid double red line clashing
          className={`relative z-10 w-full bg-transparent border-0 focus:ring-0 focus:outline-none focus:ring-offset-0 px-3.5 py-2.5 text-zinc-200 placeholder:text-zinc-650 text-xs leading-relaxed font-sans resize-none ${className}`}
          {...props}
        />
      </div>

      {/* Proofreader Suggestions Actions Panel */}
      {issues.length > 0 && (
        <div className="bg-red-500/[0.03] border border-red-500/10 rounded-lg p-2.5 flex flex-col gap-2 mt-0.5 animate-fade-in select-none">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-red-400 flex items-center gap-1.5 leading-none">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{issues.length === 1 ? '1 questão ortográfica detetada' : `${issues.length} sugestões ortográficas`}</span>
            </span>
            <button
              type="button"
              onClick={handleFixAll}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer hover:bg-emerald-500/5 px-2 py-0.5 rounded transition"
            >
              Corrigir Tudo
            </button>
          </div>

          {/* Spell check items row */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {issues.map((issue, idx) => (
              <div 
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-300 flex items-center gap-1.5 shadow-sm group hover:border-red-500/25 transition-all"
              >
                <span className="text-red-400 line-through font-mono font-medium">{issue.badWord}</span>
                <span className="text-zinc-500 font-bold">➔</span>
                <button
                  type="button"
                  onClick={() => handleFixIssue(issue)}
                  className="bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold transition flex items-center gap-0.5"
                  title={`Substituir por "${issue.goodWord}"`}
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{issue.goodWord}</span>
                </button>
                <div className="inline-block relative">
                  <button 
                    type="button"
                    className="text-zinc-500 hover:text-zinc-300 ml-0.5"
                    onClick={() => setShowTooltip(showTooltip === idx ? null : idx)}
                    onMouseEnter={() => setShowTooltip(idx)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                  {showTooltip === idx && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 bg-zinc-950 text-zinc-300 text-[10px] p-2 rounded-md shadow-lg border border-zinc-800 leading-normal z-20">
                      {issue.reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
