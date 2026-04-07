import React from "react";

type Tab = "home" | "meds" | "symptoms" | "appts" | "ask";

const TABS: { key: Tab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "meds", label: "Meds" },
  { key: "symptoms", label: "Symptoms" },
  { key: "appts", label: "Appts" },
  { key: "ask", label: "Ask" },
];

const ACCENT = "#1169a0";
const INK = "#0f2b3c";

export const TabBar: React.FC<{ active: Tab }> = ({ active }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 22,
        left: 14,
        right: 14,
        height: 70,
        backgroundColor: "#ffffff",
        borderRadius: 36,
        boxShadow: "0 10px 28px rgba(15, 43, 60, 0.10), 0 0 0 1px rgba(15,43,60,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 14px",
        zIndex: 3,
      }}
    >
      {TABS.map((t) => (
        <TabItem key={t.key} label={t.label} icon={t.key} active={t.key === active} />
      ))}
    </div>
  );
};

const TabItem: React.FC<{ label: string; icon: Tab; active: boolean }> = ({
  label,
  icon,
  active,
}) => {
  const color = active ? ACCENT : "#7b8a96";
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: active ? "8px 14px" : 0,
        borderRadius: 22,
        backgroundColor: active ? "rgba(17,105,160,0.10)" : "transparent",
        minWidth: active ? 78 : 50,
      }}
    >
      <TabIcon name={icon} color={color} />
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          fontFamily: "Outfit, sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const TabIcon: React.FC<{ name: Tab; color: string }> = ({ name, color }) => {
  const size = 22;
  switch (name) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.12"
          />
        </svg>
      );
    case "meds":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect
            x="3.2"
            y="9"
            width="17.6"
            height="6"
            rx="3"
            transform="rotate(-35 12 12)"
            stroke={color}
            strokeWidth="2"
            fill={color}
            fillOpacity="0.12"
          />
          <line
            x1="9"
            y1="6"
            x2="15"
            y2="18"
            stroke={color}
            strokeWidth="2"
            transform="rotate(-35 12 12)"
          />
        </svg>
      );
    case "symptoms":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 4.5h11.5L19 7v12.5H5Z"
            stroke={color}
            strokeWidth="2"
            fill={color}
            fillOpacity="0.12"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.5 12.9 12h2.6l-2.1 1.5.8 2.5-2.2-1.6-2.2 1.6.8-2.5L8.5 12h2.6Z"
            fill={color}
          />
        </svg>
      );
    case "appts":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect
            x="3.5"
            y="5"
            width="17"
            height="15"
            rx="2.5"
            stroke={color}
            strokeWidth="2"
            fill={color}
            fillOpacity="0.12"
          />
          <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke={color} strokeWidth="2" />
          <line x1="8" y1="3" x2="8" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="3" x2="16" y2="6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "ask":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 5.5h16v11H10l-4 4v-4H4Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.12"
          />
        </svg>
      );
  }
};
