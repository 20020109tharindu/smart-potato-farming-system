import { useRef, useState } from "react";
import ImageUpload from "../components/ImageUpload";

const fmt = (lbl) =>
  String(lbl || "unknown")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function SeedReadinessPage() {
  const resultRef = useRef(null);
  const [result, setResult] = useState(null);
  const [rawOutput, setRawOutput] = useState(null);

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
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--sr-green-soft)]/80 transition-all duration-400"
                    style={{ width: `${Math.min(100, result.confidence)}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--sr-muted)] w-10 text-right">{result.confidence}%</span>
              </div>
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
