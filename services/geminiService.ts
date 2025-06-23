
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { LegalAnalysisResponse } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;
if (!API_KEY) {
  // Updated error message to reflect the correct variable name for Vite
  throw new Error("VITE_API_KEY não configurada nas variáveis de ambiente. Certifique-se de que está em um arquivo .env.local na raiz do projeto.");
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
  let promptTemplate: string;
  try {
    const response = await fetch('/prompts/legalAnalysisPrompt.md');
    if (!response.ok) {
      throw new Error(`Erro ao carregar o template do prompt: ${response.statusText}`);
    }
    promptTemplate = await response.text();
  } catch (error) {
    console.error("Falha ao carregar o template do prompt:", error);
    throw new Error("Não foi possível carregar o modelo de prompt para a análise jurídica.");
  }

  // Replace the placeholder with the actual theme
  const prompt = promptTemplate.replace('${theme}', theme);

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
