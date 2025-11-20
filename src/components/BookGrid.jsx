import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchFederatedBooks } from '../services/bookService';
import BookCard from './BookCard';

const BookGrid = ({ onOpenBook, onOpenAuth }) => {
  const { query, page, setPage, isLoading, setIsLoading, viewMode, stash, history, user } = useApp();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  useEffect(() => {
    if (viewMode === 'grid') {
      // Check cache first for instant display
      if (cache[query]) {
        setBooks(cache[query]);
      }
      loadBooks(true);
    } else if (viewMode === 'stash') {
      setBooks(stash);
      setIsLoading(false);
    } else if (viewMode === 'history') {
      setBooks(history);
      setIsLoading(false);
    }
  }, [query, viewMode]);

  // Separate effect for page changes
  useEffect(() => {
    if (viewMode === 'grid' && page > 1) {
      loadBooks(false);
    }
  }, [page]);

  const loadBooks = async (reset = false) => {
    if (isLoading && !reset) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const results = await fetchFederatedBooks(query, reset ? 1 : page);
      
      if (reset) {
        setBooks(results);
        setPage(1);
        // Cache the results for this query
        setCache(prev => ({ ...prev, [query]: results }));
      } else {
        const newBooks = [...books, ...results];
        setBooks(newBooks);
        setCache(prev => ({ ...prev, [query]: newBooks }));
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('NETWORK ERROR');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    loadBooks(false);
  };

  const handleBookClick = (book) => {
    if (!user) {
      onOpenAuth();
    } else {
      onOpenBook(book);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(#121212_1px,transparent_1px)] [background-size:40px_40px] relative p-6 md:p-10">
      {isLoading && books.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-neo-yellow border-3 border-neo-black animate-spin mb-4"></div>
          <div className="font-display text-2xl animate-pulse text-center px-4">
            LOADING_BOOKS...
          </div>
        </div>
      ) : error && books.length === 0 ? (
        <div className="col-span-full text-center font-bold text-neo-red p-10">{error}</div>
      ) : books.length === 0 ? (
        <div className="col-span-full text-center font-bold p-10 text-gray-500">
          {viewMode === 'stash' ? 'NO ITEMS STASHED' : viewMode === 'history' ? 'NO READING HISTORY' : 'NO RESULTS IN ANY ARCHIVE'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {books.map((book, index) => (
              <BookCard key={`${book.id}-${index}`} book={book} onClick={handleBookClick} />
            ))}
          </div>

          {viewMode === 'grid' && (
            <div className="py-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-neo-black text-neo-white font-display text-xl px-8 py-4 border-3 border-neo-white shadow-hard hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
              >
                {isLoading ? 'LOADING...' : 'LOAD_MORE_DATA()'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookGrid;
