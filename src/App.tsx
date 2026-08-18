import { useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import {
  Music,
  VolumeX,
  Volume2,
  Menu,
  X,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Gift as GiftIcon,
  Mail,
  MessageCircle,
  Star,
  Infinity as InfinityIcon,
  Users,
  Share2,
  RotateCcw,
} from 'lucide-react';

/* ============================================================================
   RUBAISHA'S 17th BIRTHDAY — a cinematic, single-file digital gift
   Everything (state, helpers, sub-components, sections) lives in this file
   on purpose, per the project's architecture requirement.
   ========================================================================== */

/* --------------------------- EASY-TO-EDIT NAME ---------------------------- */
const YOUR_NAME = 'Aiman';
const FRIEND_NAME = 'Rubaisha';

/* ------------------------------- DATA ------------------------------------- */

type BalloonColor = 'pink' | 'purple' | 'gold';

interface BalloonData {
  id: number;
  message: string;
  left: number; // vw %
  top: number; // vh %
  size: number; // px
  delay: number;
  duration: number;
  color: BalloonColor;
  rotate: number;
}

const BALLOON_MESSAGES = [
  'Bestie forever ♡',
  '17 ✨',
  "You're amazing",
  "Don't stop smiling",
  'Crazy but cute 😂',
  'Keep shining ✨',
  'One more... 👀',
  'Almost there...',
];

const BALLOON_COLORS: BalloonColor[] = ['pink', 'purple', 'gold'];

const BALLOON_GRADIENTS: Record<BalloonColor, string> = {
  pink: 'radial-gradient(circle at 32% 28%, #ffd6ec 0%, #ff6fb0 38%, #ff2d95 72%, #b3006b 100%)',
  purple: 'radial-gradient(circle at 32% 28%, #e6d6ff 0%, #b07bff 38%, #6d28d9 72%, #3d1580 100%)',
  gold: 'radial-gradient(circle at 32% 28%, #fff6de 0%, #f3d9a4 38%, #d4af6a 72%, #9c7a3c 100%)',
};

function makeBalloons(isMobile = false): BalloonData[] {
  // 17 balloons — Rubaisha is turning 17. Never change this number.
  const cols = 5;
  return Array.from({ length: 17 }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = (Math.sin(i * 12.9898) * 0.5 + 0.5) * 10 - 5;
    const jitterY = (Math.sin(i * 78.233) * 0.5 + 0.5) * 10 - 5;
    return {
      id: i + 1,
      message: BALLOON_MESSAGES[i % BALLOON_MESSAGES.length],
      left: (isMobile ? 4 : 8) + col * (isMobile ? 20.5 : 21) + (isMobile ? jitterX * 0.45 : jitterX),
      top: (isMobile ? 8 : 12) + row * (isMobile ? 25 : 24) + (isMobile ? jitterY * 0.45 : jitterY),
      size: isMobile ? 58 + ((i * 23) % 16) : 78 + ((i * 37) % 40),
      delay: (i % 7) * 0.18,
      duration: 4.2 + (i % 5) * 0.5,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      rotate: ((i * 13) % 14) - 7,
    };
  });
}

interface MemoryImage {
  id: number;
  src: string;
  caption: string;
  rotate: number;
}

// Extend this array (memory-7.jpg, memory-8.jpg, ...) any time — the gallery
// auto-adjusts. Just drop new files into /public/memories/.
const MEMORY_CAPTIONS = [
  'Crazy talks 😂',
  'Endless laughter ♡',
  'Best vibes only ✨',
  'Always with you',
  'Random clicks 📸',
  'Unforgettable',
  'Good times',
  'Another favorite',
];

const MEMORIES: MemoryImage[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  src: `/memories/memory-${i + 1}.jpg`,
  caption: MEMORY_CAPTIONS[i % MEMORY_CAPTIONS.length],
  rotate: ((i * 17) % 10) - 5,
}));

interface FriendshipCard {
  number: string;
  title: string;
  text: string;
  icon: typeof MessageCircle;
}

const FRIENDSHIP_CARDS: FriendshipCard[] = [
  {
    number: '01',
    title: 'Crazy Conversations',
    text: 'The conversations that start randomly and somehow never end 😂',
    icon: MessageCircle,
  },
  {
    number: '02',
    title: 'Random Laughs',
    text: 'Those moments when we laugh for absolutely no reason.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Our Inside Jokes',
    text: 'Only we get it — and that’s what makes it special ♡',
    icon: Star,
  },
  {
    number: '04',
    title: 'Endless Gossip',
    text: 'From serious talks to the silliest things, we talk about everything.',
    icon: MessageCircle,
  },
  {
    number: '05',
    title: 'Always There',
    text: 'No matter what, we know we’ve got each other’s back.',
    icon: Users,
  },
  {
    number: '06',
    title: 'Every Memory Matters',
    text: 'Big or small, every moment with you is a favorite.',
    icon: InfinityIcon,
  },
];

const CHECKLIST_ITEMS = ['Laugh loudly', 'Make beautiful memories', 'Dream big', 'Smile brighter', 'Enjoy being 17'];

const URDU_LETTER_LINES = [
  'پیاری رُبَائیشَہ،',
  '',
  'آج تم 17 سال کی ہو گئی ہو، اور یہ سوچ کر ہی بہت خوشی ہوتی ہے کہ ہماری دوستی نے کتنے خوبصورت لمحے دیکھے ہیں۔',
  '',
  'اللہ کرے تمہاری زندگی ہمیشہ خوشیوں، سکون اور خوبصورت یادوں سے بھری رہے۔ تم ہمیشہ ایسے ہی ہنستی مسکراتی رہو اور زندگی میں جو چاہو وہ حاصل کرو۔',
  '',
  'تم میرے لیے صرف ایک دوست نہیں ہو، بلکہ ایک ایسی دوست ہو جس کے ساتھ میں اپنی بہت سی باتیں، ہنسی، پاگل پن اور خوبصورت یادیں شیئر کرتی ہوں۔',
  '',
  'ہماری دوستی کی سب سے اچھی بات یہ ہے کہ ہم چھوٹی چھوٹی باتوں میں بھی خوشی ڈھونڈ لیتے ہیں۔ کبھی لمبی باتیں، کبھی بے وجہ ہنسی اور کبھی ایسی باتیں جنہیں شاید صرف ہم ہی سمجھ سکتے ہیں۔ 😂',
  '',
  'میری دعا ہے کہ تمہاری زندگی کا یہ نیا سال تمہارے لیے بہت ساری خوشیاں، کامیابیاں، سکون اور خوبصورت مواقع لے کر آئے۔',
  '',
  'اللہ تمہاری ہر اچھی خواہش پوری کرے، تمہیں ہمیشہ خوش رکھے اور تمہارے چہرے کی مسکراہٹ کبھی کم نہ ہو۔',
  '',
  '17ویں سالگرہ بہت بہت مبارک ہو رُبَائیشَہ! 🎂💗',
  '',
  'ہمیشہ ایسی ہی پیاری، خوش مزاج، مضبوط اور تھوڑی سی پاگل رہنا۔ 😂',
  '',
  'اور ہاں...',
  '',
  'ہماری دوستی میں ابھی بہت سی یادیں بنانا باقی ہیں۔ ♡',
  '',
  'تمہاری دوست،',
  'Eman 💗',
];

/* ------------------------------- SOUND HOOK -------------------------------- */

type SfxName = 'pop' | 'click' | 'gift' | 'envelope' | 'confetti';

const SFX_SRC: Record<SfxName, string> = {
  pop: '/audio/balloon-pop.mp3',
  click: '/audio/button-click.mp3',
  gift: '/audio/gift-open.mp3',
  envelope: '/audio/envelope-open.mp3',
  confetti: '/audio/confetti.mp3',
};

function useSfx(enabled: boolean) {
  const cache = useRef<Partial<Record<SfxName, HTMLAudioElement | null>>>({});
  const disabled = useRef<Set<SfxName>>(new Set());

  return useCallback(
    (name: SfxName) => {
      if (!enabled || disabled.current.has(name)) return;
      try {
        let audio = cache.current[name];
        if (!audio) {
          audio = new Audio(SFX_SRC[name]);
          audio.volume = 0.55;
          audio.addEventListener('error', () => {
            disabled.current.add(name);
          });
          cache.current[name] = audio;
        }
        audio.currentTime = 0;
        audio.play().catch(() => {
          disabled.current.add(name);
        });
      } catch {
        disabled.current.add(name);
      }
    },
    [enabled],
  );
}

/* ------------------------------ RESPONSIVE HOOK ---------------------------- */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

/* ------------------------------ STARFIELD BG ------------------------------- */

function Starfield({ count = 60 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (Math.sin(i * 91.7) * 0.5 + 0.5) * 100,
        top: (Math.sin(i * 43.1 + 7) * 0.5 + 0.5) * 100,
        size: 1 + (i % 3),
        delay: (i % 10) * 0.3,
        dur: 2.4 + (i % 6) * 0.4,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
          }}
        />
      ))}
    </div>
  );
}

function FloatingDust({ count = 18, color = '#f3d9a4' }: { count?: number; color?: string }) {
  const dust = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (Math.sin(i * 55.3) * 0.5 + 0.5) * 100,
        top: (Math.sin(i * 21.9 + 3) * 0.5 + 0.5) * 100,
        size: 2 + (i % 3),
        delay: (i % 8) * 0.4,
        dur: 5 + (i % 5),
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dust.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full animate-drift"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            backgroundColor: color,
            opacity: 0.5,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------- CONFETTI --------------------------------- */

const CONFETTI_COLORS = ['#ff2d95', '#c4b5fd', '#f3d9a4', '#ff7ab8', '#6d28d9'];

function Confetti({ count = 70, keyProp }: { count?: number; keyProp: string | number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 2.2 + Math.random() * 1.6,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 200,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, keyProp],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '-10vh', x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

function HeartBurst({ originX, originY, count = 8 }: { originX: number; originY: number; count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (i / count) * 360,
        dist: 40 + Math.random() * 40,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed z-40" style={{ left: originX, top: originY }}>
      {hearts.map((h) => {
        const rad = (h.angle * Math.PI) / 180;
        const x = Math.cos(rad) * h.dist;
        const y = Math.sin(rad) * h.dist;
        return (
          <motion.span
            key={h.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{ x, y: y - 40, opacity: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute"
          >
            <Heart size={14} className="text-neon-pink-soft fill-neon-pink-soft" />
          </motion.span>
        );
      })}
    </div>
  );
}

/* --------------------------------- BALLOON --------------------------------- */

function Balloon({
  data,
  popping,
  onPop,
  reducedMotion,
}: {
  data: BalloonData;
  popping: boolean;
  onPop: (id: number, x: number, y: number) => void;
  reducedMotion: boolean | null;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      aria-label={`Pop balloon ${data.id}`}
      initial={{ opacity: 0, y: 40 }}
      animate={
        popping
          ? { scale: [1, 1.25, 0], opacity: [1, 1, 0], rotate: [0, -8, 8, 0] }
          : reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, -18, 0] }
      }
      transition={
        popping
          ? { duration: 0.45, ease: 'easeOut' }
          : { duration: data.duration, delay: data.delay, repeat: Infinity, ease: 'easeInOut' }
      }
      onClick={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        onPop(data.id, rect ? rect.left + rect.width / 2 : e.clientX, rect ? rect.top : e.clientY);
      }}
      className="absolute touch-manipulation select-none"
      style={{
        left: `${data.left}%`,
        top: `${data.top}%`,
        width: Math.max(data.size, 64),
        height: Math.max(data.size, 64) * 1.15,
      }}
    >
      <span
        className="block w-full rounded-[50%_50%_46%_46%] relative"
        style={{
          height: '82%',
          background: BALLOON_GRADIENTS[data.color],
          transform: `rotate(${data.rotate}deg)`,
          boxShadow: '0 0 24px rgba(255,45,149,0.25), inset -8px -10px 18px rgba(0,0,0,0.25), inset 8px 8px 14px rgba(255,255,255,0.25)',
        }}
      >
        <span
          className="absolute rounded-full bg-white/70 blur-[1px]"
          style={{ width: '22%', height: '14%', top: '16%', left: '22%' }}
        />
      </span>
      <span
        className="mx-auto block"
        style={{
          width: 1,
          height: '18%',
          background: 'rgba(255,255,255,0.35)',
        }}
      />
    </motion.button>
  );
}

/* -------------------------------- GLASS CARD -------------------------------- */

function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

/* ---------------------------- SECTION HEADING ------------------------------- */

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: ReactNode; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="text-center mb-10 md:mb-14 px-4"
    >
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm tracking-[0.35em] uppercase text-champagne/80 mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-pink leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base md:text-lg text-lavender/80 font-body">{subtitle}</p>}
    </motion.div>
  );
}

/* ============================================================================
   MAIN APP
   ========================================================================== */

type Phase = 'intro' | 'balloons' | 'main';

export default function App() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [phase, setPhase] = useState<Phase>('intro');
  const [introStage, setIntroStage] = useState(0); // 0: black, 1: line1, 2: name, 3: greeting/CTA
  const [poppedIds, setPoppedIds] = useState<number[]>([]);
  const [poppingId, setPoppingId] = useState<number | null>(null);
  const [showFinale, setShowFinale] = useState(false);
  const [burst, setBurst] = useState<{ x: number; y: number; message: string; key: number } | null>(null);

  const [wishMade, setWishMade] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [memoryIndex, setMemoryIndex] = useState(0);

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const balloons = useMemo(() => makeBalloons(isMobile), [isMobile]);
  const playSfx = useSfx(soundEnabled);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const balloonsRef = useRef<HTMLDivElement>(null);
  const birthdayRef = useRef<HTMLDivElement>(null);
  const memoriesRef = useRef<HTMLDivElement>(null);
  const friendshipRef = useRef<HTMLDivElement>(null);
  const giftRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  /* -------------------- ONE persistent audio element -------------------- */
  useEffect(() => {
    const audio = new Audio('/audio/birthday.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicEnabled && musicStarted) {
      audio.play().catch(() => {
        // Autoplay blocked — silently ignore, toggle stays available for the user.
      });
    } else {
      audio.pause();
    }
  }, [musicEnabled, musicStarted]);

  /* --------------------------- Smooth memory slideshow -------------------------- */
  useEffect(() => {
    if (lightboxImage) return;
    const timer = window.setInterval(() => {
      setMemoryIndex((current) => (current + 1) % MEMORIES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [lightboxImage]);

  /* ------------------------------- Intro sequence ------------------------------ */
  useEffect(() => {
    if (phase !== 'intro') return;
    const timers = [
      setTimeout(() => setIntroStage(1), 500),
      setTimeout(() => setIntroStage(2), 2200),
      setTimeout(() => setIntroStage(3), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  /* ------------------------------- Scroll-top button ---------------------------- */
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    setNavOpen(false);
  };

  const handleLetsGo = () => {
    playSfx('click');
    setMusicStarted(true);
    setPhase('balloons');
    requestAnimationFrame(() => {
      setTimeout(() => scrollToRef(balloonsRef), 50);
    });
  };

  const handlePop = (id: number, x: number, y: number) => {
    if (poppedIds.includes(id) || poppingId !== null) return;
    playSfx('pop');
    setPoppingId(id);
    const bd = balloons.find((b) => b.id === id);
    setBurst({ x, y, message: bd?.message ?? '', key: Date.now() });
    setTimeout(() => {
      setPoppedIds((prev) => {
        const next = [...prev, id];
        if (next.length === 17) {
          setTimeout(() => {
            setShowFinale(true);
            playSfx('confetti');
          }, 500);
        }
        return next;
      });
      setPoppingId(null);
    }, 450);
    setTimeout(() => setBurst(null), 1400);
  };

  useEffect(() => {
    if (!showFinale) return;
    const t = setTimeout(() => {
      setPhase('main');
      setShowFinale(false);
      requestAnimationFrame(() => setTimeout(() => scrollToRef(birthdayRef), 50));
    }, 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFinale]);

  const handleWish = () => {
    playSfx('click');
    setWishMade(true);
  };

  const handleGift = () => {
    playSfx('gift');
    setGiftOpened(true);
  };

  const handleLetter = () => {
    playSfx('envelope');
    setLetterOpened(true);
  };

  const openLightbox = (src: string, idx: number) => {
    setLightboxImage(src);
    setLightboxIndex(idx);
  };

  const navLightbox = (dir: 1 | -1) => {
    const next = (lightboxIndex + dir + MEMORIES.length) % MEMORIES.length;
    setLightboxIndex(next);
    setLightboxImage(MEMORIES[next].src);
  };

  const handleReplay = () => {
    playSfx('click');
    setPoppedIds([]);
    setPoppingId(null);
    setShowFinale(false);
    setBurst(null);
    setWishMade(false);
    setGiftOpened(false);
    setLetterOpened(false);
    setLightboxImage(null);
    setIntroStage(0);
    setMusicStarted(false);
    setPhase('intro');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const particleCount = isMobile ? 22 : 60;
  const confettiCount = isMobile ? 36 : 80;

  return (
    <div className="grain relative min-h-screen bg-midnight text-white font-body overflow-x-hidden">
      {/* ambient global background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(109,40,217,0.35), transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(255,45,149,0.22), transparent 50%), linear-gradient(180deg, #08050f 0%, #0f0a1e 50%, #08050f 100%)',
        }}
      />

      {/* ============================= INTRO ============================= */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-midnight overflow-hidden"
          >
            <Starfield count={introStage >= 1 ? particleCount : 0} />
            {introStage >= 2 && <FloatingDust count={isMobile ? 10 : 24} />}

            {/* soft ambient glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 40%, rgba(255,45,149,0.18), transparent 60%), radial-gradient(circle at 50% 70%, rgba(109,40,217,0.2), transparent 55%)',
              }}
            />

            {/* balloons drifting in behind the text */}
            {introStage >= 2 && !reducedMotion && (
              <div className="pointer-events-none absolute inset-0 opacity-40">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '-10%', opacity: 0.8 }}
                    transition={{ duration: 6 + i, delay: i * 0.4, ease: 'easeOut' }}
                    className="absolute rounded-full blur-[1px]"
                    style={{
                      left: `${8 + i * 20}%`,
                      width: 40,
                      height: 50,
                      background: BALLOON_GRADIENTS[BALLOON_COLORS[i % 3]],
                      borderRadius: '50% 50% 45% 45%',
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10 text-center px-6">
              <AnimatePresence mode="wait">
                {introStage === 1 && (
                  <motion.p
                    key="line1"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 1.1 }}
                    className="font-display italic text-lg sm:text-2xl md:text-3xl text-lavender tracking-wide"
                  >
                    I made something special for you...
                  </motion.p>
                )}
                {introStage === 2 && (
                  <motion.h1
                    key="name"
                    initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="font-script text-6xl sm:text-7xl md:text-8xl text-gradient-gold glow-gold"
                  >
                    {FRIEND_NAME} ♡
                  </motion.h1>
                )}
                {introStage >= 3 && (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="flex flex-col items-center gap-5"
                  >
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gradient-pink font-bold">
                      Hey {FRIEND_NAME} ♡
                    </h2>
                    <p className="text-lavender/80 text-base sm:text-lg">Ready for a little surprise?</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLetsGo}
                      className="mt-2 px-8 py-3 rounded-full glass-strong glow-pink border border-neon-pink/40 font-display text-lg tracking-wide"
                    >
                      Let's Go <Sparkles className="inline w-5 h-5 mb-1 ml-1 text-champagne" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================ NAVIGATION ============================ */}
      {phase !== 'intro' && (
        <>
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl"
          >
            <div className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between shadow-lg">
              <span className="font-script text-xl sm:text-2xl text-champagne px-2 select-none">
                {FRIEND_NAME} <span className="text-neon-pink-soft">17</span>
              </span>

              <div className="hidden md:flex items-center gap-1 text-sm">
                {[
                  ['Pop Balloons', balloonsRef],
                  ['Birthday', birthdayRef],
                  ['Memories', memoriesRef],
                  ['Friendship', friendshipRef],
                  ['Surprise', giftRef],
                  ['Letter', letterRef],
                ].map(([label, ref]) => (
                  <button
                    key={label as string}
                    onClick={() => scrollToRef(ref as React.RefObject<HTMLDivElement | null>)}
                    className="px-3 py-1.5 rounded-full text-lavender/85 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {label as string}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  aria-label="Toggle music"
                  onClick={() => setMusicEnabled((v) => !v)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  {musicEnabled ? (
                    <Music className="w-4 h-4 text-neon-pink-soft" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-lavender/60" />
                  )}
                </button>
                <button
                  aria-label="Toggle sound effects"
                  onClick={() => setSoundEnabled((v) => !v)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:inline-flex"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-champagne" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-lavender/60" />
                  )}
                </button>
                <button
                  aria-label="Open menu"
                  onClick={() => setNavOpen((v) => !v)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
                >
                  {navOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {navOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  className="md:hidden mt-2 glass-strong rounded-2xl p-2 flex flex-col gap-1"
                >
                  {[
                    ['Pop Balloons', balloonsRef],
                    ['Birthday', birthdayRef],
                    ['Memories', memoriesRef],
                    ['Friendship', friendshipRef],
                    ['Surprise', giftRef],
                    ['Letter', letterRef],
                  ].map(([label, ref]) => (
                    <button
                      key={label as string}
                      onClick={() => scrollToRef(ref as React.RefObject<HTMLDivElement | null>)}
                      className="text-left px-4 py-2.5 rounded-xl text-lavender/85 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {label as string}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
                aria-label="Scroll to top"
                className="fixed bottom-6 right-5 z-40 p-3 rounded-full glass-strong glow-pink"
              >
                <ChevronUp className="w-5 h-5 text-champagne" />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ============================ BALLOON GAME ============================ */}
      {phase !== 'intro' && (
        <section
          ref={balloonsRef}
          className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-24"
        >
          <Starfield count={particleCount / 2} />
          <FloatingDust count={isMobile ? 8 : 16} color="#ff7ab8" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-4 relative z-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-pink">
              POP ALL THE BALLOONS 🎈
            </h2>
            <p className="mt-3 text-lavender/80">Every balloon has a little surprise inside...</p>
            <div className="mt-5 inline-block glass-strong px-6 py-2 rounded-full font-display text-lg">
              Popped: <span className="text-champagne font-bold">{poppedIds.length}</span> / 17
            </div>
          </motion.div>

          <div className="relative w-full max-w-5xl h-[62vh] sm:h-[68vh] mt-4">
            {balloons
              .filter((b) => !poppedIds.includes(b.id))
              .map((b) => (
                <Balloon
                  key={b.id}
                  data={b}
                  popping={poppingId === b.id}
                  onPop={handlePop}
                  reducedMotion={reducedMotion}
                />
              ))}
          </div>

          {burst && (
            <>
              <HeartBurst originX={burst.x} originY={burst.y} count={isMobile ? 5 : 8} />
              <motion.div
                key={burst.key}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -10, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed z-40 font-display text-lg sm:text-xl text-champagne glow-gold px-4 py-1.5 rounded-full glass-strong"
                style={{ left: burst.x, top: burst.y, transform: 'translate(-50%, -120%)' }}
              >
                {burst.message}
              </motion.div>
            </>
          )}

          <AnimatePresence>
            {showFinale && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/90"
              >
                <Confetti count={confettiCount} keyProp="finale" />
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                  className="text-center px-6"
                >
                  <Heart className="mx-auto w-16 h-16 text-neon-pink fill-neon-pink glow-pink mb-4" />
                  <h3 className="font-display text-5xl sm:text-6xl font-bold text-gradient-gold">ALL DONE! ♡</h3>
                  <p className="mt-3 text-lavender/90 text-lg">You're the best!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {phase === 'main' && (
        <>
          {/* ============================ BIRTHDAY REVEAL ============================ */}
          <section
            ref={birthdayRef}
            className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-24"
          >
            <Starfield count={particleCount} />
            <FloatingDust count={isMobile ? 10 : 22} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 20%, rgba(255,45,149,0.16), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(109,40,217,0.25), transparent 50%)',
              }}
            />

            <div className="relative z-10 text-center max-w-3xl">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="uppercase tracking-[0.4em] text-xs sm:text-sm text-champagne/80 mb-3"
              >
                Happy
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl text-gradient-gold leading-tight"
              >
                BIRTHDAY
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="font-script text-6xl sm:text-7xl md:text-8xl text-gradient-pink mt-1"
              >
                {FRIEND_NAME} ♡
              </motion.h2>

              {/* cake */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative mx-auto mt-10 w-56 sm:w-64"
              >
                <div className="relative">
                  {/* candle */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-14 flex flex-col items-center">
                    <AnimatePresence>
                      {!wishMade ? (
                        <motion.span
                          key="flame"
                          exit={{ opacity: 0, scale: 0, y: -10 }}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-3 h-4 rounded-full bg-gradient-to-t from-orange-500 via-yellow-300 to-yellow-100 blur-[0.5px]"
                          style={{ boxShadow: '0 0 18px 6px rgba(255,200,80,0.7)' }}
                        />
                      ) : (
                        <motion.span
                          key="smoke"
                          initial={{ opacity: 0.6, y: 0 }}
                          animate={{ opacity: 0, y: -30 }}
                          transition={{ duration: 2 }}
                          className="w-1 h-6 rounded-full bg-lavender/40 blur-sm"
                        />
                      )}
                    </AnimatePresence>
                    <span className="w-1 h-8 bg-champagne-deep rounded-full" />
                  </div>

                  <div className="rounded-2xl px-6 py-4 glass-strong border border-champagne/20 flex items-center justify-center">
                    <span className="font-display text-6xl sm:text-7xl font-extrabold text-gradient-gold glow-gold">
                      17
                    </span>
                  </div>
                  <div className="h-6 -mt-1 rounded-b-2xl bg-gradient-to-b from-neon-pink/70 to-deep-purple/70 border-x border-b border-white/10" />
                  <div className="h-4 rounded-b-2xl bg-gradient-to-b from-plum to-midnight border-x border-b border-white/10" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-lavender/85 text-base sm:text-lg"
              >
                17 years of being absolutely wonderful ✨
              </motion.p>

              <AnimatePresence mode="wait">
                {!wishMade ? (
                  <motion.button
                    key="wishbtn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWish}
                    className="mt-8 px-8 py-3 rounded-full glass-strong glow-pink border border-neon-pink/40 font-display text-lg"
                  >
                    Make a Wish ✨
                  </motion.button>
                ) : (
                  <motion.p
                    key="wishtext"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 font-display italic text-xl sm:text-2xl text-champagne glow-gold"
                  >
                    Make a wish, birthday girl ✨
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {wishMade && <Confetti count={confettiCount} keyProp="wish" />}
          </section>

          {/* ============================ TODAY IS ALL ABOUT YOU ============================ */}
          <section className="relative w-full py-24 px-4 flex items-center justify-center overflow-hidden">
            <FloatingDust count={isMobile ? 6 : 14} color="#c4b5fd" />
            <div className="relative z-10 max-w-xl w-full text-center">
              <SectionHeading title={`Today is all about YOU ♡`} />
              <GlassCard className="p-6 sm:p-10">
                <ul className="space-y-4 text-left">
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      className="flex items-center gap-3 text-lg sm:text-xl"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neon-pink/20 border border-neon-pink/50 glow-pink shrink-0">
                        <Sparkles className="w-4 h-4 text-neon-pink-soft" />
                      </span>
                      <span className="text-lavender/95">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </section>

          {/* ============================ MEMORY GALLERY ============================ */}
          <section ref={memoriesRef} className="relative w-full py-24 px-4 overflow-hidden">
            <FloatingDust count={isMobile ? 8 : 16} />
            <SectionHeading
              eyebrow="Snapshots"
              title="Our Beautiful Memories ♡"
              subtitle="Some moments I'll always keep close to my heart..."
            />

            <div className="relative z-10 max-w-3xl mx-auto px-2 sm:px-4 py-6">
              <div className="relative flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Previous memory"
                  onClick={() => setMemoryIndex((current) => (current - 1 + MEMORIES.length) % MEMORIES.length)}
                  className="absolute left-0 sm:-left-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong border border-white/15 flex items-center justify-center text-white hover:scale-110 hover:border-neon-pink/50 transition-all duration-300 shadow-xl"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="w-full max-w-md sm:max-w-lg glass rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/10 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.button
                      key={MEMORIES[memoryIndex].id}
                      type="button"
                      initial={{ opacity: 0, x: 35, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -35, scale: 0.98 }}
                      transition={{ duration: 0.55, ease: 'easeInOut' }}
                      onClick={() => openLightbox(MEMORIES[memoryIndex].src, memoryIndex)}
                      className="relative block w-full focus:outline-none group"
                    >
                      <img
                        src={MEMORIES[memoryIndex].src}
                        alt={MEMORIES[memoryIndex].caption}
                        className="w-full h-[390px] sm:h-[500px] object-cover rounded-xl shadow-lg transition-transform duration-700 group-hover:scale-[1.015]"
                        loading="eager"
                      />
                      <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-20 pb-5 px-4">
                        <p className="font-script text-xl sm:text-2xl text-white drop-shadow-lg">
                          {MEMORIES[memoryIndex].caption}
                        </p>
                      </div>
                    </motion.button>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  aria-label="Next memory"
                  onClick={() => setMemoryIndex((current) => (current + 1) % MEMORIES.length)}
                  className="absolute right-0 sm:-right-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-strong border border-white/15 flex items-center justify-center text-white hover:scale-110 hover:border-neon-pink/50 transition-all duration-300 shadow-xl"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                {MEMORIES.map((memory, i) => (
                  <button
                    key={memory.id}
                    type="button"
                    aria-label={`Show memory ${i + 1}`}
                    onClick={() => setMemoryIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === memoryIndex ? 'w-7 bg-neon-pink shadow-[0_0_12px_rgba(255,45,149,0.7)]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-lavender/50 text-xs mt-3">Click the arrows to explore our memories ♡</p>
            </div>
          </section>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl px-4"
              >
                <motion.img
                  key={lightboxImage}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  src={lightboxImage}
                  alt="Memory"
                  className="max-h-[78vh] max-w-full rounded-xl shadow-2xl object-contain"
                />
                <button
                  aria-label="Close"
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-5 right-5 p-2 rounded-full glass-strong"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  aria-label="Previous"
                  onClick={(e) => {
                    e.stopPropagation();
                    navLightbox(-1);
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full glass-strong"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Next"
                  onClick={(e) => {
                    e.stopPropagation();
                    navLightbox(1);
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full glass-strong"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================ FRIENDSHIP ============================ */}
          <section ref={friendshipRef} className="relative w-full py-24 px-4 overflow-hidden">
            <FloatingDust count={isMobile ? 8 : 16} color="#ff7ab8" />
            <SectionHeading title="Things I Love About Our Friendship ♡" />

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-2">
              {FRIENDSHIP_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.12 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="glass rounded-2xl p-6 border border-white/10 hover:border-neon-pink/40 transition-colors relative overflow-hidden group"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-neon-pink/10 blur-2xl group-hover:bg-neon-pink/20 transition-colors" />
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-2xl text-champagne/70">{card.number}</span>
                      <span className="p-2 rounded-full bg-white/5 border border-white/10">
                        <Icon className="w-4 h-4 text-neon-pink-soft" />
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-lavender/75 text-sm leading-relaxed">{card.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ============================ GIFT ============================ */}
          <section ref={giftRef} className="relative min-h-screen w-full flex items-center justify-center px-4 py-24 overflow-hidden">
            <Starfield count={particleCount / 2} />
            <div className="relative z-10 max-w-xl w-full text-center">
              <SectionHeading title="A Little Surprise For You 🎁" />
              <p className="text-lavender/80 -mt-6 mb-1">You thought that was everything?</p>
              <p className="text-champagne/90 mb-8">Nope... there's one more thing 👀</p>

              <motion.button
                onClick={handleGift}
                disabled={giftOpened}
                whileHover={!giftOpened ? { scale: 1.04 } : {}}
                animate={
                  !giftOpened && !reducedMotion
                    ? { rotate: [0, -3, 3, -3, 0] }
                    : {}
                }
                transition={{ duration: 1.6, repeat: giftOpened ? 0 : Infinity, repeatDelay: 1 }}
                className="relative mx-auto block w-40 h-40 sm:w-52 sm:h-52"
              >
                <div className="absolute inset-0 rounded-2xl glow-pink" />
                <div
                  className="absolute inset-0 rounded-2xl border border-champagne/30"
                  style={{ background: 'linear-gradient(145deg, #6d28d9, #ff2d95)' }}
                />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-champagne/80" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-champagne/80" />
                <GiftIcon className="absolute inset-0 m-auto w-14 h-14 text-white/90" />
              </motion.button>

              {!giftOpened && (
                <p className="mt-6 text-lavender/70 text-sm">tap the gift to open it ✨</p>
              )}

              <AnimatePresence>
                {giftOpened && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-10 glass-strong rounded-3xl p-6 sm:p-10"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl text-gradient-gold font-bold mb-4">
                      Happy 17th Birthday, {FRIEND_NAME}! 💗
                    </h3>
                    <p className="text-lavender/90 leading-relaxed">
                      I'm genuinely lucky to have a friend like you. Here's to more laughs, more crazy
                      conversations, more memories and many more years of friendship.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {giftOpened && <Confetti count={confettiCount} keyProp="gift" />}
          </section>

          {/* ============================ URDU LETTER ============================ */}
          <section
            ref={letterRef}
            className="relative min-h-screen w-full flex items-center justify-center px-4 py-24 overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 10%, rgba(243,217,164,0.12), transparent 55%), radial-gradient(ellipse at 15% 90%, rgba(109,40,217,0.3), transparent 50%)',
            }}
          >
            <Starfield count={particleCount / 2} />
            <FloatingDust count={isMobile ? 8 : 18} color="#f3d9a4" />
            {/* moon */}
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                top: '8%',
                right: '10%',
                width: isMobile ? 70 : 120,
                height: isMobile ? 70 : 120,
                background: 'radial-gradient(circle at 35% 35%, #fffbe9, #f3d9a4 70%)',
                boxShadow: '0 0 60px 20px rgba(243,217,164,0.35)',
              }}
            />

            <div className="relative z-10 max-w-xl w-full text-center">
              <SectionHeading
  title={<span className="font-urdu">ایک خط رُبَائیشَہ کے نام 💌</span>}
  subtitle="A little letter from my heart to yours..."
/>

              <AnimatePresence mode="wait">
                {!letterOpened ? (
                  <motion.button
                    key="envelope"
                    onClick={handleLetter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ scale: 1.1, opacity: 0, transition: { duration: 0.5 } }}
                    whileHover={{ scale: 1.03 }}
                    className="relative mx-auto block w-64 sm:w-80"
                  >
                    <div className="relative aspect-[3/2] rounded-lg glow-gold border border-champagne/30" style={{
                      background: 'linear-gradient(155deg, #2a1547, #1a0f2e)'
                    }}>
                      <div
                        className="absolute inset-x-0 top-0 h-1/2"
                        style={{
                          background: 'linear-gradient(135deg, transparent 49%, rgba(0,0,0,0.25) 50%), linear-gradient(225deg, transparent 49%, rgba(0,0,0,0.25) 50%)',
                          clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-9 h-9 rounded-full bg-neon-pink flex items-center justify-center glow-pink border border-champagne/50">
                          <Heart className="w-4 h-4 text-white fill-white" />
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 font-urdu text-xl text-champagne">رُبَائیشَہ کے نام ♡</p>
<span className="mt-4 inline-block px-7 py-2.5 rounded-full glass-strong border border-champagne/30 font-display text-base">
  Open My Letter ✨
</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="letter"
                    initial={{ opacity: 0, y: 40, rotateX: -12 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8 }}
                    className="glass-strong rounded-2xl p-6 sm:p-10 border border-champagne/20 text-right"
                    dir="rtl"
                  >
                    <div className="font-urdu text-lg sm:text-xl leading-loose text-lavender/95 space-y-1">
                      {URDU_LETTER_LINES.map((line, i) =>
                        line === '' ? (
                          <div key={i} className="h-2" />
                        ) : (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.09, duration: 0.5 }}
                          >
                            {line}
                          </motion.p>
                        ),
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* ============================ FINAL SCENE ============================ */}
          <section
            ref={finalRef}
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
          >
            <Starfield count={particleCount} />
            <FloatingDust count={isMobile ? 10 : 20} />
            {/* huge moon */}
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                top: '6%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: isMobile ? 140 : 220,
                height: isMobile ? 140 : 220,
                background: 'radial-gradient(circle at 35% 35%, #fffbe9, #f3d9a4 65%, #d4af6a 100%)',
                boxShadow: '0 0 100px 40px rgba(243,217,164,0.3)',
              }}
            />
            {/* skyline silhouette */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 sm:h-56 bg-gradient-to-t from-midnight via-plum/70 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-24 sm:h-32 opacity-70">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className="bg-midnight-2"
                  style={{ width: `${5 + (i % 3) * 2}%`, height: `${40 + ((i * 37) % 60)}%` }}
                />
              ))}
            </div>
            {/* two silhouettes sitting together */}
            <svg
              viewBox="0 0 200 80"
              className="pointer-events-none absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-56 sm:w-72 opacity-90"
            >
              <ellipse cx="70" cy="72" rx="26" ry="8" fill="#08050f" />
              <circle cx="70" cy="40" r="12" fill="#08050f" />
              <path d="M50 72 Q50 45 70 45 Q90 45 90 72 Z" fill="#08050f" />
              <ellipse cx="128" cy="72" rx="26" ry="8" fill="#08050f" />
              <circle cx="128" cy="38" r="12" fill="#08050f" />
              <path d="M108 72 Q108 43 128 43 Q148 43 148 72 Z" fill="#08050f" />
            </svg>

            <div className="relative z-10 text-center max-w-2xl">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-display italic text-lg sm:text-xl text-lavender/80 mb-4"
              >
                17 is just the beginning...
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-gold leading-tight"
              >
                Happy 17th Birthday,
                <br />
                <span className="font-script text-gradient-pink text-5xl sm:text-6xl md:text-7xl">
                  {FRIEND_NAME} ♡
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-lavender/85"
              >
                Here's to another year of laughter, memories and being wonderfully YOU.
              </motion.p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReplay}
                  className="px-7 py-3 rounded-full glass-strong glow-pink border border-neon-pink/40 font-display flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Replay the Magic ✨
                </motion.button>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={() =>
                      (navigator as Navigator & { share: (data: ShareData) => Promise<void> })
                        .share({ title: `Happy 17th Birthday, ${FRIEND_NAME}!`, text: 'A birthday gift, made just for you ♡' })
                        .catch(() => {})
                    }
                    className="px-5 py-3 rounded-full glass border border-white/10 flex items-center gap-2 text-sm text-lavender/80"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                )}
              </div>
            </div>
          </section>

          <footer className="relative py-8 text-center text-lavender/40 text-xs">
            made with <Heart className="inline w-3 h-3 text-neon-pink fill-neon-pink" /> by {YOUR_NAME}, for {FRIEND_NAME}
          </footer>
        </>
      )}
    </div>
  );
}
