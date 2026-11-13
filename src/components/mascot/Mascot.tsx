import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CANVAS, HEAD_PIVOT, LAYERS, type Layer } from './layers';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'wave';

type MascotProps = {
  mood?: MascotMood;
  size?: number; // প্রস্থ (px)
  basePath?: string;
  className?: string;
};

const loop = (duration: number) => ({
  repeat: Infinity,
  duration,
  ease: 'easeInOut' as const,
});

// পুরো শরীর: শ্বাস নেওয়া, লাফ, নুয়ে পড়া
const rootV: Variants = {
  idle: { y: 0, scaleX: 1, scaleY: [1, 1.012, 1], transition: loop(3.2) },
  happy: {
    y: [0, 5, -60, 0, -22, 0],
    scaleY: [1, 0.94, 1.06, 0.96, 1.02, 1],
    scaleX: [1, 1.04, 0.97, 1.03, 1, 1],
    transition: { duration: 1.1, ease: 'easeOut' },
  },
  sad: { y: 6, scaleX: 1, scaleY: 0.985, transition: { duration: 0.6 } },
  thinking: { y: 0, scaleX: 1, scaleY: [1, 1.01, 1], transition: loop(3.6) },
  wave: { y: [0, -14, 0], scaleX: 1, scaleY: 1, transition: { duration: 0.9 } },
};

// মাথা: ঘাড়ের কাছে ঘোরে
const headV: Variants = {
  idle: { rotate: [-1.5, 1.5, -1.5], y: [0, -3, 0], transition: loop(4.5) },
  happy: { rotate: [0, -7, 6, -4, 0], y: [0, -6, 0], transition: { duration: 1.1 } },
  sad: { rotate: -6, y: 12, transition: { duration: 0.7 } },
  thinking: { rotate: [5, 7, 5], y: 0, transition: loop(3) },
  wave: { rotate: [0, -6, 6, -6, 0], y: 0, transition: { duration: 1 } },
};

// লেজ (বেশি ঘোরালে গোড়ায় ফাঁক দেখা যায়, তাই ±৬° এর মধ্যে রাখা)
const tailV: Variants = {
  idle: { rotate: [-3, 4, -3], transition: loop(3) },
  happy: { rotate: [-6, 6, -6, 6, -5, 0], transition: { duration: 0.9 } },
  sad: { rotate: 4, transition: { duration: 0.6 } },
  thinking: { rotate: [-2, 3, -2], transition: loop(4) },
  wave: { rotate: [-5, 5, -5, 5, 0], transition: { duration: 1 } },
};

// ট্যাসেল
const tasselV: Variants = {
  idle: { rotate: [-3, 3, -3], transition: loop(3.4) },
  happy: { rotate: [-14, 12, -9, 6, -3, 0], transition: { duration: 1.1 } },
  sad: { rotate: 2, transition: { duration: 0.6 } },
  thinking: { rotate: [-2, 2, -2], transition: loop(4) },
  wave: { rotate: [-8, 8, -8, 0], transition: { duration: 1 } },
};

function placement(l: Layer) {
  return {
    position: 'absolute' as const,
    left: `${(l.x / CANVAS.w) * 100}%`,
    top: `${(l.y / CANVAS.h) * 100}%`,
    width: `${(l.w / CANVAS.w) * 100}%`,
    height: `${(l.h / CANVAS.h) * 100}%`,
  };
}

function origin(l: Layer) {
  return {
    originX: ((l.px ?? l.x + l.w / 2) - l.x) / l.w,
    originY: ((l.py ?? l.y + l.h / 2) - l.y) / l.h,
  };
}

const imgStyle = { width: '100%', height: '100%', display: 'block', pointerEvents: 'none' as const };

// মাঝে মাঝে পলক ফেলা
function useBlink() {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, 2200 + Math.random() * 3000);
    };
    schedule();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return blink;
}

export default function Mascot({
  mood = 'idle',
  size = 240,
  basePath = '/mascot/layers/',
  className,
}: MascotProps) {
  const blink = useBlink();
  const eyeScale = blink ? 0.08 : mood === 'happy' ? 0.6 : mood === 'sad' ? 0.88 : 1;
  const eyeAnim = { scaleY: eyeScale };
  const eyeTransition = { duration: 0.08 };

  const src = (l: Layer) => `${basePath}${l.file}`;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, aspectRatio: `${CANVAS.w} / ${CANVAS.h}` }}
      role="img"
      aria-label="Neura Academy mascot"
    >
      <motion.div
        style={{ position: 'absolute', inset: 0, originX: 0.5, originY: 0.97 }}
        variants={rootV}
        initial="idle"
        animate={mood}
      >
        {/* লেজ (শরীরের পেছনে) */}
        <motion.div style={{ ...placement(LAYERS.tail), ...origin(LAYERS.tail) }} variants={tailV}>
          <img src={src(LAYERS.tail)} alt="" draggable={false} style={imgStyle} />
        </motion.div>

        {/* শরীর */}
        <div style={placement(LAYERS.body)}>
          <img src={src(LAYERS.body)} alt="" draggable={false} style={imgStyle} />
        </div>

        {/* মাথা + চোখ + ট্যাসেল একসাথে ঘোরে */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            originX: HEAD_PIVOT.x / CANVAS.w,
            originY: HEAD_PIVOT.y / CANVAS.h,
          }}
          variants={headV}
        >
          <div style={placement(LAYERS.head)}>
            <img src={src(LAYERS.head)} alt="" draggable={false} style={imgStyle} />
          </div>

          <motion.div
            style={{ ...placement(LAYERS.eyeL), ...origin(LAYERS.eyeL) }}
            animate={eyeAnim}
            transition={eyeTransition}
          >
            <img src={src(LAYERS.eyeL)} alt="" draggable={false} style={imgStyle} />
          </motion.div>
          <motion.div
            style={{ ...placement(LAYERS.eyeR), ...origin(LAYERS.eyeR) }}
            animate={eyeAnim}
            transition={eyeTransition}
          >
            <img src={src(LAYERS.eyeR)} alt="" draggable={false} style={imgStyle} />
          </motion.div>

          <motion.div
            style={{ ...placement(LAYERS.tassel), ...origin(LAYERS.tassel) }}
            variants={tasselV}
          >
            <img src={src(LAYERS.tassel)} alt="" draggable={false} style={imgStyle} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
