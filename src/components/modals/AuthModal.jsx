import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const { playSound } = useSoundEffects();
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      playSound('click');
      login(username);
      onClose();
      setUsername('');
    }
  };

  const handleClose = () => {
    playSound('click');
    onClose();
    setUsername('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[90] bg-neo-black/90 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-neo-white w-full max-w-md border-3 border-neo-white shadow-[10px_10px_0px_0px_#333] relative p-8">
        <button
          onClick={handleClose}
          className="absolute -top-5 -right-5 w-10 h-10 bg-neo-red text-neo-white border-3 border-neo-black font-bold"
        >
          X
        </button>
        <h2 className="font-display text-2xl mb-4 text-center">IDENTIFY</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-100 border-3 border-neo-black p-3 font-bold mb-4 uppercase"
          placeholder="CODENAME"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-neo-black text-neo-white border-3 border-neo-black py-3 font-display text-xl hover:bg-neo-pink hover:text-neo-black"
        >
          LOGIN / REGISTER
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
