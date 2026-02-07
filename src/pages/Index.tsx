import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Image,
  History,
  Settings,
  Camera,
  FileDown,
  FileJson,
  Share2,
  Gauge,
} from "lucide-react";

const mainCards = [
  {
    to: "/analyze",
    icon: Activity,
    title: "Analyze Movement",
    desc: "Upload trainer & user videos for AI biomechanical analysis",
    glow: true,
  },
  {
    to: "/generate",
    icon: Image,
    title: "Generate Correct Form",
    desc: "AI-powered form correction image generation",
    glow: true,
  },
  {
    to: "#",
    icon: History,
    title: "Past Analyses",
    desc: "Review your previous sessions and progress",
    glow: false,
  },
  {
    to: "#",
    icon: Settings,
    title: "Settings",
    desc: "Configure API endpoints and preferences",
    glow: false,
  },
];

const extraFeatures = [
  { icon: Camera, label: "Real-Time Webcam Mode" },
  { icon: FileDown, label: "Download Full Report" },
  { icon: FileJson, label: "Export Skeleton Data" },
  { icon: Share2, label: "Share Analysis Link" },
  { icon: Gauge, label: "Confidence Score Gauge" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-primary mb-6">
              <Activity className="w-3.5 h-3.5" />
              AI-Powered Biomechanical Analysis
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-black leading-[0.95] mb-6">
              <span className="gradient-text">Visual AI</span>
              <br />
              Gym Coach
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 font-light">
              Upload. Analyze. Correct.
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto mb-12">
              Advanced computer vision for real-time exercise form analysis. Compare your technique against expert trainers and get instant AI feedback.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 neon-glow transition-all"
              >
                <Activity className="w-4 h-4" />
                Start Analysis
              </Link>
              <Link
                to="/generate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-semibold hover:bg-secondary transition-all"
              >
                <Image className="w-4 h-4" />
                Generate Image
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {mainCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={card.to}
                className={`block p-6 rounded-2xl glass hover-lift group ${
                  card.glow ? "neon-border" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center">
            Extensible Features
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {extraFeatures.map((f) => (
              <div
                key={f.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-xs text-muted-foreground hover:text-foreground cursor-default transition-colors"
              >
                <f.icon className="w-3.5 h-3.5" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
