import { useState } from "react";

export type SeedHabit = { name: string; icon: string; time: string; frequency: string };

type Step = "welcome" | "signup" | "habit";
const STEPS: Step[] = ["welcome", "signup", "habit"];

const ICONS = ["🌱", "🏃", "📖", "💧", "🧘", "✍️", "🎵", "🍎", "💪", "🌙"];
const TIMES = ["7:00 AM", "8:00 AM", "9:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"];
const FREQUENCIES = ["Every day", "Weekdays", "A few times a week"];

export default function OnboardingFlow({ onDone }: { onDone: (habit: SeedHabit) => void }) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🌱");
  const [time, setTime] = useState(TIMES[1]);
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);

  const stepIndex = STEPS.indexOf(step);
  const goBack = () => setStep(STEPS[Math.max(0, stepIndex - 1)]);
  const goNext = () => setStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)]);

  const finish = () => {
    onDone({ name: name.trim() || "My first habit", icon, time, frequency });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {step !== "welcome" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px 0" }}>
          <button
            onClick={goBack}
            aria-label="Back"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, marginLeft: -12, border: "none", background: "none", cursor: "pointer", color: "var(--color-bloom-text-muted)" }}
          >
            <ChevronLeft />
          </button>
          <StepDots current={stepIndex} total={STEPS.length} />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {step === "welcome" && <WelcomeStep onNext={goNext} />}
        {step === "signup" && <SignUpStep onNext={goNext} />}
        {step === "habit" && (
          <CreateHabitStep
            name={name} setName={setName}
            icon={icon} setIcon={setIcon}
            time={time} setTime={setTime}
            frequency={frequency} setFrequency={setFrequency}
            onFinish={finish}
          />
        )}
      </div>
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div role="img" aria-label={`Step ${current + 1} of ${total}`} style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: 99,
            background: i === current ? "#4D9467" : "#DDD8D0",
            transition: "width 200ms ease, background 200ms ease",
          }}
        />
      ))}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px 32px", gap: 20 }}>
      <div
        aria-hidden="true"
        style={{
          width: 96, height: 96, borderRadius: 28, background: "#283328",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44,
        }}
      >
        🌱
      </div>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "#283328", margin: "0 0 10px" }}>
          Welcome to Bloom
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-bloom-text-muted)", lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
          A calm way to build small daily habits. Small, kind nudges — never a guilt trip.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, margin: "4px 0 8px" }} aria-hidden="true">
        <FeaturePill emoji="✅" label="Daily habits" />
        <FeaturePill emoji="😊" label="Mood check-ins" />
        <FeaturePill emoji="📈" label="Gentle insights" />
      </div>
      <button
        onClick={onNext}
        style={{
          width: "100%", maxWidth: 320, background: "#4D9467", color: "white", borderRadius: 18,
          padding: "16px", border: "none", fontFamily: "var(--font-display)", fontSize: 16,
          fontWeight: 600, cursor: "pointer", minHeight: 44,
        }}
      >
        Get started
      </button>
    </div>
  );
}

function FeaturePill({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#EEF6F1", borderRadius: 99, padding: "6px 10px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--color-bloom-green-600, #3A7A52)" }}>
      <span>{emoji}</span>{label}
    </span>
  );
}

function SignUpStep({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "#283328", margin: "0 0 8px" }}>
        Create your account
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
        Takes less than a minute. Your data stays yours.
      </p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <SocialButton
          onClick={onNext}
          bg="#FFFFFF"
          color="#283328"
          border="1.5px solid #DDD8D0"
          icon={<GoogleIcon />}
          label="Continue with Google"
        />
        <SocialButton
          onClick={onNext}
          bg="#111214"
          color="#FFFFFF"
          border="1.5px solid #111214"
          icon={<AppleIcon />}
          label="Continue with Apple"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }} aria-hidden="true">
          <span style={{ flex: 1, height: 1, background: "#EDE8E0" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-bloom-text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
          <span style={{ flex: 1, height: 1, background: "#EDE8E0" }} />
        </div>
        <SocialButton
          onClick={onNext}
          bg="#EEF6F1"
          color="#3A7A52"
          border="1.5px solid #EEF6F1"
          icon={<span aria-hidden="true">✉️</span>}
          label="Continue with email"
        />
      </div>

      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-bloom-text-faint)", textAlign: "center", lineHeight: 1.6, margin: "16px 0 0" }}>
        By continuing, you agree to Bloom's Terms of Service and Privacy Policy.
        <br />
        <em>Prototype only — no real sign-in happens here.</em>
      </p>
    </div>
  );
}

function SocialButton({ onClick, bg, color, border, icon, label }: {
  onClick: () => void; bg: string; color: string; border: string; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        background: bg, color, border, borderRadius: 16, padding: "13px 16px",
        fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 44,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function CreateHabitStep({ name, setName, icon, setIcon, time, setTime, frequency, setFrequency, onFinish }: {
  name: string; setName: (v: string) => void;
  icon: string; setIcon: (v: string) => void;
  time: string; setTime: (v: string) => void;
  frequency: string; setFrequency: (v: string) => void;
  onFinish: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#283328", margin: "0 0 8px", lineHeight: 1.3 }}>
        What's one habit<br />you want to build?
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", margin: "0 0 20px", lineHeight: 1.6 }}>
        Start small. You can always add more later.
      </p>

      <label htmlFor="onb-habit-name" style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--color-bloom-text-muted)", marginBottom: 8 }}>
        Habit name
      </label>
      <input
        id="onb-habit-name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Drink more water"
        style={{
          width: "100%", background: "#FFFFFF", border: "1.5px solid #DDD8D0", borderRadius: 16,
          padding: "12px 16px", fontSize: 14, color: "#283328", outline: "none", marginBottom: 18,
          fontFamily: "var(--font-body)", boxSizing: "border-box", minHeight: 44,
        }}
      />

      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--color-bloom-text-muted)", marginBottom: 10 }}>
        Choose an icon
      </p>
      <div role="radiogroup" aria-label="Habit icon" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {ICONS.map((ic) => (
          <button
            key={ic}
            role="radio"
            aria-checked={icon === ic}
            aria-label={`Icon ${ic}`}
            onClick={() => setIcon(ic)}
            style={{
              width: 44, height: 44, borderRadius: 14,
              background: icon === ic ? "#EEF6F1" : "#FFFFFF",
              border: `1.5px solid ${icon === ic ? "#4D9467" : "#EDE8E0"}`,
              fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 150ms ease, border-color 150ms ease",
            }}
          >
            <span aria-hidden="true">{ic}</span>
          </button>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--color-bloom-text-muted)", marginBottom: 10 }}>
        How often?
      </p>
      <div role="radiogroup" aria-label="Frequency" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {FREQUENCIES.map((f) => (
          <button
            key={f}
            role="radio"
            aria-checked={frequency === f}
            onClick={() => setFrequency(f)}
            style={{
              padding: "9px 14px", borderRadius: 99,
              background: frequency === f ? "#4D9467" : "#FFFFFF",
              color: frequency === f ? "white" : "#283328",
              border: `1.5px solid ${frequency === f ? "#4D9467" : "#EDE8E0"}`,
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 36,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <label htmlFor="onb-habit-time" style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--color-bloom-text-muted)" }}>
          Reminder time
        </label>
        <select
          id="onb-habit-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#4D9467", background: "#EEF6F1", borderRadius: 12, padding: "8px 12px", border: "none", outline: "none", cursor: "pointer", minHeight: 36 }}
        >
          {TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onFinish}
        style={{
          width: "100%", background: "#4D9467", color: "white", borderRadius: 18, padding: "16px",
          border: "none", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600,
          cursor: "pointer", minHeight: 44,
        }}
      >
        Start growing 🌱
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 4L6 8l4 4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 009 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
      <path d="M13.1 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.6.8-3.3 2-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.5 2 1-.1 1.4-.6 2.6-.6s1.6.6 2.7.6c1.1 0 1.8-1 2.5-1.9.6-.8.9-1.6 1.1-2.1-2.9-1.1-2.9-3.9-2.9-3.9zM11 3.2c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z"/>
    </svg>
  );
}
