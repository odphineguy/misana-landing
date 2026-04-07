import React from "react";

// 540 x 1140 composition. The phone bezel fills the comp. The screen
// inside is offset by the bezel padding and clipped with rounded corners.

const BEZEL_PADDING = 12;
const SCREEN_RADIUS = 58;
const BEZEL_RADIUS = 70;

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#0a1722",
        borderRadius: BEZEL_RADIUS,
        padding: BEZEL_PADDING,
        boxShadow:
          "inset 0 0 0 2px rgba(255,255,255,0.06), 0 24px 80px rgba(14,92,132,0.35)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: SCREEN_RADIUS,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {children}

        {/* Status bar overlay (always on top) */}
        <StatusBar />

        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 130,
            height: 36,
            borderRadius: 22,
            backgroundColor: "#0a1722",
            zIndex: 5,
          }}
        />

        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 140,
            height: 5,
            borderRadius: 99,
            backgroundColor: "#0a1722",
            opacity: 0.55,
            zIndex: 6,
          }}
        />
      </div>
    </div>
  );
};

const StatusBar: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 36px",
        zIndex: 4,
        fontFamily:
          "-apple-system, system-ui, BlinkMacSystemFont, 'Outfit', sans-serif",
        color: "#0a1722",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>9:41</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
        }}
      >
        {/* Cell signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#0a1722">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" opacity="0.35" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" opacity="0.35" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#0a1722">
          <path d="M8 2.2c2.4 0 4.6 0.9 6.3 2.4l1.4-1.5C13.6 1.2 10.9 0 8 0S2.4 1.2 0.3 3.1l1.4 1.5C3.4 3.1 5.6 2.2 8 2.2z" />
          <path d="M8 5.4c1.6 0 3 0.6 4.1 1.6l1.3-1.4C12 4.4 10.1 3.5 8 3.5s-4 0.9-5.4 2.1l1.3 1.4C5 6 6.4 5.4 8 5.4z" />
          <path d="M8 8.6c0.8 0 1.5 0.3 2 0.8L8 11.5l-2-2.1c0.5-0.5 1.2-0.8 2-0.8z" />
        </svg>
        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="#0a1722" strokeOpacity="0.55" />
          <rect x="2" y="2" width="19" height="8" rx="2" fill="#0a1722" />
          <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="#0a1722" opacity="0.55" />
        </svg>
      </div>
    </div>
  );
};
