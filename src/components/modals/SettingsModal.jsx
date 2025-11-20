import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const SettingsModal = ({ isOpen, onClose }) => {
  const { soundEnabled, setSoundEnabled, crtEnabled, setCrtEnabled, updateSettings } = useApp();
  const { playSound } = useSoundEffects();

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  const toggleSound = async () => {
    playSound('click');
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    if (updateSettings) {
      await updateSettings({ soundEnabled: newValue });
    }
  };

  const toggleCrt = async () => {
    playSound('click');
    const newValue = !crtEnabled;
    setCrtEnabled(newValue);
    if (updateSettings) {
      await updateSettings({ crtEffect: newValue });
    }
  };

  useEffect(() => {
    const body = document.body;
    if (crtEnabled) {
      body.classList.add('crt');
    } else {
      body.classList.remove('crt');
    }
  }, [crtEnabled]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[90] bg-neo-black/90 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-neo-white w-full max-w-md border-3 border-neo-white shadow-[10px_10px_0px_0px_#333] p-8 relative">
        <button
          onClick={handleClose}
          className="absolute -top-5 -right-5 w-10 h-10 bg-neo-red text-neo-white border-3 border-neo-black font-bold"
        >
          X
        </button>
        <h2 className="font-display text-2xl mb-6 text-center">CONFIG</h2>
        <div className="space-y-6 font-bold">
          <div className="flex justify-between items-center">
            <label>SOUND_FX</label>
            <button
              onClick={toggleSound}
              className={`px-4 py-2 border-3 border-neo-black ${
                soundEnabled ? 'bg-neo-green' : 'bg-gray-300'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <label>CRT_OVERLAY</label>
            <button
              onClick={toggleCrt}
              className={`px-4 py-2 border-3 border-neo-black ${
                crtEnabled ? 'bg-neo-green' : 'bg-gray-300'
              }`}
            >
              {crtEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
