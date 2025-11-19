import React, { useState } from 'react';
import Navbar from './Navbar';
import BookGrid from './BookGrid';
import Footer from './Footer';
import ReaderModal from './modals/ReaderModal';
import AuthModal from './modals/AuthModal';
import SettingsModal from './modals/SettingsModal';
import Terminal from './Terminal';

const MainLayout = ({ isVisible }) => {
  const [showReader, setShowReader] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleOpenReader = (book) => {
    setSelectedBook(book);
    setShowReader(true);
  };

  return (
    <div className="h-full flex flex-col bg-neo-white">
      <Navbar
        onOpenAuth={() => setShowAuth(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="flex-1 flex relative overflow-hidden min-h-0">
        <aside className="w-16 border-r-3 border-neo-black bg-grid hidden md:flex flex-col items-center py-8 gap-8 bg-neo-white">
          <div
            className="vertical-text font-display text-xl rotate-180"
            style={{ writingMode: 'vertical-rl' }}
          >
            ARCHIVE
          </div>
          <div className="w-2 h-2 bg-neo-black rounded-full"></div>
          <div className="w-2 h-2 bg-neo-black rounded-full"></div>
        </aside>

        <BookGrid onOpenBook={handleOpenReader} onOpenAuth={() => setShowAuth(true)} />
      </main>

      <Footer />

      {/* Terminal Button */}
      <button
        onClick={() => setShowTerminal(true)}
        className="fixed bottom-14 right-6 md:bottom-16 md:right-10 z-50 bg-neo-black text-neo-green border-3 border-neo-green px-4 py-3 font-bold shadow-hard hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        &gt;_ AI ASSISTANT
      </button>

      {/* Modals */}
      <ReaderModal
        isOpen={showReader}
        onClose={() => setShowReader(false)}
        book={selectedBook}
      />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <Terminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />
    </div>
  );
};

export default MainLayout;
