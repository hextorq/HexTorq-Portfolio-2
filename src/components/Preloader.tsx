import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING SYSTEM CORE...",
  "LOADING WEBGL RENDERING SHADERS...",
  "SPINNING UP GEOMETRIC TORQUE MATRIX...",
  "SYNCHRONIZING ENTERPRISE CRM & ERP CORES...",
  "SPAWNING AI CHATBOTS & INTELLIGENT NEURAL AGENTS...",
  "ORCHESTRATING INDUSTRIAL IOT SENSOR MESHES...",
  "FORMATTING IEEE GRADUATION RESEARCH TEMPLATES...",
  "ESTABLISHING PRINTFLOW EMULATORS...",
  "CONFIGURING HEXPAY TRANSACTION GATEWAYS...",
  "SECURE HANDSHAKE SUCCESSFUL.",
  "HEXTORQ ECOSYSTEM INSTANTIATED."
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Increment progress smoothly
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 800); // Allow fadeout animation
        }, 600);
      }
      setProgress(currentProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Cycle through mock boot logs based on progress
    const segment = Math.floor(100 / BOOT_LOGS.length);
    const calculatedIndex = Math.min(
      Math.floor(progress / segment),
      BOOT_LOGS.length - 1
    );
    setLogIndex(calculatedIndex);
  }, [progress]);

  const letterContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9] as any,
      },
    },
  };

  const hexLetters = "HEXTORQ".split("");

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark tech-grid select-none"
        >
          {/* Ambient center radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive loading spinner logo */}
          <div className="relative mb-12 flex items-center justify-center h-40 w-40">
            {/* Spinning external hexagonal border */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute w-36 h-36 text-brand-cyan/20"
              viewBox="0 0 100 100"
            >
              <polygon
                points="50,3 93,28 93,78 50,97 7,78 7,28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="10, 10"
              />
            </motion.svg>

            {/* Inner pulsing solid glowing hexagon */}
            <motion.svg
              animate={{ rotate: -360, scale: [0.95, 1.05, 0.95] }}
              transition={{
                rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              className="absolute w-24 h-24 text-brand-cyan"
              viewBox="0 0 100 100"
            >
              <polygon
                points="50,15 80,32 80,68 50,85 20,68 20,32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
            </motion.svg>

            {/* Core logo dot */}
            <div className="h-4 w-4 bg-brand-cyan rounded-full glow-cyan animate-pulse" />
          </div>

          {/* Spanned Title Reveal */}
          <motion.div
            variants={letterContainerVariants}
            initial="initial"
            animate="animate"
            className="flex space-x-1.5 md:space-x-3 mb-6"
          >
            {hexLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="font-display italic text-4xl md:text-6xl font-bold tracking-[0.15em] text-white glow-cyan"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          <div className="w-64 md:w-80 space-y-4 text-center">
            {/* Tech Meter */}
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
            </div>

            {/* Progress Percentage */}
            <div className="flex justify-between items-center px-1">
              <span className="font-mono text-[10px] text-gray-500 tracking-widest">
                SYSTEM CORE SEED
              </span>
              <span className="font-mono text-xs text-brand-cyan font-bold">
                {progress}%
              </span>
            </div>

            {/* Rotating Diagnostic Logs */}
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={logIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-[10px] text-gray-400 tracking-wider uppercase text-center truncate"
                >
                  &gt; {BOOT_LOGS[logIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
