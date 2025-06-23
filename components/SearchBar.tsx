
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from './Icons';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  setSearchTermExt: (searchTerm: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setSearchTermExt, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchTermExt(e.target.value); // Update parent's searchTerm for immediate feedback/clearing
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-3xl mx-auto bg-slate-700 rounded-lg shadow-xl overflow-hidden">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Digite o tema jurídico (e.g., responsabilidade civil do Estado por omissão)..."
        className="w-full p-4 text-lg bg-slate-700 text-gray-100 placeholder-slate-400 focus:outline-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="p-4 bg-sky-500 hover:bg-sky-600 transition-colors duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <MagnifyingGlassIcon className="w-6 h-6 text-white" />
        )}
      </button>
    </form>
  );
};
