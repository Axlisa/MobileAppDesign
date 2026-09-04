import { useState } from "react";

const HABITS = [
  { id: 1, name: "Morning pages",  icon: "✍️", colorBg: "#EEF6F1", accent: "#4D9467", streak: 14, initDone: false, time: "7:00 AM" },
  { id: 2, name: "10-min walk",    icon: "🚶", colorBg: "#EAF5FA", accent: "#6BAEC4", streak: 6,  initDone: false, time: "12:00 PM" },
  { id: 3, name: "Read 20 pages",  icon: "📖", colorBg: "#F2EEF7", accent: "#9B82B8", streak: 21, initDone: true,  time: "9:00 PM" },
  { id: 4, name: "Drink 8 glasses",icon: "💧", colorBg: "#FBF0E6", accent: "#E8975A", streak: 3,  initDone: true,  time: "All day" },
  { id: 5, name: "Meditate",       icon: "🌿", colorBg: "#EEF6F1", accent: "#4D9467", streak: 9,  initDone: false, time: "8:00 AM" },
];

export default function HomeScreen({ onMoodTap }: { onMoodTap: () => void }) {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(
    new Set(HABITS.filter((h) => h.initDone).map((h) => h.id))
  );
  const [showAdd, setShowAdd] = useState(false);

  const toggle = (id: number) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const doneCount = checkedIds.size;
  const totalCount = HABITS.length;
  const progress = doneCount / totalCount;

  const today = new Date();
  const dayName  = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr  = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "16px 24px 24px", gap: 0, minHeight: "100%" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#7A9080", marginBottom: 4 }}>
            {dayName}, {dateStr}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 600,
              color: "#283328",
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            Good morning,<br />Aga 🌱
          </h1>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#EEF6F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🌸
        </div>
      </div>

      {/* ── Progress card ────────────────────────────────────── */}
      <div
        style={{
          background: "#283328",
          borderRadius: 24,
          padding: "20px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <ProgressRing progress={progress} count={doneCount} total={totalCount} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#A9D6B7", marginBottom: 4 }}>
            Today's progress
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {doneCount === totalCount
              ? "All habits done! 🎉"
              : `${totalCount - doneCount} habit${totalCount - doneCount !== 1 ? "s" : ""} left`}
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#6BAE82", marginTop: 4 }}>
            Your plant is growing 🌿
          </p>
        </div>
      </div>

      {/* ── Mood nudge ───────────────────────────────────────── */}
      <button
        onClick={onMoodTap}
        style={{
          width: "100%",
          background: "#FBF0E6",
          borderRadius: 18,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "opacity 150ms ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.opacity = "0.75")}
        onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <span style={{ fontSize: 24 }}>😊</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: 0 }}>
            How are you feeling?
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#7A9080", marginTop: 2 }}>
            Tap to log today's mood check-in
          </p>
        </div>
        <ChevronRight />
      </button>

      {/* ── Habits header ────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 600,
            color: "#283328",
            margin: 0,
          }}
        >
          Today's habits
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#4D9467",
            color: "#fff",
            border: "none",
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      </div>

      {/* ── Habits list ──────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {HABITS.map((habit) => {
          const done = checkedIds.has(habit.id);
          return (
            <button
              key={habit.id}
              onClick={() => toggle(habit.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 18,
                padding: "14px 14px",
                border: `1.5px solid ${done ? "#A9D6B7" : "#EDE8E0"}`,
                background: done ? "#F2FAF5" : "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 200ms ease, border-color 200ms ease, transform 120ms ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: habit.colorBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {habit.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: done ? "#7A9080" : "#283328",
                    textDecoration: done ? "line-through" : "none",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {habit.name}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#7A9080", margin: "3px 0 0" }}>
                  🔥 {habit.streak} day streak · {habit.time}
                </p>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? "#4D9467" : "transparent",
                  border: done ? "none" : "2px solid #DDD8D0",
                  transition: "background 200ms ease, border 200ms ease",
                }}
              >
                {done && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Add habit sheet ──────────────────────────────────── */}
      {showAdd && <AddHabitSheet onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function ProgressRing({ progress, count, total }: { progress: number; count: number; total: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - progress * circ;
  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#3A5040" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke="#6BAE82"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1, margin: 0 }}>
          {count}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#6BAE82", margin: 0 }}>/{total}</p>
      </div>
    </div>
  );
}

function AddHabitSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🌱");
  const icons = ["🌱", "🏃", "📖", "💧", "🧘", "✍️", "🎵", "🍎", "💪", "🌙"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(40,51,40,0.45)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        zIndex: 50,
        animation: "fadeIn 200ms ease forwards",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#F8F5F0",
          borderRadius: "28px 28px 0 0",
          padding: "0 24px 32px",
          animation: "slideUp 280ms cubic-bezier(0.4,0,0.2,1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: 40, height: 4, background: "#DDD8D0", borderRadius: 99, margin: "16px auto 20px" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#283328", marginBottom: 16 }}>
          New habit
        </h2>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning pages"
          style={{
            width: "100%",
            background: "#FFFFFF",
            border: "1.5px solid #DDD8D0",
            borderRadius: 16,
            padding: "12px 16px",
            fontSize: 14,
            color: "#283328",
            outline: "none",
            marginBottom: 16,
            fontFamily: "var(--font-body)",
            boxSizing: "border-box",
          }}
        />
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#7A9080", marginBottom: 10 }}>
          Choose an icon
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {icons.map((ic) => (
            <button
              key={ic}
              onClick={() => setSelectedIcon(ic)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: selectedIcon === ic ? "#EEF6F1" : "#FFFFFF",
                border: `1.5px solid ${selectedIcon === ic ? "#4D9467" : "#EDE8E0"}`,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 150ms ease, border-color 150ms ease",
              }}
            >
              {ic}
            </button>
          ))}
        </div>
        <button
          style={{
            width: "100%",
            background: "#4D9467",
            color: "white",
            borderRadius: 18,
            padding: "16px",
            border: "none",
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          Add habit
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#7A9080",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          Cancel
        </button>
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
      `}</style>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7A9080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12l4-4-4-4" />
    </svg>
  );
}
