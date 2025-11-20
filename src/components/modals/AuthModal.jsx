import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const { playSound } = useSoundEffects();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    setError('');

    if (!username.trim()) {
      setError('USERNAME REQUIRED');
      return;
    }

    if (username.length < 3) {
      setError('USERNAME TOO SHORT (MIN 3 CHARS)');
      return;
    }

    if (mode === 'register') {
      if (!email.trim()) {
        setError('EMAIL REQUIRED');
        return;
      }

      if (!validateEmail(email)) {
        setError('INVALID EMAIL FORMAT');
        return;
      }

      if (!password) {
        setError('PASSWORD REQUIRED');
        return;
      }

      if (password.length < 6) {
        setError('PASSWORD TOO SHORT (MIN 6 CHARS)');
        return;
      }

      if (password !== confirmPassword) {
        setError('PASSWORDS DO NOT MATCH');
        return;
      }
    }

    // Simulate processing
    setIsProcessing(true);
    playSound('click');
    
    setTimeout(() => {
      login(username);
      setIsProcessing(false);
      onClose();
      resetForm();
    }, 800);
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    playSound('click');
    onClose();
    resetForm();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    playSound('click');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[90] bg-neo-black/90 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-neo-white w-full max-w-md border-3 border-neo-black shadow-[12px_12px_0px_0px_#000] relative p-8">
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-neo-red text-neo-white border-3 border-neo-black font-bold hover:bg-neo-pink transition-colors shadow-[4px_4px_0px_0px_#000]"
        >
          X
        </button>
        
        <div className="mb-6">
          <h2 className="font-display text-3xl mb-2 text-center uppercase tracking-tight">
            {mode === 'login' ? 'ACCESS_ARCHIVE' : 'CREATE_ACCOUNT'}
          </h2>
          <div className="h-1 bg-neo-yellow border-2 border-neo-black"></div>
        </div>

        {error && (
          <div className="bg-neo-red text-white border-3 border-neo-black p-3 mb-4 font-bold text-sm animate-pulse">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block font-bold text-sm mb-2 uppercase">
              <i className="fas fa-user mr-2"></i>Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-100 border-3 border-neo-black p-3 font-bold uppercase focus:bg-neo-yellow focus:outline-none transition-colors"
              placeholder="ENTER CODENAME"
              autoFocus
              disabled={isProcessing}
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-sm mb-2 uppercase">
                  <i className="fas fa-envelope mr-2"></i>Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-100 border-3 border-neo-black p-3 font-bold lowercase focus:bg-neo-yellow focus:outline-none transition-colors"
                  placeholder="agent@archive.sys"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-2 uppercase">
                  <i className="fas fa-lock mr-2"></i>Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-100 border-3 border-neo-black p-3 font-bold focus:bg-neo-yellow focus:outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-2 uppercase">
                  <i className="fas fa-lock mr-2"></i>Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-100 border-3 border-neo-black p-3 font-bold focus:bg-neo-yellow focus:outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={isProcessing}
                />
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-neo-black text-neo-white border-3 border-neo-black py-4 font-display text-xl hover:bg-neo-pink hover:text-neo-black transition-all shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                PROCESSING...
              </span>
            ) : (
              mode === 'login' ? 'ENTER ARCHIVE()' : 'INITIALIZE_USER()'
            )}
          </button>

          <div className="border-t-3 border-neo-black pt-4 mt-4">
            <button
              onClick={switchMode}
              disabled={isProcessing}
              className="w-full text-center font-bold text-sm hover:text-neo-pink transition-colors uppercase"
            >
              {mode === 'login' ? (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  NEW USER? CREATE ACCOUNT
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  HAVE ACCOUNT? LOGIN HERE
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-600 font-mono">
          <i className="fas fa-shield-alt mr-1"></i>
          SECURE CONNECTION ESTABLISHED
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
