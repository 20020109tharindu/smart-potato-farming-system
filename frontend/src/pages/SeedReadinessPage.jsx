import { useRef, useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";

const fmt = (lbl) =>
  String(lbl || "unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function SeedReadinessPage() {
  const resultRef = useRef(null);
  const [result, setResult] = useState(null);
  const [rawOutput, setRawOutput] = useState(null);
  const [showSproutPreview, setShowSproutPreview] = useState(true);
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);
  const [previewZoomScale, setPreviewZoomScale] = useState(1);
  const zoomContainerRef = useRef(null);

  const handlePrediction = (data) => {
    if (!data) {
      setResult(null);
      setRawOutput(null);
      return;
    }
    if (data.seed_readiness || data.sprout_length) {
      setRawOutput(data);
      const seed = data.seed_readiness || { label: "unknown", confidence: 0 };
      const sprout = data.sprout_length || { label: "unknown", confidence: 0 };
      const shrivel = data.shrivel_level || { label: "unknown", confidence: 0 };
      const damage = data.damage_level || { label: "unknown", confidence: 0 };

      const confidencePct = Math.round((seed.confidence || 0) * 100);
      const recommendations = [];
      if ((seed.label || "").toLowerCase().includes("ready")) {
        recommendations.push("Seeds look ready for planting — consider planting within 1–2 weeks.");
      } else {
        recommendations.push("Seeds may not be ready — consider waiting or checking moisture and maturity.");
      }
      recommendations.push(`Sprout length: ${fmt(sprout.label)}`);
      recommendations.push(`Damage level: ${fmt(damage.label)}`);
      if (
        (shrivel.label || "").toLowerCase().includes("high") ||
        (shrivel.label || "").toLowerCase().includes("severe")
      ) {
        recommendations.push("High shriveling detected — sort out badly shriveled seeds before planting.");
      }

      const mapped = {
        readiness: fmt(seed.label),
        confidence: confidencePct,
        recommendations,
        quality: {
          size: fmt(sprout.label),
          color: fmt(damage.label),
          texture: fmt(shrivel.label),
        },
        personalized_feedback: data.personalized_feedback || null,
      };
      setResult(mapped);
      setTimeout(() => {
        if (resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      return;
    }
    setResult(data);
    setRawOutput(null);
  };

  const feedback = result?.personalized_feedback;

  useEffect(() => {
    if (!previewZoomOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setPreviewZoomOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewZoomOpen]);

  return (
    <div className="seed-readiness-page">
      <style>{`
        .seed-readiness-page {
          font-family: 'Outfit', 'Segoe UI', sans-serif;
          --sr-green: #2d4a38;
          --sr-green-soft: #5a8a6e;
          --sr-green-bg: #f2f7f4;
          --sr-card: #ffffff;
          --sr-text: #1e2d24;
          --sr-muted: #6b7f72;
        }
        .seed-readiness-page .sr-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 600;
          color: var(--sr-green);
        }
        .seed-readiness-page .sr-card {
          background: var(--sr-card);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,.06);
          border: 1px solid rgba(0,0,0,.06);
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Header — moderate */}
        <header className="mb-6">
          <h1 className="sr-title text-2xl md:text-3xl mb-1">
            Seed Readiness Predictor
          </h1>
          <p className="text-[var(--sr-muted)] text-sm">
            Upload a photo of your potato seed for analysis
          </p>
        </header>

        {/* Upload */}
        <section className="sr-card p-5 mb-6">
          <h2 className="text-base font-medium text-[var(--sr-green)] mb-3">
            Upload seed photo
          </h2>
          <ImageUpload onResult={handlePrediction} />
        </section>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="space-y-4">
            {/* Sprout-marked preview: collapsible, click to zoom */}
            {rawOutput?.sprout_annotated_image && (
              <section className="sr-card p-5">
                <button
                  type="button"
                  onClick={() => setShowSproutPreview((v) => !v)}
                  className="w-full flex items-center justify-between gap-2 text-left mb-2"
                >
                  <h3 className="text-sm font-medium text-[var(--sr-green)]">
                    Predicted sprout on your photo
                  </h3>
                  <span className="text-xs text-[var(--sr-muted)]">
                    {showSproutPreview ? "Hide" : "Show"}
                  </span>
                </button>
                {showSproutPreview && (
                  <>
                    <p className="text-xs text-[var(--sr-muted)] mb-3">
                      Green line = sprout length (base → tip). Click image to zoom.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setPreviewZoomScale(1); setPreviewZoomOpen(true); }}
                      className="rounded-lg overflow-hidden border border-[var(--sr-green-bg)] bg-[var(--sr-green-bg)]/30 block w-full cursor-zoom-in hover:border-[var(--sr-green-soft)]/50 transition-colors"
                    >
                      <img
                        src={`data:image/jpeg;base64,${rawOutput.sprout_annotated_image}`}
                        alt="Seed with predicted sprout length marked"
                        className="block max-h-[280px] w-full object-contain pointer-events-none"
                      />
                    </button>
                  </>
                )}

                {/* Zoom overlay / lightbox */}
                {previewZoomOpen && (
                  <div
                    className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && setPreviewZoomOpen(false)}
                  >
                    <div className="flex items-center justify-between w-full max-w-4xl mb-2 gap-2">
                      <span className="text-white/90 text-sm">Sprout preview — zoom to see detail</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewZoomScale((s) => Math.max(0.5, s - 0.25))}
                          className="text-white bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium"
                        >
                          −
                        </button>
                        <span className="text-white/80 text-sm min-w-[4rem] text-center">{Math.round(previewZoomScale * 100)}%</span>
                        <button
                          type="button"
                          onClick={() => setPreviewZoomScale((s) => Math.min(3, s + 0.25))}
                          className="text-white bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewZoomOpen(false)}
                          className="text-white bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-sm font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    <div
                      ref={zoomContainerRef}
                      className="overflow-auto flex-1 flex items-center justify-center min-h-0 w-full"
                      style={{ maxHeight: "calc(100vh - 120px)" }}
                      onWheel={(e) => {
                        e.preventDefault();
                        setPreviewZoomScale((s) => {
                          const next = e.deltaY < 0 ? s + 0.15 : s - 0.15;
                          return Math.max(0.5, Math.min(3, next));
                        });
                      }}
                    >
                      <img
                        src={`data:image/jpeg;base64,${rawOutput.sprout_annotated_image}`}
                        alt="Sprout marked"
                        className="max-w-full select-none"
                        style={{ transform: `scale(${previewZoomScale})`, transformOrigin: "center" }}
                        onClick={(e) => e.stopPropagation()}
                        draggable={false}
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Feedback + Readiness in one card */}
            <section className="sr-card p-5">
              {feedback && (
                <div className="mb-4 pb-4 border-b border-[var(--sr-green-bg)]">
                  <h3 className="text-sm font-medium text-[var(--sr-green)] mb-2">Feedback</h3>
                  <p className="text-[var(--sr-text)] text-sm leading-relaxed">
                    {feedback.summary}
                  </p>
                  {feedback.size_note && (
                    <p className="text-[var(--sr-muted)] text-xs mt-2">{feedback.size_note}</p>
                  )}
                  {feedback.action_items?.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-[var(--sr-text)]">
                      {feedback.action_items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[var(--sr-green-soft)]">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-[var(--sr-muted)]">Readiness</span>
                <span className="text-sm font-medium text-[var(--sr-green)] bg-[var(--sr-green-bg)] px-3 py-1 rounded-lg">
                  {result.readiness}
                </span>
              </div>
              {/* Bar shows readiness level (high when Ready, low when Not Ready), not model confidence */}
              {(() => {
                const r = (result.readiness || "").toLowerCase();
                const isReady = (r.includes("ready") && !r.includes("not")) || r.includes("suitable") || r.includes("good");
                const readinessBarPct = isReady ? 100 : 25;
                return (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-400 ${isReady ? "bg-[var(--sr-green-soft)]/80" : "bg-amber-500/70"}`}
                        style={{ width: `${readinessBarPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--sr-muted)] w-10 text-right">{readinessBarPct}%</span>
                  </div>
                );
              })()}
              <p className="text-xs text-[var(--sr-muted)] mt-1">Model confidence: {result.confidence}%</p>
            </section>

            {/* Metrics — compact */}
            {rawOutput && (
              <section className="sr-card p-5">
                <h3 className="text-sm font-medium text-[var(--sr-green)] mb-3">Quality metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    ["seed_readiness", "Readiness"],
                    ["sprout_length", "Sprout"],
                    ["shrivel_level", "Shrivel"],
                    ["damage_level", "Damage"],
                  ].map(([key, title]) => {
                    const val = rawOutput[key] || { label: "unknown", confidence: 0 };
                    const pct = Math.round((val.confidence || 0) * 100);
                    return (
                      <div key={key} className="bg-[var(--sr-green-bg)]/60 rounded-lg px-3 py-2">
                        <div className="text-xs text-[var(--sr-muted)]">{title}</div>
                        <div className="text-sm font-medium text-[var(--sr-text)]">{fmt(val.label)}</div>
                        <div className="text-xs text-[var(--sr-muted)]">{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Recommendations — compact */}
            <section className="sr-card p-5">
              <h3 className="text-sm font-medium text-[var(--sr-green)] mb-2">Recommendations</h3>
              <ul className="space-y-1.5 text-sm text-[var(--sr-text)]">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--sr-green-soft)]">·</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* Single line footer — no 3 cards */}
        {!result && (
          <p className="text-center text-xs text-[var(--sr-muted)] mt-6">
            AI-powered analysis · Results in seconds
          </p>
        )}
      </div>
    </div>
  );
}
