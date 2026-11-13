import { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CANVAS, HEAD_PIVOT, LAYERS, type Layer } from './layers';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'wave';
type MascotProps = { mood?: MascotMood; size?: number; basePath?: string; className?: string };

type RigState = { head: number; bodyY: number; bodyScale: number; eyeX: number; eyeY: number; eyeScale: number };

const RIG: Record<MascotMood, RigState> = {
  idle: { head: 0, bodyY: 0, bodyScale: 1, eyeX: 0, eyeY: 0, eyeScale: 1 },
  happy: { head: -3, bodyY: -18, bodyScale: 1.045, eyeX: 0, eyeY: -3, eyeScale: 1.04 },
  sad: { head: 6, bodyY: 7, bodyScale: 0.985, eyeX: 0, eyeY: 5, eyeScale: 0.94 },
  thinking: { head: 5, bodyY: 0, bodyScale: 1, eyeX: -8, eyeY: -5, eyeScale: 1 },
  wave: { head: -4, bodyY: -8, bodyScale: 1.02, eyeX: 2, eyeY: -2, eyeScale: 1.02 },
};

const bodyV: Variants = {
  idle: { y: [0, -3, 0], scaleY: [1, 1.012, 1], transition: { repeat: Infinity, duration: 3.3, ease: 'easeInOut' } },
  happy: { y: [0, 7, -28, 0, -8, 0], scaleY: [1, 0.95, 1.05, 1], transition: { duration: 1.05, ease: 'easeOut' } },
  sad: { y: 8, scaleY: 0.985, transition: { duration: 0.55 } },
  thinking: { y: [0, -2, 0], transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } },
  wave: { y: [0, -8, 0], transition: { duration: 0.75, ease: 'easeOut' } },
};

const headV: Variants = {
  idle: { rotate: [-1, 1, -1], y: [0, -2, 0], transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' } },
  happy: { rotate: [0, -5, 4, -2, 0], y: [0, -5, 0], transition: { duration: 1.05, ease: 'easeOut' } },
  sad: { rotate: -6, y: 10, transition: { duration: 0.55 } },
  thinking: { rotate: [5, 8, 5], y: [0, -2, 0], transition: { repeat: Infinity, duration: 2.3, ease: 'easeInOut' } },
  wave: { rotate: [0, -7, 5, -4, 0], transition: { duration: 0.95, ease: 'easeInOut' } },
};

const tailV: Variants = {
  idle: { rotate: [-3, 4, -3], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } },
  happy: { rotate: [-7, 8, -6, 5, 0], transition: { duration: 1, ease: 'easeInOut' } },
  sad: { rotate: 5, y: 8, transition: { duration: 0.5 } },
  thinking: { rotate: [-2, 3, -2], transition: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' } },
  wave: { rotate: [-6, 7, -5, 0], transition: { duration: 0.9 } },
};

const tasselV: Variants = {
  idle: { rotate: [-4, 4, -4], transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' } },
  happy: { rotate: [-15, 13, -9, 7, 0], transition: { duration: 1.1, ease: 'easeOut' } },
  sad: { rotate: 4, transition: { duration: 0.5 } },
  thinking: { rotate: [-3, 3, -3], transition: { repeat: Infinity, duration: 3.6, ease: 'easeInOut' } },
  wave: { rotate: [-9, 9, -7, 0], transition: { duration: 1 } },
};

function useBlink() {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let openTimer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      openTimer = setTimeout(() => {
        setBlink(true);
        closeTimer = setTimeout(() => { setBlink(false); schedule(); }, 115);
      }, 2300 + Math.random() * 3000);
    };
    schedule();
    return () => { clearTimeout(openTimer); clearTimeout(closeTimer); };
  }, []);
  return blink;
}

function place(layer: Layer) {
  return { position: 'absolute' as const, left: `${layer.x / CANVAS.w * 100}%`, top: `${layer.y / CANVAS.h * 100}%`, width: `${layer.w / CANVAS.w * 100}%`, height: `${layer.h / CANVAS.h * 100}%` };
}
function pivot(layer: Layer) {
  return { originX: (((layer.px ?? layer.x + layer.w / 2) - layer.x) / layer.w), originY: (((layer.py ?? layer.y + layer.h / 2) - layer.y) / layer.h) };
}
const imageStyle = { width: '100%', height: '100%', display: 'block', pointerEvents: 'none' as const };

export default function Mascot({ mood = 'idle', size = 240, basePath = '/mascot/layers/', className }: MascotProps) {
  const blink = useBlink();
  const state = RIG[mood];
  const previousMood = useRef(mood);
  const isEnteringReaction = previousMood.current !== mood && mood !== 'idle';
  useEffect(() => { previousMood.current = mood; }, [mood]);

  return (
    <div className={className} role="img" aria-label="Neura Academy cat mascot" style={{ position: 'relative', width: size, aspectRatio: `${CANVAS.w} / ${CANVAS.h}`, userSelect: 'none' }}>
      <motion.div variants={bodyV} initial="idle" animate={mood} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 97%' }}>
        <motion.div variants={tailV} animate={mood} style={{ ...place(LAYERS.tail), ...pivot(LAYERS.tail) }}>
          <img src={`${basePath}${LAYERS.tail.file}`} alt="" draggable={false} style={imageStyle} />
        </motion.div>
        <div style={place(LAYERS.bodyOpen)}><img src={`${basePath}${LAYERS.bodyOpen.file}`} alt="" draggable={false} style={imageStyle} /></div>
        <div style={place(LAYERS.legs)}><img src={`${basePath}${LAYERS.legs.file}`} alt="" draggable={false} style={imageStyle} /></div>
        <motion.div variants={headV} animate={mood} style={{ position: 'absolute', inset: 0, originX: HEAD_PIVOT.x / CANVAS.w, originY: HEAD_PIVOT.y / CANVAS.h }}>
          <div style={place(LAYERS.head)}><img src={`${basePath}${LAYERS.head.file}`} alt="" draggable={false} style={imageStyle} /></div>
          <motion.div
            animate={{ x: state.eyeX, y: state.eyeY, scaleY: blink ? 0.08 : state.eyeScale }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, duration: isEnteringReaction ? 0.18 : 0.12 }}
            style={{ ...place(LAYERS.eyeL), ...pivot(LAYERS.eyeL) }}
          ><img src={`${basePath}${LAYERS.eyeL.file}`} alt="" draggable={false} style={imageStyle} /></motion.div>
          <motion.div
            animate={{ x: state.eyeX, y: state.eyeY, scaleY: blink ? 0.08 : state.eyeScale }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, duration: isEnteringReaction ? 0.18 : 0.12 }}
            style={{ ...place(LAYERS.eyeR), ...pivot(LAYERS.eyeR) }}
          ><img src={`${basePath}${LAYERS.eyeR.file}`} alt="" draggable={false} style={imageStyle} /></motion.div>
          <motion.div variants={tasselV} animate={mood} style={{ ...place(LAYERS.tassel), ...pivot(LAYERS.tassel) }}>
            <img src={`${basePath}${LAYERS.tassel.file}`} alt="" draggable={false} style={imageStyle} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
