import { motion, type Variants } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'wave';

type MascotProps = {
  mood?: MascotMood;
  size?: number;
  src?: string;
  className?: string;
};

const variants: Variants = {
  idle: {
    y: [0, -8, 0],
    rotate: 0,
    scale: [1, 1.02, 1],
    transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
  },
  happy: {
    y: [0, -45, 0, -20, 0],
    rotate: [0, -6, 6, -3, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 0.9, ease: 'easeOut' },
  },
  sad: {
    y: 8,
    rotate: -5,
    scale: 0.97,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  thinking: {
    y: [0, -4, 0],
    rotate: [4, 6, 4],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  wave: {
    rotate: [0, -8, 8, -8, 8, 0],
    transition: { duration: 1.2, ease: 'easeInOut' },
  },
};

export default function Mascot({
  mood = 'idle',
  size = 240,
  src = '/mascot/MC02.png',
  className,
}: MascotProps) {
  return (
    <motion.img
      key={mood} // mood বদলালে অ্যানিমেশন নতুন করে শুরু হবে
      src={src}
      alt="Neura Academy mascot"
      width={size}
      height={size}
      draggable={false}
      className={className}
      style={{ objectFit: 'contain', userSelect: 'none', transformOrigin: '50% 100%' }}
      variants={variants}
      initial="idle"
      animate={mood}
    />
  );
}
