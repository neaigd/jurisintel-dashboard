
import React from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-slate-700">
      <nav className="-mb-px flex space-x-1 md:space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              ${activeTab === tab.id
                ? 'border-sky-500 text-sky-400 bg-slate-800'
                : 'border-transparent text-slate-400 hover:text-sky-300 hover:border-slate-600'
              }
              flex items-center whitespace-nowrap py-3 px-3 md:px-4 border-b-2 font-medium text-sm md:text-base transition-colors duration-150 focus:outline-none rounded-t-lg
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
