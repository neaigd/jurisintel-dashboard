
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', icon }) => {
  return (
    <div className={`bg-slate-750 shadow-lg rounded-lg overflow-hidden p-5 md:p-6 ${className}`}>
      {title && (
        <h3 className={`text-xl font-semibold text-sky-300 mb-4 flex items-center ${titleClassName}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
      )}
      <div className="text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
};

// Specific card for code-like examples
interface CodeExampleCardProps {
  title: string;
  scenario?: string;
  code: string;
  language?: string; // e.g., 'sql', ' právní text'
}

export const CodeExampleCard: React.FC<CodeExampleCardProps> = ({ title, scenario, code, language = 'text' }) => {
  return (
    <Card title={title} className="bg-slate-800 border border-slate-700">
        {scenario && <p className="text-sm text-slate-400 mb-2 italic">{scenario}</p>}
        <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto text-sm text-slate-200 custom-scrollbar">
            <code className={`language-${language}`}>{code}</code>
        </pre>
    </Card>
  );
};
