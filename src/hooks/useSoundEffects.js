import { useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const useSoundEffects = () => {
  const { soundEnabled } = useApp();

  const audioContext = useMemo(() => {
    return new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'click') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      } else if (type === 'hover') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      }
    } catch (error) {
      console.error('Sound effect error:', error);
    }
  }, [soundEnabled, audioContext]);

  return { playSound };
};
