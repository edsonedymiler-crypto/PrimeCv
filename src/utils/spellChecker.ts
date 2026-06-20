// A list of common professional Portuguese spelling & grammar mistakes
export interface SpellError {
  bad: string;       // Lowercase pattern to match/find (word or short phrase)
  good: string;      // Correct spelling or suggested word
  reason: string;    // Professional explanation in Portuguese
}

export const COMMON_PORTUGUESE_ERRORS: SpellError[] = [
  { bad: 'concerteza', good: 'com certeza', reason: 'Escreve-se separado ("com certeza").' },
  { bad: 'excessão', good: 'exceção', reason: 'Escreve-se com "ç" e apenas um "c" ("exceção").' },
  { bad: 'excepção', good: 'exceção', reason: 'Grafia antiga. De acordo com o Acordo Ortográfico vigente, escreve-se "exceção".' },
  { bad: 'paralizar', good: 'paralisar', reason: 'Deriva de "paralisia", mantendo o "s" na raiz.' },
  { bad: 'analizar', good: 'analisar', reason: 'Deriva de "análise", mantendo o "s" na raiz.' },
  { bad: 'atrazado', good: 'atrasado', reason: 'Deriva de "atrás", escreve-se com "s".' },
  { bad: 'atraz', good: 'atrás', reason: 'Escreve-se com "s" e acento agudo.' },
  { bad: 'fasso', good: 'faço', reason: 'Conjugação do verbo fazer, escreve-se com "ç".' },
  { bad: 'menas', good: 'menos', reason: '"Menos" é uma palavra invariável. Não existe "menas".' },
  { bad: 'sejao', good: 'sejam', reason: 'Forma correta da conjugação no plural.' },
  { bad: 'previlégio', good: 'privilégio', reason: 'Escreve-se com "i" de "privus" (privilégio).' },
  { bad: 'reinvindicar', good: 'reivindicar', reason: 'Não possui o primeiro "n", a palavra correta é reivindicar.' },
  { bad: 'ancioso', good: 'ansioso', reason: 'Deriva de "ânsia", escreve-se com "s".' },
  { bad: 'anciosa', good: 'ansiosa', reason: 'Deriva de "ânsia", escreve-se com "s".' },
  { bad: 'compania', good: 'companhia', reason: 'Escreve-se com "nh" (companhia).' },
  { bad: 'experiençia', good: 'experiência', reason: 'Não se usa cedilha antes de "i". Escreve-se com "c".' },
  { bad: 'experiençias', good: 'experiências', reason: 'Não se usa cedilha antes de "i". Escreve-se com "c".' },
  { bad: 'proficional', good: 'profissional', reason: 'Escreve-se com "ss" (profissional).' },
  { bad: 'proficionais', good: 'profissionais', reason: 'Escreve-se com "ss" (profissionais).' },
  { bad: 'porisso', good: 'por isso', reason: 'Escreve-se separado ("por isso").' },
  { bad: 'geito', good: 'jeito', reason: 'Escreve-se com j (jeito).' },
  { bad: 'asertivo', good: 'assertivo', reason: 'Escreve-se com "ss" (assertivo).' },
  { bad: 'asertiva', good: 'assertiva', reason: 'Escreve-se com "ss" (assertiva).' },
  { bad: 'atravez', good: 'através', reason: 'Escreve-se com "s" e acento agudo ("através").' },
  { bad: 'talves', good: 'talvez', reason: 'Escreve-se com "z" ("talvez").' },
  { bad: 'efitividade', good: 'efetividade', reason: 'Deriva de efeito, escreve-se com "e" ("efetividade").' },
  { bad: 'efitivar', good: 'efetivar', reason: 'Deriva de efetivo, escreve-se com "e" ("efetivar").' },
  { bad: 'pobrema', good: 'problema', reason: 'A forma correta da palavra é "problema".' },
  { bad: 'desenvolver-mos', good: 'desenvolvermos', reason: 'Infinitivo pessoal de "nós", escreve-se junto ("desenvolvermos").' },
  { bad: 'obter-mos', good: 'obtermos', reason: 'Infinitivo pessoal de "nós", escreve-se junto ("obtermos").' },
  { bad: 'ter-mos', good: 'termos', reason: 'Infinitivo pessoal de "nós", escreve-se junto ("termos").' },
  { bad: 'ver-mos', good: 'vermos', reason: 'Infinitivo pessoal de "nós", escreve-se junto ("vermos").' },
  { bad: 'beneficiente', good: 'beneficente', reason: 'A forma correta é "beneficente", sem o "i" no meio.' },
  { bad: 'conhecidimento', good: 'conhecimento', reason: 'A palavra correta é "conhecimento".' },
  { bad: 'conhecidimentos', good: 'conhecimentos', reason: 'A palavra correta é "conhecimentos".' },
  { bad: 'envolver-mos', good: 'envolvermos', reason: 'Infinitivo pessoal de "nós", escreve-se junto ("envolvermos").' },
  { bad: 'difissil', good: 'difícil', reason: 'Escreve-se com "c" e acento agudo ("difícil").' },
  { bad: 'facil', good: 'fácil', reason: 'Palavra proparoxítona, leva acento agudo no "á" ("fácil").' },
  { bad: 'dificil', good: 'difícil', reason: 'Palavra proparoxítona, leva acento agudo no "í" ("difícil").' },
  { bad: 'comunicasao', good: 'comunicação', reason: 'Escreve-se "comunicação" com "ç" e til.' },
  { bad: 'comunicaçao', good: 'comunicação', reason: 'Escreve-se com til ("comunicação").' },
  { bad: 'ativididades', good: 'atividades', reason: 'Sílaba repetida por erro de digitação ("atividades").' },
  { bad: 'responsablidade', good: 'responsabilidade', reason: 'Falta a letra "i" no meio da palavra ("responsabilidade").' },
  { bad: 'teconologia', good: 'tecnologia', reason: 'Erro de digitação, a grafia correta é "tecnologia".' },
  { bad: 'experiencia', good: 'experiência', reason: 'Falta o acento circunflexo / agudo regulamentar ("experiência").' },
  { bad: 'currículo', good: 'currículo', reason: 'Nota de escrita (correto).' },
  { bad: 'curriculo', good: 'currículo', reason: 'Leva acento na antepenúltima sílaba ("currículo").' },
  { bad: 'curriculos', good: 'currículos', reason: 'Leva acento na antepenúltima sílaba ("currículos").' }
];

export interface DetectedIssue {
  badWord: string;
  goodWord: string;
  reason: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Scans a given text string for known Portuguese professional spelling and grammar errors.
 * Returns a list of detected spelling issues.
 */
export function scanTextForErrors(text: string): DetectedIssue[] {
  if (!text) return [];
  const lowercaseText = text.toLowerCase();
  const issues: DetectedIssue[] = [];

  // Sort errors by pattern length descending to match longer phrases first
  const sortedErrors = [...COMMON_PORTUGUESE_ERRORS].sort((a, b) => b.bad.length - a.bad.length);

  for (const err of sortedErrors) {
    let index = lowercaseText.indexOf(err.bad);
    while (index !== -1) {
      // Ensure the matched pattern is indeed a full word boundary
      // by checking surrounding characters
      const prevChar = index > 0 ? lowercaseText.charAt(index - 1) : '';
      const nextChar = index + err.bad.length < lowercaseText.length ? lowercaseText.charAt(index + err.bad.length) : '';

      const isPrevWordChar = /[a-zA-Z0-9áéíóúâêîôûàèìòùãõçñÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]/.test(prevChar);
      const isNextWordChar = /[a-zA-Z0-9áéíóúâêîôûàèìòùãõçñÁÉÍÓÚÂÊÎÔÛÀÈÌÒÙÃÕÇ]/.test(nextChar);

      if (!isPrevWordChar && !isNextWordChar) {
        // Prevent adding duplicate issues matching the exact same indexes
        const isDuplicate = issues.some(iss => 
          (index >= iss.startIndex && index < iss.endIndex) ||
          (index + err.bad.length > iss.startIndex && index + err.bad.length <= iss.endIndex)
        );

        if (!isDuplicate) {
          // Extract the exact written word (respecting the original casing)
          const matchedOriginal = text.substring(index, index + err.bad.length);
          
          // Try to preserve casing of the first letter if the original was capitalized
          let finalCorrection = err.good;
          if (matchedOriginal.charAt(0) === matchedOriginal.charAt(0).toUpperCase()) {
            finalCorrection = err.good.charAt(0).toUpperCase() + err.good.slice(1);
          }

          issues.push({
            badWord: matchedOriginal,
            goodWord: finalCorrection,
            reason: err.reason,
            startIndex: index,
            endIndex: index + err.bad.length
          });
        }
      }
      index = lowercaseText.indexOf(err.bad, index + 1);
    }
  }

  // Sort issues by order of appearance in the text
  return issues.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Replaces a misspelling with the correct spelling in a given text.
 */
export function applyCorrection(text: string, issue: DetectedIssue): string {
  if (!text) return '';
  const before = text.substring(0, issue.startIndex);
  const after = text.substring(issue.endIndex);
  return before + issue.goodWord + after;
}
