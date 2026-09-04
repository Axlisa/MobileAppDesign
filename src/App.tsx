import { useState, useEffect, useRef } from "react";
import HomeScreen from "./screens/HomeScreen";
import InsightsScreen from "./screens/InsightsScreen";
import MoodScreen from "./screens/MoodScreen";
import SettingsScreen from "./screens/SettingsScreen";

type Tab = "home" | "insights" | "mood" | "settings";
const TAB_ORDER: Tab[] = ["home", "insights", "mood", "settings"];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [prevTab, setPrevTab] = useState<Tab | null>(null);
  const [animating, setAnimating] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    home: <HomeScreen onMoodTap={() => navigate("mood")} />,
    insights: <InsightsScreen />,
    mood: <MoodScreen done={checkInDone} onComplete={() => setCheckInDone(true)} />,
    settings: <SettingsScreen />,
  };

  const dir = prevTab ? direction(prevTab, activeTab) : 0;

  return (
    <div
      style={{ fontFamily: "var(--font-body)", background: "#D8D4CC", minHeight: "100%" }}
      className="flex items-center justify-center p-4"
    >
      {/* Phone frame */}
      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          boxShadow: "0 40px 100px rgba(0,0,0,0.35), 0 0 0 12px #1c1c1e, 0 0 0 14px #3a3a3c",
          background: "#F8F5F0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Status bar */}
        <StatusBar />

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
        <TabBar activeTab={activeTab} onNavigate={navigate} checkInDone={checkInDone} />
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

function TabBar({ activeTab, onNavigate, checkInDone }: {
  activeTab: Tab;
  onNavigate: (t: Tab) => void;
  checkInDone: boolean;
}) {
  const tabs = [
    { id: "home" as Tab, label: "Today", icon: <HomeIcon /> },
    { id: "insights" as Tab, label: "Insights", icon: <InsightsIcon /> },
    { id: "mood" as Tab, label: "Check-in", icon: <MoodIcon />, badge: !checkInDone },
    { id: "settings" as Tab, label: "Settings", icon: <SettingsIconSvg /> },
  ];
  return (
    <div
      style={{
        flexShrink: 0,
        background: "rgba(248,245,240,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid #E0DCD5",
        paddingBottom: 28,
        paddingTop: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
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
                  color: active ? "#4D9467" : "#7A9080",
                  transition: "background 250ms ease, color 250ms ease",
                  position: "relative",
                }}
              >
                {tab.icon}
                {tab.badge && (
                  <span
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
                  color: active ? "#4D9467" : "#7A9080",
                  transition: "color 250ms ease",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomeIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function InsightsIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function MoodIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" /><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" /></svg>;
}
function SettingsIconSvg() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>;
}
function SignalIcon() {
  return <svg width="17" height="12" viewBox="0 0 17 12" fill="#283328"><rect x="0" y="6" width="3" height="6" rx="1" /><rect x="4.5" y="4" width="3" height="8" rx="1" /><rect x="9" y="2" width="3" height="10" rx="1" /><rect x="13.5" y="0" width="3" height="12" rx="1" /></svg>;
}
function WifiIcon() {
  return <svg width="17" height="13" viewBox="0 0 24 18" fill="none" stroke="#283328" strokeWidth="2" strokeLinecap="round"><path d="M1 7C5.5 2.5 18.5 2.5 23 7" /><path d="M4.5 10.5C7.5 7.5 16.5 7.5 19.5 10.5" /><path d="M8 14c2-2 6-2 8 0" /><circle cx="12" cy="17" r="1" fill="#283328" stroke="none" /></svg>;
}
function BatteryIcon() {
  return <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#283328" strokeOpacity="0.35" /><rect x="2" y="2" width="16" height="8" rx="2" fill="#283328" /><path d="M23 4v4a2 2 0 000-4z" fill="#283328" fillOpacity="0.4" /></svg>;
}
