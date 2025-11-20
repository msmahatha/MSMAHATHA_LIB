import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Terminal = ({ isOpen, onClose }) => {
  const { setQuery, setPage, setViewMode } = useApp();
  const [termMode, setTermMode] = useState('console');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'info', text: 'AI SYSTEM ONLINE. WAITING FOR INPUT...' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleModeChange = (mode) => {
    setTermMode(mode);
    setInput('');
  };

  const analyzeWithAI = async (bookTitle) => {
    setIsAnalyzing(true);
    setOutput(prev => [...prev, { type: 'info', text: `ANALYZING "${bookTitle.toUpperCase()}"...` }]);

    // Simulate AI analysis with realistic data
    const analyses = [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `BOOK: ${bookTitle}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `GENRE CLASSIFICATION:`,
      `  • Fiction: 78%`,
      `  • Classic Literature: 65%`,
      `  • Drama: 54%`,
      `  • Romance: 42%`,
      ``,
      `READING METRICS:`,
      `  • Level: Intermediate-Advanced`,
      `  • Est. Time: 8-12 hours`,
      `  • Page Count: ~250-350 pages`,
      `  • Complexity Score: 7.2/10`,
      ``,
      `ANALYSIS:`,
      `This work explores deep human themes through compelling narrative`,
      `structure. Rich character development and vivid prose create an`,
      `immersive reading experience suitable for mature readers.`,
      ``,
      `KEY THEMES:`,
      `  • Human nature and society`,
      `  • Love and relationships`,
      `  • Identity and self-discovery`,
      `  • Social commentary`,
      ``,
      `SIMILAR TITLES:`,
      `  1. Search for classics in same genre`,
      `  2. Check author's other works`,
      `  3. Explore contemporary adaptations`,
      `  4. Look for thematic connections`,
      ``,
      `RECOMMENDATION SCORE: 8.5/10`,
      `STATUS: Highly recommended for literary enthusiasts`,
      ``,
      `TIP: Use SEARCH tab to find similar books instantly!`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    ];
    
    analyses.forEach((text, i) => {
      setTimeout(() => {
        setOutput(prev => [...prev, { type: 'info', text }]);
      }, i * 80);
    });

    setTimeout(() => {
      setIsAnalyzing(false);
    }, analyses.length * 80 + 100);
  };

  const handleInput = async (e) => {
    if (e.key !== 'Enter') return;
    if (isAnalyzing) return;

    const val = input.trim();
    if (!val) return;

    setOutput(prev => [...prev, { type: 'command', text: `> ${val}` }]);

    if (termMode === 'search') {
      setQuery(val);
      setPage(1);
      setViewMode('grid');
      setInput('');
      onClose(); // Close immediately to show results
      return;
    }

    if (termMode === 'analyze') {
      setInput('');
      await analyzeWithAI(val);
      return;
    }

    // Console mode commands
    if (val === 'clear') {
      setOutput([]);
      setInput('');
      return;
    }

    if (val === 'help') {
      setOutput(prev => [
        ...prev,
        { type: 'info', text: 'AVAILABLE COMMANDS:' },
        { type: 'info', text: '  clear - Clear terminal output' },
        { type: 'info', text: '  help - Show this message' },
        { type: 'info', text: '  status - Show system status' },
        { type: 'info', text: '  Use SEARCH tab to find books' },
        { type: 'info', text: '  Use ANALYZE tab to analyze books' }
      ]);
      setInput('');
      return;
    }

    if (val === 'status') {
      setOutput(prev => [
        ...prev,
        { type: 'info', text: 'SYSTEM STATUS: ONLINE' },
        { type: 'info', text: 'FEDERATED_APIS: CONNECTED' },
        { type: 'info', text: 'AI_CORE: ACTIVE' },
        { type: 'info', text: 'ARCHIVES: 3 SOURCES AVAILABLE' }
      ]);
      setInput('');
      return;
    }

    setOutput(prev => [...prev, { type: 'error', text: `UNKNOWN COMMAND: ${val}. Type "help" for available commands.` }]);
    setInput('');
  };

  if (!isOpen) return null;

  const getPlaceholder = () => {
    if (termMode === 'search') return 'SEARCH BOOKS...';
    if (termMode === 'analyze') return 'ENTER BOOK TITLE...';
    return 'ENTER COMMAND...';
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50">
      <div className="bg-neo-black w-full max-w-3xl mx-4 border-3 border-neo-white shadow-hard-hover flex flex-col h-[600px]">
        <div className="bg-neo-white text-neo-black p-3 font-bold border-b-3 border-neo-white flex justify-between items-center">
          <span className="font-display tracking-wide">MSMAHATHA_AI // FEDERATED_CORE</span>
          <button
            onClick={onClose}
            className="px-2 hover:bg-neo-pink hover:text-neo-white border-2 border-transparent"
          >
            X
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-3 border-neo-white bg-neo-black">
          <button
            onClick={() => handleModeChange('console')}
            className={`flex-1 py-2 font-bold transition-colors ${
              termMode === 'console'
                ? 'text-neo-black bg-neo-green'
                : 'text-neo-green border-l-3 border-neo-white hover:bg-neo-white hover:text-neo-black'
            }`}
          >
            CONSOLE
          </button>
          <button
            onClick={() => handleModeChange('search')}
            className={`flex-1 py-2 font-bold transition-colors ${
              termMode === 'search'
                ? 'text-neo-black bg-neo-green'
                : 'text-neo-green border-l-3 border-neo-white hover:bg-neo-white hover:text-neo-black'
            }`}
          >
            SEARCH
          </button>
          <button
            onClick={() => handleModeChange('analyze')}
            className={`flex-1 py-2 font-bold transition-colors ${
              termMode === 'analyze'
                ? 'text-neo-black bg-neo-green'
                : 'text-neo-green border-l-3 border-neo-white hover:bg-neo-white hover:text-neo-black'
            }`}
          >
            ANALYZE
          </button>
        </div>

        {/* Output */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-neo-green text-sm space-y-3 leading-relaxed">
          {output.map((line, index) => (
            <div
              key={index}
              className={
                line.type === 'command'
                  ? 'text-neo-green font-bold mt-2'
                  : line.type === 'error'
                  ? 'text-neo-red mb-4'
                  : 'text-neo-white'
              }
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t-3 border-neo-white bg-neo-black flex text-neo-green font-mono items-center">
          <span className="mr-2 font-bold">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInput}
            className="bg-transparent border-none outline-none flex-1 text-neo-green font-bold text-lg uppercase"
            placeholder={getPlaceholder()}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
