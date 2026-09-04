import { useEffect, useRef, useState } from "react";

/**
 * A small custom dropdown to replace native <select> — the browser's native
 * option list can't be styled (no rounded corners, no transition, no custom
 * hover), so this renders its own rounded, animated, keyboard-accessible menu.
 */
export default function Dropdown({
  value,
  options,
  onChange,
  label,
  align = "right",
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 600,
          color: "#4D9467",
          background: open ? "#E3F1E8" : "#EEF6F1",
          borderRadius: 12,
          padding: "8px 12px",
          border: "1.5px solid transparent",
          outline: "none",
          cursor: "pointer",
          minHeight: 36,
          transition: "background 150ms ease",
        }}
      >
        {value}
        <ChevronDown open={open} />
      </button>

      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          [align]: 0,
          minWidth: 128,
          background: "#FFFFFF",
          border: "1.5px solid #EDE8E0",
          borderRadius: 16,
          boxShadow: "0 12px 28px rgba(40,51,40,0.16)",
          padding: 6,
          zIndex: 30,
          transformOrigin: "top",
          transform: open ? "scale(1) translateY(0)" : "scale(0.94) translateY(-4px)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "transform 160ms cubic-bezier(0.16,1,0.3,1), opacity 140ms ease, visibility 160ms",
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: selected ? 700 : 500,
                color: selected ? "#3A7A52" : "#283328",
                background: selected ? "#EEF6F1" : "transparent",
                border: "none",
                borderRadius: 10,
                padding: "9px 10px",
                cursor: "pointer",
                minHeight: 36,
                transition: "background 120ms ease, color 120ms ease",
              }}
              onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#F5F3EE"; }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms cubic-bezier(0.4,0,0.2,1)", flexShrink: 0 }}
    >
      <path d="M2.5 4.5L6 8l3.5-3.5" />
    </svg>
  );
}
