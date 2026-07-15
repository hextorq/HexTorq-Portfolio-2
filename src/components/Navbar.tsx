import { motion } from "motion/react";
import { Terminal, Shield, Workflow, Contact, MessageSquarePlus, Activity } from "lucide-react";
import { pushRouteForSection, scrollToSection } from "../routeUtils";

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const navItems = [
    { id: "hero", label: "Core", icon: Activity },
    { id: "about", label: "Story", icon: Terminal },
    { id: "services", label: "Pillars", icon: Workflow },
    { id: "products", label: "Products", icon: Shield },
    { id: "contact", label: "Contact", icon: MessageSquarePlus }
  ];

  const handleScrollTo = (id: string) => {
    pushRouteForSection(id);
    scrollToSection(id);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="fixed top-0 left-0 w-full z-40 px-4 md:px-8 py-4 flex justify-between items-center bg-transparent pointer-events-none"
    >
      {/* Logo Container */}
      <div 
        onClick={() => handleScrollTo("hero")}
        className="flex items-center space-x-3 pointer-events-auto cursor-pointer group"
      >
        <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-[0.35em] text-xs text-white group-hover:text-brand-cyan transition-colors uppercase border-b border-brand-cyan/30 pb-0.5">
            Hextorq / Portfolio
          </span>
          <span className="font-mono text-[7px] text-gray-500 tracking-[0.2em] uppercase mt-1">
            Global Tech Ecosystem
          </span>
        </div>
      </div>

      {/* Floating Glass Navigation */}
      <nav className="hidden md:flex items-center space-x-1.5 px-1.5 py-1.5 rounded-full frosted-glass border border-white/5 shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleScrollTo(item.id)}
              className={`relative px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 ${
                isActive ? "text-brand-cyan" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-white/5 rounded-full border border-brand-cyan/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile/Compact Corner Actions */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo("contact");
          }}
          className="relative overflow-hidden px-4 py-2 rounded bg-gradient-to-r from-brand-violet/20 to-brand-cyan/20 border border-brand-cyan/30 hover:border-brand-cyan text-brand-cyan font-mono text-[10px] tracking-widest uppercase transition-all duration-300"
        >
          <span className="relative z-10">START PROJECT</span>
        </a>
      </div>
    </motion.header>
  );
}
