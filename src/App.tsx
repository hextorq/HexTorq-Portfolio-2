import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowDown, Send, Check, 
  Cpu, Users, Shield, ArrowUpRight, Github, ExternalLink, Mail, MessageSquare
} from "lucide-react";

import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import StoryMilestones from "./components/StoryMilestones";
import ProductShowcase from "./components/ProductShowcase";
import PillarShowcase from "./components/PillarShowcase";
import { soundFx } from "./lib/audio";
import ParallaxTitle from "./components/ParallaxTitle";
import BackgroundEffects from "./components/BackgroundEffects";
import TemplateSwitcher from "./components/TemplateSwitcher";
import { currentSectionFromPath, pushRouteForSection, scrollToSection } from "./routeUtils";

// Framer Motion layout variants for Intersection Observer staggering
const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const // smooth luxury bezier curve
    }
  }
};

const hasPrerenderedHtml = () =>
  typeof document !== "undefined" &&
  document.getElementById("root")?.dataset.prerendered === "true";

export default function App({ prerender = false }: { prerender?: boolean }) {
  const [isIntroComplete, setIsIntroComplete] = useState(prerender || hasPrerenderedHtml());
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [activePillar, setActivePillar] = useState<string>("digital");
  const [selectedProduct, setSelectedProduct] = useState<string | null>("printflow");

  // Keep track of which sections have been intersected/seen
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Custom Intersection Observer to track staggered entries of section elements
  useEffect(() => {
    if (!isIntroComplete) return;

    const sections = ["hero", "about", "services", "products", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-8% 0px -12% 0px", // Trigger when entering slightly within the viewport bounds
      threshold: 0.1, // Trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setRevealedSections((prev) => {
            if (prev[id]) return prev; // Avoid unnecessary re-renders
            return { ...prev, [id]: true };
          });
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [isIntroComplete]);

  useEffect(() => {
    if (!isIntroComplete || prerender) return;
    const scrollToCurrentRoute = () => {
      const section = currentSectionFromPath();
      if (section) window.setTimeout(() => scrollToSection(section), 80);
    };
    scrollToCurrentRoute();
    window.addEventListener("popstate", scrollToCurrentRoute);
    return () => window.removeEventListener("popstate", scrollToCurrentRoute);
  }, [isIntroComplete, prerender]);

  // Scroll tracking effect
  useEffect(() => {
    if (!isIntroComplete) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = totalHeight > 0 ? scrollY / totalHeight : 0;
      setScrollPercent(percent);

      // Determine active section based on scroll offset
      const sections = ["hero", "about", "services", "products", "contact"];
      let currentSection = "hero";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If section is centered or occupies the main top half of viewport
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isIntroComplete]);

  // Form submit simulator
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFx.handshake();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      soundFx.success();
      setFormData({ name: "", email: "", message: "" });
    }, 1800);
  };

  const handleScrollToSection = (id: string) => {
    soundFx.click();
    pushRouteForSection(id);
    scrollToSection(id);
  };

  return (
    <div className="relative min-h-screen bg-brand-dark overflow-hidden font-sans select-none">
      {/* Intro Preloader Loading sequence */}
      {!prerender && !isIntroComplete && (
        <Preloader onComplete={() => setIsIntroComplete(true)} />
      )}

      {/* Main Experience Layout (renders after preloader completes) */}
      <AnimatePresence>
        {isIntroComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full relative min-h-screen"
          >
            {/* Ambient Background & Glow System */}
            <BackgroundEffects />

            {/* Float Menu Minimalist Header */}
            <Navbar activeSection={activeSection} />
            <TemplateSwitcher />

            {/* Left Vertical HUD Coordinates for 3D tech feel */}
            <div className="fixed left-6 bottom-8 z-30 hidden xl:flex flex-col space-y-4 text-[10px] font-mono text-gray-500 tracking-widest pointer-events-none">
              <div className="flex items-center space-x-2">
                <span className="h-1 w-1 bg-brand-cyan animate-pulse rounded-full" />
                <span>R3F_SYS_ACTIVE [60FPS]</span>
              </div>
              <div>COORDS: X={scrollPercent.toFixed(4)} | Y={(scrollPercent * 100).toFixed(1)}%</div>
              <div>VIEW_ANCHOR: {activeSection.toUpperCase()}</div>
            </div>

            {/* Right Vertical Scroll Progress HUD */}
            <div className="fixed right-6 bottom-8 z-30 hidden xl:flex flex-col items-center space-y-3 pointer-events-none">
              <span className="font-mono text-[9px] text-gray-500 rotate-90 mb-6 uppercase tracking-wider">
                SCROLL VECTOR
              </span>
              <div className="h-32 w-[1px] bg-white/10 relative overflow-hidden">
                <div 
                  className="w-full bg-brand-cyan absolute top-0 transition-all duration-100"
                  style={{ height: `${scrollPercent * 100}%` }}
                />
              </div>
            </div>

             {/* ========================================================= */}
            {/* HTML SCROLL SECTIONS                                      */}
            {/* ========================================================= */}
            <main className="relative z-20 pointer-events-none">

              {/* SECTION 1: HERO / LANDING */}
              <section 
                id="hero"
                className="min-h-screen flex flex-col justify-between pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto"
              >
                {/* Blank space to keep center elements readable */}
                <div />

                {/* Main Hero greeting */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left pointer-events-auto">
                  <div className="md:col-span-8 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1.0, delay: 0.3 }}
                      className="space-y-2"
                    >
                      <span className="text-[10px] uppercase tracking-[0.3em] text-brand-cyan font-semibold block">Global Tech Ecosystem</span>
                    </motion.div>

                    <ParallaxTitle offset={50}>
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, delay: 0.4 }}
                        className="font-display italic text-7xl sm:text-8xl lg:text-9xl leading-[0.85] text-white tracking-tight"
                      >
                        Hex<br />
                        <span className="ml-12 sm:ml-16 bg-gradient-to-r from-white via-amber-100 to-brand-cyan bg-clip-text text-transparent">Torq.</span>
                      </motion.h1>
                    </ParallaxTitle>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.6 }}
                      className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-sm mt-8 border-l border-brand-cyan/30 pl-6"
                    >
                      Synthesizing complex IT development into seamless digital experiences. 
                      From custom payment architectures to revolutionary industrial automation.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="flex flex-wrap gap-4 items-center pt-4"
                    >
                      <button
                        onClick={() => handleScrollToSection("services")}
                        className="px-6 py-3 rounded bg-gradient-to-r from-brand-violet to-brand-cyan hover:shadow-[0_0_15px_#f59e0b] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                      >
                        <span>DISCOVER OUR CAPABILITIES</span>
                        <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                      </button>
                      
                      <button
                        onClick={() => handleScrollToSection("about")}
                        className="px-6 py-3 rounded border border-white/10 hover:border-brand-cyan/40 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                      >
                        LEARN THE STORY
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Downward indicator */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="flex items-center space-x-4 cursor-pointer pointer-events-auto self-start text-gray-400 hover:text-brand-cyan transition-colors"
                  onClick={() => handleScrollToSection("about")}
                >
                  <div className="w-12 h-[1px] bg-brand-cyan" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase">
                    Scroll to Explore Story
                  </span>
                </motion.div>
              </section>

              {/* SECTION 2: THE STORY (ABOUT) */}
              <section 
                id="about"
                className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 max-w-7xl mx-auto"
              >
                <motion.div
                  variants={sectionContainerVariants}
                  initial="hidden"
                  animate={revealedSections["about"] ? "visible" : "hidden"}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left pointer-events-auto"
                >
                  {/* Left Column: Heading (5 cols) */}
                  <motion.div variants={fadeInUpVariants} className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                      <p className="font-mono text-xs text-brand-cyan tracking-widest uppercase font-bold">
                        WHO WE ARE
                      </p>
                      <ParallaxTitle offset={30}>
                        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                          We build bridges, not silos.
                        </h2>
                      </ParallaxTitle>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      At Hextorq, we don't just write scripts—we sculpt digital architecture. Founded by developers and systems architects, we unite high-performance web engineering with bespoke automation pipelines.
                    </p>

                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                      Whether orchestrating custom cloud deployments or deploying robust payment engines, our process remains focused on code integrity, robust security, and long-term modularity.
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="font-display text-2xl font-black text-white">50+</div>
                        <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                          PROJECTS SHIPPED
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-display text-2xl font-black text-white">100%</div>
                        <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                          DURABLE RETENTION
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column: Timeline Widget (7 cols) */}
                  <motion.div variants={fadeInUpVariants} className="lg:col-span-7">
                    <div className="text-center md:text-left space-y-4 mb-4">
                      <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                        EXPLORE OUR CHRONOLOGY
                      </span>
                    </div>
                    <StoryMilestones />
                  </motion.div>
                </motion.div>
              </section>

              {/* SECTION 3: THREE PILLARS (WHAT WE DO) */}
              <section 
                id="services"
                className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 max-w-7xl mx-auto"
              >
                <motion.div
                  variants={sectionContainerVariants}
                  initial="hidden"
                  animate={revealedSections["services"] ? "visible" : "hidden"}
                  className="space-y-12 text-left pointer-events-auto"
                >
                  {/* Headline */}
                  <motion.div variants={fadeInUpVariants} className="max-w-2xl space-y-3">
                    <p className="font-mono text-xs text-brand-cyan tracking-widest uppercase font-bold">
                      ENGINEERING FOCUS // THREE PILLARS
                    </p>
                    <ParallaxTitle offset={35}>
                      <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        We transform concepts<br />into digital realities.
                      </h2>
                    </ParallaxTitle>
                    <p className="text-gray-400 text-xs md:text-sm">
                      Our capabilities are organized around three operational verticals. Select any module to interact with our live simulations, trace database ledgers, or tune neural networks.
                    </p>
                  </motion.div>

                  {/* Interactive Pillar Showcase Component */}
                  <motion.div variants={fadeInUpVariants}>
                    <PillarShowcase activeTab={activePillar} setActiveTab={setActivePillar} />
                  </motion.div>
                </motion.div>
              </section>

              {/* SECTION 4: PRODUCTS */}
              <section 
                id="products"
                className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 max-w-7xl mx-auto"
              >
                <motion.div
                  variants={sectionContainerVariants}
                  initial="hidden"
                  animate={revealedSections["products"] ? "visible" : "hidden"}
                  className="space-y-12 text-left pointer-events-auto"
                >
                  {/* Headline */}
                  <motion.div variants={fadeInUpVariants} className="max-w-2xl space-y-3">
                    <p className="font-mono text-xs text-brand-cyan tracking-widest uppercase font-bold">
                      PROPRIETARY SUITE
                    </p>
                    <ParallaxTitle offset={35}>
                      <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Ready-to-Deploy Solutions
                      </h2>
                    </ParallaxTitle>
                    <p className="text-gray-400 text-xs md:text-sm">
                      We design and operate specialized platforms. Toggle the dashboard nodes below to inspect our automated print console and high-throughput transaction terminals.
                    </p>
                  </motion.div>

                  {/* Interactive showcase box */}
                  <motion.div variants={fadeInUpVariants}>
                    <ProductShowcase 
                      selectedProduct={selectedProduct} 
                      setSelectedProduct={setSelectedProduct} 
                    />
                  </motion.div>
                </motion.div>
              </section>

              {/* SECTION 5: CONTACT */}
              <section 
                id="contact"
                className="min-h-screen flex flex-col justify-center py-24 px-4 md:px-8 max-w-7xl mx-auto"
              >
                <motion.div
                  variants={sectionContainerVariants}
                  initial="hidden"
                  animate={revealedSections["contact"] ? "visible" : "hidden"}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left pointer-events-auto"
                >
                  {/* Left detail Column (5 cols) */}
                  <motion.div variants={fadeInUpVariants} className="lg:col-span-5 space-y-6">
                    <div className="space-y-3">
                      <p className="font-mono text-xs text-brand-cyan tracking-widest uppercase font-bold">
                        GET IN TOUCH
                      </p>
                      <ParallaxTitle offset={30}>
                        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                          Let's engineer together.
                        </h2>
                      </ParallaxTitle>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      Have a vision for a complex web app, a native mobile product, or need specialized system integrations? Submit the developer console request on the right.
                    </p>

                    {/* Static Contact Points */}
                    <div className="space-y-4 pt-4 border-t border-white/5 font-mono text-xs">
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Mail className="w-4 h-4 text-brand-cyan" />
                        <span>solutions@hextorq.com</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <MessageSquare className="w-4 h-4 text-brand-violet" />
                        <span>Instant dispatch terminal</span>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-gray-500 font-mono">
                      HEXTORQ HQ • ASIA PACIFIC & GLOBAL INTEGRATION
                    </div>
                  </motion.div>

                  {/* Right Form terminal Column (7 cols) */}
                  <motion.div variants={fadeInUpVariants} className="lg:col-span-7">
                    <div className="w-full frosted-glass border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {/* Form Header */}
                      <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-gray-400 tracking-wider">
                          hextorq_comms_gateway.exe
                        </span>
                        <div className="flex space-x-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-6 bg-brand-slate/40 min-h-[300px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                          {!isSubmitted ? (
                            <motion.form
                              key="form"
                              onSubmit={handleContactSubmit}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                                    Your Name
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Elena Rostova"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white font-mono focus:border-brand-cyan outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    required
                                    placeholder="e.g. elena@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white font-mono focus:border-brand-cyan outline-none"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                                  Message / Project Brief
                                  </label>
                                <textarea
                                  required
                                  rows={4}
                                  placeholder="Describe the scope, technical parameters, and desired timelines of your integration..."
                                  value={formData.message}
                                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                  className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white font-mono focus:border-brand-cyan outline-none resize-none"
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center space-x-2 py-3 rounded bg-brand-cyan text-black border border-brand-cyan hover:bg-brand-cyan/85 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitting ? "ENCRYPTING & DISPATCHING..." : "DISPATCH DISCOVERY PAYLOAD"}</span>
                              </button>
                            </motion.form>
                          ) : (
                            <motion.div
                              key="success"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-left font-mono text-xs space-y-4"
                            >
                              <div className="h-10 w-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 glow-cyan">
                                <Check className="w-5 h-5" />
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-green-400 font-bold tracking-wider">
                                  ✔ TELEMETRY DISPATCHED SUCCESSFULLY.
                                </p>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                  [INFO] Connection verified. Our communication routing nodes have recorded your payload. A Hextorq engineering lead will review the parameters and establish direct handshake contact within 12 cycles.
                                </p>
                              </div>

                              <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1 text-[10px] text-gray-500">
                                <div>GATEWAY_STATUS: ACK_RECEIVED</div>
                                <div>ENCRYPTION_HASH: 7F8E9C92B410D6A3</div>
                                <div>TIMESTAMP: {new Date().toUTCString()}</div>
                              </div>

                              <button
                                onClick={() => setIsSubmitted(false)}
                                className="px-4 py-2 rounded border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors text-[10px] tracking-wider uppercase font-bold"
                              >
                                SUBMIT ANOTHER BRIEF
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* FOOTER */}
              <footer className="py-8 px-4 md:px-8 border-t border-white/5 bg-black/30 text-left pointer-events-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm tracking-wider text-white">HEXTORQ</span>
                    <span className="font-mono text-[9px] text-gray-500 mt-1">
                      © {new Date().getFullYear()} Hextorq IT Solutions. All rights reserved.
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 font-mono text-[10px] text-gray-400">
                    <a href="#hero" className="hover:text-brand-cyan transition-colors">Core</a>
                    <a href="#services" className="hover:text-brand-cyan transition-colors">Services</a>
                    <a href="#products" className="hover:text-brand-cyan transition-colors">Products Suite</a>
                    <a href="#contact" className="hover:text-brand-cyan transition-colors">Integrations</a>
                  </div>
                </div>
              </footer>

            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
