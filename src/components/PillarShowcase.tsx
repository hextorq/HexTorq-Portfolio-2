import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, Globe, Activity, Code, Play, CheckCircle, 
  Terminal, Sliders, Database, Smartphone, Network, ChevronRight, BookOpen
} from "lucide-react";
import { soundFx } from "../lib/audio";

interface PillarData {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  verticals: { name: string; desc: string }[];
  tech: string[];
  accentColor: string;
}

const PILLARS: PillarData[] = [
  {
    id: "digital",
    num: "01",
    title: "Digital Solutions",
    subtitle: "Enterprise Software & Web Architectures",
    description: "We sculpt high-performance, secure digital environments. From bespoke CRM/ERP structures to lightning-fast cross-platform mobile apps, we prioritize memory efficiency, elegant code, and bulletproof security.",
    verticals: [
      { name: "Custom Software", desc: "Tailored backend architectures, billing systems, and cloud infrastructure." },
      { name: "Web Applications", desc: "Bespoke corporate platforms, e-commerce, and modular landing hubs." },
      { name: "Mobile Ecosystems", desc: "High-fidelity native and cross-platform apps (Android, iOS)." }
    ],
    tech: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS"],
    accentColor: "from-amber-500 to-amber-600"
  },
  {
    id: "innovation",
    num: "02",
    title: "Innovation & Automation",
    subtitle: "Next-Gen AI & Industrial IoT Matrices",
    description: "We integrate intelligence and autonomy into industrial and enterprise operations. Our systems deploy machine vision, custom AI agents, and IoT sensor meshes that monitor telemetry streams in real time.",
    verticals: [
      { name: "AI & Neural Agents", desc: "Custom LLM integrations, OCR, object detection, and automated chatbots." },
      { name: "IoT & Sensor Arrays", desc: "Industrial sensor monitoring, automation, and custom hardware integration." },
      { name: "SaaS Platforms", desc: "PrintFlow print automation and HexPay high-throughput gateways." }
    ],
    tech: ["Python", "TensorFlow", "MQTT", "ESP32", "WebSockets", "FastAPI", "Rust"],
    accentColor: "from-amber-600 to-amber-700"
  },
  {
    id: "education",
    num: "03",
    title: "Education & Engineering",
    subtitle: "IEEE Projects & Academic Research Guidance",
    description: "We translate pioneering engineering concepts into functional, high-quality reference projects. Our guidance bridges advanced academic theories with robust, production-ready research frameworks.",
    verticals: [
      { name: "Final Year & IEEE Projects", desc: "Full software/hardware setups for AI, ML, IoT, and Web architectures." },
      { name: "Research Development", desc: "Methodology validation, algorithms, and technical presentation consulting." },
      { name: "Custom Prototyping", desc: "Turnkey hardware, schematic design, and software stack validation." }
    ],
    tech: ["IEEE Standards", "Arduino", "MATLAB", "AI Models", "PCB Design", "Research Guidance"],
    accentColor: "from-amber-700 to-amber-800"
  }
];

interface PillarShowcaseProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function PillarShowcase({ activeTab: propActiveTab, setActiveTab: propSetActiveTab }: PillarShowcaseProps = {}) {
  const [localActiveTab, setLocalActiveTab] = useState<string>("digital");
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setLocalActiveTab;

  // State for DIGITAL SOLUTIONS simulation
  const [systemLatency, setSystemLatency] = useState("2.4");
  const [dbQueries, setDbQueries] = useState(240);
  const [erpLoad, setErpLoad] = useState(42);
  const [recentTransactions, setRecentTransactions] = useState<string[]>([
    "✔ Handshake validated at [UTC 10:20:11]",
    "✔ CRM Sync: Client ledger written [ID: 99401]",
    "✔ API billing router update completed"
  ]);

  // State for INNOVATION simulation
  const [sensorTemp, setSensorTemp] = useState(24.5);
  const [sensorHumidity, setSensorHumidity] = useState(58.2);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([
    "[SYS] Model loaded: ResNet-50",
    "[SYS] Sensor thread pool listening on port 8080",
    "[SYS] Machine status: STABLE"
  ]);

  // State for EDUCATION simulation
  const [projectComplexity, setProjectComplexity] = useState(70);
  const [projectStage, setProjectStage] = useState(0);

  // Trigger continuous lightweight metrics variation
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemLatency((Math.random() * 5 + 1).toFixed(1));

      // Vary DB metrics slightly
      setDbQueries(q => Math.max(100, Math.min(500, q + Math.floor(Math.random() * 21) - 10)));
      setErpLoad(l => Math.max(10, Math.min(95, l + Math.floor(Math.random() * 9) - 4)));

      // Vary IoT sensor data
      setSensorTemp(t => parseFloat((t + (Math.random() * 0.4 - 0.2)).toFixed(2)));
      setSensorHumidity(h => parseFloat((h + (Math.random() * 0.6 - 0.3)).toFixed(2)));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Handler for DIGITAL simulator write button
  const triggerDbWrite = () => {
    soundFx.click();
    const actions = [
      "CRM Sync: Dispatch ledger generated",
      "Billing: Batch reconciliation initialized",
      "ERP: Cloud cache invalidated & cleared",
      "API: Webhook event posted to node_edge"
    ];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const time = new Date().toLocaleTimeString();
    
    setRecentTransactions(prev => [
      `✔ ${randomAction} [${time}]`,
      ...prev.slice(0, 2)
    ]);
    setDbQueries(q => q + 15);
    setErpLoad(l => Math.min(99, l + 3));
  };

  // Handler for INNOVATION AI query trigger
  const triggerAiAgent = () => {
    if (isAiProcessing) return;
    soundFx.click();
    setIsAiProcessing(true);
    setAiLogs(prev => [
      ...prev,
      "[AI_AGENT] Received query: 'Initialize anomaly scan across sensor array'"
    ]);

    setTimeout(() => {
      setAiLogs(prev => [
        ...prev,
        "[NEURAL_GRID] Propagating sensor vectors to hidden layers...",
        "[NEURAL_GRID] Analysis: 0.998 threshold matched. No anomaly."
      ]);
      soundFx.success();
      setIsAiProcessing(false);
    }, 1800);
  };

  const currentPillar = PILLARS.find(p => p.id === activeTab) || PILLARS[0];

  return (
    <div className="w-full space-y-12">
      {/* 1. Large Editorial Pillar Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-white/10 pb-4">
        {PILLARS.map((p) => {
          const isActive = p.id === activeTab;
          return (
            <button
              key={p.id}
              onClick={() => {
                setActiveTab(p.id);
                soundFx.select();
              }}
              className={`relative py-6 px-6 rounded-xl text-left transition-all duration-500 overflow-hidden ${
                isActive 
                  ? "bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 shadow-2xl scale-[1.01]" 
                  : "border border-transparent hover:border-white/5 opacity-50 hover:opacity-80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePillarUnderline"
                  className="absolute bottom-0 left-6 right-6 h-[2px] bg-brand-cyan"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              {/* Number and subtitle header */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-brand-cyan tracking-widest font-bold">
                  PILLAR // {p.num}
                </span>
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                  {p.id.toUpperCase()}_ENV
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                {p.title}
              </h3>
              
              <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
                {p.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* 2. Main Split Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
        >
          {/* LEFT COLUMN: Narrative & Service Verticals (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-brand-cyan/20 text-brand-cyan uppercase tracking-wider bg-brand-cyan/5 inline-block">
                  {currentPillar.subtitle}
                </span>
                <h4 className="font-display text-2xl font-black text-white tracking-tight">
                  {currentPillar.title} Ecosystem
                </h4>
              </div>

              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                {currentPillar.description}
              </p>

              {/* Dynamic Service Verticals list */}
              <div className="space-y-4 pt-2">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                  Core Operational Nodes
                </p>
                <div className="space-y-3">
                  {currentPillar.verticals.map((v, i) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded bg-white/[0.02] border border-white/5 flex items-start space-x-3 group hover:border-brand-cyan/30 transition-colors"
                    >
                      <div className="p-1.5 rounded bg-brand-cyan/10 text-brand-cyan mt-0.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          {v.name}
                        </span>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tech Stack Matrix Tag List */}
            <div className="space-y-2 pt-4 border-t border-white/5">
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider block">
                Technical Stack Matrix
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentPillar.tech.map((t) => (
                  <span 
                    key={t}
                    className="font-mono text-[9px] px-2 py-1 bg-white/5 rounded text-white border border-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive High-Fidelity Simulator (7 cols) */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[420px] rounded-xl border border-white/10 overflow-hidden frosted-glass shadow-2xl flex flex-col justify-between">
              {/* Simulator Header */}
              <div className="bg-black/45 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">
                    LIVE_CONSOLE // MODULE_{currentPillar.num}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Render dynamic simulator content based on activeTab */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                
                {/* 1. DIGITAL SOLUTIONS SIMULATOR */}
                {activeTab === "digital" && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Interactive copy */}
                      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded">
                        <div>
                          <p className="text-[10px] font-mono text-gray-500 uppercase">Interactive Playground</p>
                          <h5 className="text-white text-xs font-bold font-mono">ERP & DB TRANSACTION CONSOLE</h5>
                        </div>
                        <button 
                          onClick={triggerDbWrite}
                          className="px-4 py-2 bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/40 hover:border-brand-cyan text-[10px] font-mono rounded uppercase tracking-wider transition-all duration-300 flex items-center space-x-2"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>Trigger Ledger Write</span>
                        </button>
                      </div>

                      {/* Micro visual stats blocks */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                          <span className="font-mono text-[9px] text-gray-500 uppercase block">Active Threads</span>
                          <span className="font-display text-xl font-bold text-white tracking-tight">32 / 32</span>
                        </div>
                        <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                          <span className="font-mono text-[9px] text-gray-500 uppercase block">Queries / sec</span>
                          <span className="font-display text-xl font-bold text-brand-cyan tracking-tight">{dbQueries}</span>
                        </div>
                        <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                          <span className="font-mono text-[9px] text-gray-500 uppercase block">ERP CPU Load</span>
                          <span className="font-display text-xl font-bold text-white tracking-tight">{erpLoad}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction logs */}
                    <div className="space-y-2 bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-[10px]">
                      <div className="flex justify-between items-center text-gray-500 border-b border-white/5 pb-1.5 mb-1.5">
                        <span>TRANSACTION_LOGS</span>
                        <span>AUTO_REFRESH_ON</span>
                      </div>
                      <div className="space-y-1.5 min-h-[90px]">
                        {recentTransactions.map((tx, idx) => (
                          <div 
                            key={idx} 
                            className={`flex justify-between ${idx === 0 ? "text-brand-cyan font-bold" : "text-gray-400"}`}
                          >
                            <span>{tx}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. INNOVATION & AUTOMATION SIMULATOR */}
                {activeTab === "innovation" && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* AI Agent trigger bar */}
                      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded">
                        <div>
                          <p className="text-[10px] font-mono text-gray-500 uppercase">Intelligent Neural Hub</p>
                          <h5 className="text-white text-xs font-bold font-mono">AI AGENT CO-PROCESSOR</h5>
                        </div>
                        <button 
                          onClick={triggerAiAgent}
                          disabled={isAiProcessing}
                          className={`px-4 py-2 rounded text-[10px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 ${
                            isAiProcessing 
                              ? "bg-white/10 text-gray-500 border border-white/5 cursor-not-allowed"
                              : "bg-brand-cyan/20 hover:bg-brand-cyan/30 text-brand-cyan border border-brand-cyan/40 hover:border-brand-cyan"
                          }`}
                        >
                          <Play className={`w-3.5 h-3.5 ${isAiProcessing ? "animate-spin" : ""}`} />
                          <span>{isAiProcessing ? "AI Modeling..." : "Analyze Sensors"}</span>
                        </button>
                      </div>

                      {/* IoT and AI Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                          <span className="font-mono text-[9px] text-gray-500 uppercase block">Ambient Temp</span>
                          <span className="font-display text-xl font-bold text-white tracking-tight">{sensorTemp}°C</span>
                        </div>
                        <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                          <span className="font-mono text-[9px] text-gray-500 uppercase block">Rel Humidity</span>
                          <span className="font-display text-xl font-bold text-white tracking-tight">{sensorHumidity}%</span>
                        </div>
                        <div className="p-3 bg-black/30 border border-white/5 rounded text-center">
                          <span className="font-mono text-[9px] text-gray-500 uppercase block">Inference Speed</span>
                          <span className="font-display text-xl font-bold text-brand-cyan tracking-tight">12ms</span>
                        </div>
                      </div>
                    </div>

                    {/* Sensor graph representation and telemetry logs */}
                    <div className="space-y-2 bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-[10px]">
                      <div className="flex justify-between items-center text-gray-500 border-b border-white/5 pb-1.5 mb-1.5">
                        <span>NEURAL_&_IOT_PIPELINE</span>
                        <span className="animate-pulse text-brand-cyan">● INTERACTION_READY</span>
                      </div>
                      <div className="space-y-1.5 min-h-[90px] overflow-y-auto max-h-[120px]">
                        {aiLogs.slice(-4).map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`truncate ${log.includes("✔") || log.includes("threshold") ? "text-brand-cyan" : "text-gray-400"}`}
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. EDUCATION & ENGINEERING SIMULATOR */}
                {activeTab === "education" && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Dynamic complexity slider */}
                      <div className="space-y-2 bg-white/[0.02] border border-white/5 p-4 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-mono text-gray-500 uppercase">IEEE Complexity Metric</p>
                            <h5 className="text-white text-xs font-bold font-mono">RESEARCH GRID TUNER</h5>
                          </div>
                          <span className="font-mono text-xs font-bold text-brand-cyan">
                            {projectComplexity}% Complexity
                          </span>
                        </div>
                        <input 
                          type="range"
                          min="30"
                          max="100"
                          value={projectComplexity}
                          onChange={(e) => {
                            setProjectComplexity(Number(e.target.value));
                          }}
                          className="w-full accent-brand-cyan h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Interactive Step Selection Timeline */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { step: "A", label: "IEEE Base" },
                          { step: "B", label: "ML / IoT" },
                          { step: "C", label: "Validation" },
                          { step: "D", label: "Paper" }
                        ].map((s, index) => {
                          const isCurrent = index === projectStage;
                          return (
                            <button
                              key={s.step}
                              onClick={() => {
                                setProjectStage(index);
                                soundFx.select();
                              }}
                              className={`p-2.5 rounded border text-left transition-all duration-300 ${
                                isCurrent 
                                  ? "bg-brand-cyan/20 border-brand-cyan text-white shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                                  : "bg-black/20 border-white/5 hover:border-white/15 text-gray-400"
                              }`}
                            >
                              <div className="font-mono text-[9px] uppercase text-brand-cyan font-bold">
                                Step 0{index + 1}
                              </div>
                              <div className="text-[10px] font-bold truncate mt-0.5">
                                {s.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected step details */}
                    <div className="bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-[10px] space-y-2">
                      <div className="flex justify-between items-center text-gray-500 border-b border-white/5 pb-1.5 mb-1.5">
                        <span>STAGE_ANALYSIS</span>
                        <span>SYSTEM: ON_SPEC</span>
                      </div>
                      <div className="space-y-1.5 min-h-[90px]">
                        {projectStage === 0 && (
                          <>
                            <div className="text-brand-cyan">▶ Thesis Base Selection: [ACTIVE]</div>
                            <p className="text-gray-400 leading-relaxed text-[11px]">
                              Synthesizing complex IEEE reference papers in AI, computer vision, or embedded IoT. Complexity rating adjusts math matrix constraints and data models to meet peak standards.
                            </p>
                          </>
                        )}
                        {projectStage === 1 && (
                          <>
                            <div className="text-brand-cyan">▶ ML Models & Hardware Integration: [ACTIVE]</div>
                            <p className="text-gray-400 leading-relaxed text-[11px]">
                              Interfacing neural algorithms with microcontrollers (ESP32, Arduino) or web systems. Hardware schematics are simulated at {(projectComplexity * 0.8).toFixed(0)}% hardware yield parameter.
                            </p>
                          </>
                        )}
                        {projectStage === 2 && (
                          <>
                            <div className="text-brand-cyan">▶ Rigorous Data Validation: [ACTIVE]</div>
                            <p className="text-gray-400 leading-relaxed text-[11px]">
                              Compiling confusion matrices, training accuracy curves, and performance benchmarking. Precision rate established at {parseFloat((0.92 + (projectComplexity * 0.0006)).toFixed(4)) * 100}% reliability score.
                            </p>
                          </>
                        )}
                        {projectStage === 3 && (
                          <>
                            <div className="text-brand-cyan">▶ Final IEEE Paper Formulation: [READY]</div>
                            <p className="text-gray-400 leading-relaxed text-[11px]">
                              Formatting final draft according to exact IEEE standards, structuring results, preparing high-fidelity research slides, and ensuring successful delivery and grading.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status footer bar */}
              <div className="bg-black/35 px-4 py-2 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-gray-500">
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>SECURE CONNECTED SOCKETS</span>
                </span>
                <span>SYSTEM LATENCY: {systemLatency}ms</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
