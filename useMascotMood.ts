import { useCallback, useEffect, useRef, useState } from 'react';
import type { MascotMood } from './Mascot';

// কিছুক্ষণের জন্য মুড বদলে আবার idle-এ ফেরত আনে
export function useMascotMood(resetAfterMs = 2000) {
  const [mood, setMood] = useState<MascotMood>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const react = useCallback(
    (next: MascotMood) => {
      clearTimeout(timer.current);
      setMood(next);
      if (next === 'happy' || next === 'sad' || next === 'wave') {
        timer.current = setTimeout(() => setMood('idle'), resetAfterMs);
      }
    },
    [resetAfterMs],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { mood, react };
}
