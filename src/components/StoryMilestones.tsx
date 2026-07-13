import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MILESTONES, CompanyMilestone } from "../types";
import { ChevronRight, Calendar, Landmark, Sparkles } from "lucide-react";
import { soundFx } from "../lib/audio";

export default function StoryMilestones() {
  const [activeIdx, setActiveIdx] = useState(MILESTONES.length - 1);

  const activeMilestone = MILESTONES[activeIdx];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 relative z-20">
      {/* 3D-feeling node timeline */}
      <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4">
        {/* Horizontal connect track */}
        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/5 -translate-y-1/2 overflow-hidden rounded">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(activeIdx / (MILESTONES.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan"
          />
        </div>

        {MILESTONES.map((m, idx) => {
          const isActive = idx === activeIdx;
          const isPassed = idx < activeIdx;

          return (
            <button
              key={m.year}
              onClick={() => {
                setActiveIdx(idx);
                soundFx.select();
              }}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              {/* Glowing Node Button */}
              <motion.div
                animate={{
                  scale: isActive ? 1.25 : 1.0,
                  borderColor: isActive ? "#f59e0b" : isPassed ? "#b45309" : "rgba(255,255,255,0.1)",
                  backgroundColor: isActive ? "#0f0f0f" : isPassed ? "#b45309" : "#080808",
                }}
                transition={{ duration: 0.3 }}
                className={`h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  isActive ? "shadow-[0_0_15px_rgba(245,158,11,0.25)]" : isPassed ? "shadow-[0_0_8px_rgba(180,83,9,0.15)]" : ""
                }`}
              >
                {isActive ? (
                  <Sparkles className="w-4 h-4 text-brand-cyan glow-cyan" />
                ) : isPassed ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  color: isActive ? "#f59e0b" : isPassed ? "#ffffff" : "rgba(156,163,175,0.4)",
                  scale: isActive ? 1.1 : 1.0,
                }}
                className={`font-mono text-xs font-bold mt-2.5 transition-colors tracking-wider`}
              >
                {m.year}
              </motion.span>
            </button>
          );
        })}
      </div>

      {/* Narrative Highlight Panel */}
      <div className="relative min-h-[160px] md:min-h-[130px] rounded-xl border border-white/5 bg-brand-slate/30 frosted-glass p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute top-2 right-3 flex items-center space-x-1 font-mono text-[8px] text-gray-500 uppercase tracking-widest">
          <Calendar className="w-2.5 h-2.5" />
          <span>Milestone Index 0{activeIdx + 1}</span>
        </div>

        <div className="space-y-2 flex-1 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2.5">
                <Landmark className="w-4.5 h-4.5 text-brand-cyan" />
                <h4 className="font-display text-lg md:text-xl font-bold text-white tracking-wide">
                  {activeMilestone.title}
                </h4>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mt-2.5 max-w-2xl">
                {activeMilestone.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sequential Step Trigger */}
        <div className="shrink-0 w-full md:w-auto flex justify-end">
          <button
            onClick={() => setActiveIdx((idx) => (idx + 1) % MILESTONES.length)}
            className="flex items-center space-x-2 px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] tracking-widest uppercase transition-colors"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
