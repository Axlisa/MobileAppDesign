import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import Dropdown from "../components/Dropdown";
import { ModalRootContext } from "../modalRoot";

type SheetId =
  | "editProfile"
  | "signOut"
  | "notifications"
  | "privacy"
  | "export"
  | "whatsNew"
  | "feedback"
  | "rate"
  | null;

export default function SettingsScreen({
  habitCount,
  bestStreak,
  profileName,
  profileEmail,
  onUpdateProfile,
  onSignOut,
}: {
  habitCount: number;
  bestStreak: number;
  profileName: string;
  profileEmail: string;
  onUpdateProfile: (name: string, email: string) => void;
  onSignOut: () => void;
}) {
  const [reminders, setReminders] = useState(true);
  const [gentleMode, setGentleMode] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [reminderTime, setReminderTime] = useState("8:00 AM");
  const [openSheet, setOpenSheet] = useState<SheetId>(null);
  const close = () => setOpenSheet(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "16px 24px calc(24px + env(safe-area-inset-bottom))", gap: 24 }}>
      {/* Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div aria-hidden="true" style={{ width: 64, height: 64, borderRadius: "50%", background: "#EEF6F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
          🌸
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#283328", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {profileName}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-bloom-text-muted)", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {profileEmail}
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#4D9467", fontWeight: 600, margin: 0 }}>
            🌿 Growing since Aug 2026
          </p>
        </div>
        <button
          aria-label="Edit profile"
          onClick={() => setOpenSheet("editProfile")}
          style={{ width: 44, height: 44, borderRadius: "50%", background: "#EEF6F1", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <EditIcon />
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#283328", borderRadius: 22, padding: "18px 24px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <MiniStat value={String(habitCount)} label="Habits" />
        <div aria-hidden="true" style={{ width: 1, height: 32, background: "var(--color-bloom-green-700)" }} />
        <MiniStat value={`${bestStreak}d`} label="Best streak" />
        <div aria-hidden="true" style={{ width: 1, height: 32, background: "var(--color-bloom-green-700)" }} />
        <MiniStat value="34" label="Days active" />
      </div>

      {/* Reminders */}
      <Section title="Reminders">
        <ToggleRow label="Daily reminders" sub="Get nudged when it's habit time" value={reminders} onChange={setReminders} />
        {reminders && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #EDE8E0" }}>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: "0 0 2px" }}>Default time</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-bloom-text-muted)", margin: 0 }}>Applied to habits without a set time</p>
            </div>
            <Dropdown
              label="Default reminder time"
              value={reminderTime}
              onChange={setReminderTime}
              options={["7:00 AM", "8:00 AM", "9:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"]}
            />
          </div>
        )}
        <ToggleRow label="Weekly digest" sub="Summary every Sunday morning" value={weeklyDigest} onChange={setWeeklyDigest} divider />
      </Section>

      {/* App settings */}
      <Section title="App">
        <ToggleRow label="Gentle mode" sub="No streak warnings — just encouragement" value={gentleMode} onChange={setGentleMode} />
        <LinkRow label="Notification settings" onClick={() => setOpenSheet("notifications")} />
        <LinkRow label="Data & privacy" onClick={() => setOpenSheet("privacy")} />
        <LinkRow label="Export my data" onClick={() => setOpenSheet("export")} />
      </Section>

      {/* About */}
      <Section title="About">
        <LinkRow label="What's new" onClick={() => setOpenSheet("whatsNew")} />
        <LinkRow label="Send feedback" onClick={() => setOpenSheet("feedback")} />
        <LinkRow label="Rate Bloom 🌸" onClick={() => setOpenSheet("rate")} />
      </Section>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-bloom-text-faint)", margin: "0 0 8px" }}>Bloom v1.0 · Made with 🌱</p>
        <button
          onClick={() => setOpenSheet("signOut")}
          style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#E8A0A0", background: "none", border: "none", cursor: "pointer", minHeight: 44, padding: "8px 16px" }}
        >
          Sign out
        </button>
      </div>

      {openSheet === "editProfile" && (
        <EditProfileSheet
          name={profileName}
          email={profileEmail}
          onSave={(n, e) => { onUpdateProfile(n, e); close(); }}
          onClose={close}
        />
      )}
      {openSheet === "signOut" && (
        <ConfirmSheet
          icon="🌙"
          title="Sign out of Bloom?"
          body="Your habits are only saved in this session — signing out clears them and starts you back at onboarding."
          confirmLabel="Sign out"
          onConfirm={() => { onSignOut(); close(); }}
          onClose={close}
        />
      )}
      {openSheet === "notifications" && (
        <InfoSheet icon="🔔" title="Notification settings" onClose={close}>
          <p style={sheetP}>
            Reminders are currently <strong>{reminders ? "on" : "off"}</strong>, sent around your default time
            ({reminderTime}). Gentle mode is <strong>{gentleMode ? "on" : "off"}</strong>, so reminders stay
            encouraging even after a missed day.
          </p>
          <p style={sheetP}>
            This is a front-end prototype, so notifications aren't actually delivered to your device — this
            screen just reflects the settings above.
          </p>
        </InfoSheet>
      )}
      {openSheet === "privacy" && (
        <InfoSheet icon="🔒" title="Data & privacy" onClose={close}>
          <p style={sheetP}>
            Bloom is a design prototype — there's no account database or server. Everything you see (habits,
            check-ins, reflections) lives only in this browser tab and resets when you sign out or reload.
          </p>
          <p style={sheetP}>Nothing you enter is sent anywhere or stored permanently.</p>
        </InfoSheet>
      )}
      {openSheet === "export" && <ExportSheet habitCount={habitCount} onClose={close} />}
      {openSheet === "whatsNew" && (
        <InfoSheet icon="✨" title="What's new" onClose={close}>
          <ChangelogItem version="1.0" date="Sep 2026" text="Bloom launches — habits, mood check-ins, reflections, and weekly insights." />
          <ChangelogItem version="0.3" date="Aug 2026" text="Added gentle mode: missed days no longer break your streak visuals." />
          <ChangelogItem version="0.2" date="Aug 2026" text="Insights screen with weekly and monthly trends." />
        </InfoSheet>
      )}
      {openSheet === "feedback" && <FeedbackSheet onClose={close} />}
      {openSheet === "rate" && <RateSheet onClose={close} />}
    </div>
  );
}

const sheetP: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--color-bloom-text-muted)",
  lineHeight: 1.55,
  margin: "0 0 12px",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-bloom-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px 4px" }}>
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
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#A9D6B7" }}>{label}</span>
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
        {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-bloom-text-muted)", margin: 0 }}>{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        style={{
          position: "relative",
          width: 48,
          height: 44,
          border: "none",
          cursor: "pointer",
          background: "transparent",
          flexShrink: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            width: 48,
            height: 28,
            borderRadius: 14,
            background: value ? "#4D9467" : "#DDD8D0",
            transition: "background 200ms ease",
            display: "block",
          }}
        >
          <span
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
        </span>
      </button>
    </div>
  );
}

function LinkRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderTop: "1px solid #EDE8E0",
        background: "none",
        border: "none",
        borderTopStyle: "solid",
        borderTopWidth: 1,
        borderTopColor: "#EDE8E0",
        cursor: "pointer",
        textAlign: "left",
        minHeight: 44,
        transition: "opacity 150ms ease",
      }}
      onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#283328", margin: 0 }}>{label}</p>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-bloom-text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 12l4-4-4-4" />
      </svg>
    </button>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4D9467" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

/* ── Sheet shell ─────────────────────────────────────────────────────── */

function SheetShell({ onClose, labelledBy, children }: { onClose: () => void; labelledBy: string; children: React.ReactNode }) {
  // Portaled to a root outside the scrollable screen content (see App.tsx) so
  // opening a modal while this screen is scrolled down doesn't shift it.
  const modalRoot = useContext(ModalRootContext);
  if (!modalRoot) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(28,36,28,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 50,
        pointerEvents: "auto",
        animation: "fadeIn 180ms ease forwards",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#F8F5F0",
          borderRadius: 26,
          padding: "24px 24px calc(24px + env(safe-area-inset-bottom))",
          width: "100%",
          maxWidth: 340,
          maxHeight: "82%",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(16,22,16,0.45), 0 6px 18px rgba(16,22,16,0.25)",
          animation: "popIn 220ms cubic-bezier(0.16,1,0.3,1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn  { from { opacity:0; transform:scale(0.92) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
    </div>,
    modalRoot
  );
}

function SheetTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 id="sheet-title" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "#283328", margin: "0 0 16px" }}>
      <span aria-hidden="true">{icon}</span>
      {children}
    </h2>
  );
}

function PrimaryButton({ children, onClick, disabled, danger }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        background: disabled ? "#DDD8D0" : danger ? "#E8A0A0" : "#4D9467",
        color: disabled ? "var(--color-bloom-text-faint)" : "white",
        borderRadius: 18,
        padding: "16px",
        border: "none",
        fontFamily: "var(--font-display)",
        fontSize: 16,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        marginBottom: 10,
        minHeight: 44,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        color: "var(--color-bloom-text-muted)",
        cursor: "pointer",
        padding: 8,
        minHeight: 44,
      }}
    >
      {children}
    </button>
  );
}

/* ── Individual sheets ───────────────────────────────────────────────── */

function InfoSheet({ icon, title, onClose, children }: { icon: string; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <SheetShell onClose={onClose} labelledBy="sheet-title">
      <SheetTitle icon={icon}>{title}</SheetTitle>
      {children}
      <GhostButton onClick={onClose}>Close</GhostButton>
    </SheetShell>
  );
}

function ConfirmSheet({ icon, title, body, confirmLabel, onConfirm, onClose }: {
  icon: string; title: string; body: string; confirmLabel: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <SheetShell onClose={onClose} labelledBy="sheet-title">
      <SheetTitle icon={icon}>{title}</SheetTitle>
      <p style={sheetP}>{body}</p>
      <PrimaryButton onClick={onConfirm} danger>{confirmLabel}</PrimaryButton>
      <GhostButton onClick={onClose}>Cancel</GhostButton>
    </SheetShell>
  );
}

function EditProfileSheet({ name, email, onSave, onClose }: {
  name: string; email: string; onSave: (name: string, email: string) => void; onClose: () => void;
}) {
  const [n, setN] = useState(name);
  const [e, setE] = useState(email);
  const trimmed = n.trim();

  return (
    <SheetShell onClose={onClose} labelledBy="sheet-title">
      <SheetTitle icon="✏️">Edit profile</SheetTitle>
      <label htmlFor="edit-name" style={fieldLabel}>Name</label>
      <input id="edit-name" value={n} onChange={(ev) => setN(ev.target.value)} style={fieldInput} autoFocus />
      <label htmlFor="edit-email" style={fieldLabel}>Email</label>
      <input id="edit-email" type="email" value={e} onChange={(ev) => setE(ev.target.value)} style={{ ...fieldInput, marginBottom: 24 }} />
      <PrimaryButton onClick={() => trimmed && onSave(trimmed, e.trim())} disabled={!trimmed}>
        Save changes
      </PrimaryButton>
      <GhostButton onClick={onClose}>Cancel</GhostButton>
    </SheetShell>
  );
}

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-bloom-text-muted)",
  marginBottom: 6,
};

const fieldInput: React.CSSProperties = {
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
  minHeight: 44,
};

function ExportSheet({ habitCount, onClose }: { habitCount: number; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "preparing" | "done">("idle");

  return (
    <SheetShell onClose={onClose} labelledBy="sheet-title">
      <SheetTitle icon="📦">Export my data</SheetTitle>
      {state === "done" ? (
        <p style={sheetP}>
          Your export would include {habitCount} habit{habitCount !== 1 ? "s" : ""}, today's check-ins, and any
          reflections — as a JSON file. This prototype has no backend to generate real files from, but that's
          exactly what tapping "Export" would kick off in the shipped app.
        </p>
      ) : (
        <p style={sheetP}>
          Download a copy of everything Bloom has stored for you: habits, streaks, mood check-ins, and
          reflections.
        </p>
      )}
      {state !== "done" ? (
        <PrimaryButton
          onClick={() => {
            setState("preparing");
            setTimeout(() => setState("done"), 700);
          }}
          disabled={state === "preparing"}
        >
          {state === "preparing" ? "Preparing export…" : "Prepare export"}
        </PrimaryButton>
      ) : (
        <PrimaryButton onClick={onClose}>Done</PrimaryButton>
      )}
      <GhostButton onClick={onClose}>Close</GhostButton>
    </SheetShell>
  );
}

function ChangelogItem({ version, date, text }: { version: string; date: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "#4D9467", background: "#EEF6F1", borderRadius: 8, padding: "2px 7px", height: "fit-content", flexShrink: 0 }}>
        v{version}
      </span>
      <div>
        <p style={{ ...sheetP, margin: 0 }}>{text}</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-bloom-text-faint)", margin: "3px 0 0" }}>{date}</p>
      </div>
    </div>
  );
}

function FeedbackSheet({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const trimmed = text.trim();

  if (sent) {
    return (
      <SheetShell onClose={onClose} labelledBy="sheet-title">
        <SheetTitle icon="💌">Thank you</SheetTitle>
        <p style={sheetP}>Your feedback helps Bloom grow — appreciated.</p>
        <PrimaryButton onClick={onClose}>Done</PrimaryButton>
      </SheetShell>
    );
  }

  return (
    <SheetShell onClose={onClose} labelledBy="sheet-title">
      <SheetTitle icon="💬">Send feedback</SheetTitle>
      <label htmlFor="feedback-text" className="sr-only">Your feedback</label>
      <textarea
        id="feedback-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's working, what isn't — anything helps."
        rows={4}
        autoFocus
        style={{ ...fieldInput, resize: "vertical", minHeight: 88, marginBottom: 16 }}
      />
      <PrimaryButton onClick={() => trimmed && setSent(true)} disabled={!trimmed}>
        Send
      </PrimaryButton>
      <GhostButton onClick={onClose}>Cancel</GhostButton>
    </SheetShell>
  );
}

function RateSheet({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <SheetShell onClose={onClose} labelledBy="sheet-title">
        <SheetTitle icon="🌸">Thanks for rating Bloom</SheetTitle>
        <p style={sheetP}>Glad you're here — {rating} of 5 stars, noted.</p>
        <PrimaryButton onClick={onClose}>Done</PrimaryButton>
      </SheetShell>
    );
  }

  return (
    <SheetShell onClose={onClose} labelledBy="sheet-title">
      <SheetTitle icon="🌸">Rate Bloom</SheetTitle>
      <p style={sheetP}>How's Bloom working for you so far?</p>
      <div role="radiogroup" aria-label="Star rating" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
            style={{
              width: 44,
              height: 44,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 26,
              padding: 0,
              opacity: n <= rating ? 1 : 0.35,
              transition: "opacity 150ms ease, transform 150ms ease",
              transform: n <= rating ? "scale(1)" : "scale(0.92)",
            }}
          >
            <span aria-hidden="true">⭐</span>
          </button>
        ))}
      </div>
      <PrimaryButton onClick={() => rating > 0 && setSubmitted(true)} disabled={rating === 0}>
        Submit rating
      </PrimaryButton>
      <GhostButton onClick={onClose}>Not now</GhostButton>
    </SheetShell>
  );
}
