import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getBookContent } from '../../services/bookService';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const ReaderModal = ({ isOpen, onClose, book }) => {
  const { addToHistory, isInStash, addToStash, removeFromStash } = useApp();
  const { playSound } = useSoundEffects();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && book) {
      addToHistory(book);
      loadContent();
    }
  }, [isOpen, book]);

  const loadContent = async () => {
    if (!book) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getBookContent(book);
      setContent(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStash = () => {
    playSound('click');
    if (isInStash(book.id)) {
      removeFromStash(book.id);
    } else {
      addToStash(book);
    }
  };

  const handleClose = () => {
    playSound('click');
    onClose();
    setContent(null);
    setError(null);
  };

  if (!isOpen || !book) return null;

  const stashed = isInStash(book.id);

  return (
    <div className={`fixed inset-0 z-[80] bg-neo-black/95 backdrop-blur-sm flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-neo-yellow border-b-3 border-neo-black p-4 flex justify-between items-center shrink-0 h-16">
        <div className="font-display text-lg truncate max-w-[200px] md:max-w-md">
          {book.title}
        </div>
        <div className="flex gap-2 md:gap-4">
          <button
            onClick={handleStash}
            className={`border-2 border-neo-black px-3 font-bold text-xs md:text-sm flex items-center gap-2 ${
              stashed ? 'bg-neo-pink text-white' : 'bg-neo-white hover:bg-neo-pink'
            }`}
          >
            <span>{stashed ? '♥' : '♡'}</span>
            <span className="hidden md:inline">{stashed ? 'SAVED' : 'SAVE'}</span>
          </button>
          <button
            onClick={handleClose}
            className="bg-neo-black text-neo-white px-4 font-bold hover:bg-neo-red border-2 border-transparent text-xs md:text-sm"
          >
            [X]
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-neo-white relative overflow-hidden p-4 md:p-0 reader-theme-light">
        {loading ? (
          <div className="h-full flex items-center justify-center flex-col">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-mono font-bold">ACCESSING SOURCE NODE...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center font-bold text-neo-red">{error}</div>
        ) : content?.type === 'embed' ? (
          <iframe src={content.url} className="w-full h-full border-none"></iframe>
        ) : content?.type === 'text' ? (
          <div
            className="prose max-w-none p-8 text-justify font-mono text-sm bg-neo-white select-text overflow-y-auto h-full text-neo-black"
            dangerouslySetInnerHTML={{ __html: content.content }}
          ></div>
        ) : null}
      </div>
    </div>
  );
};

export default ReaderModal;
