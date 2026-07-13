import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface ParallaxTitleProps {
  children: React.ReactNode;
  offset?: number; // the total pixel movement of the parallax effect
  className?: string;
}

export default function ParallaxTitle({ children, offset = 40, className = "" }: ParallaxTitleProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track the scroll position of the element relative to the viewport
  // "start end" means start of element enters bottom of viewport
  // "end start" means end of element leaves top of viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress [0, 1] to a vertical translation offset
  // We use positive offset when entering and negative offset when leaving
  const yRange = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  // Apply a smooth spring transition to remove any potential scrolling jitter
  const ySmooth = useSpring(yRange, {
    damping: 25,
    stiffness: 120,
    mass: 0.5,
  });

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      <motion.div style={{ y: ySmooth }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
