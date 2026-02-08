import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, RotateCcw, Play, Loader2, ChevronDown } from "lucide-react";
import VideoUploader from "@/components/shared/VideoUploader";
import FrameCard from "@/components/shared/FrameCard";
import { analyzeMovement, type AnalysisResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AnalyzeMovement() {
  const [trainerVideo, setTrainerVideo] = useState<File | null>(null);
  const [userVideo, setUserVideo] = useState<File | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!trainerVideo || !userVideo || !exerciseName.trim()) {
      toast({
        title: "Missing inputs",
        description: "Please provide both videos and an exercise name.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setUploadProgress(0);
    try {
      const data = await analyzeMovement(trainerVideo, userVideo, exerciseName, "anksushraj2024@gmail.com", setUploadProgress);
      setResult(data);
    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err?.message || "Could not reach the backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTrainerVideo(null);
    setUserVideo(null);
    setExerciseName("");
    setResult(null);
    setUploadProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center neon-border">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Analyze Movement</h1>
            <p className="text-sm text-muted-foreground">Compare user form against trainer reference</p>
          </div>
        </div>

        {/* Input section */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <VideoUploader label="Trainer Video" file={trainerVideo} onFileChange={setTrainerVideo} />
            <VideoUploader label="User Video" file={userVideo} onFileChange={setUserVideo} />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Exercise Name</label>
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Bench Press, Squat, Deadlift…"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 neon-glow transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Analyze Movement
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-secondary transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-muted-foreground font-medium hover:bg-secondary transition-all">
              Load Sample Videos
            </button>
          </div>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl p-8 mb-6 flex flex-col items-center gap-4"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-foreground font-medium">Synchronizing skeletons and analyzing posture…</p>
              <div className="w-full max-w-xs h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Upload: {uploadProgress}%</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Summary */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <ChevronDown className="w-5 h-5 text-primary" />
                  Session Summary
                </h2>
                <p className="text-foreground mb-4">{result.feedback_summary}</p>
                {result.technical_details.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Technical Corrections</h3>
                    <ul className="space-y-1">
                      {result.technical_details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>
                            <strong className="font-semibold text-foreground">{d.title}:</strong> {d.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Frame cards */}
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                Frame Analysis ({result.analysis.length} frames)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.analysis.map((frame, i) => (
                  <FrameCard key={frame.frame_id} frame={frame} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
