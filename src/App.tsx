import { useState, useEffect, useRef } from "react";
import HomeScreen from "./screens/HomeScreen";
import InsightsScreen from "./screens/InsightsScreen";
import MoodScreen from "./screens/MoodScreen";
import SettingsScreen from "./screens/SettingsScreen";
import OnboardingFlow, { type SeedHabit } from "./screens/OnboardingFlow";
import type { Habit } from "./types";

type Tab = "home" | "insights" | "mood" | "settings";
const TAB_ORDER: Tab[] = ["home", "insights", "mood", "settings"];

// The one source of truth for "which habits exist" — Home, Insights, and
// Settings all read from the same list instead of each keeping a private
// copy, so a habit created in onboarding (or via Home's + button) shows up
// everywhere, not just on the screen that created it.
const SAMPLE_HABITS: (Habit & { initDone: boolean })[] = [
  { id: 1, name: "Morning pages",   icon: "✍️", colorBg: "#EEF6F1", accent: "#4D9467", streak: 14, time: "7:00 AM",  isSample: true, initDone: false },
  { id: 2, name: "10-min walk",     icon: "🚶", colorBg: "#EAF5FA", accent: "#6BAEC4", streak: 6,  time: "12:00 PM", isSample: true, initDone: false },
  { id: 3, name: "Read 20 pages",   icon: "📖", colorBg: "#F2EEF7", accent: "#9B82B8", streak: 21, time: "9:00 PM",  isSample: true, initDone: true },
  { id: 4, name: "Drink 8 glasses", icon: "💧", colorBg: "#FBF0E6", accent: "#E8975A", streak: 3,  time: "All day",  isSample: true, initDone: true },
  { id: 5, name: "Meditate",        icon: "🌿", colorBg: "#EEF6F1", accent: "#4D9467", streak: 9,  time: "8:00 AM",  isSample: true, initDone: false },
];
const initialCheckedIds = () => new Set(SAMPLE_HABITS.filter((h) => h.initDone).map((h) => h.id));

// A real phone (any orientation) is detected by touch-primary input, not just
// a narrow width — that way rotating to landscape doesn't flip it back into
// the desktop hardware-mockup treatment. A narrow desktop window falls back
// to the same full-bleed layout too, since that's the more useful behavior
// either way.
const TOUCH_DEVICE_QUERY = "(hover: none) and (pointer: coarse)";
const NARROW_WIDTH_QUERY = "(max-width: 480px)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [prevTab, setPrevTab] = useState<Tab | null>(null);
  const [animating, setAnimating] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(SAMPLE_HABITS);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(initialCheckedIds);
  const [profileName, setProfileName] = useState("Aga");
  const [profileEmail, setProfileEmail] = useState("aga@example.com");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTouchDevice = useMediaQuery(TOUCH_DEVICE_QUERY);
  const isNarrow = useMediaQuery(NARROW_WIDTH_QUERY);
  const isMobile = isTouchDevice || isNarrow;
  const isLandscape = useMediaQuery("(orientation: landscape)");
  // Only nudge touch devices to rotate — a wide desktop window is always
  // "landscape" and shouldn't be blocked.
  const showRotateNotice = isTouchDevice && isLandscape;

  // Brief, honest loading state the moment the user lands on Home for the
  // first time (this is where a real fetch of today's habits would resolve)
  // rather than skipping straight to content.
  const finishOnboarding = (habit: SeedHabit) => {
    const seed: Habit = {
      id: -1, name: habit.name, icon: habit.icon,
      colorBg: "#EEF6F1", accent: "#4D9467", streak: 1, time: habit.time, isSample: false,
    };
    setHabits([seed, ...SAMPLE_HABITS]);
    setOnboarded(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 550);
  };

  const toggleHabit = (id: number) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const addHabit = (name: string, icon: string) => {
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), name, icon, colorBg: "#EEF6F1", accent: "#4D9467", streak: 0, time: "Anytime", isSample: false },
    ]);
  };

  // This is a front-end-only prototype with no backend, so "sign out" simply
  // clears local state and drops back to onboarding — same spirit as the rest
  // of the app: real interaction, no real persistence.
  const resetToOnboarding = () => {
    setOnboarded(false);
    setHabits(SAMPLE_HABITS);
    setCheckedIds(initialCheckedIds());
    setCheckInDone(false);
    setActiveTab("home");
    setPrevTab(null);
    setAnimating(false);
  };

  const updateProfile = (name: string, email: string) => {
    setProfileName(name);
    setProfileEmail(email);
  };

  const navigate = (tab: Tab) => {
    if (tab === activeTab || animating) return;
    setPrevTab(activeTab);
    setActiveTab(tab);
    setAnimating(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPrevTab(null);
      setAnimating(false);
    }, 320);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const direction = (from: Tab, to: Tab) => {
    const fi = TAB_ORDER.indexOf(from);
    const ti = TAB_ORDER.indexOf(to);
    return ti > fi ? 1 : -1;
  };

  const screens: Record<Tab, React.ReactNode> = {
    home: (
      <HomeScreen
        onMoodTap={() => navigate("mood")}
        habits={habits}
        checkedIds={checkedIds}
        onToggle={toggleHabit}
        onAdd={addHabit}
        profileName={profileName}
      />
    ),
    insights: <InsightsScreen habits={habits} checkedIds={checkedIds} />,
    mood: <MoodScreen done={checkInDone} onComplete={() => setCheckInDone(true)} />,
    settings: (
      <SettingsScreen
        habitCount={habits.length}
        bestStreak={Math.max(...habits.map((h) => h.streak))}
        profileName={profileName}
        profileEmail={profileEmail}
        onUpdateProfile={updateProfile}
        onSignOut={resetToOnboarding}
      />
    ),
  };

  const dir = prevTab ? direction(prevTab, activeTab) : 0;

  // Real phone in landscape: the layout is designed portrait-only (per project
  // scope), so ask for a rotate rather than showing a squashed, half-working screen.
  if (showRotateNotice) {
    return (
      <div
        style={{
          fontFamily: "var(--font-body)",
          background: "var(--color-bloom-text)",
          color: "#fff",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 12,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 40 }} aria-hidden="true">📱</div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, margin: 0 }}>
          Bloom works best in portrait
        </p>
        <p style={{ fontSize: 13, color: "var(--color-bloom-green-200)", margin: 0, maxWidth: 260 }}>
          Rotate your phone back upright to keep going.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: isMobile ? "var(--color-bloom-cream)" : "#D8D4CC",
        minHeight: "100dvh",
      }}
      className={isMobile ? "" : "flex items-center justify-center p-4"}
    >
      {/* Phone frame — a real hardware mockup on desktop for presentation, a
          full-bleed viewport on an actual phone */}
      <div
        style={
          isMobile
            ? {
                width: "100%",
                maxWidth: 560,
                margin: "0 auto",
                height: "100dvh",
                background: "#F8F5F0",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }
            : {
                width: 390,
                height: 844,
                borderRadius: 50,
                boxShadow: "0 40px 100px rgba(0,0,0,0.35), 0 0 0 12px #1c1c1e, 0 0 0 14px #3a3a3c",
                background: "#F8F5F0",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }
        }
      >
        {isMobile ? (
          // The real device already draws its own status bar/notch — reserve
          // just the safe-area inset so content never sits under it.
          <div style={{ flexShrink: 0, height: "env(safe-area-inset-top)" }} />
        ) : (
          <StatusBar />
        )}

        {!onboarded ? (
          <OnboardingFlow onDone={finishOnboarding} />
        ) : loading ? (
          <ScreenSkeleton />
        ) : (
          <>
            {/* Screen viewport */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              {/* Outgoing screen */}
              {prevTab && animating && (
                <div
                  key={`prev-${prevTab}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflowY: "auto",
                    transform: `translateX(${dir * -30}px)`,
                    opacity: 0,
                    transition: "transform 320ms cubic-bezier(0.4,0,0.2,1), opacity 320ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {screens[prevTab]}
                </div>
              )}

              {/* Incoming screen */}
              <div
                key={`active-${activeTab}`}
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  overflowY: "auto",
                  transform: animating ? "translateX(0)" : "translateX(0)",
                  opacity: 1,
                  animation: animating ? `slideIn${dir > 0 ? "Right" : "Left"} 320ms cubic-bezier(0.4,0,0.2,1) forwards` : "none",
                }}
              >
                {screens[activeTab]}
              </div>
            </div>

            {/* Tab bar */}
            <TabBar activeTab={activeTab} onNavigate={navigate} checkInDone={checkInDone} isMobile={isMobile} />
          </>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-40px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px 8px",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}
    >
      <span style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: "#283328" }}>9:41</span>
      {/* Dynamic island */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 34,
          background: "#1c1c1e",
          borderRadius: 20,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function ScreenSkeleton() {
  const block = (h: number, w: string = "100%", r = 16) => (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: r,
        background: "var(--color-bloom-cream-dark)",
        animation: "pulse 1.1s ease-in-out infinite",
      }}
    />
  );
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading your day"
      style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 24px 24px", flex: 1 }}
    >
      <span className="sr-only">Loading your day…</span>
      {block(48, "70%", 10)}
      {block(96, "100%", 24)}
      {block(56, "100%", 18)}
      {block(20, "40%", 6)}
      {block(64, "100%", 18)}
      {block(64, "100%", 18)}
      {block(64, "100%", 18)}
    </div>
  );
}

function TabBar({ activeTab, onNavigate, checkInDone, isMobile }: {
  activeTab: Tab;
  onNavigate: (t: Tab) => void;
  checkInDone: boolean;
  isMobile: boolean;
}) {
  const tabs = [
    { id: "home" as Tab, label: "Today", icon: <HomeIcon /> },
    { id: "insights" as Tab, label: "Insights", icon: <InsightsIcon /> },
    { id: "mood" as Tab, label: "Check-in", icon: <MoodIcon />, badge: !checkInDone },
    { id: "settings" as Tab, label: "Settings", icon: <SettingsIconSvg /> },
  ];
  return (
    <div
      role="tablist"
      aria-label="Main navigation"
      style={{
        flexShrink: 0,
        background: "rgba(248,245,240,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid #E0DCD5",
        paddingBottom: isMobile ? "calc(10px + env(safe-area-inset-bottom))" : 28,
        paddingTop: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onNavigate(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "4px 8px",
                position: "relative",
                minWidth: 56,
                minHeight: 44,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 36,
                  borderRadius: 18,
                  background: active ? "#EEF6F1" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? "#4D9467" : "var(--color-bloom-text-muted)",
                  transition: "background 250ms ease, color 250ms ease",
                  position: "relative",
                }}
              >
                {tab.icon}
                {tab.badge && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#E8975A",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: active ? "#4D9467" : "var(--color-bloom-text-muted)",
                  transition: "color 250ms ease",
                }}
              >
                {tab.label}
                {tab.badge && <span className="sr-only"> — not checked in yet</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomeIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function InsightsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function MoodIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" /><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" /></svg>;
}
function SettingsIconSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>;
}
function SignalIcon() {
  return <svg width="17" height="12" viewBox="0 0 17 12" fill="#283328" aria-hidden="true"><rect x="0" y="6" width="3" height="6" rx="1" /><rect x="4.5" y="4" width="3" height="8" rx="1" /><rect x="9" y="2" width="3" height="10" rx="1" /><rect x="13.5" y="0" width="3" height="12" rx="1" /></svg>;
}
function WifiIcon() {
  return <svg width="17" height="13" viewBox="0 0 24 18" fill="none" stroke="#283328" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 7C5.5 2.5 18.5 2.5 23 7" /><path d="M4.5 10.5C7.5 7.5 16.5 7.5 19.5 10.5" /><path d="M8 14c2-2 6-2 8 0" /><circle cx="12" cy="17" r="1" fill="#283328" stroke="none" /></svg>;
}
function BatteryIcon() {
  return <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#283328" strokeOpacity="0.35" /><rect x="2" y="2" width="16" height="8" rx="2" fill="#283328" /><path d="M23 4v4a2 2 0 000-4z" fill="#283328" fillOpacity="0.4" /></svg>;
}
