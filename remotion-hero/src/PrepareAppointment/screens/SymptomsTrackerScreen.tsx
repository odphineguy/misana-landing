import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { T } from "../timing";
import { SymptomsTabBar } from "../parts/SymptomsTabBar";

const ACCENT = "#1169a0";
const ACCENT_DARK = "#0d5f8a";
const INK = "#0f2b3c";
const MUTED = "#5a7186";
const PAGE_BG = "#ffffff";
const HERO_BG = "#dceaf3";
const PATTERNS_BG = "#dde9f1";
const RED = "#dd3a3a";

export const SymptomsTrackerScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame for staggered entrance — 0 at trackerEnter
  const local = frame - T.trackerEnter;

  const headerIn = spring({
    frame: local,
    fps,
    config: { damping: 22, stiffness: 140 },
  });
  const heroIn = spring({
    frame: local - 4,
    fps,
    config: { damping: 22, stiffness: 140 },
  });
  const ctaIn = spring({
    frame: local - 8,
    fps,
    config: { damping: 22, stiffness: 140 },
  });
  const patternsIn = spring({
    frame: local - 12,
    fps,
    config: { damping: 22, stiffness: 140 },
  });
  const patternsDetailsIn = spring({
    frame: frame - T.patternsReveal,
    fps,
    config: { damping: 22, stiffness: 140 },
  });

  // Export tap pulse
  const exportPulse =
    frame >= T.exportTap
      ? spring({
          frame: frame - T.exportTap,
          fps,
          config: { damping: 8, stiffness: 220 },
        })
      : 0;
  const exportScale = interpolate(exportPulse, [0, 0.5, 1], [1, 1.14, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: PAGE_BG,
        padding: "60px 18px 0",
        fontFamily: "Outfit, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* ── Top header: back chip + Symptoms title ──────────────── */}
      <div
        style={{
          marginTop: 14,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          ...enter(headerIn),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 6px 16px rgba(15,43,60,0.10), 0 0 0 1px rgba(15,43,60,0.06)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: INK,
            letterSpacing: -0.4,
          }}
        >
          Symptoms
        </div>
      </div>

      {/* ── "Symptom tracker" hero card ───────────────────────── */}
      <div
        style={{
          backgroundColor: HERO_BG,
          borderRadius: 22,
          padding: "22px 24px",
          ...enter(heroIn),
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: INK,
            letterSpacing: -0.8,
            lineHeight: 1.0,
          }}
        >
          Symptom tracker
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 18,
            lineHeight: 1.35,
            color: INK,
            opacity: 0.78,
          }}
        >
          Log how you feel.
          <br />
          Your doctor will see the patterns.
        </div>
      </div>

      {/* ── "How do you feel today?" CTA ──────────────────────── */}
      <div
        style={{
          height: 64,
          borderRadius: 32,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -0.4,
          boxShadow: "0 12px 28px rgba(13,95,138,0.32)",
          ...enter(ctaIn),
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ACCENT,
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          +
        </div>
        How do you feel today?
      </div>

      {/* ── "Patterns noticed" card ────────────────────────────── */}
      <div
        style={{
          backgroundColor: PATTERNS_BG,
          borderRadius: 22,
          padding: "20px 22px",
          ...enter(patternsIn),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchPlusIcon />
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: INK,
              letterSpacing: -0.4,
            }}
          >
            Patterns noticed
          </div>
        </div>
        <div
          style={{
            marginLeft: 36,
            marginTop: 4,
            fontSize: 16,
            color: MUTED,
          }}
        >
          Observations from your logs, not a diagnosis
        </div>

        {/* Pattern 1 */}
        <div
          style={{
            marginTop: 16,
            ...enter(patternsDetailsIn),
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: INK,
              letterSpacing: -0.2,
            }}
          >
            Repeated symptom
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 17,
              color: INK,
              lineHeight: 1.35,
            }}
          >
            Headache appears in 3 entries.
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 15,
              fontStyle: "italic",
              color: MUTED,
              lineHeight: 1.35,
            }}
          >
            Question for your doctor: should we review what may be related to
            these episodes?
          </div>
        </div>

        {/* Pattern 2 */}
        <div
          style={{
            marginTop: 14,
            ...enter(patternsDetailsIn),
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: INK,
              letterSpacing: -0.2,
            }}
          >
            Symptoms and missed medicines
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 17,
              color: INK,
              lineHeight: 1.35,
            }}
          >
            2 entries include a medicine marked as missed.
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 15,
              fontStyle: "italic",
              color: MUTED,
              lineHeight: 1.35,
            }}
          >
            Question for your doctor: should we review whether symptoms change
            when a medicine is missed?
          </div>
        </div>
      </div>

      {/* ── Entries header row ──────────────────────────────── */}
      <div
        style={{
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6px",
          ...enter(patternsIn),
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: MUTED }}>
          3 entries
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: RED,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.2,
            }}
          >
            <TrashIcon color={RED} />
            Clear all
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: ACCENT,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.2,
              transform: `scale(${exportScale})`,
            }}
          >
            <ShareIcon color={ACCENT} />
            Export
          </div>
        </div>
      </div>

      {/* ── Entries list ────────────────────────────────────── */}
      <div
        style={{
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          padding: "0 6px",
        }}
      >
        <EntryRow
          dot={RED}
          time={"May 7,\n3:08 PM"}
          name="Headache"
          missed
          delayFrames={0}
        />
        <EntryRow
          dot="#f5a623"
          time={"May 7,\n3:08 PM"}
          name="Headache"
          missed={false}
          delayFrames={6}
        />
        <EntryRow
          dot="#f5d423"
          time={"May 7,\n3:07 PM"}
          name="Headache"
          missed
          delayFrames={12}
        />
      </div>

      {/* ── Tab bar ─────────────────────────────────────────── */}
      <SymptomsTabBar active="home" />
    </div>
  );
};

// ── Sub components ───────────────────────────────────────────────────────

const enter = (s: number): React.CSSProperties => ({
  opacity: s,
  transform: `translateY(${(1 - s) * 14}px)`,
});

const EntryRow: React.FC<{
  dot: string;
  time: string;
  name: string;
  missed: boolean;
  delayFrames: number;
}> = ({ dot, time, name, missed, delayFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterIn = spring({
    frame: frame - (T.entriesStart + delayFrames),
    fps,
    config: { damping: 22, stiffness: 160 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        ...enter(enterIn),
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: dot,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: 90,
          fontSize: 15,
          color: MUTED,
          lineHeight: 1.25,
          whiteSpace: "pre-line",
          fontWeight: 500,
        }}
      >
        {time}
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 22,
          fontWeight: 800,
          color: INK,
          letterSpacing: -0.4,
        }}
      >
        {name}
      </div>
      {missed && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: RED,
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          <PillSmallIcon color={RED} />
          ×1
        </div>
      )}
    </div>
  );
};

const SearchPlusIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle
      cx="11"
      cy="11"
      r="6.5"
      stroke={INK}
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="16"
      y1="16"
      x2="20.5"
      y2="20.5"
      stroke={INK}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M11 8.5v5M8.5 11h5"
      stroke={INK}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const TrashIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 4v12M12 4l-4 4M12 4l4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PillSmallIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <g transform="rotate(-35 12 12)">
      <rect
        x="3"
        y="9"
        width="18"
        height="6"
        rx="3"
        fill={color}
      />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="15"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
    </g>
  </svg>
);
