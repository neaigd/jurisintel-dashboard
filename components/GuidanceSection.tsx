
import React, { useMemo } from 'react';
import type { GuidanceData, KeyedPrequestionamentoExample, KeyedRecursoEspecialElement } from '../types';
import { Card, CodeExampleCard } from './Card';
import { CheckCircleIcon, ListChecksIcon, FileSignatureIcon } from './Icons';

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; isEmpty?: boolean; emptyText?: string }> = 
  ({ title, children, icon, isEmpty = false, emptyText = "Nenhuma informação disponível." }) => (
  <section className="mb-8 p-4 bg-slate-850 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-teal-400 mb-4 pb-2 border-b border-slate-700 flex items-center">
      {icon && <span className="mr-3 text-teal-500">{icon}</span>}
      {title}
    </h2>
     {isEmpty ? <p className="text-slate-400 italic">{emptyText}</p> : children}
  </section>
);


export const GuidanceSection: React.FC<{ data: GuidanceData }> = ({ data }) => {
  const { prequestionamento, recursoEspecialElements } = data;

  const keyedPrequestExamples: KeyedPrequestionamentoExample[] = useMemo(() => 
    prequestionamento.examples.map((ex, index) => ({...ex, id: `preq-ex-${index}`})), 
    [prequestionamento.examples]
  );

  const keyedRecursoElements: KeyedRecursoEspecialElement[] = useMemo(() =>
    recursoEspecialElements.map((el, index) => ({...el, id: `resp-el-${index}`})),
    [recursoEspecialElements]
  );
  
  const noPrequestionamentoData = !prequestionamento.explanation && (!keyedPrequestExamples || keyedPrequestExamples.length === 0);
  const noRecursoEspecialData = !keyedRecursoElements || keyedRecursoElements.length === 0;


  return (
    <div className="space-y-8">
      <Section title="Prequestionamento" icon={<CheckCircleIcon className="w-6 h-6" />} isEmpty={noPrequestionamentoData}>
        {prequestionamento.explanation && (
          <Card className="bg-slate-700/50 border border-slate-600 mb-6">
            <p className="text-slate-200 whitespace-pre-line">{prequestionamento.explanation}</p>
          </Card>
        )}
        {keyedPrequestExamples.length > 0 && (
            <div className="space-y-4">
            <h4 className="text-lg font-medium text-teal-300 mb-2">Exemplos Práticos:</h4>
            {keyedPrequestExamples.map((example) => (
                <CodeExampleCard 
                key={example.id}
                title={`Situação: ${example.scenario}`}
                code={example.text}
                language="legal"
                />
            ))}
            </div>
        )}
      </Section>

      <Section title="Elementos Essenciais do Recurso Especial" icon={<ListChecksIcon className="w-6 h-6" />} isEmpty={noRecursoEspecialData}>
        <div className="space-y-6">
          {keyedRecursoElements.map((element) => (
            <Card key={element.id} title={element.name} className="bg-slate-700/50 border border-slate-600" titleClassName="text-teal-300 !text-lg">
              <p className="text-slate-300 mb-3 whitespace-pre-line">{element.explanation}</p>
              {element.example && (
                <CodeExampleCard 
                  title="Exemplo de Redação:"
                  code={element.example}
                  language="legal"
                />
              )}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
};
