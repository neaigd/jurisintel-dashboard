
export interface ThesisSTJ {
  text: string;
  reference?: string;
  sourceUrl?: string; // Added for link to source
}

export interface Precedent {
  summary: string;
  reference: string;
  sourceUrl?: string; // Added for link to source
}

export interface TemporalPoint {
  year: string;
  event: string;
  description: string;
  value?: number; // Optional: for chart y-axis if applicable
}

export interface UnderstandingEvolutionPoint {
  period: string;
  description: string;
}

export interface Divergence {
  description: string;
  implication: string;
}

export interface DashboardData {
  thesesSTJ: ThesisSTJ[];
  precedents: Precedent[];
  temporalEvolution: TemporalPoint[];
  understandingEvolution: UnderstandingEvolutionPoint[];
  divergences: Divergence[];
}

export interface PrequestionamentoExample {
  scenario: string;
  text: string;
}

export interface PrequestionamentoGuidance {
  explanation: string;
  examples: PrequestionamentoExample[];
}

export interface RecursoEspecialElement {
  name: string;
  explanation: string;
  example: string;
}

export interface GuidanceData {
  prequestionamento: PrequestionamentoGuidance;
  recursoEspecialElements: RecursoEspecialElement[];
}

export interface LegalAnalysisResponse {
  dashboard: DashboardData;
  guidance: GuidanceData;
}

// Props for components that render list items, to add a unique key
export interface KeyedThesisSTJ extends ThesisSTJ { id: string; }
export interface KeyedPrecedent extends Precedent { id: string; }
export interface KeyedTemporalPoint extends TemporalPoint { id: string; }
export interface KeyedUnderstandingEvolutionPoint extends UnderstandingEvolutionPoint { id: string; }
export interface KeyedDivergence extends Divergence { id: string; }
export interface KeyedPrequestionamentoExample extends PrequestionamentoExample { id: string; }
export interface KeyedRecursoEspecialElement extends RecursoEspecialElement { id: string; }
