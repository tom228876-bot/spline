import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'wave';

type MascotProps = {
  mood?: MascotMood;
  size?: number;
  src?: string;
  className?: string;
};

const bodyV: Variants = {
  idle: { y: [0, -2, 0], scaleY: [1, 1.008, 1], transition: { repeat: Infinity, duration: 3.4, ease: 'easeInOut' } },
  happy: { y: [0, 5, -16, 0], scaleY: [1, 0.97, 1.025, 1], transition: { duration: 0.9, ease: 'easeOut' } },
  sad: { y: 5, scaleY: 0.985, transition: { duration: 0.55, ease: 'easeOut' } },
  thinking: { y: [0, -1, 0], transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' } },
  wave: { y: [0, -5, 0], transition: { duration: 0.7, ease: 'easeOut' } },
};

const wingV: Variants = {
  idle: { rotate: [0, -1.5, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } },
  happy: { rotate: [0, -9, 7, -5, 0], y: [0, -5, 0, -2, 0], transition: { duration: 0.95, ease: 'easeInOut' } },
  sad: { rotate: 5, y: 7, transition: { duration: 0.55 } },
  thinking: { rotate: [0, 2, 0], transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } },
  wave: { rotate: [0, -18, 8, -15, 0], y: [0, -7, 0, -5, 0], transition: { duration: 1.1, ease: 'easeInOut' } },
};

const browV: Variants = {
  idle: { rotate: 0, y: 0, transition: { duration: 0.25 } },
  happy: { rotate: -7, y: 8, transition: { duration: 0.35 } },
  sad: { rotate: 10, y: 9, transition: { duration: 0.35 } },
  thinking: { rotate: -9, y: 3, transition: { duration: 0.35 } },
  wave: { rotate: -2, y: 0, transition: { duration: 0.25 } },
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
        }, 115);
      }, 2400 + Math.random() * 2800);
    };
    schedule();
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);
  return blink;
}

function Eye({ side, mood, blink }: { side: 'left' | 'right'; mood: MascotMood; blink: boolean }) {
  const isLeft = side === 'left';
  const gaze = mood === 'thinking' ? (isLeft ? -5 : -7) : mood === 'sad' ? (isLeft ? -2 : 2) : 0;
  const blinkScale = blink ? 0.08 : mood === 'happy' ? 0.62 : mood === 'sad' ? 0.78 : 1;

  return (
    <motion.div
      aria-hidden="true"
      animate={{ x: gaze, scaleY: blinkScale }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, duration: 0.16 }}
      style={{
        position: 'absolute', left: isLeft ? '35.1%' : '61.8%', top: '34.9%', width: '9.9%', height: '10.8%',
        borderRadius: '50%', background: 'linear-gradient(#070b19 0 58%, #02040b 59% 100%)',
        boxShadow: '0 0 0 3px rgba(8,12,32,.18)', transformOrigin: '50% 50%',
      }}
    >
      <span style={{ position: 'absolute', width: '24%', height: '24%', left: '18%', top: '12%', borderRadius: '50%', background: '#fff' }} />
      <span style={{ position: 'absolute', width: '11%', height: '11%', left: '50%', top: '24%', borderRadius: '50%', background: '#fff', opacity: 0.8 }} />
    </motion.div>
  );
}

function Beak({ mood }: { mood: MascotMood }) {
  const talking = mood === 'happy' || mood === 'wave';
  return (
    <motion.div
      aria-hidden="true"
      animate={talking ? { scaleY: [1, 0.82, 1], y: [0, 2, 0] } : { scaleY: 1, y: 0 }}
      transition={talking ? { repeat: Infinity, duration: 0.46, ease: 'easeInOut' } : { duration: 0.2 }}
      style={{
        position: 'absolute', left: '47.1%', top: '39.8%', width: '5.6%', height: '4.9%',
        transformOrigin: '50% 25%', clipPath: 'polygon(50% 0, 100% 48%, 50% 100%, 0 48%)',
        background: 'linear-gradient(145deg, #ffd66a, #e28a16 68%, #b75c09)', filter: 'drop-shadow(0 2px 1px rgba(70,30,0,.22))',
      }}
    />
  );
}

export default function Mascot({ mood = 'idle', size = 240, src = '/mascot/owl-neutral.png', className }: MascotProps) {
  const blink = useBlink();
  const eyeKey = useMemo(() => `${mood}-${blink}`, [mood, blink]);

  return (
    <motion.div
      className={className}
      style={{ position: 'relative', width: size, aspectRatio: '2 / 3', userSelect: 'none' }}
      role="img"
      aria-label="Neura Academy owl mascot"
      variants={bodyV}
      initial="idle"
      animate={mood}
    >
      <img src={src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />

      <motion.div
        aria-hidden="true"
        variants={wingV}
        animate={mood}
        style={{ position: 'absolute', left: '8%', top: '40%', width: '23%', height: '27%', borderRadius: '48% 18% 55% 42%', background: 'linear-gradient(145deg, rgba(55,86,150,.7), rgba(9,25,69,.72))', transformOrigin: '90% 20%', opacity: 0.22, pointerEvents: 'none' }}
      />
      <motion.div
        aria-hidden="true"
        variants={wingV}
        animate={mood}
        style={{ position: 'absolute', right: '8%', top: '40%', width: '23%', height: '27%', borderRadius: '18% 48% 42% 55%', background: 'linear-gradient(215deg, rgba(55,86,150,.7), rgba(9,25,69,.72))', transformOrigin: '10% 20%', opacity: 0.22, pointerEvents: 'none' }}
      />

      <motion.div
        key={eyeKey}
        variants={browV}
        animate={mood}
        style={{ position: 'absolute', left: '33.5%', top: '29.8%', width: '12%', height: '2.2%', borderRadius: 999, background: '#4f3b46', transformOrigin: '80% 50%' }}
      />
      <motion.div
        variants={browV}
        animate={mood}
        style={{ position: 'absolute', right: '33.5%', top: '29.8%', width: '12%', height: '2.2%', borderRadius: 999, background: '#4f3b46', transformOrigin: '20% 50%' }}
      />

      <Eye side="left" mood={mood} blink={blink} />
      <Eye side="right" mood={mood} blink={blink} />
      <Beak mood={mood} />
    </motion.div>
  );
}
