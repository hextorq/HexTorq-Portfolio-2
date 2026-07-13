import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Printer, Coins, ShieldCheck, Check, Play, RefreshCw, 
  FileText, Sparkles, Cpu, Layers, DollarSign, CreditCard, ArrowRight
} from "lucide-react";
import { PRODUCTS, ProductItem } from "../types";
import { soundFx } from "../lib/audio";

interface ProductShowcaseProps {
  selectedProduct: string | null;
  setSelectedProduct: (p: string | null) => void;
}

// Mock print files for PrintFlow Simulator
const PRESET_FILES = [
  { name: "legal_lease_agreement.pdf", size: "4.2 MB", pages: 12, dept: "Legal" },
  { name: "marketing_q3_infographics.png", size: "18.5 MB", pages: 1, dept: "Design" },
  { name: "annual_financial_audit.xlsx", size: "1.4 MB", pages: 35, dept: "Finance" },
  { name: "manufacturing_cad_schematics.dxf", size: "45.0 MB", pages: 4, dept: "Engineering" }
];

export default function ProductShowcase({
  selectedProduct,
  setSelectedProduct
}: ProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"printflow" | "hexpay">("printflow");

  // Sync state when parent scroll changes active selection
  useEffect(() => {
    if (selectedProduct === "printflow" || selectedProduct === "hexpay") {
      setActiveTab(selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    setSelectedProduct(activeTab);
  }, [activeTab, setSelectedProduct]);

  // --- PrintFlow Simulator State ---
  const [printQueue, setPrintQueue] = useState<any[]>([
    { id: 1, name: "confidential_m_and_a.docx", pages: 8, dept: "Legal", status: "completed", progress: 100, timestamp: "08:14:10" },
    { id: 2, name: "hiring_onboarding_handbook.pdf", pages: 24, dept: "HR", status: "printing", progress: 68, timestamp: "08:15:32" },
    { id: 3, name: "architecture_render_facade.tiff", pages: 2, dept: "Design", status: "queued", progress: 0, timestamp: "08:16:01" }
  ]);
  const [tonerLevel, setTonerLevel] = useState(82);
  const [paperSaved, setPaperSaved] = useState(14022);
  const [isSimulatingPrint, setIsSimulatingPrint] = useState(false);
  const [newFileCounter, setNewFileCounter] = useState(0);

  const triggerMockPrint = () => {
    if (isSimulatingPrint) return;
    soundFx.click();
    setIsSimulatingPrint(true);

    const randomFile = PRESET_FILES[newFileCounter % PRESET_FILES.length];
    setNewFileCounter(prev => prev + 1);

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];

    const newJob = {
      id: Date.now(),
      name: randomFile.name,
      pages: randomFile.pages,
      dept: randomFile.dept,
      status: "optimizing",
      progress: 0,
      timestamp: timeStr
    };

    setPrintQueue(prev => [newJob, ...prev]);

    // Stage 1: Auto optimization & queue routing (0.8s)
    setTimeout(() => {
      setPrintQueue(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, status: "printing", progress: 15 } : job
      ));

      // Stage 2: Progress rendering (1.5s total)
      let progressTimer = setInterval(() => {
        setPrintQueue(prev => prev.map(job => {
          if (job.id === newJob.id) {
            const nextProgress = job.progress + 25;
            if (nextProgress >= 100) {
              clearInterval(progressTimer);
              setIsSimulatingPrint(false);
              soundFx.success();
              setTonerLevel(lvl => Math.max(10, lvl - 1));
              setPaperSaved(p => p + (job.pages * 0.4)); // assume 40% double-sided paper efficiency
              return { ...job, status: "completed", progress: 100 };
            }
            return { ...job, progress: nextProgress };
          }
          return job;
        }));
      }, 350);
    }, 800);
  };

  const resetPrintSimulator = () => {
    setPrintQueue([
      { id: 1, name: "confidential_m_and_a.docx", pages: 8, dept: "Legal", status: "completed", progress: 100, timestamp: "08:14:10" }
    ]);
    setTonerLevel(95);
    setPaperSaved(14000);
  };

  // --- HexPay Gateway Simulator State ---
  const [payAmount, setPayAmount] = useState("49.99");
  const [payStatus, setPayStatus] = useState<"idle" | "authenticating" | "fraud_checking" | "clearing" | "success">("idle");
  const [gatewayLogs, setGatewayLogs] = useState<string[]>([]);
  const [gatewayHistory, setGatewayHistory] = useState<any[]>([
    { ref: "TXN-8201", amt: "$120.00", currency: "USD", status: "SETTLED", date: "Just now" },
    { ref: "TXN-7945", amt: "€2,450.00", currency: "EUR", status: "SETTLED", date: "4m ago" }
  ]);

  const triggerMockPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payStatus !== "idle") return;

    soundFx.click();
    setPayStatus("authenticating");
    setGatewayLogs(["[SYSTEM] Initiating PCI-DSS Level 1 Encrypted Handshake...", "[SSL] TLS v1.3 Secure Socket Established."]);

    setTimeout(() => {
      setPayStatus("fraud_checking");
      setGatewayLogs(prev => [
        ...prev,
        "[SHIELD] Routing transaction details to AI Fraud Core...",
        "[SHIELD] Geolocation & card footprint validated (Risk score: 0.02%)."
      ]);

      setTimeout(() => {
        soundFx.payment();
        setPayStatus("clearing");
        setGatewayLogs(prev => [
          ...prev,
          "[GATEWAY] Clearing funds with distributed clearing networks...",
          `[MERCHANT] Automated Settlement initialized for $${payAmount} USD.`
        ]);

        setTimeout(() => {
          setPayStatus("success");
          soundFx.success();
          setGatewayLogs(prev => [
            ...prev,
            "✔ Settlement finalized in 143ms.",
            `[LEDGER] Vault Token created & callback posted successfully.`
          ]);

          const randomRef = "TXN-" + Math.floor(1000 + Math.random() * 9000);
          setGatewayHistory(prev => [
            { ref: randomRef, amt: `$${payAmount}`, currency: "USD", status: "SETTLED", date: "Secs ago" },
            ...prev
          ]);
        }, 1000);
      }, 1000);
    }, 900);
  };

  const resetPaySimulator = () => {
    setPayStatus("idle");
    setGatewayLogs([]);
  };

  const productData = PRODUCTS.find(p => p.id === activeTab) as ProductItem;

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-20">
      {/* LEFT: Info Column (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Toggle buttons */}
        <div className="flex space-x-1.5 p-1 rounded-lg frosted-glass max-w-xs border border-white/5">
          <button
            onClick={() => {
              setActiveTab("printflow");
              soundFx.select();
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded font-mono text-[11px] tracking-wider uppercase transition-all duration-300 ${
              activeTab === "printflow"
                ? "bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINTFLOW</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("hexpay");
              soundFx.select();
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded font-mono text-[11px] tracking-wider uppercase transition-all duration-300 ${
              activeTab === "hexpay"
                ? "bg-brand-violet/20 border border-brand-violet/40 text-brand-violet"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>HEXPAY</span>
          </button>
        </div>

        {/* Content detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className={`h-2 w-2 rounded-full ${activeTab === "printflow" ? "bg-brand-cyan glow-cyan" : "bg-brand-violet glow-violet"}`} />
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                  {productData.tagline}
                </span>
              </div>
              <h3 className="font-display text-3xl font-extrabold text-white tracking-tight">
                {productData.name}
              </h3>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {productData.description}
            </p>

            {/* List of features */}
            <div className="space-y-2.5">
              <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                KEY ARCHITECTURE
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {productData.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs text-gray-300">
                    <span className={`p-0.5 rounded mt-0.5 ${activeTab === "printflow" ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20" : "bg-brand-violet/10 text-brand-violet border border-brand-violet/20"}`}>
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Performance metrics dashboard style */}
            <div className="pt-2">
              <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">
                LIVE PRODUCTION METRICS
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {productData.metrics.map((m, i) => (
                  <div key={i} className="frosted-glass-light border border-white/5 rounded-lg p-3 text-center">
                    <p className={`font-display text-lg font-bold tracking-tight ${activeTab === "printflow" ? "text-brand-cyan" : "text-brand-violet"}`}>
                      {m.value}
                    </p>
                    <p className="font-mono text-[8px] text-gray-400 uppercase leading-snug mt-1">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT: Live Interactive Simulator Panel (7 cols) */}
      <div className="lg:col-span-7">
        <div className="w-full frosted-glass border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono text-[10px] text-gray-500">|</span>
              <span className="font-mono text-[10px] text-gray-400 tracking-wider">
                {activeTab === "printflow" ? "printflow_orchestrator_node.env" : "hexpay_sandbox_terminal.bash"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[8px] text-green-500 uppercase tracking-widest">
                ONLINE
              </span>
            </div>
          </div>

          {/* Interactive sandbox space */}
          <div className="p-4 md:p-6 bg-brand-slate/40 min-h-[380px] flex flex-col justify-between">
            {activeTab === "printflow" ? (
              /* ========================================================= */
              /* PRINTFLOW SIMULATOR                                       */
              /* ========================================================= */
              <div className="space-y-5 flex flex-col justify-between h-full">
                {/* Visual Widgets Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Toner Widget */}
                  <div className="border border-white/5 rounded-lg p-3 bg-black/20 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-[9px] text-gray-500 tracking-widest uppercase">
                        TONER CARTRIDGES
                      </p>
                      <p className="font-display text-xl font-bold text-white">
                        {tonerLevel}% <span className="text-xs text-gray-400 font-normal">Capacitive</span>
                      </p>
                    </div>
                    {/* Visual radial level */}
                    <div className="h-10 w-10 relative flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle 
                          cx="20" cy="20" r="16" fill="transparent" stroke="#f59e0b" strokeWidth="3" 
                          strokeDasharray={2 * Math.PI * 16}
                          strokeDashoffset={2 * Math.PI * 16 * (1 - tonerLevel / 100)}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <Printer className="w-4 h-4 text-brand-cyan absolute" />
                    </div>
                  </div>

                  {/* Carbon/Paper Savings Widget */}
                  <div className="border border-white/5 rounded-lg p-3 bg-black/20 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-[9px] text-gray-500 tracking-widest uppercase">
                        TOTAL AUTO SAVINGS
                      </p>
                      <p className="font-display text-xl font-bold text-brand-cyan">
                        {paperSaved.toLocaleString()}{" "}
                        <span className="text-[10px] text-gray-400 font-normal">SHTS</span>
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20">
                      <Sparkles className="w-5 h-5 text-brand-cyan animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Simulated print queues list */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest font-bold flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-brand-cyan" />
                      <span>PRINTQUEUE ENGINE</span>
                    </p>
                    <span className="font-mono text-[9px] text-gray-500">
                      {printQueue.length} Active Jobs
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {printQueue.map((job) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="p-2.5 rounded border border-white/5 bg-black/30 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center space-x-3 truncate mr-4">
                            <FileText className={`w-4 h-4 shrink-0 ${
                              job.status === "completed" ? "text-gray-500" : "text-brand-cyan"
                            }`} />
                            <div className="truncate text-left">
                              <p className="text-gray-200 truncate font-semibold text-[11px]">{job.name}</p>
                              <p className="text-[8px] text-gray-500">
                                Pages: {job.pages} | Dept: {job.dept} | Time: {job.timestamp}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center space-x-3">
                            {job.status === "optimizing" && (
                              <span className="text-[9px] text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center space-x-1 animate-pulse">
                                <Cpu className="w-2.5 h-2.5 animate-spin" />
                                <span>OPTIMIZING</span>
                              </span>
                            )}
                            {job.status === "printing" && (
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-1 bg-white/5 rounded overflow-hidden">
                                  <div className="bg-brand-cyan h-full transition-all duration-300" style={{ width: `${job.progress}%` }} />
                                </div>
                                <span className="text-[9px] text-brand-cyan">{job.progress}%</span>
                              </div>
                            )}
                            {job.status === "completed" && (
                              <span className="text-[9px] text-green-400 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 flex items-center space-x-1">
                                <Check className="w-2.5 h-2.5" />
                                <span>COMPLETED</span>
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Queue interactions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5">
                  <button
                    onClick={triggerMockPrint}
                    disabled={isSimulatingPrint || tonerLevel < 15}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded font-mono text-xs tracking-wider uppercase border transition-all ${
                      isSimulatingPrint
                        ? "bg-brand-cyan/5 border-brand-cyan/20 text-brand-cyan/50 cursor-not-allowed"
                        : "bg-brand-cyan text-black border-brand-cyan hover:bg-brand-cyan/80 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>SIMULATE AUTOMATED JOB DISPATCH</span>
                  </button>

                  <button
                    onClick={resetPrintSimulator}
                    className="px-3 py-2.5 rounded border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all font-mono text-xs flex items-center justify-center"
                    title="Reset Simulator"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================= */
              /* HEXPAY SIMULATOR                                          */
              /* ========================================================= */
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Simulated Terminal UI (5 cols) */}
                  <form onSubmit={triggerMockPayment} className="md:col-span-5 space-y-3">
                    <div className="space-y-1 text-left">
                      <label className="block font-mono text-[9px] text-gray-500 uppercase tracking-wider">
                        TRANSACTION AMOUNT (USD)
                      </label>
                      <div className="relative rounded border border-white/10 focus-within:border-brand-violet overflow-hidden bg-black/30">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          step="0.01"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          disabled={payStatus !== "idle"}
                          className="w-full bg-transparent border-0 pl-7 pr-3 py-2 text-sm text-white font-mono focus:ring-0 outline-none"
                        />
                      </div>
                    </div>

                    {/* Pre-sets */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {["9.99", "49.99", "250.00"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPayAmount(preset)}
                          disabled={payStatus !== "idle"}
                          className={`py-1 rounded font-mono text-[10px] border transition-all ${
                            payAmount === preset
                              ? "bg-brand-violet/20 border-brand-violet text-brand-violet"
                              : "border-white/5 hover:border-white/10 text-gray-400"
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={payStatus !== "idle"}
                      className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded font-mono text-xs tracking-wider uppercase border transition-all ${
                        payStatus !== "idle"
                          ? "bg-brand-violet/5 border-brand-violet/20 text-brand-violet/50 cursor-not-allowed"
                          : "bg-brand-violet text-white border-brand-violet hover:bg-brand-violet/80 hover:shadow-[0_0_12px_rgba(180,83,9,0.3)]"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{payStatus === "idle" ? "AUTHORIZE SETTLEMENT" : "PROCESSING..."}</span>
                    </button>
                  </form>

                  {/* Flow Steps (7 cols) */}
                  <div className="md:col-span-7 flex flex-col justify-center border border-white/5 rounded-lg p-3.5 bg-black/20 min-h-[180px]">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest font-bold flex items-center space-x-1">
                        <Cpu className="w-3 h-3 text-brand-violet" />
                        <span>INTEGRITY CHECKFLOW</span>
                      </p>
                      <button
                        type="button"
                        onClick={resetPaySimulator}
                        className="p-1 rounded text-gray-500 hover:text-white transition-colors"
                        title="Reset Sandbox"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Diagnostic list */}
                    <div className="space-y-1.5 font-mono text-[10px] text-left">
                      {payStatus === "idle" ? (
                        <p className="text-gray-500 italic text-center py-6">
                          Waiting for merchant payment trigger...
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {gatewayLogs.map((log, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`leading-relaxed ${
                                log.startsWith("✔") ? "text-green-400 font-bold" : 
                                log.startsWith("[SHIELD]") ? "text-brand-violet" : "text-gray-400"
                              }`}
                            >
                              {log}
                            </motion.div>
                          ))}
                          {payStatus !== "success" && (
                            <motion.div
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="text-brand-cyan"
                            >
                              ⚙ COMPILING METRIC SECURE HASH...
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transaction history log */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold text-left flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-brand-violet" />
                    <span>SECURE TRANSACTION LOG (REAL-TIME CALLBACKS)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {gatewayHistory.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded border border-white/5 bg-black/30 font-mono text-[10px]">
                        <div className="text-left">
                          <span className="text-gray-400 font-bold">{h.ref}</span>
                          <span className="text-gray-500 mx-1.5">•</span>
                          <span className="text-gray-400">{h.amt} {h.currency}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          <span className="text-green-400 text-[8px] font-bold tracking-widest">{h.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
