import React from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const BookCard = ({ book, onClick }) => {
  const { playSound } = useSoundEffects();

  let badgeColor = 'bg-gray-300';
  if (book.source === 'GOOGLE') badgeColor = 'bg-neo-blue';
  if (book.source === 'GUTENBERG') badgeColor = 'bg-neo-pink';
  if (book.source === 'OPENLIB') badgeColor = 'bg-neo-green';

  return (
    <div
      onClick={() => onClick(book)}
      onMouseEnter={() => playSound('hover')}
      className="book-card bg-neo-white border-3 border-neo-black p-2 flex flex-col cursor-pointer relative group"
    >
      <div className="relative aspect-[2/3] w-full border-b-3 border-neo-black overflow-hidden mb-2 bg-neo-black">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
          loading="lazy"
        />
        <div className={`absolute bottom-0 right-0 ${badgeColor} text-neo-black px-2 text-[10px] font-bold border-t-3 border-l-3 border-neo-black`}>
          SRC: {book.source}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="font-display text-sm leading-tight line-clamp-2 uppercase">
          {book.title}
        </h3>
        <p className="font-mono text-[10px] text-gray-500 mb-2 truncate">{book.author}</p>
        <button className="w-full bg-neo-yellow border-3 border-neo-black font-bold py-2 hover:bg-neo-pink transition-colors text-sm flex justify-between px-4 items-center">
          <span>OPEN</span>
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
