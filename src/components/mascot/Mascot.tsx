import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'wave';

type MascotProps = {
  mood?: MascotMood;
  size?: number;
  src?: string;
  className?: string;
};

const motionV: Variants = {
  idle: { y: [0, -2, 0], rotate: [-0.5, 0.5, -0.5], scaleY: [1, 1.006, 1], transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' } },
  happy: { y: [0, 5, -22, 0, -7, 0], rotate: [0, -2, 2, 0], scaleY: [1, 0.96, 1.04, 1], transition: { duration: 1.05, ease: 'easeOut' } },
  sad: { y: 7, rotate: -2, scaleY: 0.985, transition: { duration: 0.55, ease: 'easeOut' } },
  thinking: { y: [0, -1, 0], rotate: [0, 2, 0], transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' } },
  wave: { y: [0, -4, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.8, ease: 'easeInOut' } },
};

const browV: Variants = {
  idle: { rotate: 0, y: 0, transition: { duration: 0.25 } },
  happy: { rotate: -8, y: 8, transition: { duration: 0.3, ease: 'easeOut' } },
  sad: { rotate: 9, y: 8, transition: { duration: 0.3, ease: 'easeOut' } },
  thinking: { rotate: -12, y: 3, transition: { duration: 0.3 } },
  wave: { rotate: -3, y: 1, transition: { duration: 0.25 } },
};

function useBlink() {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let openTimer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      openTimer = setTimeout(() => {
        setBlink(true);
        closeTimer = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 105);
      }, 2200 + Math.random() * 3200);
    };
    schedule();
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);
  return blink;
}

function Pupil({ side, mood, blink }: { side: 'left' | 'right'; mood: MascotMood; blink: boolean }) {
  const isLeft = side === 'left';
  const x = mood === 'thinking' ? (isLeft ? -7 : -8) : mood === 'sad' ? (isLeft ? -2 : 2) : mood === 'happy' ? 0 : 0;
  const y = mood === 'thinking' ? -2 : mood === 'happy' ? 1 : 0;
  return (
    <motion.span
      aria-hidden="true"
      animate={{ x, y, scaleY: blink ? 0.08 : mood === 'happy' ? 0.84 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, duration: 0.16 }}
      style={{
        position: 'absolute', left: isLeft ? '39.8%' : '62.2%', top: '30.7%', width: '8.1%', height: '9.1%',
        borderRadius: '50%', background: 'radial-gradient(circle at 32% 25%, #fff 0 9%, #fff0 10%), radial-gradient(circle at 50% 50%, #08102b 0 52%, #02040b 54% 100%)',
        transformOrigin: '50% 60%', pointerEvents: 'none',
      }}
    />
  );
}

function Mouth({ mood }: { mood: MascotMood }) {
  if (mood === 'happy' || mood === 'wave') {
    return <motion.span aria-hidden="true" animate={{ scaleY: [1, 0.88, 1] }} transition={{ repeat: Infinity, duration: 0.48 }} style={{ position: 'absolute', left: '48.4%', top: '41.2%', width: '7.5%', height: '5.5%', borderRadius: '0 0 50% 50%', background: 'linear-gradient(#8d1f35 0 55%, #f78e9d 56%)', border: '2px solid #9a3140', transformOrigin: '50% 15%' }} />;
  }
  if (mood === 'sad') {
    return <motion.span aria-hidden="true" animate={{ rotate: 180 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', left: '49%', top: '42.2%', width: '5.7%', height: '3.3%', borderBottom: '3px solid #713748', borderRadius: '0 0 50% 50%' }} />;
  }
  return <span aria-hidden="true" style={{ position: 'absolute', left: '49.1%', top: '42.4%', width: '5.2%', height: '2.4%', borderBottom: '2px solid #713748', borderRadius: '0 0 50% 50%' }} />;
}

export default function Mascot({ mood = 'idle', size = 240, src = '/mascot/cat-neutral.png', className }: MascotProps) {
  const blink = useBlink();
  const faceTilt = mood === 'thinking' ? -3 : mood === 'sad' ? 2 : 0;
  const cheekOpacity = mood === 'happy' ? 0.38 : mood === 'sad' ? 0.14 : 0;

  return (
    <motion.div
      className={className}
      variants={motionV}
      initial="idle"
      animate={mood}
      style={{ position: 'relative', width: size, aspectRatio: '1 / 1', userSelect: 'none', transformOrigin: '50% 92%' }}
      role="img"
      aria-label="Neura Academy cat mascot"
    >
      <img src={src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      <motion.div animate={{ rotate: faceTilt, y: mood === 'sad' ? 5 : 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 42%', pointerEvents: 'none' }}>
        <motion.span aria-hidden="true" animate={{ opacity: cheekOpacity, scale: mood === 'happy' ? 1.08 : 1 }} transition={{ duration: 0.25 }} style={{ position: 'absolute', left: '28%', top: '42%', width: '10%', height: '4%', borderRadius: '50%', background: '#f48b9b', filter: 'blur(2px)' }} />
        <motion.span aria-hidden="true" animate={{ opacity: cheekOpacity, scale: mood === 'happy' ? 1.08 : 1 }} transition={{ duration: 0.25 }} style={{ position: 'absolute', right: '28%', top: '42%', width: '10%', height: '4%', borderRadius: '50%', background: '#f48b9b', filter: 'blur(2px)' }} />
        <motion.span variants={browV} animate={mood} aria-hidden="true" style={{ position: 'absolute', left: '34%', top: '25.5%', width: '11%', height: '1.5%', borderRadius: 999, background: '#4a3343', transformOrigin: '85% 50%' }} />
        <motion.span variants={browV} animate={mood} aria-hidden="true" style={{ position: 'absolute', right: '34%', top: '25.5%', width: '11%', height: '1.5%', borderRadius: 999, background: '#4a3343', transformOrigin: '15% 50%' }} />
        <Pupil side="left" mood={mood} blink={blink} />
        <Pupil side="right" mood={mood} blink={blink} />
        <Mouth mood={mood} />
      </motion.div>
    </motion.div>
  );
}
