import { useState } from "react";
import type { Habit } from "../types";

const MAX_HABITS = 5;
const MOOD_EMOJI = ["", "😔", "😕", "😐", "🙂", "😄"];
const MOOD_LABEL = ["", "Rough", "Meh", "Okay", "Good", "Great"];

// Two independent datasets so the Week/Month toggle actually shows different
// content instead of re-rendering the same numbers under a different label.
const WEEK_VIEW = {
  dateRange: "Sep 1 – 7, 2026",
  title: "Your week",
  chartLabel: "Habits per day",
  barLabels: ["M", "T", "W", "T", "F", "S", "S"],
  barLongLabels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  barData: [3, 5, 4, 5, 2, 5, 3],
  barMax: MAX_HABITS,
  highlightIndex: 3,
  moodLabel: "Mood this week",
  moodData: [4, 3, 5, 4, 2, 5, 4],
  completionSub: "this week",
  habits: [
    { name: "Morning pages",   icon: "✍️", streak: 14, rate: 0.86, color: "#4D9467" },
    { name: "10-min walk",     icon: "🚶", streak: 6,  rate: 0.71, color: "#6BAEC4" },
    { name: "Read 20 pages",   icon: "📖", streak: 21, rate: 1.0,  color: "#9B82B8" },
    { name: "Drink 8 glasses", icon: "💧", streak: 3,  rate: 0.57, color: "#E8975A" },
    { name: "Meditate",        icon: "🌿", streak: 9,  rate: 0.71, color: "#4D9467" },
  ],
};

const MONTH_VIEW = {
  dateRange: "September 2026",
  title: "Your month",
  chartLabel: "Habits per week",
  barLabels: ["W1", "W2", "W3", "W4"],
  barLongLabels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  barData: [24, 28, 19, 17],
  barMax: MAX_HABITS * 7,
  highlightIndex: 0,
  moodLabel: "Mood this month",
  moodData: [4, 4, 3, 4],
  completionSub: "this month",
  habits: [
    { name: "Morning pages",   icon: "✍️", streak: 14, rate: 0.78, color: "#4D9467" },
    { name: "10-min walk",     icon: "🚶", streak: 6,  rate: 0.65, color: "#6BAEC4" },
    { name: "Read 20 pages",   icon: "📖", streak: 21, rate: 0.92, color: "#9B82B8" },
    { name: "Drink 8 glasses", icon: "💧", streak: 3,  rate: 0.61, color: "#E8975A" },
    { name: "Meditate",        icon: "🌿", streak: 9,  rate: 0.74, color: "#4D9467" },
  ],
};

export default function InsightsScreen({ habits, checkedIds }: { habits: Habit[]; checkedIds: Set<number> }) {
  const [tab, setTab] = useState<"week" | "month">("week");
  const view = tab === "week" ? WEEK_VIEW : MONTH_VIEW;

  // Habits the user actually created (onboarding, or Home's "+" button) have
  // no pre-baked history yet, so show today's live completion instead — this
  // is what makes a habit tracked on Home also show up here.
  const liveHabits = habits
    .filter((h) => !h.isSample)
    .map((h) => ({
      name: h.name,
      icon: h.icon,
      streak: h.streak,
      rate: checkedIds.has(h.id) ? 1 : 0,
      color: h.accent,
    }));
  const displayedHabits = [...liveHabits, ...view.habits];

  const totalDone   = view.barData.reduce((a, b) => a + b, 0);
  const totalPossible = view.barData.length * view.barMax;
  const overallRate = Math.round((totalDone / totalPossible) * 100);
  const bestStreak  = Math.max(...displayedHabits.map((h) => h.streak));
  const avgMood     = (view.moodData.reduce((a, b) => a + b, 0) / view.moodData.length).toFixed(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "16px 24px 28px", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-bloom-text-muted)", margin: "0 0 4px" }}>
            {view.dateRange}
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "#283328", margin: 0 }}>
            {view.title}
          </h1>
        </div>
        <div role="tablist" aria-label="Time range" style={{ display: "flex", background: "#EEF6F1", borderRadius: 18, padding: 4, gap: 4 }}>
          {(["week", "month"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 14,
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: tab === t ? "#4D9467" : "transparent",
                color: tab === t ? "white" : "var(--color-bloom-text-muted)",
                transition: "background 200ms ease, color 200ms ease",
                textTransform: "capitalize",
                minHeight: 32,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <StatTile label="Completion" value={`${overallRate}%`} sub={view.completionSub} color="#4D9467" bg="#EEF6F1" />
        <StatTile label="Best streak" value={`${bestStreak}d`} sub="Read 20 pages" color="var(--color-bloom-lavender-deep)" bg="#F2EEF7" />
        <StatTile label="Avg mood"   value={avgMood}           sub="out of 5"      color="#E8975A" bg="#FBF0E6" />
      </div>

      {/* Bar chart */}
      <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "18px 18px 14px", border: "1.5px solid #EDE8E0" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-bloom-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 14px" }}>
          {view.chartLabel}
        </p>
        <div
          role="img"
          aria-label={`${view.chartLabel}: ${view.barLabels.map((_, i) => `${view.barLongLabels[i]} ${view.barData[i]} of ${view.barMax}`).join(", ")}`}
          style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}
        >
          {view.barData.map((count, i) => {
            const isHighlight = i === view.highlightIndex;
            const barH  = Math.max(4, (count / view.barMax) * 60);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} aria-hidden="true">
                <div style={{ width: "100%", height: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      width: "100%",
                      height: barH,
                      borderRadius: "6px 6px 4px 4px",
                      background: isHighlight ? "#4D9467" : "#D4EBDB",
                      transition: "height 500ms cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, color: isHighlight ? "#4D9467" : "var(--color-bloom-text-muted)" }}>
                  {view.barLabels[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mood strip */}
      <div style={{ background: "#FFFFFF", borderRadius: 22, padding: "18px 18px 14px", border: "1.5px solid #EDE8E0" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-bloom-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 14px" }}>
          {view.moodLabel}
        </p>
        <div
          role="img"
          aria-label={`${view.moodLabel}: ${view.barLabels.map((_, i) => `${view.barLongLabels[i]} ${MOOD_LABEL[view.moodData[i]]}`).join(", ")}`}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          {view.moodData.map((m, i) => (
            <div key={i} aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 22 }}>{MOOD_EMOJI[m]}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--color-bloom-text-muted)" }}>{view.barLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Habit breakdown */}
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "#283328", margin: "0 0 12px" }}>
          Habit breakdown
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {displayedHabits.map((h, i) => (
            <div key={`${h.name}-${i}`} style={{ background: "#FFFFFF", borderRadius: 18, padding: "14px 16px", border: "1.5px solid #EDE8E0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }} aria-hidden="true">{h.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {h.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-bloom-text-muted)", margin: "2px 0 0" }}>
                    🔥 {h.streak} day streak
                  </p>
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: h.color }}>
                  {Math.round(h.rate * 100)}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${h.name} completion rate`}
                aria-valuenow={Math.round(h.rate * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ height: 6, background: "#EDE8E0", borderRadius: 99, overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${h.rate * 100}%`,
                    background: h.color,
                    borderRadius: 99,
                    transition: "width 700ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, color, bg }: { label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 18, padding: "12px 12px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--color-bloom-text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color, margin: 0, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--color-bloom-text-muted)", margin: 0, lineHeight: 1.3 }}>
        {sub}
      </p>
    </div>
  );
}
