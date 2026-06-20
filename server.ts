import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize express app
const app = express();
const PORT = 3000;

// Enable JSON parser middleware
app.use(express.json());

// Lazy-load Gemini client to prevent crashing on boot if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("A chave GEMINI_API_KEY não foi configurada nas definições de segredos.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

/**
 * Endpoint for contextual AI professional summary ideas
 * Generates 3 professional variants based on the profile title, current skills and optional draft.
 */
app.post("/api/gemini/summary", async (req, res) => {
  try {
    const { title, draft, skills, name } = req.body;
    const ai = getGeminiClient();

    let systemPrompt = `Você é um especialista em recrutamento e recursos humanos em Moçambique, sénior e altamente qualificado. 
Sua tarefa é gerar exatamente 3 opções/ideias impecáveis de "Resumo Profissional" (perfil inicial para currículo) otimizados para sistemas ATS (Applicant Tracking Systems) e de leitura rápida e cativante para recrutadores nacionais e internacionais em Moçambique.

Requisitos específicos:
1. Use termos corporativos, elegantes e assertivos típicos de Portugal e Moçambique (Português de Moçambique/Europeu).
2. Cada opção deve ter entre 2 e 4 frases max, focando em conquistas, expertise técnico e prontidão.
3. Se houver um rascunho anterior (draft), use-o para inspirar e enriquecer os dados, tornando-o imensamente melhor.
4. Evite slogans de autoajuda vazios ou frases feitas como "procuro novos desafios". Seja focado e objetivo.
5. Se o nome do candidato for informado, pode integrá-lo de forma fluida e profissional em parte das sugestões (ex: "Edson Rita é um Engenheiro..."), gerando maior personalização na leitura inicial.`;

    let userPrompt = `Gerar 3 alternativas profissionais com base nos seguintes dados de perfil do candidato:
Nome do Candidato: ${name || "Profissional"}
Cargo/Título: ${title || "Profissional em início de carreira"}
Competências principais: ${skills && skills.length > 0 ? skills.join(", ") : "Sem competências de destaque declaradas"}
Rascunho atual disponibilizado: "${draft || ""}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "Lista de exatamente 3 opções excelentes de Resumo Profissional em Português."
            },
            contextualAdvice: {
              type: Type.STRING,
              description: "Conselho contextual estratégico rápido e direto de recrutamento em Moçambique."
            }
          },
          required: ["suggestions", "contextualAdvice"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini summary error:", error);
    return res.status(500).json({ 
      error: error.message || "Erro desconhecido ao processar ideias de resumo com IA." 
    });
  }
});

/**
 * Endpoint for contextual AI work experience suggestions
 * Generates 3 options of high-impact description bullet points / text based on company, role and draft.
 */
app.post("/api/gemini/experience", async (req, res) => {
  try {
    const { role, company, draft } = req.body;
    const ai = getGeminiClient();

    let systemPrompt = `Você é um redator de currículos sénior especialista nas dinâmicas corporativas de Moçambique (retalho, banca, telecomunicações, ONGs, energia, mineração).
Sua missão é ajudar o usuário a reescrever ou gerar as principais responsabilidades e conquistas de uma determinada experiência profissional em Moçambique.

Requisitos específicos:
1. Forneça exatamente 3 opções/alternativas excelentes. Cada opção pode ser um parágrafo estruturado com bullet points de forte impacto prático e técnico (como otimizar processos, gerir equipas, manusear plataformas locais como M-Pesa, faturação AT, etc.).
2. Use verbos de ação robustos (Ex: "Liderar", "Coordenar", "Implementar", "Desenvolver", "Otimizar").
3. Se houver um rascunho fornecido (draft), use-o para manter a coerência das responsabilidades e polir ao máximo o texto.
4. Linguagem formal e adequada para recrutamento de alta performance em Moçambique.`;

    let userPrompt = `Gerar 3 propostas de descrição profissional com base nos dados fornecidos:
Cargo ocupado: ${role || "Profissional técnico"}
Empresa/Instituição: ${company || "Empresa sob sigilo em Moçambique"}
Rascunho atual de atribuições: "${draft || ""}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: "Lista de exatamente 3 alternativas/estilos profissionais de responsabilidades em formato de texto rico, contendo bullet points ou parágrafo, em Português."
            },
            contextualAdvice: {
              type: Type.STRING,
              description: "Conselho curto e pragmático para se destacar nesta função específica, focado no contexto do país ou na empresa informada."
            }
          },
          required: ["suggestions", "contextualAdvice"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini experience error:", error);
    return res.status(500).json({ 
      error: error.message || "Erro desconhecido ao processar ideias de experiência com IA." 
    });
  }
});

/**
 * Endpoint to parse unstructured resume/CV text into our JSON schema
 */
app.post("/api/gemini/parse-cv", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "O texto do currículo está vazio." });
    }

    const ai = getGeminiClient();

    let systemPrompt = `Você é um refinador e estruturador de currículos habilitado com Inteligência Artificial.
Sua missão é extrair as informações do texto desestruturado fornecido pelo usuário e encaixá-las no esquema JSON de currículo exigido de forma primorosa.

Além de extrair, você deve:
1. Corrigir eventuais erros ortográficos de português clássico ou de digitação.
2. Formatar as datas em formato limpo de forma consistente (ex: "Jan 2020", "Jun 2022", "Presente").
3. Nos campos de descrição de experiência ou educação, se o rascunho original for extremamente pobre ou em bullet points simples, reescreva de forma a valorizar a atuação profissional (focando em realizações e competências de alto impacto).
4. Estimar de forma correta e ponderada o nível das habilidades (skills) de 1 a 5 baseado na descrição e no tempo de experiência.
5. Se algum campo (como email, telefone, localização ou sobre/about) não puder ser extraído de forma alguma do texto, deixe-o em branco ("") em vez de inventar dados fictícios desnecessários.`;

    let userPrompt = `Analise e formate o seguinte texto desestruturado de currículo para o formato JSON estruturado:
---
${text}
---`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3, // Low temperature for higher accuracy in extraction
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                about: { type: Type.STRING, description: "Resumo profissional ou bio do candidato baseada no perfil" }
              },
              required: ["fullName", "title", "email", "phone", "location", "about"]
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Descrição das responsabilidades e realizações de alto impacto" }
                },
                required: ["company", "role", "startDate", "endDate", "description"]
              }
            },
            educations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Opcional. Detalhamento de cursos, distinções acadêmicas." }
                },
                required: ["institution", "degree", "startDate", "endDate", "description"]
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.INTEGER, description: "Inteiro de 1 a 5 que representa o domínio técnico" }
                },
                required: ["name", "level"]
              }
            },
            languages: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["personalInfo", "experiences", "educations", "skills", "languages"]
        }
      }
    });

    const parsedText = response.text || "{}";
    const data = JSON.parse(parsedText);

    // Ensure all experiences, educations, skills have unique string IDs
    if (data.experiences && Array.isArray(data.experiences)) {
      data.experiences = data.experiences.map((exp: any, index: number) => ({
        ...exp,
        id: `exp-parsed-${Date.now()}-${index}`
      }));
    }
    if (data.educations && Array.isArray(data.educations)) {
      data.educations = data.educations.map((edu: any, index: number) => ({
        ...edu,
        id: `edu-parsed-${Date.now()}-${index}`
      }));
    }
    if (data.skills && Array.isArray(data.skills)) {
      data.skills = data.skills.map((sk: any, index: number) => ({
        ...sk,
        id: `skill-parsed-${Date.now()}-${index}`
      }));
    }

    return res.json(data);
  } catch (error: any) {
    console.error("Gemini parse-cv error:", error);
    return res.status(500).json({ 
      error: error.message || "Erro desconhecido ao estruturar currículo com IA." 
    });
  }
});

/**
 * Endpoint to parse LinkedIn JSON profile exported files or scraper payloads into our CV schema
 */
app.post("/api/gemini/parse-linkedin", async (req, res) => {
  try {
    const { linkedinJson } = req.body;
    if (!linkedinJson) {
      return res.status(400).json({ error: "Dados do LinkedIn não fornecidos." });
    }

    const ai = getGeminiClient();

    let systemPrompt = `Você é um refinador de carreiras e mapeador avançado de dados profissionais especialista em LinkedIn.
Sua missão é analisar o objeto JSON ou texto de perfil do LinkedIn fornecido pelo usuário (que pode vir de scrapers, arquivos oficiais ou exportações variadas) e mapeá-lo perfeitamente para nosso formato unificado de CV.

Diretrizes importantes:
1. Extraia o nome completo do usuário (conforme campos firstName, lastName, ou fullName), seu título/headline atual, contato eletrónico (email), telefone, e localização física.
2. Extraia todas as experiências profissionais descritas, mapeando nomes de empresas (companyName ou company), títulos ocupados (role, title), datas de entrada/saída (startDate, endDate ou similar) e descrições de atividades de forma bem polida e focada em resultados.
3. Extraia todas as instituições de ensino frequentadas, graus escolares ou cursos (degree, fieldOfStudy, schoolName, institution, etc.) e datas.
4. Mapeie todas as habilidades/competências listadas (skills ou competencies) atribuindo um nível apropriado (level) de 1 a 5 baseado na proeminência das competências e cargos ocupados.
5. Se o resumo (summary) ou parágrafo "about" estiver presente, utilize-o para criar uma biografia/resumo do perfil corporativo cativante. Se não, auto-gere um pequeno e polido baseando-se nas competências e experiências detectadas de forma que soe altamente profissional.
6. Corrija automaticamente quaisquer erros de digitação e garanta que datas fiquem legíveis (ex: "Jan 2021", "Presente").`;

    let userPrompt = `Abaixo está o conteúdo extraído do perfil do LinkedIn em formato bruto ou JSON. Filtre, mapeie e estruture no formato solicitado:
---
${typeof linkedinJson === 'string' ? linkedinJson : JSON.stringify(linkedinJson, null, 2)}
---`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                about: { type: Type.STRING }
              },
              required: ["fullName", "title", "email", "phone", "location", "about"]
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["company", "role", "startDate", "endDate", "description"]
              }
            },
            educations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["institution", "degree", "startDate", "endDate", "description"]
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.INTEGER }
                },
                required: ["name", "level"]
              }
            },
            languages: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["personalInfo", "experiences", "educations", "skills", "languages"]
        }
      }
    });

    const parsedText = response.text || "{}";
    const data = JSON.parse(parsedText);

    // Ensure all experiences, educations, skills have unique string IDs
    if (data.experiences && Array.isArray(data.experiences)) {
      data.experiences = data.experiences.map((exp: any, index: number) => ({
        ...exp,
        id: `exp-linkedin-${Date.now()}-${index}`
      }));
    }
    if (data.educations && Array.isArray(data.educations)) {
      data.educations = data.educations.map((edu: any, index: number) => ({
        ...edu,
        id: `edu-linkedin-${Date.now()}-${index}`
      }));
    }
    if (data.skills && Array.isArray(data.skills)) {
      data.skills = data.skills.map((sk: any, index: number) => ({
        ...sk,
        id: `skill-linkedin-${Date.now()}-${index}`
      }));
    }

    return res.json(data);
  } catch (error: any) {
    console.error("Gemini parse-linkedin error:", error);
    return res.status(500).json({ 
      error: error.message || "Erro ao processar as informações do LinkedIn." 
    });
  }
});

/**
 * Endpoint to translate complete CV data into English or Portuguese using Gemini
 */
app.post("/api/gemini/translate-cv", async (req, res) => {
  try {
    const { cvData, targetLanguage } = req.body;
    if (!cvData) {
      return res.status(400).json({ error: "Dados do currículo não fornecidos." });
    }

    const targetLangLabel = targetLanguage === "en" ? "Inglês (English)" : "Português de Moçambique/Europeu (Portuguese)";
    const ai = getGeminiClient();

    let systemPrompt = `Você é um tradutor profissional sénior especializado em currículos de alta performance (ATS-friendly) e termos corporativos modernos.
Sua tarefa é traduzir todo o currículo JSON que lhe for enviado para o idioma: "${targetLangLabel}".

Regras fundamentais:
1. Preserve exatamente todos os IDs e estruturas das listas (não adicione nem remova elementos, apenas traduza o conteúdo textual deles).
2. NÃO altere, não modifique e não traduza os seguintes campos sob nenhuma circunstância:
   - "fullName" (Nome do candidato)
   - "email"
   - "phone"
   - "avatarUrl"
   - Os valores de identificadores "id" (ex: "exp-x", "edu-y" ou "skill-z")
   - Os valores inteiros em "level" (mantenha exatamente o mesmo número de 1 a 5)
3. Traduza com esmero profissional os campos de texto:
   - "title" (Cargo/Profissão, ex: "Analista de Sistemas" -> "Systems Analyst")
   - "location" (Localização, ex: "Maputo, Moçambique" -> "Maputo, Mozambique")
   - "about" (Resumo profissional, mantenha a elegância corporativa)
   - "company" e "institution" (apenas se fizer sentido, nomes próprios mantêm, ex: "Universidade Eduardo Mondlane" fica assim)
   - "role" (Cargos ocupados, ex: "Estagiário" -> "Intern")
   - "description" (Atividades e atribuições das experiências e formações)
   - "degree" (Curso ou grau obtido, ex: "Licenciatura em Direito" -> "Bachelor of Laws")
   - No array "skills", os "name" de cada competência (ex: "Trabalho em grupo" -> "Teamwork")
   - No array "languages", as strings de idiomas (ex: "Português" -> "Portuguese")
4. Retorne APENAS o objeto JSON correspondente estruturado exatamente na mesma tipagem de entrada.`;

    let userPrompt = `Traduza este currículo para o idioma alvo (${targetLangLabel}):
${JSON.stringify(cvData, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2, // Low temperature for high fidelity translations
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                avatarUrl: { type: Type.STRING },
                about: { type: Type.STRING }
              },
              required: ["fullName", "title", "email", "phone", "location", "avatarUrl", "about"]
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "company", "role", "startDate", "endDate", "description"]
              }
            },
            educations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "institution", "degree", "startDate", "endDate", "description"]
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  level: { type: Type.INTEGER }
                },
                required: ["id", "name", "level"]
              }
            },
            languages: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["personalInfo", "experiences", "educations", "skills", "languages"]
        }
      }
    });

    const parsedText = response.text || "{}";
    const data = JSON.parse(parsedText);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini translate-cv error:", error);
    return res.status(500).json({ 
      error: error.message || "Erro desconhecido ao traduzir o currículo." 
    });
  }
});

// Configure Vite middleware in development vs static public serving in production
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Iniciando Vite em modo desenvolvimento...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Iniciando servidor em modo produção...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PrimeCV Express] Servidor ativado sob porta http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
