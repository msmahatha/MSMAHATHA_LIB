import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants/categories';

const Navbar = ({ onOpenAuth, onOpenSettings }) => {
  const { user, stash, setQuery, setPage, setViewMode } = useApp();

  const handleCategoryClick = (categoryId) => {
    setQuery(categoryId);
    setPage(1);
    setViewMode('grid');
  };

  const handleViewChange = (view) => {
    setViewMode(view);
    setPage(1);
  };

  return (
    <nav className="flex flex-col shrink-0 z-40 border-b-3 border-neo-black">
      <div className="h-16 bg-neo-white flex border-b-3 border-neo-black">
        <div
          onClick={() => window.location.reload()}
          className="bg-neo-black text-neo-white px-6 flex items-center font-display text-2xl tracking-tighter border-r-3 border-neo-black shrink-0 uppercase cursor-pointer hover:bg-neo-pink transition-colors"
        >
          MSMAHATHA_
        </div>
        <div className="flex-1 flex items-center px-4 bg-neo-yellow min-w-0 overflow-hidden">
          <button
            onClick={onOpenSettings}
            className="mr-4 border-2 border-neo-black p-1 hover:bg-white font-bold text-sm"
          >
            <i className="fas fa-cog"></i> CONFIG
          </button>

          <div className="hidden md:flex space-x-4 border-l-2 border-neo-black pl-4">
            <button
              onClick={() => handleViewChange('stash')}
              className="font-bold hover:text-neo-red transition-colors"
            >
              STASH [{stash.length}]
            </button>
            <button
              onClick={() => handleViewChange('history')}
              className="font-bold hover:text-neo-red transition-colors"
            >
              HISTORY
            </button>
          </div>
        </div>
        <div className="flex bg-neo-black text-neo-green border-l-3 border-neo-black whitespace-nowrap">
          <div className="px-6 flex items-center font-bold text-sm">
            <span className={`mr-2 ${user ? 'text-neo-green' : 'text-neo-red animate-pulse'}`}>
              ●
            </span>
            {user || 'GUEST'}
          </div>
          <button
            onClick={onOpenAuth}
            className="px-6 bg-neo-white text-neo-black border-l-3 border-neo-black font-bold hover:bg-neo-pink transition-colors"
          >
            LOGIN
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto no-scrollbar bg-neo-white items-stretch h-12 border-b-3 border-neo-black">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="px-6 border-r-3 border-neo-black bg-white font-bold whitespace-nowrap hover:bg-neo-black hover:text-white transition-colors"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
