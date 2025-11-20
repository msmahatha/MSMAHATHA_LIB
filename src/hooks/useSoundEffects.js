import { useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const useSoundEffects = () => {
  const { soundEnabled } = useApp();
  const audioContextRef = useRef(null);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      // Create AudioContext only when needed and reuse it
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Check if context is closed
      if (audioContext.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return;
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {
          // Silently fail if resume doesn't work
          return;
        });
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
      // Silently fail - don't spam console
      return;
    }
  }, [soundEnabled]);

  return { playSound };
};
