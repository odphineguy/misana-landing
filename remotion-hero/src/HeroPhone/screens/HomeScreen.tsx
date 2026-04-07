import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TabBar } from "../parts/TabBar";
import { MiSanaLogo } from "../parts/MiSanaLogo";
import { T } from "../timing";

const ACCENT = "#1169a0";
const INK = "#0f2b3c";
const MUTED = "#5a7186";
const PANEL = "#ecf4fb";

export const HomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger entrance for cards. Frames are global, so we offset relative
  // to when the home screen visually appears.
  const localFrame = frame - T.splashEnd;

  const heroIn = staggered(localFrame, fps, 0);
  const healthIn = staggered(localFrame, fps, 6);
  const action1In = staggered(localFrame, fps, 14);
  const action2In = staggered(localFrame, fps, 18);
  const action3In = staggered(localFrame, fps, 22);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at 20% 0%, rgba(26,139,199,0.10), transparent 40%), radial-gradient(circle at 90% 90%, rgba(13,95,138,0.06), transparent 35%)",
        padding: "70px 26px 130px",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
          marginBottom: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MiSanaLogo size={28} />
          <div style={{ fontWeight: 800, fontSize: 22, color: INK, letterSpacing: -0.6 }}>
            MiSana
          </div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#eef4fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ACCENT,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          ···
        </div>
      </div>

      {/* Hello card */}
      <Card style={enterStyle(heroIn)}>
        <div style={{ fontSize: 32, fontWeight: 800, color: INK, letterSpacing: -1 }}>
          Hello!
        </div>
        <div style={{ marginTop: 4, color: MUTED, fontSize: 15, fontWeight: 500 }}>
          Welcome back to your health sanctuary.
        </div>
      </Card>

      {/* Connect health */}
      <Card style={{ ...enterStyle(healthIn), marginTop: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #1a8bc7, #1169a0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-4.5-7-10.5A4.5 4.5 0 0 1 12 6.5 4.5 4.5 0 0 1 19 10.5C19 16.5 12 21 12 21Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: INK, letterSpacing: -0.3 }}>
              Connect health data
            </div>
            <div style={{ marginTop: 3, color: MUTED, fontSize: 12.5, lineHeight: 1.4 }}>
              Allow Apple Health for personalized recommendations. Your data never leaves the device.
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            width: "100%",
            height: 44,
            borderRadius: 22,
            background: "linear-gradient(135deg, #1580b8 0%, #0d5f8a 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: -0.2,
            boxShadow: "0 8px 18px rgba(13,95,138,0.28)",
          }}
        >
          Connect Apple Health
        </div>
      </Card>

      {/* Quick actions title */}
      <div
        style={{
          marginTop: 18,
          marginBottom: 8,
          fontSize: 18,
          fontWeight: 800,
          color: INK,
          letterSpacing: -0.4,
          opacity: clamp(action1In - 0.2, 0, 1),
        }}
      >
        Quick Actions
      </div>

      <ActionRow
        title="Scan Prescription"
        subtitle="Scan your medication label to add it."
        iconBg="linear-gradient(135deg, #1a8bc7, #1169a0)"
        icon={<IconScan />}
        style={enterStyle(action1In)}
      />
      <ActionRow
        title="Check Symptoms"
        subtitle="Check what you're feeling with AI."
        iconBg="linear-gradient(135deg, #1a8bc7, #1169a0)"
        icon={<IconStetho />}
        style={{ ...enterStyle(action2In), marginTop: 8 }}
      />
      <ActionRow
        title="Prepare Appointment"
        subtitle="Organize questions for your visit."
        iconBg="linear-gradient(135deg, #1a8bc7, #1169a0)"
        icon={<IconClipboard />}
        style={{ ...enterStyle(action3In), marginTop: 8 }}
      />

      <TabBar active="home" />
    </div>
  );
};

// ── Helpers ────────────────────────────────────────────────────────────────

const staggered = (frame: number, fps: number, delay: number) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 140 },
  });

const enterStyle = (s: number): React.CSSProperties => ({
  opacity: s,
  transform: `translateY(${(1 - s) * 14}px)`,
});

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: PANEL,
      borderRadius: 22,
      padding: "16px 18px",
      boxShadow: "0 6px 20px rgba(15,43,60,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

const ActionRow: React.FC<{
  title: string;
  subtitle: string;
  iconBg: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, subtitle, iconBg, icon, style }) => (
  <div
    style={{
      backgroundColor: PANEL,
      borderRadius: 18,
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 4px 14px rgba(15,43,60,0.05)",
      ...style,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: INK, letterSpacing: -0.2 }}>
        {title}
      </div>
      <div
        style={{
          marginTop: 2,
          color: MUTED,
          fontSize: 12,
          lineHeight: 1.35,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {subtitle}
      </div>
    </div>
    <div style={{ color: "#9aa9b6", fontSize: 18, fontWeight: 700 }}>›</div>
  </div>
);

const IconScan: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="8" y="9" width="8" height="6" rx="1.5" stroke="#fff" strokeWidth="2" />
  </svg>
);

const IconStetho: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 4v6a4 4 0 0 0 8 0V4M10 19a3 3 0 0 0 3-3v-3"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="17" cy="9.5" r="2" stroke="#fff" strokeWidth="2" />
  </svg>
);

const IconClipboard: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="6" y="4.5" width="12" height="16" rx="2" stroke="#fff" strokeWidth="2" />
    <rect x="9" y="3" width="6" height="3" rx="1" fill="#fff" />
    <line x1="9" y1="11" x2="15" y2="11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="14.5" x2="13.5" y2="14.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
