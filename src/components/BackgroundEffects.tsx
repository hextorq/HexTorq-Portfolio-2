import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseTime: number;
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [systemUptime, setSystemUptime] = useState("00:00:00");
  const [activeNodes, setActiveNodes] = useState(65);

  // Springs for smooth mouse follow light
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const mouseRaw = useRef({ x: -1000, y: -1000 });

  const springConfig = { damping: 55, stiffness: 120, mass: 1.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Track scroll depth for parallax particle shifts
  const scrollYRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);

    // 1. Uptime Clock Tracker
    const startTime = Date.now();
    const clockInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const totalSecs = Math.floor(elapsed / 1000);
      const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, "0");
      const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, "0");
      const secs = String(totalSecs % 60).padStart(2, "0");
      setSystemUptime(`${hrs}:${mins}:${secs}`);
    }, 1000);

    // 2. Window size and scroll listeners
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRaw.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX - 200); // Center the 400px glow
      mouseY.set(e.clientY - 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    // 3. High-Performance Canvas Particles + Connection Mesh
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Colors mapping to cyber-hybrid theme (amber, teal, violet)
    const particleColors = [
      "rgba(245, 158, 11, ", // Amber
      "rgba(6, 182, 212, ",  // Cyan/Teal
      "rgba(139, 92, 246, "  // Violet
    ];

    // Seed initial particles
    const particles: Particle[] = [];
    const particleCount = 65;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseTime: Math.random() * 100
      });
    }

    let lastScrollY = window.scrollY;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = scrollYRef.current;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Draw connection lines first (lower z-index look)
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const proximityFactor = 1 - dist / maxDistance;
            // Line alpha fades out based on distance and individual opacity
            const lineAlpha = proximityFactor * 0.08 * (p1.alpha + p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Blend colors of the two particles for the gradient line
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.pulseTime += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulseTime) * 0.12;
        
        // 1. Move particle based on velocity
        p.x += p.vx;
        // Parallax effect: scroll moves particles in opposite direction
        p.y += p.vy - scrollDiff * 0.18;

        // 2. Dynamic mouse repulsion/attraction
        const mdx = mouseRaw.current.x - p.x;
        const mdy = mouseRaw.current.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          const force = (180 - mdist) / 180;
          // Softly push away from cursor to feel interactive
          p.x -= (mdx / mdist) * force * 1.2;
          p.y -= (mdy / mdist) * force * 1.2;
        }

        // Boundary checks with wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.02, Math.min(0.9, currentAlpha))})`;
        ctx.shadowBlur = p.size > 2 ? 8 : 0;
        ctx.shadowColor = "rgba(245, 158, 11, 0.3)";
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(clockInterval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#030206]"
    >
      {/* 1. Deep Celestial Cyber Gradients */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: "radial-gradient(circle at 50% 50%, #080611 0%, #030206 100%)"
        }}
      />

      {/* 2. Interactive Interactive Particles Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 block"
        style={{ mixBlendMode: "screen" }}
      />

      {/* 3. Luxurious Fine Grain Matte Finish */}
      <div className="absolute inset-0 grain-overlay z-10" />

      {/* 4. Telemetry Scanner Sweeper (Gently glides down to scan) */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent shadow-[0_0_8px_rgba(6,182,212,0.15)] pointer-events-none select-none z-10 animate-pulse-line" 
        style={{
          animation: "scannerSweep 18s cubic-bezier(0.4, 0, 0.2, 1) infinite"
        }}
      />

      {/* 5. Custom Geometric Perspective Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-15" />

      {/* 6. High-Tech Blueprint Tick Marks & Alignment Corner Bars */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent" />
      
      {/* Micro tech indicators */}
      <div className="absolute left-16 top-16 font-mono text-[9px] text-cyan-500/20 tracking-[0.2em] uppercase select-none hidden lg:block">
        GRID_PERSPECTIVE_MATRIX // ON
      </div>
      <div className="absolute right-16 top-16 font-mono text-[9px] text-violet-400/20 tracking-[0.2em] uppercase select-none text-right hidden lg:block">
        ACTIVE_NODES // {activeNodes}
      </div>

      <div className="absolute left-16 bottom-16 font-mono text-[9px] text-amber-500/20 tracking-[0.2em] uppercase select-none hidden lg:block">
        SYS_UPTIME // {systemUptime}
      </div>
      <div className="absolute right-16 bottom-16 font-mono text-[9px] text-cyan-500/20 tracking-[0.2em] uppercase select-none text-right hidden lg:block">
        CORE // HEXTORQ_NODE_0
      </div>

      {/* 7. Rotating Geometric Navigation Matrix Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[950px] max-h-[950px] opacity-10 pointer-events-none select-none z-0">
        {/* Outer dashed slow rotating ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/15 animate-slow-spin" />
        
        {/* Middle ring with laser alignment lines */}
        <div className="absolute inset-[12%] rounded-full border border-violet-500/5 animate-slow-reverse flex items-center justify-center">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-cyan-500/20 via-transparent to-cyan-500/20" />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-violet-500/20 via-transparent to-violet-500/20" />
        </div>

        {/* Concentric telemetry circles */}
        <div className="absolute inset-[26%] rounded-full border border-dotted border-amber-500/20 animate-slow-spin flex items-center justify-center">
          <div className="w-[14px] h-[14px] rounded-full border border-cyan-500/30" />
        </div>
      </div>

      {/* 8. Floating Ambient Nebula Blooms (Rich glowing colors) */}
      <div className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/[0.035] blur-[160px] mix-blend-screen animate-pulse" style={{ animationDuration: "25s" }} />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-violet-600/[0.03] blur-[180px] mix-blend-screen animate-pulse" style={{ animationDuration: "30s" }} />
      <div className="absolute top-[35%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-amber-500/[0.015] blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: "22s" }} />

      {/* 9. Interactive Lagging Mouse Torch Light */}
      {isMounted && (
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-amber-500/5 blur-[100px] mix-blend-screen"
          style={{
            x: smoothX,
            y: smoothY,
          }}
        />
      )}
    </div>
  );
}
