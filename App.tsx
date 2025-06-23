
import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Tabs, Tab } from './components/Tabs';
import { DashboardSection } from './components/DashboardSection';
import { GuidanceSection } from './components/GuidanceSection';
import { PromptGeneratorSection } from './components/PromptGeneratorSection'; // Added
import { LoadingSpinner } from './components/LoadingSpinner';
import { fetchLegalAnalysis } from './services/geminiService';
import type { LegalAnalysisResponse, DashboardData, GuidanceData, TemporalPoint, ThesisSTJ, Precedent, UnderstandingEvolutionPoint, Divergence, PrequestionamentoExample, RecursoEspecialElement } from './types';
import { AlertCircleIcon, BookOpenIcon, ChartBarIcon, SparklesIcon, FileTextIcon, LightBulbIcon } from './components/Icons'; // Added LightBulbIcon


const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentSearchTermForReport, setCurrentSearchTermForReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guidance' | 'promptGenerator'>('dashboard'); // Added 'promptGenerator'
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [guidanceData, setGuidanceData] = useState<GuidanceData | null>(null);

  const handleSearch = useCallback(async (theme: string) => {
    if (!theme.trim()) {
      setError("Por favor, insira um tema para pesquisa.");
      setDashboardData(null);
      setGuidanceData(null);
      setCurrentSearchTermForReport('');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDashboardData(null);
    setGuidanceData(null);
    setCurrentSearchTermForReport(theme); 

    try {
      const analysis: LegalAnalysisResponse = await fetchLegalAnalysis(theme);
      if (analysis.dashboard) {
        setDashboardData(analysis.dashboard);
      } else {
        setDashboardData({
            thesesSTJ: [],
            precedents: [],
            temporalEvolution: [],
            understandingEvolution: [],
            divergences: [],
        });
        console.warn("Dados do dashboard não encontrados na resposta da API.");
      }
      if (analysis.guidance) {
        setGuidanceData(analysis.guidance);
      } else {
        setGuidanceData({
            prequestionamento: { explanation: "", examples: [] },
            recursoEspecialElements: [],
        });
        console.warn("Dados de guias não encontrados na resposta da API.");
      }
    } catch (err) {
      console.error("Erro ao buscar análise jurídica:", err);
      setError(err instanceof Error ? `Erro ao processar sua solicitação: ${err.message}. Verifique o console para mais detalhes.` : 'Ocorreu um erro desconhecido.');
      setDashboardData(null);
      setGuidanceData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
        setDashboardData(null);
        setGuidanceData(null);
        setError(null);
        // Keep currentSearchTermForReport if user clears input after a search, so prompt generator can still use it.
        // Only clear it if a new empty search is attempted or page loads.
        // setCurrentSearchTermForReport(''); // Removed to allow prompt generator to use last search term
    }
  }, [searchTerm]);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'dashboard' || tabId === 'guidance' || tabId === 'promptGenerator') {
      setActiveTab(tabId as 'dashboard' | 'guidance' | 'promptGenerator');
    } else {
      console.warn(`Tentativa de mudar para uma aba desconhecida: ${tabId}`);
    }
  };

  const generateReportHtmlContent = (
    searchTheme: string,
    dbData: DashboardData | null,
    gdData: GuidanceData | null
  ): string => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;

    const styles = `
      <style>
        body { 
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          margin: 0; 
          padding: 20px; 
          color: #cbd5e1; /* slate-300 */
          background-color: #0f172a; /* slate-900 */
        }
        .container { 
          max-width: 900px; 
          margin: auto; 
          background-color: #1e293b; /* slate-800 */
          padding: 25px; 
          border-radius: 8px; 
          box-shadow: 0 0 20px rgba(0,0,0,0.3); 
          border: 1px solid #334155; /* slate-700 */
        }
        h1, h2, h3, h4 { 
          font-weight: 600;
        }
        h1 { 
          text-align: center; 
          color: #38bdf8; /* sky-400 */
          border-bottom: 2px solid #0ea5e9; /* sky-500 */
          padding-bottom: 15px; 
          margin-bottom: 25px; 
          font-size: 2.2em;
        }
        h2 { 
          font-size: 1.8em; 
          margin-top: 35px; 
          margin-bottom: 15px;
          padding-bottom: 10px; 
          color: #2dd4bf; /* teal-400 */
          border-bottom: 1px solid #5eead4; /* teal-300 */
        }
        h3 { 
          font-size: 1.4em; 
          margin-top: 25px; 
          margin-bottom: 10px;
          color: #67e8f9; /* cyan-300 */
        }
        h4 { 
          font-size: 1.2em; 
          margin-top: 20px; 
          margin-bottom: 8px;
          color: #a5f3fc; /* cyan-200 */
        }
        ul { 
          list-style-type: none; 
          padding-left: 0; 
        }
        li { 
          margin-bottom: 15px; 
          background-color: #334155; /* slate-700 */
          padding: 15px; 
          border-radius: 6px; 
          border-left: 4px solid #38bdf8; /* sky-400 */
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        p { 
          margin-bottom: 12px; 
          color: #e2e8f0; /* slate-200 */
        }
        .card { 
          background-color: #334155; /* slate-700 */ 
          border: 1px solid #475569; /* slate-600 */
          padding: 18px; 
          margin-bottom: 18px; 
          border-radius: 6px; 
          box-shadow: 0 3px 7px rgba(0,0,0,0.25); 
        }
        .card-title { 
          font-weight: bold; 
          color: #7dd3fc; /* sky-300 */ 
          margin-bottom: 10px; 
          font-size: 1.1em;
        }
        .reference, .implication, .scenario, .period, .source-link { 
          font-style: italic; 
          color: #94a3b8; /* slate-400 */
          font-size: 0.9em; 
          margin-top: 8px; 
        }
        .source-link a { 
          color: #5eead4; /* teal-300 */
          text-decoration: none; 
          font-weight: 500;
        }
        .source-link a:hover { 
          text-decoration: underline; 
          color: #99f6e4; /* teal-200 */
        }
        pre { 
          background-color: #0f172a; /* slate-900 */
          color: #e2e8f0; /* slate-200 */
          padding: 15px; 
          border-radius: 5px; 
          overflow-x: auto; 
          white-space: pre-wrap; 
          word-wrap: break-word; 
          font-family: 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', Courier, monospace; 
          font-size: 0.9em; 
          border: 1px solid #475569; /* slate-600 */
        }
        code {
          font-family: 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', Courier, monospace; 
        }
        .report-header p { 
          font-size: 0.95em; 
          color: #94a3b8; /* slate-400 */
          text-align: center; 
          margin-bottom: 5px;
        }
        .empty-data { 
          color: #64748b; /* slate-500 */
          font-style: italic; 
          padding: 10px;
          background-color: #293548; /* slightly lighter than slate-700 for contrast */
          border-radius: 4px;
        }
        li.divergence-item {
          border-left: 4px solid #ef4444; /* red-500 */
        }
        li.divergence-item .card-title {
          color: #fca5a5; /* red-300 for the description text */
        }
        li.divergence-item .implication {
          color: #fcd34d; /* amber-300 for implication text */
        }
      </style>
    `;

    const sectionHtml = (title: string, items: any[], renderer: (item: any, index: number) => string) => {
      if (!items || items.length === 0) return `<h3>${title}</h3><p class="empty-data">Nenhuma informação disponível.</p>`;
      return `<h3>${title}</h3><ul>${items.map(renderer).join('')}</ul>`;
    };
    
    let content = `<html><head><title>Relatório JurisIntel - ${searchTheme}</title>${styles}</head><body><div class="container">`;
    content += `<div class="report-header"><h1>Relatório JurisIntel</h1><p><strong>Tema da Pesquisa:</strong> ${searchTheme}</p><p><strong>Gerado em:</strong> ${formattedDate}</p></div>`;

    // Dashboard Section
    content += `<h2>Análise Jurisprudencial</h2>`;
    if (dbData) {
      content += sectionHtml("Teses Firmadas pelo STJ", dbData.thesesSTJ, (thesis: ThesisSTJ, i: number) => `
        <li key="thesis-${i}">
          <p>${thesis.text}</p>
          ${thesis.reference ? `<p class="reference">Referência: ${thesis.reference}</p>` : ''}
          ${thesis.sourceUrl ? `<p class="source-link">Fonte: <a href="${thesis.sourceUrl}" target="_blank" rel="noopener noreferrer">${thesis.sourceUrl}</a></p>` : ''}
        </li>`);
      content += sectionHtml("Precedentes Relevantes", dbData.precedents, (prec: Precedent, i: number) => `
        <li key="prec-${i}">
          <p class="card-title">${prec.summary}</p>
          <p class="reference">Referência: ${prec.reference}</p>
          ${prec.sourceUrl ? `<p class="source-link">Fonte: <a href="${prec.sourceUrl}" target="_blank" rel="noopener noreferrer">${prec.sourceUrl}</a></p>` : ''}
        </li>`);
      content += sectionHtml("Evolução Temporal dos Casos", dbData.temporalEvolution, (point: TemporalPoint, i: number) => `
        <li key="temp-${i}">
          <p class="card-title"><strong>${point.year} - ${point.event}</strong></p>
          <p>${point.description}</p>
        </li>`);
      content += sectionHtml("Evolução dos Entendimentos Jurídicos", dbData.understandingEvolution, (item: UnderstandingEvolutionPoint, i: number) => `
        <li key="und-${i}">
          <p class="period"><strong>Período:</strong> ${item.period}</p>
          <p>${item.description}</p>
        </li>`);
      content += sectionHtml("Divergências Jurisprudenciais e Incidentes", dbData.divergences, (div: Divergence, i: number) => `
        <li key="div-${i}" class="divergence-item">
          <p class="card-title">${div.description}</p>
          <p class="implication">Implicação: ${div.implication}</p>
        </li>`);
    } else {
      content += `<p class="empty-data">Nenhuma análise jurisprudencial disponível.</p>`;
    }

    // Guidance Section
    content += `<h2>Guias Práticos</h2>`;
    if (gdData) {
      content += `<h3>Prequestionamento</h3>`;
      if (gdData.prequestionamento && (gdData.prequestionamento.explanation || gdData.prequestionamento.examples.length > 0)) {
        if (gdData.prequestionamento.explanation) {
          content += `<div class="card"><p class="card-title">Explicação:</p><p>${gdData.prequestionamento.explanation.replace(/\n/g, '<br>')}</p></div>`;
        }
        if (gdData.prequestionamento.examples.length > 0) {
          content += `<h4>Exemplos Práticos:</h4><ul>`;
          gdData.prequestionamento.examples.forEach((ex: PrequestionamentoExample, i: number) => {
            content += `
              <li key="preq-ex-${i}">
                <p class="scenario"><strong>Situação:</strong> ${ex.scenario}</p>
                <pre><code>${ex.text}</code></pre>
              </li>`;
          });
          content += `</ul>`;
        }
      } else {
        content += `<p class="empty-data">Nenhuma informação sobre prequestionamento disponível.</p>`;
      }

      content += `<h3>Elementos Essenciais do Recurso Especial</h3>`;
      if (gdData.recursoEspecialElements && gdData.recursoEspecialElements.length > 0) {
        content += `<ul>`;
        gdData.recursoEspecialElements.forEach((el: RecursoEspecialElement, i: number) => {
          content += `
            <li key="resp-el-${i}">
              <p class="card-title">${el.name}</p>
              <p>${el.explanation.replace(/\n/g, '<br>')}</p>
              <p class="card-title" style="margin-top: 10px;">Exemplo de Redação:</p>
              <pre><code>${el.example}</code></pre>
            </li>`;
        });
        content += `</ul>`;
      } else {
        content += `<p class="empty-data">Nenhuma informação sobre elementos do recurso especial disponível.</p>`;
      }
    } else {
      content += `<p class="empty-data">Nenhum guia prático disponível.</p>`;
    }

    content += `</div></body></html>`;
    return content;
  };

  const generateReportMarkdownContent = (
    searchTheme: string,
    dbData: DashboardData | null,
    gdData: GuidanceData | null
  ): string => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
    let md = `# Relatório JurisIntel\n\n`;
    md += `**Tema da Pesquisa:** ${searchTheme}\n`;
    md += `**Gerado em:** ${formattedDate}\n\n---\n\n`;
  
    const sectionMd = (
      title: string, 
      items: any[] | null | undefined, 
      renderer: (item: any, index: number) => string, 
      emptyText: string = "Nenhuma informação disponível."
    ) => {
      let sectionContent = `## ${title}\n\n`;
      if (!items || items.length === 0) {
        sectionContent += `*${emptyText}*\n\n`;
      } else {
        sectionContent += items.map(renderer).join('\n') + '\n\n';
      }
      return sectionContent;
    };
    
    const listItemMd = (content: string) => `- ${content.replace(/\n/g, '\n  ')}`;
  
    md += `## Análise Jurisprudencial\n\n`;
    if (dbData) {
      md += sectionMd("Teses Firmadas pelo STJ", dbData.thesesSTJ, (thesis: ThesisSTJ) => 
        listItemMd(
          `${thesis.text}${thesis.reference ? `\n  *Referência: ${thesis.reference}*` : ''}${thesis.sourceUrl ? `\n  [Ver Fonte](${thesis.sourceUrl})` : ''}`
        )
      );
      md += sectionMd("Precedentes Relevantes", dbData.precedents, (prec: Precedent) => 
        listItemMd(
          `**${prec.summary}**\n  *Referência: ${prec.reference}*${prec.sourceUrl ? `\n  [Ver Fonte](${prec.sourceUrl})` : ''}`
        )
      );
      md += sectionMd("Evolução Temporal dos Casos", dbData.temporalEvolution, (point: TemporalPoint) => 
        listItemMd(`**${point.year} - ${point.event}:** ${point.description}`)
      );
      md += sectionMd("Evolução dos Entendimentos Jurídicos", dbData.understandingEvolution, (item: UnderstandingEvolutionPoint) => 
        listItemMd(`**Período:** ${item.period}\n  ${item.description}`)
      );
      md += sectionMd("Divergências Jurisprudenciais e Incidentes", dbData.divergences, (div: Divergence) => 
        listItemMd(`**Descrição:** ${div.description}\n  *Implicação: ${div.implication}*`)
      , "Nenhuma divergência identificada.");
    } else {
      md += `*Nenhuma análise jurisprudencial disponível.*\n\n`;
    }
    md += '---\n\n';
  
    md += `## Guias Práticos\n\n`;
    if (gdData) {
      md += `### Prequestionamento\n\n`;
      if (gdData.prequestionamento && (gdData.prequestionamento.explanation || gdData.prequestionamento.examples.length > 0)) {
        if (gdData.prequestionamento.explanation) {
          md += `${gdData.prequestionamento.explanation}\n\n`;
        }
        if (gdData.prequestionamento.examples.length > 0) {
          md += `#### Exemplos Práticos:\n\n`;
          gdData.prequestionamento.examples.forEach((ex: PrequestionamentoExample) => {
            md += `**Situação:** ${ex.scenario}\n`;
            md += "```text\n";
            md += `${ex.text}\n`;
            md += "```\n\n";
          });
        }
      } else {
        md += `*Nenhuma informação sobre prequestionamento disponível.*\n\n`;
      }
  
      md += `### Elementos Essenciais do Recurso Especial\n\n`;
      if (gdData.recursoEspecialElements && gdData.recursoEspecialElements.length > 0) {
        gdData.recursoEspecialElements.forEach((el: RecursoEspecialElement) => {
          md += `#### ${el.name}\n\n`;
          md += `${el.explanation}\n\n`;
          if (el.example) {
            md += `**Exemplo de Redação:**\n`;
            md += "```text\n";
            md += `${el.example}\n`;
            md += "```\n\n";
          }
        });
      } else {
        md += `*Nenhuma informação sobre elementos do recurso especial disponível.*\n\n`;
      }
    } else {
      md += `*Nenhum guia prático disponível.*\n\n`;
    }
  
    return md;
  };

  const handleGenerateHtmlReport = () => {
    if (!dashboardData && !guidanceData) {
      alert("Não há dados para gerar o relatório HTML.");
      return;
    }
    const htmlContent = generateReportHtmlContent(currentSearchTermForReport || "N/A", dashboardData, guidanceData);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTheme = (currentSearchTermForReport || "Relatorio_JurisIntel").replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
    link.download = `JurisIntel_Relatorio_${sanitizedTheme}.html`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateMarkdownReport = () => {
    if (!dashboardData && !guidanceData) {
      alert("Não há dados para gerar o relatório Markdown.");
      return;
    }
    const mdContent = generateReportMarkdownContent(currentSearchTermForReport || "N/A", dashboardData, guidanceData);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTheme = (currentSearchTermForReport || "Relatorio_JurisIntel").replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
    link.download = `JurisIntel_Relatorio_${sanitizedTheme}.md`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Análise Jurisprudencial', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
    { id: 'guidance', label: 'Guias Práticos', icon: <BookOpenIcon className="w-5 h-5 mr-2" /> },
    { id: 'promptGenerator', label: 'Gerador de Prompts', icon: <LightBulbIcon className="w-5 h-5 mr-2" /> }, // Added
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-200 p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <SparklesIcon className="w-12 h-12 text-sky-400 mr-3"/>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400">
            JurisIntel Dashboard
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Inteligência jurídica para suas teses e recursos.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <SearchBar onSearch={handleSearch} setSearchTermExt={setSearchTerm} isLoading={isLoading} />

        {(dashboardData || guidanceData) && !isLoading && !error && (
          <div className="mt-6 mb-6 text-center">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={handleGenerateHtmlReport}
                disabled={isLoading}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-l-lg transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center focus:z-10 focus:ring-2 focus:ring-teal-500 focus:bg-teal-700"
                aria-label="Gerar relatório em HTML"
              >
                <FileTextIcon className="w-5 h-5 mr-2" />
                Gerar HTML
              </button>
              <button
                onClick={handleGenerateMarkdownReport}
                disabled={isLoading}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-r-lg border-l border-sky-500 transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center focus:z-10 focus:ring-2 focus:ring-sky-500 focus:bg-sky-700"
                aria-label="Gerar relatório em Markdown"
              >
                <FileTextIcon className="w-5 h-5 mr-2" /> 
                Gerar Markdown
              </button>
            </div>
          </div>
        )}

        {isLoading && <LoadingSpinner />}
        
        {error && (
          <div className="mt-6 p-4 bg-red-700 border border-red-500 text-red-100 rounded-lg shadow-lg flex items-center">
            <AlertCircleIcon className="w-6 h-6 mr-3 text-red-200"/>
            <div>
              <h3 className="font-semibold">Erro na Solicitação</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Show tabs and content area if not loading, no error, and EITHER data exists OR prompt generator tab is active */}
        {((dashboardData || guidanceData) || activeTab === 'promptGenerator') && !isLoading && !error && (
          <div className="mt-2">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="mt-2 p-4 md:p-6 bg-slate-800 rounded-b-lg shadow-2xl min-h-[300px]">
              {activeTab === 'dashboard' && dashboardData && <DashboardSection data={dashboardData} />}
              {activeTab === 'guidance' && guidanceData && <GuidanceSection data={guidanceData} />}
              {activeTab === 'promptGenerator' && <PromptGeneratorSection currentSearchTerm={currentSearchTermForReport} />}
            </div>
          </div>
        )}
        
        {/* Message when search term entered but no data found (and not on prompt generator tab) */}
        {!isLoading && !error && !dashboardData && !guidanceData && searchTerm && activeTab !== 'promptGenerator' && (
             <div className="mt-10 text-center text-slate-500">
                <p>Nenhum dado para exibir para o tema "{searchTerm}". Tente refinar sua busca.</p>
            </div>
        )}

        {/* Initial state message (no search term, no data, not loading, no error, and not on prompt generator tab) */}
        {!isLoading && !error && !dashboardData && !guidanceData && !searchTerm && activeTab !== 'promptGenerator' && (
             <div className="mt-16 text-center text-slate-500 flex flex-col items-center justify-center">
                <ChartBarIcon className="w-16 h-16 mb-4 text-slate-600"/>
                <p className="text-xl">Pronto para explorar a jurisprudência?</p>
                <p>Insira um tema na barra de pesquisa acima para começar.</p>
            </div>
        )}
      </main>
      <footer className="text-center mt-12 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} JurisIntel Dashboard. Powered by Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
