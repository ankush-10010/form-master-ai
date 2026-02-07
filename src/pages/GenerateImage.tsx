import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Loader2, Download, RefreshCw, ArrowLeftRight } from "lucide-react";
import ImageUploader from "@/components/shared/ImageUploader";
import { generateImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function GenerateImage() {
  const [file, setFile] = useState<File | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [correctedImage, setCorrectedImage] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [showCompare, setShowCompare] = useState(false);
  const { toast } = useToast();
  const compareRef = useRef<HTMLDivElement>(null);

  const originalPreview = file ? URL.createObjectURL(file) : null;

  const handleGenerate = async () => {
    if (!file || !exerciseName.trim()) {
      toast({
        title: "Missing inputs",
        description: "Please provide an image and exercise name.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const data = await generateImage(file, exerciseName, errorDesc || undefined);
      setCorrectedImage(`data:image/jpeg;base64,${data.corrected_image}`);
      setShowCompare(false);
    } catch (err: any) {
      toast({
        title: "Generation failed",
        description: err?.message || "Could not reach the backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!correctedImage) return;
    const a = document.createElement("a");
    a.href = correctedImage;
    a.download = `corrected_${exerciseName.replace(/\s/g, "_")}.jpg`;
    a.click();
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center neon-border">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Generate Correct Form</h1>
            <p className="text-sm text-muted-foreground">AI-powered form correction image</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ImageUploader label="User Image / Frame" file={file} onFileChange={setFile} />
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Exercise Name</label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="Bench Press, Squat, Deadlift…"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Error Description (optional)</label>
                <textarea
                  value={errorDesc}
                  onChange={(e) => setErrorDesc(e.target.value)}
                  placeholder="Describe the form error you'd like corrected…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 neon-glow transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
              Generate Correct Form Image
            </button>
            {correctedImage && (
              <>
                <button
                  onClick={() => setShowCompare(!showCompare)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-secondary transition-all"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Compare Before vs After
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-secondary transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-muted-foreground font-medium hover:bg-secondary transition-all disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </>
            )}
          </div>
        </div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-8 mb-6 flex flex-col items-center gap-4"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-foreground font-medium">Generating corrected form image…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output */}
        <AnimatePresence>
          {correctedImage && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {showCompare && originalPreview ? (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-4">Before vs After</h2>
                  <div
                    ref={compareRef}
                    className="relative rounded-xl overflow-hidden cursor-col-resize select-none aspect-video"
                    onMouseMove={handleSliderMove}
                  >
                    {/* After (full) */}
                    <img
                      src={correctedImage}
                      alt="Corrected"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Before (clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="w-full h-full object-cover"
                        style={{ width: compareRef.current?.offsetWidth || "100%" }}
                      />
                    </div>
                    {/* Slider line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <ArrowLeftRight className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 px-2 py-1 rounded bg-background/70 text-xs text-foreground backdrop-blur-sm">Original</span>
                    <span className="absolute top-3 right-3 px-2 py-1 rounded bg-background/70 text-xs text-foreground backdrop-blur-sm">Corrected</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {originalPreview && (
                    <div className="glass rounded-2xl overflow-hidden">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground px-4 py-3 border-b border-border/50">Original</p>
                      <img src={originalPreview} alt="Original" className="w-full aspect-video object-contain bg-black/30" />
                    </div>
                  )}
                  <div className="glass rounded-2xl overflow-hidden neon-border">
                    <p className="text-xs uppercase tracking-widest text-primary px-4 py-3 border-b border-border/50">AI-Corrected Form</p>
                    <img src={correctedImage} alt="Corrected" className="w-full aspect-video object-contain bg-black/30" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
