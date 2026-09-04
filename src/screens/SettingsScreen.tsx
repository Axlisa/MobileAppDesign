import { useState } from "react";

export default function SettingsScreen() {
  const [reminders,   setReminders]   = useState(true);
  const [gentleMode,  setGentleMode]  = useState(true);
  const [weeklyDigest,setWeeklyDigest]= useState(false);
  const [reminderTime,setReminderTime]= useState("8:00 AM");

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "16px 24px 36px", gap: 24 }}>
      {/* Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EEF6F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
          🌸
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#283328", margin: "0 0 2px" }}>
            Aga
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#7A9080", margin: "0 0 3px" }}>
            aga@example.com
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#4D9467", fontWeight: 600, margin: 0 }}>
            🌿 Growing since Aug 2026
          </p>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: "50%", background: "#EEF6F1", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EditIcon />
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#283328", borderRadius: 22, padding: "18px 24px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <MiniStat value="5"  label="Habits" />
        <div style={{ width: 1, height: 32, background: "#3A5040" }} />
        <MiniStat value="21" label="Best streak" />
        <div style={{ width: 1, height: 32, background: "#3A5040" }} />
        <MiniStat value="34" label="Days active" />
      </div>

      {/* Reminders */}
      <Section title="Reminders">
        <ToggleRow label="Daily reminders" sub="Get nudged when it's habit time" value={reminders} onChange={setReminders} />
        {reminders && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #EDE8E0" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: "0 0 2px" }}>Default time</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#7A9080", margin: 0 }}>Applied to habits without a set time</p>
            </div>
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#4D9467", background: "#EEF6F1", borderRadius: 12, padding: "6px 12px", border: "none", outline: "none", cursor: "pointer" }}
            >
              {["7:00 AM","8:00 AM","9:00 AM","12:00 PM","6:00 PM","9:00 PM"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
        <ToggleRow label="Weekly digest" sub="Summary every Sunday morning" value={weeklyDigest} onChange={setWeeklyDigest} divider />
      </Section>

      {/* App settings */}
      <Section title="App">
        <ToggleRow label="Gentle mode" sub="No streak warnings — just encouragement" value={gentleMode} onChange={setGentleMode} />
        <LinkRow label="Notification settings" />
        <LinkRow label="Data & privacy" />
        <LinkRow label="Export my data" />
      </Section>

      {/* About */}
      <Section title="About">
        <LinkRow label="What's new" />
        <LinkRow label="Send feedback" />
        <LinkRow label="Rate Bloom 🌸" />
      </Section>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#B0BDB2", margin: "0 0 8px" }}>Bloom v1.0 · Made with 🌱</p>
        <button style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#E8A0A0", background: "none", border: "none", cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "#7A9080", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px 4px" }}>
        {title}
      </p>
      <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "0 16px", border: "1.5px solid #EDE8E0" }}>
        {children}
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#7A9080" }}>{label}</span>
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange, divider }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; divider?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: divider ? "1px solid #EDE8E0" : "none" }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: "0 0 2px" }}>{label}</p>
        {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#7A9080", margin: 0 }}>{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{ position: "relative", width: 48, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: value ? "#4D9467" : "#DDD8D0", transition: "background 200ms ease", flexShrink: 0 }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: value ? "calc(100% - 24px)" : 4,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transition: "left 200ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </button>
    </div>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #EDE8E0" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: 0 }}>{label}</p>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#B0BDB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12l4-4-4-4" />
      </svg>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4D9467" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
