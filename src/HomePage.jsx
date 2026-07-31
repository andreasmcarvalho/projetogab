import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Pause, Heart, Flame, Music2 } from 'lucide-react';

/* ============================================================
   PARA GABRIELA
   ============================================================ */

/* ---------- Assets (tudo em /public) ---------- */
const PEEP = [
  '/peep-1.webp',
  '/peep-2.webp',
  '/peep-3.webp',
  '/peep-4.webp',
  '/peep-5.webp',
];
const COVER = [
  '/cover-1.png',
  '/cover-2.png',
  '/cover-3.png',
  '/cover-4.png',
  '/cover-5.png',
  '/cover-6.png',
  '/cover-7.png',
];
const CAT_GIF = '/cat.gif';
const BONFIRE_GIF = '/bonfire.gif';
const KNIGHT_GIF = '/knight.gif';
const ROSE_PIXEL = '/rose.png';
const NOS_PIXEL = '/nos.png';
const STAR_PIXEL = '/star-pixel.png';
const HEART_PIXEL = '/heart-pixel.png';
const ENVELOPE_PIXEL = '/envelope.png';
const MOON_PIXEL = '/moon.png';

/* os cinco filhos, em pixel art */
const CAT_SPRITES = {
  Laranja: '/laranja.png',
  Zuck: '/zuck.png',
  Kira: '/kira.png',
  Pitica: '/pitica.png',
  Lua: '/lua.png',
};

/* ---------- Conteúdo ---------- */

/* Frases lentas do começo (antes das que já tínhamos).
   Cada uma tem seu tempo próprio em ms. */
const OPENING_PHRASES = [
  { text: 'Querida Gabriela...', hold: 3400 },
  { text: 'eu fiz isso...', hold: 3200 },
  { text: 'porque eu amo você.', hold: 4000 },
  { text: 'e queria que, por alguns minutos,', hold: 3600 },
  { text: 'você esquecesse um pouco do peso que carrega.', hold: 4600 },
];

/* As frases que já tínhamos — entram depois das de cima. */
const PHRASES = [
  'minha vida costumava ser apagada,',
  'nao vou mentir pra voce',
  'mas desde que voce chegou',
  'meu mundo se tornou mais...',
];

const FINAL_WORD = `colorido`;
const REST_MESSAGE = 'espero que voce ache descanso em mim, assim como eu achei em voce.';

/* Mensagem escondida no envelope. */
const LETTER_MESSAGE =
  'Sei que as coisas tem sido difíceis, mas quero que saiba que estou aqui para você. Te amo muito e sempre estarei ao seu lado. Mesmo que voce queira me afastar dos teus braços, jamais deixaria aquela que mudou meu mundo';

/* Uma dessas aparece no fecho, sorteada a cada visita. */
const CLOSING_LINES = [
  'que bom que você existe.',
  'voce eh especial pra mim.',
  'amo suas linhas.',
  'ainda que devagar, a gente floresce.',
  'obrigado por mais um dia com você.',
  'você já é o suficiente pra mim.',
];

/* Fogueiras-memória: cada uma guarda uma lembrança.
   Edite title e text à vontade — troque pelas memórias reais de vocês. */
const MEMORY_BONFIRES = [
  {
    title: 'oi',
    text: 'a primeira vez que a gente conversou. eu nem imaginava que aquilo ia virar tudo isso.',
  },
  {
    title: 'eu te amo',
    text: 'quando eu disse pela primeira vez. meu coração estava saindo pela boca. Quando eu ouvi de voce, foi como se o mundo inteiro tivesse parado por um instante.',
  },
  {
    title: 'a callzinha',
    text: 'a gente ficou horas na call. Se eu pudesse revivia esse momento pra sempre.',
  },
  {
    title: 'lol',
    text: 'lembro de todas as partidas e dias que a gnt ficou junto dando risada e estando lado a lado.',
  },
  {
    title: 'mamae',
    text: 'cada parte de mim te procura espero que voce seja minha por inteira pra sempre.',
  },
];

/* Os cinco filhos, com personalidade. */
const CATS = [
  { name: 'Laranja', purrs: ['oi mamae', 'eu amo voce', 'miau'] },
  { name: 'Zuck', purrs: ['nao me cutuca', 'grr', 'odeio o laranja'] },
  { name: 'Kira', purrs: ['te achei', 'mew', 'eu te amo'] },
  { name: 'Pitica', purrs: ['zzz...', 'que sono', 'mimir'] },
  { name: 'Lua', purrs: ['fica pertinho', 'te amo mamae', 'mew'] },
];

/* Coloque os arquivos .mp3 em /public e aponte o caminho no campo audio. */
const TRACKS = [
  { title: 'quando penso em voce', duration: '4:56', img: COVER[0], audio: '/musica-1.mp3' },
  { title: 'quando sinto tua falta', duration: '2:54', img: COVER[1], audio: '/musica-2.mp3' },
  { title: 'quando quero dizer que te amo', duration: '4:50', img: COVER[2], audio: '/musica-3.mp3' },
  { title: 'quando sinto medo de te perder', duration: '4:59', img: COVER[3], audio: '/musica-4.mp3' },
  { title: 'quando voce me toca', duration: '3:04', img: COVER[4], audio: '/musica-5.mp3' },
  { title: 'quando eu te olho', duration: '4:10', img: COVER[5], audio: '/musica-6.mp3' },
  { title: 'eu te amo', duration: '---', img: COVER[6], audio: '/musica-8.mp3' },
];

/* Música baixinha do céu final (a mesma The Moon Song). */
const FINALE_AUDIO = '/musica-7.mp3';

const PETAL_PALETTE = [
  '#FFFFFF', '#FFF6FA', '#FFD9E8', '#F7B7D3',
  '#E9A6F0', '#C9B6F7', '#A8C8FF', '#FFE2A8',
  '#FFC1A8', '#B8F0D8',
];
const CENTER_PALETTE = ['#FFD86B', '#FFC247', '#FFE9A8', '#F7F0D8'];

function seededRandom(seed) {
  let currentSeed = seed % 2147483647;
  if (currentSeed <= 0) currentSeed += 2147483646;
  return () => {
    currentSeed = (currentSeed * 16807) % 2147483647;
    return (currentSeed - 1) / 2147483646;
  };
}

/* ---------- Estilos ---------- */
const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@600;700&family=Press+Start+2P&display=swap');
html, body, #root { background: #000; }
body { margin: 0; font-family: 'Inter', sans-serif; overflow-x: clip; }
.font-gothic { font-family: 'Cinzel', serif; }
.font-serif-love { font-family: 'Cormorant Garamond', serif; }
.font-script { font-family: 'Dancing Script', cursive; }
.font-pixel { font-family: 'Press Start 2P', monospace; }
.text-colorful {
  background: linear-gradient(90deg,#ff2e88,#ff8a3d,#ffe14d,#4dff88,#3dc9ff,#b84dff,#ff2e88);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hue-slide 4s linear infinite;
}
@keyframes hue-slide { to { background-position: 300% 0; } }
@keyframes ember-rise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 0.9; }
  100% { transform: translateY(-120px) scale(0.2); opacity: 0; }
}
@keyframes pixel-flame {
  0%   { transform: scaleY(0.85) translateY(2px); }
  100% { transform: scaleY(1.15) translateY(-4px); }
}
@keyframes twinkle {
  0%, 100% { opacity: var(--dim, 0.25); }
  50%      { opacity: var(--bright, 0.75); }
}
@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.12); }
}
.grain-overlay::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.pixel-art {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
*:focus-visible { outline: 2px solid rgba(255,255,255,.8); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .text-colorful { animation: none; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

/* ---------- Imagem com fallback ---------- */
function SafeImage({ src, alt, className, style, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className={`${className} bg-white/[0.03]`} style={style} aria-label={alt} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      draggable={false}
      {...rest}
    />
  );
}

/* ---------- Rosa branca em pixel art ---------- */
function PixelRose({ size = 28, opacity = 1, className = '', style }) {
  return (
    <img
      src={ROSE_PIXEL}
      alt=""
      aria-hidden="true"
      className={`pixel-art select-none ${className}`}
      style={{ width: size, height: 'auto', opacity, ...style }}
      draggable={false}
    />
  );
}

/* ---------- Estrela pixelada ---------- */
function PixelStar({ size = 10, opacity = 1, className = '', style }) {
  return (
    <img
      src={STAR_PIXEL}
      alt=""
      aria-hidden="true"
      className={`pixel-art select-none ${className}`}
      style={{ width: size, height: 'auto', opacity, ...style }}
      draggable={false}
    />
  );
}

/* céu de fundo: estrelas piscando devagar + estrela cadente ocasional */
function StarField({ density = 34 }) {
  const stars = useMemo(() => {
    const rand = seededRandom(880022);
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 5 + rand() * 9,
      dim: 0.12 + rand() * 0.15,
      bright: 0.45 + rand() * 0.4,
      duration: 4 + rand() * 6,
      delay: rand() * 8,
    }));
  }, [density]);
  const [shooting, setShooting] = useState(null);
  useEffect(() => {
    let timeout;
    const schedule = () => {
      const wait = 14000 + Math.random() * 20000;
      timeout = setTimeout(() => {
        setShooting({
          id: Date.now(),
          top: 6 + Math.random() * 34,
          left: 12 + Math.random() * 55,
        });
        schedule();
      }, wait);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <img
          key={star.id}
          src={STAR_PIXEL}
          alt=""
          className="pixel-art absolute select-none"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: 'auto',
            '--dim': star.dim,
            '--bright': star.bright,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
          draggable={false}
        />
      ))}
      <AnimatePresence>
        {shooting && (
          <motion.div
            key={shooting.id}
            className="absolute"
            style={{ top: `${shooting.top}%`, left: `${shooting.left}%` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: 260, y: 150, opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 1.5, ease: 'easeIn', times: [0, 0.15, 0.7, 1] }}
            onAnimationComplete={() => setShooting(null)}
          >
            <div
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 0 8px 2px rgba(255,255,255,0.8)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 1,
                right: 1,
                width: 70,
                height: 1,
                transformOrigin: 'right center',
                transform: 'rotate(150deg)',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55))',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Flor SVG (usada só na espiral da intro) ---------- */
function Flower({ size = 40, petalColor, centerColor, petalCount = 6, rotation = 0 }) {
  const petals = [];
  const rx = size * 0.18;
  const ry = size * 0.37;
  const dist = size * 0.26;
  for (let i = 0; i < petalCount; i += 1) {
    petals.push(
      <ellipse
        key={i}
        cx="0"
        cy={-dist}
        rx={rx}
        ry={ry}
        fill={petalColor}
        transform={`rotate(${(360 / petalCount) * i})`}
        opacity="0.93"
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      style={{ transform: `rotate(${rotation}deg)`, display: 'block' }}
    >
      {petals}
      <circle cx="0" cy="0" r={size * 0.13} fill={centerColor} />
      <circle cx="0" cy="0" r={size * 0.07} fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}

/* ============================================================
   INTRO
   ============================================================ */
const SPIRAL_STEP_MS = 9;

function FlowerSpiral({ dims }) {
  const flowers = useMemo(() => {
    const rand = seededRandom(20260723);
    const cx = dims.w / 2;
    const cy = dims.h / 2;
    const maxR = Math.hypot(dims.w, dims.h) / 2 + 90;
    const turns = 5;
    const a = maxR / (turns * Math.PI * 2);
    const arcSpacing = 46;
    const out = [];
    let theta = 0.5;
    let count = 0;
    while (count < 900) {
      const r = a * theta;
      if (r > maxR) break;
      const progress = r / maxR;
      out.push({
        id: count,
        x: cx + Math.cos(theta) * r,
        y: cy + Math.sin(theta) * r,
        size: 34 + progress * 54 + rand() * 20,
        petalColor:
          rand() < 0.4
            ? PETAL_PALETTE[Math.floor(rand() * 2)]
            : PETAL_PALETTE[2 + Math.floor(rand() * (PETAL_PALETTE.length - 2))],
        centerColor: CENTER_PALETTE[Math.floor(rand() * CENTER_PALETTE.length)],
        petalCount: rand() < 0.3 ? 5 : rand() < 0.78 ? 6 : 8,
        rotation: (theta * 180) / Math.PI + rand() * 40,
        delay: (count * SPIRAL_STEP_MS) / 1000,
      });
      theta += arcSpacing / (a * theta);
      count += 1;
    }
    return out;
  }, [dims]);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute"
          style={{
            left: flower.x,
            top: flower.y,
            marginLeft: -flower.size / 2,
            marginTop: -flower.size / 2,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -120 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.4, transition: { duration: 1.2, delay: flower.delay * 0.3 } }}
          transition={{ duration: 0.52, delay: flower.delay, ease: [0.2, 0.85, 0.3, 1.1] }}
        >
          <Flower
            size={flower.size}
            petalColor={flower.petalColor}
            centerColor={flower.centerColor}
            petalCount={flower.petalCount}
            rotation={flower.rotation}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* A intro agora tem três fases de texto:
   1. OPENING_PHRASES (lentas, uma por vez, com tempo próprio de cada)
   2. PHRASES (as que já tínhamos)
   3. FINAL_WORD colorido → espiral → portas abrem */
function Intro({ onDone }) {
  /* fase: 'opening' | 'phrases' | 'final' */
  const [phase, setPhase] = useState('opening');
  const [idx, setIdx] = useState(0);
  const [flowers, setFlowers] = useState(false);
  const [fading, setFading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [dims, setDims] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* avança as frases de abertura (cada uma com seu próprio tempo) */
  useEffect(() => {
    if (phase !== 'opening') return undefined;
    const hold = OPENING_PHRASES[idx].hold;
    const timer = setTimeout(() => {
      if (idx < OPENING_PHRASES.length - 1) {
        setIdx((i) => i + 1);
      } else {
        setPhase('phrases');
        setIdx(0);
      }
    }, hold);
    return () => clearTimeout(timer);
  }, [phase, idx]);

  /* avança as frases antigas (ritmo constante) */
  useEffect(() => {
    if (phase !== 'phrases') return undefined;
    const timer = setTimeout(() => {
      if (idx < PHRASES.length - 1) {
        setIdx((i) => i + 1);
      } else {
        setPhase('final');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase, idx]);

  /* fase final: palavra colorida → espiral → some → portas */
  useEffect(() => {
    if (phase !== 'final') return undefined;
    const t1 = setTimeout(() => setFlowers(true), 1100);
    const t2 = setTimeout(() => setFading(true), 6200);
    const t3 = setTimeout(() => setOpening(true), 7600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  const currentText =
    phase === 'opening'
      ? OPENING_PHRASES[idx].text
      : phase === 'phrases'
      ? PHRASES[idx]
      : null;

  return (
    <motion.div className="fixed inset-0 z-50" style={{ perspective: 1200 }}>
      <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
        <AnimatePresence>{flowers && !fading && <FlowerSpiral dims={dims} />}</AnimatePresence>
        <AnimatePresence mode="wait">
          {phase !== 'final' ? (
            <motion.h1
              key={`${phase}-${idx}`}
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -26, filter: 'blur(8px)' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="font-serif-love relative z-30 max-w-4xl text-center text-3xl leading-tight text-white/95 sm:text-5xl"
            >
              {currentText}
            </motion.h1>
          ) : (
            <motion.h1
              key="final"
              initial={{ opacity: 0, scale: 0.86, filter: 'blur(14px)' }}
              animate={{ opacity: opening ? 0 : 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease: [0.16, 0.9, 0.3, 1] }}
              className="font-serif-love relative z-30 text-center text-6xl font-semibold sm:text-8xl"
            >
              <span className="text-colorful">{FINAL_WORD}</span>
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="absolute inset-y-0 left-0 z-20 w-1/2 bg-black"
        animate={{ x: opening ? '-100%' : '0%' }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: opening ? 0.4 : 0 }}
        onAnimationComplete={() => {
          if (opening) onDone();
        }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 z-20 w-1/2 bg-black"
        animate={{ x: opening ? '100%' : '0%' }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: opening ? 0.4 : 0 }}
      />
    </motion.div>
  );
}

/* ---------- Reveal ---------- */
function Reveal({ children, className = '', delay = 0, y = 40 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Barra de progresso ---------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[45] h-[2px] w-full origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg,#ff2e88,#b84dff,#3dc9ff,#4dff88)',
      }}
    />
  );
}

/* ---------- Linha da playlist ---------- */
function TrackRow({ track, index, playing, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
    >
      <div className="group flex items-center gap-4 rounded-md px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
        <div className="w-5 shrink-0 text-center text-sm text-white/40">
          {playing ? (
            <button
              type="button"
              onClick={() => onToggle(index)}
              className="flex h-4 w-full items-end justify-center gap-[2px]"
              aria-label={`Pausar ${track.title}`}
            >
              {[0, 1, 2].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-[2px] bg-emerald-400"
                  animate={{ height: [4, 14, 6, 12, 4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: bar * 0.15 }}
                />
              ))}
            </button>
          ) : (
            <>
              <span className="group-hover:hidden">{index + 1}</span>
              <button
                type="button"
                onClick={() => onToggle(index)}
                className="hidden group-hover:block"
                aria-label={`Tocar ${track.title}`}
              >
                <Play className="mx-auto h-4 w-4 fill-white text-white" />
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => onToggle(index)}
          className="group/cover relative shrink-0"
          aria-label={playing ? `Pausar ${track.title}` : `Tocar ${track.title}`}
        >
          <SafeImage
            src={track.img}
            alt={track.title}
            className="h-12 w-12 rounded object-cover grayscale"
          />
          <span
            className={`absolute inset-0 flex items-center justify-center rounded bg-black/40 transition-opacity ${
              playing ? 'opacity-100' : 'opacity-0 group-hover/cover:opacity-100'
            }`}
          >
            {playing ? (
              <Pause className="h-5 w-5 fill-white text-white" />
            ) : (
              <Play className="h-5 w-5 fill-white text-white" />
            )}
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[15px] font-medium ${playing ? 'text-emerald-400' : 'text-white'}`}>
            {track.title}
          </p>
          <p className="truncate text-[13px] text-white/50">andreas</p>
        </div>
        <p className="hidden truncate text-[13px] text-white/40 sm:block">{track.album}</p>
        <Heart className="hidden h-4 w-4 shrink-0 text-white/30 transition-colors hover:text-white sm:block" />
        <span className="w-10 shrink-0 text-right text-[13px] text-white/40">{track.duration}</span>
      </div>
    </motion.div>
  );
}

/* ---------- Bonfire principal: escurece a tela, silêncio, depois a mensagem ---------- */
function BonfireRitual({ onClose }) {
  /* etapas: 'dark' (só fogueira, silêncio ~2s) → 'message' → fecha sozinho */
  const [stage, setStage] = useState('dark');

  useEffect(() => {
    const toMessage = setTimeout(() => setStage('message'), 2200);
    const done = setTimeout(() => onClose(), 8500);
    return () => {
      clearTimeout(toMessage);
      clearTimeout(done);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* escuridão total */}
      <div className="absolute inset-0 bg-black" />

      {/* halo de luz da fogueira */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 620,
          height: 620,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,160,70,0.22) 0%, rgba(255,130,50,0.08) 40%, transparent 70%)',
        }}
        animate={{ opacity: [0.7, 1, 0.8, 1, 0.7], scale: [1, 1.05, 0.98, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* a fogueira, acesa e brilhante */}
      <img
        src={BONFIRE_GIF}
        alt=""
        className="pixel-art relative z-10 h-52 w-auto select-none sm:h-64"
        style={{ filter: 'brightness(1.25) drop-shadow(0 0 40px rgba(255,150,60,0.85))' }}
        draggable={false}
      />

      {/* brasas subindo */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-orange-200/70"
          style={{
            left: `${44 + (i % 7) * 2}%`,
            bottom: '38%',
            animation: `ember-rise ${3 + (i % 4)}s linear ${i * 0.35}s infinite`,
          }}
        />
      ))}

      {/* a mensagem, só depois do silêncio */}
      <AnimatePresence>
        {stage === 'message' && (
          <motion.p
            className="font-serif-love relative z-10 mt-12 max-w-xl px-6 text-center text-2xl italic text-white/90 sm:text-3xl"
            style={{ textShadow: '0 0 24px rgba(255,180,90,0.5)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 0.9, 0.3, 1] }}
          >
            {REST_MESSAGE}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- Fogueira-memória (checkpoint) ---------- */
function MemoryBonfire({ memory, side, onOpen }) {
  const [lit, setLit] = useState(false);

  const handleClick = () => {
    setLit(true);
    onOpen(memory);
  };

  return (
    <div
      className={`flex w-full ${side === 'left' ? 'justify-start pl-4 sm:pl-16' : 'justify-end pr-4 sm:pr-16'}`}
    >
      <Reveal>
        <button
          type="button"
          onClick={handleClick}
          className="group flex flex-col items-center gap-2 focus:outline-none"
          aria-label={`Acender: ${memory.title}`}
        >
          <div className="relative">
            {/* halo quando acesa */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 140,
                height: 140,
                background:
                  'radial-gradient(circle, rgba(255,160,70,0.25), transparent 68%)',
              }}
              animate={lit ? { opacity: [0.6, 1, 0.7, 1, 0.6] } : { opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img
              src={BONFIRE_GIF}
              alt=""
              className="pixel-art relative h-16 w-auto select-none transition-all duration-700 sm:h-20"
              style={{
                filter: lit
                  ? 'brightness(1.25) drop-shadow(0 0 20px rgba(255,150,60,0.75))'
                  : 'brightness(0.4) saturate(0.35)',
              }}
              draggable={false}
            />
          </div>
          <span
            className={`font-pixel text-[8px] lowercase tracking-wide transition-colors sm:text-[9px] ${
              lit ? 'text-amber-200/80' : 'text-white/30 group-hover:text-white/55'
            }`}
          >
            {memory.title}
          </span>
        </button>
      </Reveal>
    </div>
  );
}

/* trilha de fogueiras-memória em zigue-zague */
function MemoryTrail({ onOpen }) {
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <div className="mb-16 flex items-center justify-center gap-4">
          <PixelStar size={12} opacity={0.5} />
          <p className="text-center text-[11px] uppercase tracking-[0.5em] text-white/40">
            nossas fogueiras
          </p>
          <PixelStar size={12} opacity={0.5} />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-16 text-center text-sm text-white/40">
          cada uma guarda uma lembrança nossa. acenda pra lembrar comigo.
        </p>
      </Reveal>

      <div className="flex flex-col gap-16">
        {MEMORY_BONFIRES.map((memory, i) => (
          <MemoryBonfire
            key={memory.title}
            memory={memory}
            side={i % 2 === 0 ? 'left' : 'right'}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

/* janela que abre a lembrança */
function MemoryModal({ memory, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[75] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 max-w-md rounded-lg border border-amber-200/20 bg-[#0c0b12] p-8 text-center"
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 0.9, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={BONFIRE_GIF}
          alt=""
          className="pixel-art mx-auto mb-6 h-20 w-auto select-none"
          style={{ filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(255,150,60,0.7))' }}
          draggable={false}
        />
        <p className="font-pixel mb-5 text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
          {memory.title}
        </p>
        <p className="font-serif-love text-2xl leading-relaxed text-white/90">
          {memory.text}
        </p>
        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/30">
          toque para fechar
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Nossos filhos (os cinco gatos com personalidade) ---------- */

/* base de um gato clicável com falinha */
/* base de um gato clicável com falinha */
function CatBase({ cat, onPet, style }) {
  const [say, setSay] = useState(null);
  const [poke, setPoke] = useState(0);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const pet = useCallback(() => {
    clearTimers();
    const line = cat.purrs[Math.floor(Math.random() * cat.purrs.length)];
    setSay(line);
    setPoke((p) => p + 1);
    if (onPet) onPet();
    timers.current.push(setTimeout(() => setSay(null), 1600));
  }, [cat, onPet]);

  useEffect(() => clearTimers, []);

  return (
    <button
      type="button"
      onClick={pet}
      className="group relative flex flex-col items-center gap-2 focus:outline-none"
      aria-label={`Fazer carinho em ${cat.name}`}
      style={style}
    >
      <div className="relative flex h-24 w-20 items-end justify-center">
        <AnimatePresence>
          {say && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="font-pixel absolute -top-6 z-20 whitespace-nowrap text-[8px] lowercase text-white/80"
              style={{ textShadow: '0 0 8px rgba(180,200,255,0.6), 0 2px 4px rgba(0,0,0,0.9)' }}
            >
              {say}
            </motion.span>
          )}
        </AnimatePresence>
        <motion.img
          key={poke}
          src={CAT_SPRITES[cat.name]}
          alt={cat.name}
          className="pixel-art w-16 select-none"
          draggable={false}
          animate={poke ? { y: [0, -8, 0] } : {}}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      <span className="font-pixel text-[9px] lowercase tracking-wide text-white/45 transition-colors group-hover:text-white/75">
        {cat.name.toLowerCase()}
      </span>
    </button>
  );
}

/* Pitica — dorme (respira devagar, fala de sono) */
function CatPitica({ cat, onPet }) {
  return (
    <CatBase
      cat={cat}
      onPet={onPet}
      extraAnimate={{ scale: [1, 1.02, 1], rotate: [0, 1, 0] }}
      extraTransition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* Zuck — fica bravo: treme rápido ao clicar */
function CatZuck({ cat, onPet }) {
  const [angry, setAngry] = useState(0);
  const handlePet = useCallback(() => {
    setAngry((a) => a + 1);
    if (onPet) onPet();
  }, [onPet]);
  return (
    <motion.div
      key={angry}
      animate={angry ? { x: [0, -3, 3, -2, 2, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <CatBase cat={cat} onPet={handlePet} />
    </motion.div>
  );
}

/* Laranja — corre pela largura da seção */
function CatLaranja({ cat, onPet }) {
  return (
    <motion.div
      animate={{ x: [0, 40, -40, 20, 0], y: [0, -6, 0, -4, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <CatBase cat={cat} onPet={onPet} />
    </motion.div>
  );
}

/* Kira — segue o mouse de leve */
function CatKira({ cat, onPet }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const max = 10;
      setOffset({
        x: (dx / dist) * Math.min(max, dist / 20),
        y: (dy / dist) * Math.min(max, dist / 20),
      });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <motion.div ref={ref} animate={{ x: offset.x, y: offset.y }} transition={{ type: 'spring', stiffness: 60, damping: 12 }}>
      <CatBase cat={cat} onPet={onPet} />
    </motion.div>
  );
}

/* Lua — fica sempre perto (gravita de volta pro centro, devagar) */
function CatLua({ cat, onPet }) {
  return (
    <motion.div
      animate={{ x: [0, 8, -6, 4, 0], y: [0, -3, 2, -2, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      <CatBase cat={cat} onPet={onPet} />
    </motion.div>
  );
}

const CAT_COMPONENTS = {
  Laranja: CatBase,
  Zuck: CatZuck,
  Kira: CatBase,
  Pitica: CatBase,
  Lua: CatBase,
};

/* ---------- Chuva de corações ao encher o carinho ---------- */
function HeartBurst() {
  const hearts = useMemo(() => {
    const rand = seededRandom(Date.now() % 100000);
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: 8 + rand() * 84,
      size: 12 + rand() * 16,
      delay: rand() * 0.6,
      duration: 2.2 + rand() * 1.4,
      drift: (rand() - 0.5) * 60,
    }));
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <motion.img
          key={h.id}
          src={HEART_PIXEL}
          alt=""
          className="pixel-art absolute bottom-0 select-none"
          style={{ left: `${h.left}%`, width: h.size }}
          draggable={false}
          initial={{ y: 20, x: 0, opacity: 0, scale: 0.6 }}
          animate={{ y: -260, x: h.drift, opacity: [0, 1, 1, 0], scale: 1 }}
          transition={{ duration: h.duration, delay: h.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function CatGarden() {
  const [pets, setPets] = useState(0);
  const addPet = useCallback(() => setPets((p) => Math.min(p + 1, 999)), []);
  const target = 25;
  const fill = Math.min(pets / target, 1);
  const full = fill >= 1;
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (full) {
      setBurst(true);
      const t = setTimeout(() => setBurst(false), 4000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [full]);

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <div className="mb-3 flex items-center justify-center gap-4">
          <PixelStar size={12} opacity={0.5} />
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/40">
            todos os nossos filhos
          </p>
          <PixelStar size={12} opacity={0.5} />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-12 text-center text-sm text-white/40">
          eles querem um carinho seu, se vc clicar neles faz carinho KKKK
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10">
          {CATS.map((cat) => {
            const Comp = CAT_COMPONENTS[cat.name] || CatBase;
            return <Comp key={cat.name} cat={cat} onPet={addPet} />;
          })}
        </div>
      </Reveal>
      <AnimatePresence>{burst && <HeartBurst />}</AnimatePresence>
      <Reveal delay={0.25}>
        <div className="mx-auto mt-14 max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#f7b7d3,#e9a6f0,#a8c8ff)' }}
              animate={{ width: `${fill * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <AnimatePresence>
            {full && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif-love mt-4 text-center text-lg italic text-white/70"
              >
                todos eles disseram que voce é a melhor mãe do mundo!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Envelope escondido com uma mensagem ---------- */
function HiddenLetter() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex flex-col items-center gap-2 focus:outline-none"
        aria-label="Abrir a carta escondida"
      >
        <motion.img
          src={ENVELOPE_PIXEL}
          alt=""
          className="pixel-art w-10 select-none opacity-70 transition-opacity group-hover:opacity-100"
          draggable={false}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/30">para você</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 max-w-md rounded-lg border border-white/10 bg-[#0c0b12] p-8 text-center"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 0.9, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={ENVELOPE_PIXEL}
                alt=""
                className="pixel-art mx-auto mb-6 w-14 select-none"
                draggable={false}
              />
              <p className="font-serif-love text-2xl leading-relaxed text-white/90">
                {LETTER_MESSAGE}
              </p>
              <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-white/30">
                toque para fechar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Save Point (Dark Souls) ---------- */
function SavePoint() {
  return (
    <section className="relative z-10 flex flex-col items-center px-6 py-28">
      <Reveal>
        <div className="relative flex flex-col items-center">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 320,
              height: 320,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,180,90,0.14) 0%, rgba(255,150,60,0.06) 45%, transparent 72%)',
            }}
          />
          <motion.div
            className="relative mb-6 h-16 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(to top, rgba(255,190,110,0.9), transparent)',
              boxShadow: '0 0 20px rgba(255,170,80,0.6)',
            }}
            animate={{ scaleY: [1, 1.18, 0.95, 1.1, 1], opacity: [0.7, 1, 0.8, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="relative mb-2 text-[11px] uppercase tracking-[0.5em] text-amber-200/60">
            sempre que voce se sentir sozinha, lembra que a chama está acesa.
          </p>
          <p className="font-serif-love relative max-w-md text-center text-2xl italic text-white/80 sm:text-3xl">
            voce pode descansar em mim.
            <br />
            nao vou fugir de voce jamais.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Coração pixelado pulsando ---------- */
function PixelHeart({ size = 44 }) {
  return (
    <img
      src={HEART_PIXEL}
      alt=""
      aria-hidden="true"
      className="pixel-art select-none"
      style={{
        width: size,
        height: 'auto',
        animation: 'heart-beat 2.6s ease-in-out infinite',
        filter: 'drop-shadow(0 0 10px rgba(240,200,220,0.35))',
      }}
      draggable={false}
    />
  );
}

/* ---------- Vagalumes ocasionais ---------- */
function Fireflies({ count = 7 }) {
  const flies = useMemo(() => {
    const rand = seededRandom(424242);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 8 + rand() * 84,
      bottom: rand() * 30,
      size: 3 + rand() * 3,
      duration: 14 + rand() * 12,
      delay: rand() * 12,
      driftX: (rand() - 0.5) * 80,
    }));
  }, [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[12] overflow-hidden" aria-hidden="true">
      {flies.map((fly) => (
        <motion.span
          key={fly.id}
          className="absolute rounded-full"
          style={{
            left: `${fly.left}%`,
            bottom: `${fly.bottom}%`,
            width: fly.size,
            height: fly.size,
            background: '#f7e9a8',
            boxShadow: '0 0 8px 2px rgba(247,233,168,0.7)',
          }}
          animate={{
            y: [0, -120, -60, -180],
            x: [0, fly.driftX, -fly.driftX * 0.5, fly.driftX * 0.3],
            opacity: [0, 0.8, 0.3, 0.8, 0],
          }}
          transition={{ duration: fly.duration, delay: fly.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   CÉU FINAL — depois de tudo
   céu enorme, lua, música baixinha, estrela crescendo, silêncio
   ============================================================ */
/* ============================================================
   CÉU FINAL — depois de tudo
   céu enorme, lua crescendo, música baixinha, frases que somem, silêncio
   ============================================================ */
function NightSky({ onEnter }) {
  const ref = useRef(null);
  const audioRef = useRef(null);
  const inView = useRef(false);

  const [entered, setEntered] = useState(false);
  const [growMoon, setGrowMoon] = useState(false);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [signName, setSignName] = useState(false);

  const stars = useMemo(() => {
    const rand = seededRandom(70707);
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 4 + rand() * 8,
      dim: 0.1 + rand() * 0.15,
      bright: 0.5 + rand() * 0.4,
      duration: 4 + rand() * 6,
      delay: rand() * 8,
    }));
  }, []);

  const fadeAudio = useCallback((audio, to, ms) => {
    if (!audio) return;
    const steps = 20;
    const from = audio.volume;
    const stepTime = ms / steps;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      const v = from + (to - from) * (i / steps);
      audio.volume = Math.min(1, Math.max(0, v));
      if (i >= steps) {
        clearInterval(iv);
        if (to === 0) audio.pause();
      }
    }, stepTime);
  }, []);

  /* dispara a sequência quando o céu entra na visão */
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !inView.current) {
            inView.current = true;
            setEntered(true);
            /* manda parar a playlist de cima */
            if (onEnter) onEnter();
            /* toca a música do fim com fade-in */
            if (audioRef.current) {
              audioRef.current.volume = 0;
              const attempt = audioRef.current.play();
              if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
              fadeAudio(audioRef.current, 0.25, 1500);
            }
            /* sequência de tempos */
            setTimeout(() => setGrowMoon(true), 1200);
            /* frase 1: aparece, fica, some */
            setTimeout(() => setLine1(true), 4200);
            setTimeout(() => setLine1(false), 8200);
            /* frase 2: aparece, fica, some */
            setTimeout(() => setLine2(true), 9000);
            setTimeout(() => setLine2(false), 13000);
            setTimeout(() => setLine3(true), 13800);
            setTimeout(() => setLine3(false), 17800);
            /* obrigado: aparece e fica pra sempre */
            setTimeout(() => setThanks(true), 18600);
            setTimeout(() => setSignName(true), 20600);
            
          } else if (!entry.isIntersecting && inView.current) {
            inView.current = false;
            /* fade-out ao sair */
            if (audioRef.current) fadeAudio(audioRef.current, 0, 800);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onEnter, fadeAudio]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 py-32"
    >
      <audio ref={audioRef} src={FINALE_AUDIO} loop preload="none" />

      {/* estrelas do céu final */}
      {stars.map((star) => (
        <img
          key={star.id}
          src={STAR_PIXEL}
          alt=""
          className="pixel-art absolute select-none"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: 'auto',
            '--dim': star.dim,
            '--bright': star.bright,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
          draggable={false}
        />
      ))}

      {/* a lua que cresce, no centro */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.img
          src={MOON_PIXEL}
          alt=""
          className="pixel-art select-none"
          draggable={false}
          initial={{ width: 20, opacity: 0 }}
          animate={growMoon ? { width: 150, opacity: 1 } : { width: 20, opacity: 0.3 }}
          transition={{ duration: 4, ease: [0.16, 0.9, 0.3, 1] }}
          style={{ filter: 'drop-shadow(0 0 28px rgba(240,235,220,0.55))' }}
        />

        {/* as duas frases, aparecem e somem */}
        <div className="mt-14 min-h-[9rem] max-w-2xl text-center">
          <AnimatePresence mode="wait">
            {line1 && (
              <motion.p
                key="l1"
                className="font-serif-love text-2xl leading-relaxed text-white/85 sm:text-3xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              >
                mesmo quando você acha que está sozinha...
              </motion.p>
            )}
            {line2 && (
              <motion.p
                key="l2"
                className="font-serif-love text-2xl leading-relaxed text-white/90 sm:text-3xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              >
                eu continuo aqui.
              </motion.p>
            )}
            {line3 && (
              <motion.p
                key="l3"
                className="font-serif-love text-2xl leading-relaxed text-white/90 sm:text-3xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              >
                obrigado por existir.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* o obrigado — aparece e fica pra sempre */}
        <AnimatePresence>
          {thanks && (
            <motion.p
              key="thanks"
              className="font-pixel mt-16 text-[9px] lowercase tracking-[0.3em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
            >
              COM AMOR,
              <AnimatePresence>
                {signName && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 3.5, ease: 'easeOut' }}
                  >
                    {' '}ANDREAS.
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------- Conteúdo principal ---------- */
function MainContent() {
  const [playing, setPlaying] = useState(null);
  const [ritual, setRitual] = useState(false);
  const [litOnce, setLitOnce] = useState(false);
  const [openMemory, setOpenMemory] = useState(null);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);

  const closingLine = useMemo(
    () => CLOSING_LINES[Math.floor(Math.random() * CLOSING_LINES.length)],
    []
  );

  const toggleTrack = useCallback(
    (index) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing === index) {
        audio.pause();
        setPlaying(null);
        return;
      }
      audio.src = TRACKS[index].audio;
      const attempt = audio.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => setPlaying(null));
      }
      setPlaying(index);
    },
    [playing]
  );

/* para a playlist de cima (usado quando chega no céu final) */
  const stopPlaylist = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      /* fade-out rápido antes de pausar */
      const from = audio.volume;
      let i = 0;
      const iv = setInterval(() => {
        i += 1;
        audio.volume = Math.max(0, from * (1 - i / 15));
        if (i >= 15) {
          clearInterval(iv);
          audio.pause();
          audio.volume = 1;
          setPlaying(null);
        }
      }, 40);
    }
  }, []);

  const lightBonfire = useCallback(() => {
    setLitOnce(true);
    setRitual(true);
  }, []);

  return (
    <div className="grain-overlay relative bg-black text-white">
      <ScrollProgress />
      <StarField density={34} />
      <Fireflies count={7} />

      <audio
        ref={audioRef}
        onEnded={() => setPlaying(null)}
        onPause={() => {
          const audio = audioRef.current;
          if (audio && audio.ended) setPlaying(null);
        }}
      />

      {/* ritual da fogueira principal */}
      <AnimatePresence>
        {ritual && <BonfireRitual onClose={() => setRitual(false)} />}
      </AnimatePresence>

      {/* janela de memória das fogueiras-checkpoint */}
      <AnimatePresence>
        {openMemory && (
          <MemoryModal memory={openMemory} onClose={() => setOpenMemory(null)} />
        )}
      </AnimatePresence>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <SafeImage
            src={CAT_GIF}
            alt=""
            className="pixel-art h-auto w-[min(70vw,520px)] opacity-[0.13] grayscale"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="relative z-10 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-gothic mb-4 text-xs uppercase tracking-[0.5em] text-white/50"
          >
            querida gabriela
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="font-serif-love text-5xl leading-none sm:text-8xl"
          >
            fiz tudo isso pra voce. <br />
            espero que goste.
            <br />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="font-serif-love mx-auto mt-6 max-w-xl text-lg italic text-white/70"
          >
            que eu consiga pelo menos te fazer sentir amor enquanto voce olha tudo isso, sei que nao vai ser suficiente,
            mas espero que te faça sentir um pouco do que eu sinto por voce.
          </motion.p>
        </div>
      </section>

      {/* CARTA — agora em pequenos parágrafos, com respiro */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-32 text-center">
        <Reveal>
          <div className="mb-8 flex items-center justify-center gap-4">
            <Heart className="h-8 w-8 text-white" strokeWidth={1} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-serif-love text-3xl leading-relaxed text-white/90 sm:text-4xl">
            Desde a primeira vez que eu te olhei,
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="font-serif-love mt-6 text-3xl leading-relaxed text-white/90 sm:text-4xl">
            lembro bem da sensação que eu senti.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="font-serif-love mt-6 text-3xl leading-relaxed text-white/90 sm:text-4xl">
            e desde então, tudo mudou.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="font-serif-love mt-10 text-3xl leading-relaxed text-white/90 sm:text-4xl">
            voce faz meu estomago borbulhar,
            <br />
            meu coração bater mais forte,
            <br />
            e minha vida ficar mais feliz.
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <p className="font-serif-love mt-10 text-3xl leading-relaxed text-white/90 sm:text-4xl">
            minha vida se tornou realmente mais{' '}
            <span className="text-colorful font-semibold">colorida</span> por sua causa.
          </p>
        </Reveal>

        <Reveal delay={0.6}>
          <p className="font-script mt-12 text-4xl text-white/70">pra sempre seu, mamãe</p>
        </Reveal>
      </section>

      {/* PLAYLIST */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-10 flex items-center gap-4">
            <Music2 className="h-7 w-7 text-emerald-400" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">meus sentimentos em forma de </p>
              <h2 className="font-gothic text-4xl sm:text-5xl">musica</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2.2fr_1fr]">
            <div className="hidden flex-col gap-6 lg:flex">
              {[PEEP[0], PEEP[2]].map((src, i) => (
                <Reveal key={src} delay={i * 0.1} className="overflow-hidden rounded-xl">
                  <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}>
                    <SafeImage
                      src={src}
                      alt="Lil Peep"
                      className="aspect-[3/4] w-full object-cover grayscale"
                    />
                  </motion.div>
                </Reveal>
              ))}
            </div>
            <Reveal
              delay={0.1}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-4 sm:p-6"
            >
              <div className="mb-3 flex items-center gap-4 border-b border-white/10 px-3 pb-4">
                <SafeImage
                  src={PEEP[1]}
                  alt="Capa"
                  className="h-20 w-20 rounded object-cover grayscale shadow-lg"
                />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/40">essas musicas me fazem lembrar de voce minha gatinha</p>
                  <p className="font-gothic text-2xl">Exatamente </p>
                  <p className="text-[13px] text-white/50">{TRACKS.length} songs</p>
                </div>
              </div>
              <div className="mb-2 hidden grid-cols-[20px_48px_1fr_auto_16px_40px] items-center gap-4 px-3 text-[11px] uppercase tracking-wider text-white/30 sm:grid">
                <span>#</span>
                <span />
                <span>Titulo</span>
                <span />
                <span className="text-right">Tempo</span>
              </div>
              {TRACKS.map((track, i) => (
                <TrackRow
                  key={track.title}
                  track={track}
                  index={i}
                  playing={playing === i}
                  onToggle={toggleTrack}
                />
              ))}
            </Reveal>
            <div className="hidden flex-col gap-6 lg:flex">
              {[PEEP[3], PEEP[4]].map((src, i) => (
                <Reveal key={src} delay={i * 0.1} className="overflow-hidden rounded-xl">
                  <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}>
                    <SafeImage
                      src={src}
                      alt="Lil Peep"
                      className="aspect-[3/4] w-full object-cover grayscale"
                    />
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-8 flex gap-4 overflow-x-auto lg:hidden">
            {PEEP.map((src) => (
              <SafeImage
                key={src}
                src={src}
                alt="Lil Peep"
                className="h-32 w-28 shrink-0 rounded-lg object-cover grayscale"
              />
            ))}
          </div>
        </div>
      </section>

      {/* DARK SOULS */}
      <section className="relative z-10 overflow-hidden py-28">
        <div className="absolute inset-0 bg-black/70" />
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-0 h-1 w-1 rounded-full bg-orange-200/70"
            style={{
              left: `${(i * 7 + 5) % 100}%`,
              animation: `ember-rise ${4 + (i % 4)}s linear ${i * 0.4}s infinite`,
            }}
          />
        ))}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <Flame className="mx-auto mb-6 h-9 w-9 text-orange-300" strokeWidth={1.4} />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-3 text-xs uppercase tracking-[0.5em] text-white/40"></p>
            <h2 className="font-gothic text-4xl leading-tight sm:text-6xl">
              como a bonfire do dark souls, voce me faz queimar por dentro e se sentir seguro.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-serif-love mx-auto mt-6 max-w-2xl text-lg italic text-white/70">
              Não importa o quão escuro os dias fiquem, descansar do seu lado é
              como acender uma dessas depois de ser humilhado em alguma area no ds KKK. Você é a chama que eu acendo de novo e de novo.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-16">
            <div className="mx-auto flex max-w-xl items-end justify-center gap-6 sm:gap-12">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SafeImage
                  src={KNIGHT_GIF}
                  alt="Cavaleiro sentado, pixel art"
                  className="pixel-art h-32 w-auto select-none object-contain sm:h-52"
                />
              </motion.div>
              <button
                type="button"
                onClick={lightBonfire}
                className="relative shrink-0 cursor-pointer focus:outline-none"
                aria-label="Acender a fogueira"
              >
                <SafeImage
                  src={BONFIRE_GIF}
                  alt="Fogueira, pixel art"
                  className="pixel-art h-28 w-auto select-none object-contain transition-all duration-700 sm:h-44"
                  style={{
                    filter: litOnce
                      ? 'brightness(1.2) drop-shadow(0 0 26px rgba(255,150,60,0.75))'
                      : 'brightness(0.72) saturate(0.5)',
                  }}
                />
              </button>
            </div>
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.4em] text-white/40">
              {litOnce ? '' : 'Toque na fogueira'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FOGUEIRAS-MEMÓRIA (checkpoints) */}
      <MemoryTrail onOpen={setOpenMemory} />

      {/* SAVE POINT */}
      <SavePoint />

      {/* NOSSOS FILHOS */}
      <CatGarden />

      {/* NÓS */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-28">
        <Reveal>
          <div className="mb-14 flex items-center justify-center gap-5">
            <PixelRose size={20} opacity={0.55} />
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/40">nós</p>
            <PixelRose size={20} opacity={0.55} />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative flex flex-col items-center">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'min(90vw, 620px)',
                height: 'min(90vw, 620px)',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,46,136,0.10) 0%, rgba(184,77,255,0.07) 40%, transparent 70%)',
              }}
            />
            <motion.img
              src={NOS_PIXEL}
              alt="Nós dois e os gatos, em pixel art"
              className="pixel-art relative w-full max-w-md select-none"
              draggable="false"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </Reveal>
      </section>

      {/* FECHO com envelope */}
      <section className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 pb-24">
        <Reveal>
          <div className="mb-10">
            <PixelHeart size={48} />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-serif-love mb-3 max-w-lg text-center text-2xl italic text-white/75 sm:text-3xl">
            {closingLine}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="my-10 flex items-center justify-center gap-4">
            <PixelStar size={12} opacity={0.6} />
            <div className="h-px w-16 bg-white/20" />
            <PixelStar size={12} opacity={0.6} />
          </div>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="mt-20">
            <HiddenLetter />
          </div>
        </Reveal>
      </section>

      {/* CÉU FINAL — o verdadeiro fim */}
      <NightSky onEnter={stopPlaylist} />
    </div>
  );
}

/* ---------- Página ---------- */
export default function HomePage() {
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    document.title = 'Para Gabriela';
  }, []);
  useEffect(() => {
    if (introDone) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);
  const finish = useCallback(() => {
    setIntroDone(true);
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="min-h-screen bg-black">
        <MainContent />
        <AnimatePresence>{!introDone && <Intro onDone={finish} />}</AnimatePresence>
      </div>
    </>
  );
}
