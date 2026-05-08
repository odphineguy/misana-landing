import React from "react";

type Tab = "home" | "scan" | "myvisit" | "lookup";

const TABS: { key: Tab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "scan", label: "Scan" },
  { key: "myvisit", label: "My Visit" },
  { key: "lookup", label: "Look Up" },
];

const ACCENT = "#1169a0";
const INACTIVE = "#2b3947";

export const SymptomsTabBar: React.FC<{ active: Tab }> = ({ active }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 18,
        left: 18,
        right: 18,
        height: 78,
        backgroundColor: "#ffffff",
        borderRadius: 38,
        boxShadow:
          "0 12px 30px rgba(15,43,60,0.10), 0 0 0 1px rgba(15,43,60,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 14px",
        zIndex: 3,
      }}
    >
      {TABS.map((t) => (
        <TabItem
          key={t.key}
          label={t.label}
          icon={t.key}
          active={t.key === active}
        />
      ))}
    </div>
  );
};

const TabItem: React.FC<{
  label: string;
  icon: Tab;
  active: boolean;
}> = ({ label, icon, active }) => {
  const color = active ? ACCENT : INACTIVE;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <TabIcon name={icon} color={color} active={active} />
      <div
        style={{
          fontSize: 13,
          fontWeight: active ? 800 : 600,
          color,
          fontFamily: "Outfit, sans-serif",
          letterSpacing: -0.2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const TabIcon: React.FC<{ name: Tab; color: string; active: boolean }> = ({
  name,
  color,
  active,
}) => {
  const size = 24;
  const fill = active ? color : "none";
  const fillOpacity = active ? 1 : 0;
  switch (name) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            fill={fill}
            fillOpacity={fillOpacity}
          />
        </svg>
      );
    case "scan":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Corner brackets */}
          <path
            d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Pill in middle */}
          <rect
            x="8.5"
            y="10.5"
            width="7"
            height="3"
            rx="1.5"
            stroke={color}
            strokeWidth="1.6"
            fill={fill}
            fillOpacity={fillOpacity * 0.4}
          />
        </svg>
      );
    case "myvisit":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect
            x="4"
            y="5"
            width="16"
            height="15"
            rx="2.5"
            stroke={color}
            strokeWidth="2"
            fill={fill}
            fillOpacity={fillOpacity * 0.18}
          />
          <line
            x1="4"
            y1="9.5"
            x2="20"
            y2="9.5"
            stroke={color}
            strokeWidth="2"
          />
          <line
            x1="8"
            y1="3"
            x2="8"
            y2="6.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="3"
            x2="16"
            y2="6.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Small clock face */}
          <circle
            cx="15"
            cy="15"
            r="2.5"
            stroke={color}
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M15 13.6V15l1 0.7"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "lookup":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke={color}
            strokeWidth="2"
            fill={fill}
            fillOpacity={fillOpacity * 0.12}
          />
          <line
            x1="16"
            y1="16"
            x2="20.5"
            y2="20.5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};
