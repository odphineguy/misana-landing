import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { T } from "../timing";

const ACCENT = "#1169a0";
const ACCENT_DARK = "#0d5f8a";
const INK = "#0f2b3c";
const MUTED = "#5a7186";
const LINE = "rgba(15,43,60,0.10)";

export const DoctorBriefSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide up animation — from below the screen to settled position
  const slide = spring({
    frame: frame - T.briefSlideUp,
    fps,
    config: { damping: 26, stiffness: 130 },
  });
  const translateY = interpolate(slide, [0, 1], [1140, 0]);

  // Backdrop fade
  const backdrop = interpolate(
    frame,
    [T.briefSlideUp, T.briefSlideUp + 16],
    [0, 0.32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Hide before slide starts
  if (frame < T.briefSlideUp - 2) return null;

  return (
    <>
      {/* Dim backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0a1722",
          opacity: backdrop,
          zIndex: 6,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          bottom: 0,
          transform: `translateY(${translateY}px)`,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: "0 -16px 40px rgba(15,43,60,0.18)",
          zIndex: 7,
          padding: "14px 22px 0",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Outfit, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Grab bar */}
        <div
          style={{
            width: 48,
            height: 5,
            borderRadius: 3,
            backgroundColor: "#cbd5dc",
            alignSelf: "center",
          }}
        />

        {/* Header */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(13,95,138,0.32)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4v3M9 5.5h6M6 10h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14h6M9 17h4"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: INK,
                letterSpacing: -0.4,
                lineHeight: 1.0,
              }}
            >
              Doctor Brief
            </div>
            <div
              style={{
                fontSize: 14,
                color: MUTED,
                marginTop: 4,
              }}
            >
              MiSana · Generated May 7, 2026
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 14,
              backgroundColor: "#e6f0f8",
              color: ACCENT,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 0.2,
            }}
          >
            PDF
          </div>
        </div>

        {/* Date range pill */}
        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            alignSelf: "flex-start",
            padding: "6px 14px",
            backgroundColor: "rgba(17,105,160,0.08)",
            borderRadius: 999,
            color: ACCENT,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          May 5 – May 7, 2026
        </div>

        {/* Section: Top symptoms */}
        <Section label="Top symptoms">
          <BriefRow label="Headache" detail="3 entries · severity 2–4" />
          <BriefRow label="Fatigue" detail="1 entry · noted alongside" />
        </Section>

        {/* Section: Patterns */}
        <Section label="Patterns">
          <Bullet>Headache repeats across 3 entries.</Bullet>
          <Bullet>2 entries logged with a missed medicine.</Bullet>
        </Section>

        {/* Section: Medications */}
        <Section label="Medications">
          <BriefRow label="Lisinopril 40mg" detail="1 dose taken · 2 missed" />
        </Section>

        {/* Section: Questions for your doctor */}
        <Section label="Questions for your doctor">
          <Bullet>What may be related to these recurring headaches?</Bullet>
          <Bullet>Do symptoms change when a dose is missed?</Bullet>
        </Section>
      </div>
    </>
  );
};

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div
    style={{
      marginTop: 16,
      paddingTop: 14,
      borderTop: `1px solid ${LINE}`,
    }}
  >
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: ACCENT,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
    </div>
  </div>
);

const BriefRow: React.FC<{ label: string; detail: string }> = ({
  label,
  detail,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 14,
    }}
  >
    <div
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: INK,
        letterSpacing: -0.2,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 15,
        color: MUTED,
        textAlign: "right",
      }}
    >
      {detail}
    </div>
  </div>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      fontSize: 16,
      color: INK,
      lineHeight: 1.4,
    }}
  >
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: ACCENT,
        marginTop: 8,
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);
