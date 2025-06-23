
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { LegalAnalysisResponse } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY não configurada nas variáveis de ambiente.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-preview-04-17';

function cleanJsonString(jsonStr: string): string {
  let cleaned = jsonStr.trim();
  // Remove Markdown code block fences if present
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleaned.match(fenceRegex);
  if (match && match[2]) {
    cleaned = match[2].trim();
  }
  return cleaned;
}


export async function fetchLegalAnalysis(theme: string): Promise<LegalAnalysisResponse> {
  const prompt = `
    Você é um assistente de pesquisa jurídica avançado, especializado no sistema legal brasileiro.
    Com base no tema "${theme}", forneça uma análise completa em formato JSON.
    O JSON deve ter as seguintes chaves de nível superior: "dashboard", "guidance".

    Dentro de "dashboard", inclua:
    1.  "thesesSTJ": Uma lista de objetos, cada um com "text" (string, texto da tese firmada pelo STJ), "reference" (string, opcional, número do julgado representativo ou tema) e "sourceUrl" (string, opcional, URL direta para o inteiro teor ou página oficial da tese/julgado). Se não houver, retorne lista vazia.
    2.  "precedents": Uma lista de objetos, cada um com "summary" (string, resumo breve do precedente), "reference" (string, tribunal, número do processo, data) e "sourceUrl" (string, opcional, URL direta para o inteiro teor ou página oficial do precedente). Se não houver, retorne lista vazia.
    3.  "temporalEvolution": Uma lista de objetos, cada um com "year" (string, ano do evento/decisão chave), "event" (string, nome do evento/decisão) e "description" (string, breve descrição do impacto ou mudança). Ordene por ano. Se não houver, retorne lista vazia.
    4.  "understandingEvolution": Uma lista de objetos, cada um com "period" (string, e.g., "Até 2010", "2010-2015", "Pós-CPC/2015") e "description" (string, explicando a mudança no entendimento jurídico). Se não houver, retorne lista vazia.
    5.  "divergences": Uma lista de objetos, cada um com "description" (string, descrição da divergência jurisprudencial) e "implication" (string, e.g., "Potencial para Incidente de Uniformização", "Relevante para Recurso Especial"). Se não houver, retorne lista vazia.

    Dentro de "guidance", inclua:
    1.  "prequestionamento": Um objeto com "explanation" (string, explicação do prequestionamento) e "examples" (uma lista de objetos, cada um com "scenario" (string, e.g., "Suscitar na apelação") e "text" (string, exemplo de trecho de petição)). Se não houver, retorne "explanation": "" e "examples": [].
    2.  "recursoEspecialElements": Uma lista de objetos, cada um com "name" (string, nome do elemento essencial, e.g., "Cabimento"), "explanation" (string) e "example" (string, exemplo de trecho de petição). Se não houver, retorne lista vazia.

    Priorize informações precisas e concisas. Se não encontrar informações para uma subseção, retorne uma lista vazia ou uma estrutura vazia apropriada (e.g. para prequestionamento), mas mantenha a estrutura JSON completa.
    Para "sourceUrl", forneça a URL mais direta e oficial possível. Se nenhuma URL confiável estiver disponível, omita o campo ou deixe-o como uma string vazia.
    Exemplo para temporalEvolution: [{ "year": "2008", "event": "REsp 1.234.567/SP", "description": "Marco na interpretação do art. X do Código Civil." }]
    Exemplo para understandingEvolution: [{ "period": "Jurisprudência anterior ao CPC/2015", "description": "Entendimento X era dominante, focando no aspecto Y." }, { "period": "Jurisprudência Pós-CPC/2015", "description": "Com o novo CPC, o entendimento Z passou a ser aplicado, valorizando o aspecto W." }]
    Responda APENAS com o objeto JSON. Não inclua nenhum texto antes ou depois do JSON.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Lower temperature for more factual, less creative output
      },
    });
    
    const rawText = response.text;
    const cleanedJsonStr = cleanJsonString(rawText);

    try {
      const parsedData = JSON.parse(cleanedJsonStr) as LegalAnalysisResponse;
      // Basic validation of structure
      if (!parsedData.dashboard || !parsedData.guidance) {
        console.error("Resposta da API não contém as chaves 'dashboard' ou 'guidance'. Resposta recebida:", cleanedJsonStr);
        throw new Error("Formato de resposta da API inválido. Faltam chaves principais.");
      }
      // Further validation for sourceUrl can be added here if needed
      // e.g. ensuring dashboard.thesesSTJ is an array, etc.
      if (parsedData.dashboard && parsedData.dashboard.thesesSTJ && !Array.isArray(parsedData.dashboard.thesesSTJ)) {
        console.warn("API retornou 'thesesSTJ' que não é um array. Corrigindo para array vazio.");
        parsedData.dashboard.thesesSTJ = [];
      }
       if (parsedData.dashboard && parsedData.dashboard.precedents && !Array.isArray(parsedData.dashboard.precedents)) {
        console.warn("API retornou 'precedents' que não é um array. Corrigindo para array vazio.");
        parsedData.dashboard.precedents = [];
      }

      return parsedData;
    } catch (parseError) {
      console.error("Falha ao parsear JSON da API:", parseError);
      console.error("String JSON recebida (após limpeza):", cleanedJsonStr);
      console.error("String JSON original:", rawText);
      throw new Error(`Falha ao interpretar a resposta do servidor. Detalhes: ${ (parseError as Error).message }`);
    }

  } catch (error) {
    console.error('Erro na chamada da API Gemini:', error);
    if (error instanceof Error) {
        // Check for specific Gemini API error messages if available
        if (error.message.includes("API key not valid")) {
            throw new Error("Chave de API inválida. Verifique suas credenciais.");
        }
    }
    throw new Error(`Erro de comunicação com o serviço de IA: ${ (error as Error).message }`);
  }
}
