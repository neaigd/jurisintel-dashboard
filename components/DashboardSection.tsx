
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { DashboardData, KeyedThesisSTJ, KeyedPrecedent, KeyedTemporalPoint, KeyedUnderstandingEvolutionPoint, KeyedDivergence } from '../types';
import { Card } from './Card';
import { CalendarClockIcon, AlertTriangleIcon, UsersIcon, FileTextIcon, TrendingUpIcon, ExternalLinkIcon } from './Icons';

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; isEmpty?: boolean; emptyText?: string }> = 
  ({ title, children, icon, isEmpty = false, emptyText = "Nenhuma informação disponível." }) => (
  <section className="mb-8 p-4 bg-slate-850 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-sky-400 mb-4 pb-2 border-b border-slate-700 flex items-center">
      {icon && <span className="mr-3 text-sky-500">{icon}</span>}
      {title}
    </h2>
    {isEmpty ? <p className="text-slate-400 italic">{emptyText}</p> : children}
  </section>
);

export const DashboardSection: React.FC<{ data: DashboardData }> = ({ data }) => {
  const { thesesSTJ, precedents, temporalEvolution, understandingEvolution, divergences } = data;

  const keyedTheses: KeyedThesisSTJ[] = useMemo(() => (thesesSTJ || []).map((item, index) => ({ ...item, id: `thesis-${index}` })), [thesesSTJ]);
  const keyedPrecedents: KeyedPrecedent[] = useMemo(() => (precedents || []).map((item, index) => ({ ...item, id: `precedent-${index}` })), [precedents]);
  const keyedTemporalEvolution: KeyedTemporalPoint[] = useMemo(() => (temporalEvolution || []).map((item, index) => ({ ...item, value: 1, id: `temporal-${index}` })), [temporalEvolution]);
  const keyedUnderstanding: KeyedUnderstandingEvolutionPoint[] = useMemo(() => (understandingEvolution || []).map((item, index) => ({ ...item, id: `understanding-${index}` })), [understandingEvolution]);
  const keyedDivergences: KeyedDivergence[] = useMemo(() => (divergences || []).map((item, index) => ({ ...item, id: `divergence-${index}` })), [divergences]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = keyedTemporalEvolution.find(p => p.year === label);
      if (pointData) {
        return (
          <div className="p-3 bg-slate-700 text-white rounded shadow-lg border border-slate-600">
            <p className="font-bold text-sky-300">{`Ano: ${label}`}</p>
            <p className="text-sm">{`Evento: ${pointData.event}`}</p>
            <p className="text-sm mt-1">{`Descrição: ${pointData.description}`}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <Section title="Teses Firmadas pelo STJ" icon={<FileTextIcon className="w-6 h-6" />} isEmpty={!keyedTheses || keyedTheses.length === 0}>
        <div className="space-y-4">
          {keyedTheses.map((thesis) => (
            <Card key={thesis.id} className="bg-slate-700/50 border border-slate-600 hover:border-sky-500 transition-colors">
              <p className="text-slate-200">{thesis.text}</p>
              <div className="mt-2 flex justify-between items-center">
                {thesis.reference && <p className="text-xs text-sky-400">Referência: {thesis.reference}</p>}
                {thesis.sourceUrl && (
                  <a
                    href={thesis.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center transition-colors"
                    aria-label="Acessar fonte da tese"
                  >
                    Ver Fonte <ExternalLinkIcon className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Precedentes Relevantes" icon={<UsersIcon className="w-6 h-6" />} isEmpty={!keyedPrecedents || keyedPrecedents.length === 0}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyedPrecedents.map((precedent) => (
            <Card key={precedent.id} className="bg-slate-700/50 border border-slate-600 hover:border-sky-500 transition-colors">
              <p className="text-slate-200 font-medium mb-1">{precedent.summary}</p>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-sky-400">Referência: {precedent.reference}</p>
                {precedent.sourceUrl && (
                  <a
                    href={precedent.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center transition-colors"
                    aria-label="Acessar fonte do precedente"
                  >
                    Ver Fonte <ExternalLinkIcon className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Evolução Temporal dos Casos" icon={<CalendarClockIcon className="w-6 h-6" />} isEmpty={!keyedTemporalEvolution || keyedTemporalEvolution.length === 0}>
        {keyedTemporalEvolution && keyedTemporalEvolution.length > 0 ? (
          <div className="h-96 bg-slate-700/30 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keyedTemporalEvolution} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="year" 
                  angle={-35} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  stroke="#64748b"
                />
                <YAxis hide={true} domain={[0, 2]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.3)' }}/>
                <Legend wrapperStyle={{ color: '#e2e8f0' }}/>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#38bdf8" // sky-500
                  strokeWidth={2} 
                  dot={{ r: 5, fill: '#0ea5e9' }} // sky-600
                  activeDot={{ r: 8, fill: '#0284c7' }} // sky-700
                  name="Eventos Chave" 
                />
                {keyedTemporalEvolution.map(point => (
                    <ReferenceLine key={`ref-${point.id}`} x={point.year} stroke="#475569" strokeDasharray="2 2" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
           <p className="text-slate-400 italic">Não há dados suficientes para exibir o gráfico de evolução temporal.</p>
        )}
      </Section>

      <Section title="Evolução dos Entendimentos Jurídicos" icon={<TrendingUpIcon className="w-6 h-6" />} isEmpty={!keyedUnderstanding || keyedUnderstanding.length === 0}>
        <div className="space-y-4">
          {keyedUnderstanding.map((item) => (
            <Card key={item.id} title={item.period} className="bg-slate-700/50 border border-slate-600" titleClassName="text-sky-400 !text-lg">
              <p className="text-slate-300">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Divergências Jurisprudenciais e Incidentes" icon={<AlertTriangleIcon className="w-6 h-6" />} isEmpty={!keyedDivergences || keyedDivergences.length === 0}>
        <div className="space-y-4">
          {keyedDivergences.map((divergence) => (
            <Card key={divergence.id} className="bg-red-900/30 border border-red-700">
              <p className="text-red-200 font-semibold">{divergence.description}</p>
              <p className="text-xs text-amber-400 mt-2">Implicação: {divergence.implication}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
};
