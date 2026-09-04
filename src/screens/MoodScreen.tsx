import { useState } from "react";

const MOODS = [
  { value: 1, emoji: "😔", label: "Rough",  color: "var(--color-mood-1)", bg: "var(--color-mood-1-light)" },
  { value: 2, emoji: "😕", label: "Meh",    color: "var(--color-mood-2)", bg: "var(--color-mood-2-light)" },
  { value: 3, emoji: "😐", label: "Okay",   color: "var(--color-mood-3)", bg: "var(--color-mood-3-light)" },
  { value: 4, emoji: "🙂", label: "Good",   color: "var(--color-mood-4)", bg: "var(--color-mood-4-light)" },
  { value: 5, emoji: "😄", label: "Great",  color: "var(--color-mood-5)", bg: "var(--color-mood-5-light)" },
];

type Step = "mood" | "reflect" | "done";

export default function MoodScreen({ done, onComplete }: { done: boolean; onComplete: () => void }) {
  const [selected, setSelected]   = useState<number | null>(null);
  const [step, setStep]           = useState<Step>(done ? "done" : "mood");
  const [reflection, setReflection] = useState("");

  const reset = () => { setStep("mood"); setSelected(null); setReflection(""); };

  if (step === "done") {
    const mood = MOODS[(selected ?? 4) - 1];
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 32px", gap: 24, textAlign: "center" }}
      >
        <div style={{ fontSize: 72, animation: "bounceIn 500ms cubic-bezier(0.4,0,0.2,1) forwards" }} aria-hidden="true">🌸</div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#283328", margin: "0 0 8px" }}>
            Check-in complete
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-bloom-text-muted)", lineHeight: 1.6, margin: 0 }}>
            You showed up for yourself today.<br />That's what matters. 🌿
          </p>
        </div>
        <div style={{ background: "#EEF6F1", borderRadius: 20, padding: 16, width: "100%", textAlign: "left" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-bloom-text-muted)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Today's mood
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26 }} aria-hidden="true">{mood.emoji}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600, color: "#283328" }}>{mood.label}</span>
          </div>
          {reflection && (
            <>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-bloom-text-muted)", margin: "12px 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Reflection
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#283328", lineHeight: 1.6, margin: 0 }}>
                "{reflection}"
              </p>
            </>
          )}
        </div>
        <button onClick={reset} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", minHeight: 44, padding: "8px 12px" }}>
          Edit check-in
        </button>
        <style>{`@keyframes bounceIn { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>
      </div>
    );
  }

  if (step === "reflect") {
    const mood = MOODS[selected! - 1];
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 24px 24px" }}>
        <button onClick={() => setStep("mood")} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: "8px 0", minHeight: 44 }}>
          <ChevronLeft /> Back
        </button>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#283328", margin: "0 0 8px" }}>
          A little reflection
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", margin: "0 0 20px", lineHeight: 1.6 }}>
          Optional — even one sentence can shift your day.
        </p>
        <div style={{ borderRadius: 18, padding: "14px 16px", background: mood.bg, border: `1.5px solid ${mood.color}44`, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 30 }} aria-hidden="true">{mood.emoji}</span>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-bloom-text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>Feeling</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "#283328", margin: 0 }}>{mood.label}</p>
          </div>
        </div>
        <label htmlFor="reflection-text" className="sr-only">Reflection</label>
        <textarea
          id="reflection-text"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What's on your mind? No pressure — a word or a sentence is plenty."
          style={{
            flex: 1,
            width: "100%",
            background: "#FFFFFF",
            border: "1.5px solid #DDD8D0",
            borderRadius: 18,
            padding: "14px 16px",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#283328",
            outline: "none",
            resize: "none",
            lineHeight: 1.6,
            marginBottom: 16,
            boxSizing: "border-box",
            minHeight: 120,
          }}
        />
        <button
          onClick={() => { setStep("done"); onComplete(); }}
          style={{ width: "100%", background: "#4D9467", color: "white", borderRadius: 18, padding: "16px", border: "none", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 10, minHeight: 44 }}
        >
          Done ✓
        </button>
        <button
          onClick={() => { setStep("done"); onComplete(); }}
          style={{ width: "100%", background: "none", border: "none", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", cursor: "pointer", padding: 8, minHeight: 44 }}
        >
          Skip reflection
        </button>
      </div>
    );
  }

  // Mood selection
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 24px 24px" }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-bloom-text-muted)", margin: "0 0 4px" }}>
          Daily check-in
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "#283328", margin: 0, lineHeight: 1.3 }}>
          How are you feeling<br />right now?
        </h1>
      </div>

      {/* Big display */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }} aria-hidden="true">
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: selected ? MOODS[selected - 1].bg : "#F0EDE8",
            border: `3px solid ${selected ? MOODS[selected - 1].color + "55" : "#EDE8E0"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 70,
            transition: "background 300ms ease, border-color 300ms ease",
          }}
        >
          {selected ? MOODS[selected - 1].emoji : "🌿"}
        </div>
        {selected && (
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#283328", margin: 0, transition: "opacity 200ms ease" }}>
            {MOODS[selected - 1].label}
          </p>
        )}
      </div>

      {/* Mood buttons */}
      <div role="radiogroup" aria-label="Select your mood" style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            role="radio"
            aria-checked={selected === mood.value}
            aria-label={mood.label}
            onClick={() => setSelected(mood.value)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              minHeight: 44,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: selected === mood.value ? mood.bg : "#FFFFFF",
                border: `2px solid ${selected === mood.value ? mood.color : "#EDE8E0"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                transform: selected === mood.value ? "scale(1.18)" : "scale(1)",
                transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), background 200ms ease, border-color 200ms ease",
              }}
            >
              {mood.emoji}
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, color: "var(--color-bloom-text-muted)" }}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => { if (selected !== null) setStep("reflect"); }}
        disabled={selected === null}
        style={{
          width: "100%",
          borderRadius: 18,
          padding: "16px",
          border: "none",
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 600,
          cursor: selected !== null ? "pointer" : "not-allowed",
          background: selected !== null ? "#4D9467" : "#EDE8E0",
          color: selected !== null ? "white" : "var(--color-bloom-text-faint)",
          transition: "background 250ms ease, color 250ms ease",
          minHeight: 44,
        }}
      >
        Next →
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 4L6 8l4 4" />
    </svg>
  );
}
