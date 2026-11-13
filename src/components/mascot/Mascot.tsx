import { AnimatePresence, motion, type Variants } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'wave';

type MascotProps = {
  mood?: MascotMood;
  size?: number;
  src?: string;
  className?: string;
};

const EXPRESSIONS: Record<MascotMood, string> = {
  idle: '/mascot/cat-neutral.png',
  happy: '/mascot/cat-happy.png',
  sad: '/mascot/cat-sad.png',
  thinking: '/mascot/cat-thinking.png',
  wave: '/mascot/cat-wave.png',
};

const bodyVariants: Variants = {
  idle: { y: [0, -2, 0], rotate: [-0.35, 0.35, -0.35], scale: [1, 1.006, 1], transition: { repeat: Infinity, duration: 3.4, ease: 'easeInOut' } },
  happy: { y: [0, 7, -26, 0, -8, 0], rotate: [0, -1.5, 1.5, 0], scale: [1, 0.96, 1.045, 1], transition: { duration: 1.05, ease: 'easeOut' } },
  sad: { y: 8, rotate: -1.5, scale: 0.985, transition: { duration: 0.5, ease: 'easeOut' } },
  thinking: { y: [0, -1, 0], rotate: [0, 2.2, 0], transition: { repeat: Infinity, duration: 2.7, ease: 'easeInOut' } },
  wave: { y: [0, -5, 0], rotate: [0, -2.5, 2.5, 0], transition: { duration: 0.85, ease: 'easeInOut' } },
};

const imageVariants: Variants = {
  enter: { opacity: 0, scale: 0.985, y: 5 },
  center: { opacity: 1, scale: 1, y: 0, transition: { opacity: { duration: 0.16 }, scale: { duration: 0.28, ease: 'easeOut' }, y: { duration: 0.28, ease: 'easeOut' } } },
  exit: { opacity: 0, scale: 1.015, y: -3, transition: { opacity: { duration: 0.1 } } },
};

export default function Mascot({ mood = 'idle', size = 240, src, className }: MascotProps) {
  const expression = src ?? EXPRESSIONS[mood];

  return (
    <motion.div
      className={className}
      variants={bodyVariants}
      initial="idle"
      animate={mood}
      style={{ position: 'relative', width: size, aspectRatio: '1 / 1', userSelect: 'none', transformOrigin: '50% 92%' }}
      role="img"
      aria-label="Neura Academy cat mascot"
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={expression}
          src={expression}
          alt=""
          draggable={false}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </AnimatePresence>
    </motion.div>
  );
}
