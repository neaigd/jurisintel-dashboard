
import React, { useState, useCallback } from 'react';
import { Card } from './Card';
import { LightBulbIcon, ClipboardDocumentIcon } from './Icons';

interface PromptGeneratorSectionProps {
  currentSearchTerm: string;
}

export const PromptGeneratorSection: React.FC<PromptGeneratorSectionProps> = ({ currentSearchTerm }) => {
  const [prioritizedTJs, setPrioritizedTJs] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  const generatePrompt = useCallback(() => {
    if (!currentSearchTerm.trim()) {
      setGeneratedPrompt("Por favor, primeiro realize uma pesquisa ou insira um tema na barra de pesquisa principal para gerar um prompt relevante.");
      return;
    }

    let tjFocus = "";
    if (prioritizedTJs.trim()) {
      tjFocus = `Nos seguintes Tribunais de Justiça: ${prioritizedTJs.trim()}.`;
    } else {
      tjFocus = "Em diversos Tribunais de Justiça estaduais.";
    }
    
    const promptTemplate = `
Com base no tema jurídico: "${currentSearchTerm}", realize uma pesquisa aprofundada e abrangente.

**Objetivos Principais da Pesquisa:**
1.  Identificar jurisprudência relevante (acórdãos, decisões monocráticas) sobre o tema. Concentre-se ${tjFocus}
2.  Encontrar artigos doutrinários, capítulos de livros, teses acadêmicas (mestrado/doutorado), e outras publicações especializadas que analisem criticamente o tema "${currentSearchTerm}".
3.  Priorizar fontes verificáveis, de alta credibilidade e, sempre que possível, com acesso ao texto integral.
4.  Analisar a evolução do entendimento jurisprudencial e doutrinário sobre o tema.
5.  Identificar possíveis divergências jurisprudenciais, tanto entre diferentes tribunais quanto internamente (e.g., entre Câmaras/Turmas do mesmo TJ).
6.  Coletar argumentos jurídicos favoráveis e desfavoráveis relacionados ao tema, com suas respectivas fundamentações.

**Fontes Sugeridas para Consulta (lista não exaustiva):**
*   Portais oficiais dos Tribunais de Justiça (especialmente os priorizados, se houver).
*   Bases de dados jurisprudenciais e legislativas (ex: Jusbrasil, VLex, LexML Brasil, repositórios de súmulas).
*   Portais de notícias e revistas jurídicas especializadas (ex: Conjur, Migalhas, JOTA, Revista dos Tribunais online).
*   Repositórios acadêmicos e bibliotecas digitais (ex: SciELO, Google Scholar, Biblioteca Digital Brasileira de Teses e Dissertações - BDTD, repositórios institucionais de universidades).
*   Catálogos de editoras jurídicas e livrarias online para identificar obras doutrinárias relevantes.

**Formato Desejado para a Resposta:**
*   **Para cada Julgado Relevante:**
    *   Tribunal de origem (e.g., TJSP, TJRJ).
    *   Número do processo.
    *   Órgão julgador (e.g., Câmara, Turma).
    *   Nome do(a) Relator(a).
    *   Data de julgamento e data de publicação.
    *   Ementa completa.
    *   Link direto para o inteiro teor do acórdão/decisão (se publicamente disponível).
    *   Citação no formato ABNT (ou todos os elementos necessários para montá-la). Se um grande volume de julgados for retornado, fornecer ao menos as referências essenciais (Tribunal, tipo de recurso, número, Relator, data) para permitir a busca posterior.
*   **Para Artigos, Livros e Outras Publicações:**
    *   Título completo da obra/artigo.
    *   Nome(s) do(s) autor(es).
    *   Veículo de publicação (e.g., nome da revista, título do livro, anais de congresso, site).
    *   Editora (se livro).
    *   Ano de publicação.
    *   Link direto para acesso ao texto completo (se disponível e de acesso aberto ou mediante assinatura).
    *   Citação no formato ABNT.

**Considerações Adicionais para a Análise:**
*   Contextualizar as decisões e publicações encontradas.
*   Sintetizar os principais entendimentos e teses sobre "${currentSearchTerm}".
*   Apontar tendências atuais ou mudanças significativas na abordagem do tema.

Por favor, organize a resposta de forma clara e estruturada.
    `;
    setGeneratedPrompt(promptTemplate.trim());
    setCopySuccess('');
  }, [currentSearchTerm, prioritizedTJs]);

  const handleCopyToClipboard = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopySuccess('Prompt copiado para a área de transferência!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, (err) => {
      setCopySuccess('Falha ao copiar o prompt.');
      console.error('Erro ao copiar para a área de transferência:', err);
    });
  };

  return (
    <div className="space-y-6 p-2 md:p-4 text-slate-300">
      <Card title="Gerador de Prompts para Pesquisa Aprofundada" icon={<LightBulbIcon className="w-6 h-6 text-amber-400" />} className="bg-slate-850 border border-slate-700">
        <p className="mb-3 text-slate-300">
          Esta ferramenta auxilia na criação de prompts de pesquisa avançada para aprofundar sua investigação jurisprudencial e doutrinária sobre o tema pesquisado.
        </p>
        <p className="mb-3 text-slate-300">
          A pesquisa de precedentes nos Tribunais Superiores (STJ, STF), realizada na aba "Análise Jurisprudencial", é uma etapa crucial. Ela estabelece diretrizes e filtros que otimizam a busca por decisões e entendimentos nos Tribunais de Justiça (TJs) estaduais.
        </p>
        <p className="mb-4 text-slate-300">
          Mesmo que seu caso ainda não esteja em fase de Recurso Especial, essa estratégia refina seus argumentos para recursos como Apelação, Agravos, etc., agilizando a identificação de teses relevantes e a construção de uma fundamentação mais robusta. Os prompts gerados são projetados para instruir assistentes de IA (como o Gemini) ou mecanismos de busca a encontrar informações em uma ampla gama de fontes.
        </p>

        <div className="mb-6">
          <label htmlFor="prioritizedTJs" className="block text-sm font-medium text-sky-300 mb-1">
            Priorizar Tribunais Estaduais (opcional, siglas separadas por vírgula, ex: TJSP, TJRJ, TJMG):
          </label>
          <input
            type="text"
            id="prioritizedTJs"
            value={prioritizedTJs}
            onChange={(e) => setPrioritizedTJs(e.target.value)}
            placeholder="Ex: TJSP, TJRJ"
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400"
          />
        </div>

        <button
          onClick={generatePrompt}
          disabled={!currentSearchTerm.trim()}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto"
          aria-label="Gerar prompt de pesquisa aprofundada"
        >
          <LightBulbIcon className="w-5 h-5 mr-2" />
          Gerar Prompt
        </button>
         {!currentSearchTerm.trim() && (
          <p className="text-amber-400 text-sm mt-2">
            Por favor, insira um tema na barra de pesquisa principal para habilitar a geração de prompts.
          </p>
        )}
      </Card>

      {generatedPrompt && (
        <Card title="Prompt Gerado" className="bg-slate-850 border border-slate-700">
          <textarea
            readOnly
            value={generatedPrompt}
            className="w-full h-96 p-3 bg-slate-900 border border-slate-600 rounded-md text-sm text-slate-200 focus:outline-none custom-scrollbar whitespace-pre-wrap"
            aria-label="Prompt de pesquisa gerado"
          />
          <button
            onClick={handleCopyToClipboard}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors duration-200 flex items-center"
            aria-label="Copiar prompt gerado"
          >
            <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
            Copiar Prompt
          </button>
          {copySuccess && <p className="mt-2 text-sm text-green-400">{copySuccess}</p>}
        </Card>
      )}
    </div>
  );
};
