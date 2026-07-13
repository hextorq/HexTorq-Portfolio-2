export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  techStack: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  liveUrl?: string;
  metrics: { label: string; value: string }[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: "web-dev",
    title: "Web Development",
    shortDesc: "Bespoke, high-performance, and responsive web applications.",
    fullDesc: "We construct enterprise-grade web applications designed for maximum scalability, pristine code quality, and exceptional user experience. Using modern frameworks and custom SSR/SSG pipelines, we ensure lightning-fast page loads and high SEO rankings.",
    techStack: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "TailwindCSS"],
  },
  {
    id: "app-dev",
    title: "App Development",
    shortDesc: "High-fidelity iOS and Android native and cross-platform experiences.",
    fullDesc: "Our mobile development engineers build fluid, responsive apps that feel completely native. We focus heavily on offline-first architectures, state-of-the-art animations, secure local storage, and optimal memory management to ensure a premium product.",
    techStack: ["React Native", "Flutter", "Swift", "Kotlin", "WebSockets", "Firebase"],
  },
  {
    id: "it-solutions",
    title: "IT Solutions & Consulting",
    shortDesc: "Cloud migration, DevOps automation, and robust enterprise design.",
    fullDesc: "We provide comprehensive architecture design, cloud orchestration (AWS/GCP), secure API integrations, and robust system auditing. Our consultants help modernize legacy codebases and optimize infrastructure costs.",
    techStack: ["Docker", "Kubernetes", "AWS", "Google Cloud", "CI/CD", "Terraform"],
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "printflow",
    name: "PrintFlow",
    tagline: "Enterprise Printing Automation",
    description: "An automated IoT and network print queue management engine designed to eliminate manual intervention. Features automatic driver matching, predictive maintenance notifications, intelligent paper-saver routing, and dynamic department billing.",
    features: [
      "Zero-Touch Automated Queueing",
      "Predictive Consumables Monitoring",
      "Secure PIN/Badge Pull Printing",
      "Comprehensive Carbon-Footprint Auditing"
    ],
    liveUrl: "https://printflow.hextorq.com",
    metrics: [
      { label: "Paper Waste Reduction", value: "37%" },
      { label: "Queue Overhead Cut", value: "60%" },
      { label: "Active Enterprise Nodes", value: "1,200+" }
    ]
  },
  {
    id: "hexpay",
    name: "HexPay",
    tagline: "High-Throughput Payment Gateway",
    description: "A developer-first payment infrastructure designed for effortless merchant integration. Optimized for sub-second transactional latency, HexPay employs distributed consensus systems, military-grade hardware security modules, and automated reconciliation.",
    features: [
      "99.999% Gateway Uptime",
      "Advanced AI Fraud Shield",
      "One-Click SDK Implementations",
      "Multi-Currency Auto-Settlement"
    ],
    liveUrl: "https://hexpay.hextorq.com",
    metrics: [
      { label: "Avg Transaction Time", value: "180ms" },
      { label: "Fraud Prevention Rate", value: "99.98%" },
      { label: "PCI-DSS Level", value: "Category 1" }
    ]
  }
];

export interface CompanyMilestone {
  year: string;
  title: string;
  description: string;
}

export const MILESTONES: CompanyMilestone[] = [
  {
    year: "2021",
    title: "The Genesis",
    description: "Hextorq was founded by a team of visionary engineers seeking to bridge the gap between complex enterprise challenges and elegant software solutions."
  },
  {
    year: "2022",
    title: "PrintFlow Launch",
    description: "Launched PrintFlow, our proprietary printing automation platform, rapidly acquiring 40+ industrial and education sector clients."
  },
  {
    year: "2023",
    title: "Expanding Horizons",
    description: "Scaled our custom development services, shipping 50+ successful projects and expanding into cross-platform mobile apps."
  },
  {
    year: "2024",
    title: "HexPay Gateway Integration",
    description: "Engineered and integrated HexPay, our ultra-fast and secure payment gateway, processing millions in transactions in its first year."
  },
  {
    year: "2026",
    title: "Unified Hub",
    description: "Consolidating our live platforms, services, and SaaS tools under a singular, high-performance portfolio ecosystem."
  }
];
