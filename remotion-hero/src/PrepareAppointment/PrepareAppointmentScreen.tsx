import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TabBar } from "../HeroPhone/parts/TabBar";
import { T } from "./timing";

const ACCENT = "#1169a0";
const ACCENT_DARK = "#0d5f8a";
const INK = "#0f2b3c";
const MUTED = "#5a7186";
const CARD = "#ffffff";
const CARD_BORDER = "rgba(15,43,60,0.06)";
const PANEL = "#eef4fa";
const TIP_BG = "#fff5d6";
const TIP_BORDER = "#f5e2a0";

const QUESTIONS = [
  "What is your diagnosis?",
  "What treatment options do I have?",
  "How long will the treatment last?",
  "Do I need any procedures or surgery?",
  "What are the risks of this treatment?",
  "Will my primary doctor receive a report?",
];

// Frames at which each question gets ticked. The first two map to the
// screenshot the user shared (1/6 → 2/6); the remaining ticks add a bit
// of payoff before the loop ends.
const CHECK_FRAMES = [T.check1, T.check2, T.check3, T.check4];

export const PrepareAppointmentScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header / tip card entrance
  const headerIn = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
  });
  const tipIn = spring({
    frame: frame - 6,
    fps,
    config: { damping: 22, stiffness: 140 },
  });

  // Counter — number of questions ticked at the current frame
  const checkedCount = CHECK_FRAMES.filter((f) => frame >= f).length;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#f6f9fc",
        backgroundImage:
          "radial-gradient(circle at 20% 0%, rgba(26,139,199,0.08), transparent 45%), radial-gradient(circle at 90% 90%, rgba(13,95,138,0.05), transparent 40%)",
        padding: "62px 26px 130px",
        fontFamily: "Outfit, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top "..." menu ─────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          ...enterStyle(headerIn),
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: INK,
            fontSize: 26,
            fontWeight: 800,
            boxShadow: "0 4px 14px rgba(15,43,60,0.10)",
          }}
        >
          ⋯
        </div>
      </div>

      {/* ── Heading ──────────────────────────── */}
      <div
        style={{
          marginTop: 8,
          fontSize: 46,
          fontWeight: 800,
          color: INK,
          letterSpacing: -1.8,
          lineHeight: 1.0,
          ...enterStyle(headerIn),
        }}
      >
        Prepare
        <br />
        Appointment
      </div>

      {/* ── Visit type row ───────────────────── */}
      <div
        style={{
          marginTop: 22,
          display: "flex",
          alignItems: "center",
          gap: 14,
          ...enterStyle(headerIn),
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ACCENT,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 4v6a4 4 0 0 0 8 0V4M10 19a3 3 0 0 0 3-3v-3"
              stroke={ACCENT}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="17" cy="9.5" r="2" stroke={ACCENT} strokeWidth="2" />
          </svg>
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
          General checkup
        </div>
        <ProgressBadge count={checkedCount} total={QUESTIONS.length} />
      </div>

      {/* ── Tip card ─────────────────────────── */}
      <div
        style={{
          marginTop: 18,
          backgroundColor: TIP_BG,
          border: `1px solid ${TIP_BORDER}`,
          borderRadius: 22,
          padding: "18px 20px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          ...enterStyle(tipIn),
        }}
      >
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1 1.2 1.6l.3 1.5h4l.3-1.5c.2-.6.6-1.1 1.2-1.6A6 6 0 0 0 12 3Z"
              fill="#f5b600"
              stroke="#c48e00"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            color: "#5b4a14",
            fontSize: 18,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          Bring this list to your visit. Check off each question as you ask it.
        </div>
      </div>

      {/* ── Question rows ────────────────────── */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        {QUESTIONS.map((q, i) => (
          <QuestionRow
            key={i}
            text={q}
            index={i}
            checkedAt={CHECK_FRAMES[i] ?? null}
          />
        ))}
      </div>

      {/* ── CTA button ───────────────────────── */}
      <CtaButton />

      <TabBar active="appts" />
    </div>
  );
};

// ── Sub components ─────────────────────────────────────────────────────────

const enterStyle = (s: number): React.CSSProperties => ({
  opacity: s,
  transform: `translateY(${(1 - s) * 14}px)`,
});

const ProgressBadge: React.FC<{ count: number; total: number }> = ({
  count,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pop animation each time the count changes
  const pulseStarts = CHECK_FRAMES.slice(0, count);
  const lastPulseStart = pulseStarts[pulseStarts.length - 1] ?? -100;
  const pulse = spring({
    frame: frame - lastPulseStart,
    fps,
    config: { damping: 10, stiffness: 220 },
  });
  const scale = interpolate(pulse, [0, 0.5, 1], [1, 1.18, 1]);

  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        backgroundColor: PANEL,
        color: ACCENT,
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: -0.3,
        transform: `scale(${scale})`,
      }}
    >
      {count}/{total}
    </div>
  );
};

const QuestionRow: React.FC<{
  text: string;
  index: number;
  checkedAt: number | null;
}> = ({ text, index, checkedAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger entrance
  const enter = spring({
    frame: frame - (10 + index * 4),
    fps,
    config: { damping: 22, stiffness: 140 },
  });

  // Check animation
  const isChecking = checkedAt !== null && frame >= checkedAt;
  const checkProgress = isChecking
    ? spring({
        frame: frame - checkedAt!,
        fps,
        config: { damping: 16, stiffness: 180 },
      })
    : 0;

  // Strikethrough fills left to right over ~10 frames
  const strikethroughWidth = isChecking
    ? interpolate(frame - checkedAt!, [0, 10], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const textColor = interpolate(checkProgress, [0, 1], [0, 1]);
  const grey = `rgba(122, 136, 150, ${textColor})`;
  const dark = `rgba(15, 43, 60, ${1 - textColor})`;

  return (
    <div
      style={{
        backgroundColor: CARD,
        borderRadius: 18,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 4px 14px rgba(15,43,60,0.05)",
        border: `1px solid ${CARD_BORDER}`,
        ...enterStyle(enter),
      }}
    >
      <Checkbox checked={isChecking} progress={checkProgress} />
      <div
        style={{
          flex: 1,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: -0.2,
          lineHeight: 1.25,
          // Cross-fade the colour from ink → muted as the check fills.
          color: isChecking
            ? `rgb(${122 * textColor + 15 * (1 - textColor)}, ${
                136 * textColor + 43 * (1 - textColor)
              }, ${150 * textColor + 60 * (1 - textColor)})`
            : INK,
        }}
      >
        {/* inline-block wrapper so the strikethrough overlay only spans the
            actual text width, not the full row. */}
        <span style={{ position: "relative", display: "inline-block" }}>
          {text}
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              height: 2,
              width: `${strikethroughWidth}%`,
              backgroundColor: "#7a8896",
              borderRadius: 1,
            }}
          />
        </span>
      </div>
    </div>
  );
};

const Checkbox: React.FC<{ checked: boolean; progress: number }> = ({
  checked,
  progress,
}) => {
  const fill = checked ? interpolate(progress, [0, 1], [0, 1]) : 0;
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        border: `2px solid ${checked ? ACCENT : "#9aa9b6"}`,
        backgroundColor: checked
          ? `rgba(17,105,160,${fill})`
          : "transparent",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {checked && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="22"
            strokeDashoffset={22 - 22 * fill}
          />
        </svg>
      )}
    </div>
  );
};

const CtaButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 36,
    fps,
    config: { damping: 22, stiffness: 140 },
  });

  // Pulse around T.buttonPulseStart
  const pulse = spring({
    frame: frame - T.buttonPulseStart,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const scale = interpolate(
    Math.max(0, Math.min(1, pulse)),
    [0, 0.5, 1],
    [1, 1.04, 1]
  );

  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 18,
        ...enterStyle(enter),
      }}
    >
      <div
        style={{
          height: 64,
          borderRadius: 32,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -0.4,
          boxShadow: "0 12px 28px rgba(13,95,138,0.32)",
          transform: `scale(${scale})`,
        }}
      >
        <BrainIcon />
        Prepare with MiSana
      </div>
    </div>
  );
};

const BrainIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 4a3 3 0 0 0-3 3v0a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1 4 2.5 2.5 0 0 0 3 3 3 3 0 0 0 6 0 2.5 2.5 0 0 0 3-3 2.5 2.5 0 0 0 1-4 2.5 2.5 0 0 0-2-4v0a3 3 0 0 0-3-3 3 3 0 0 0-2 1 3 3 0 0 0-2-1Z"
      fill="#ffffff"
      fillOpacity="0.2"
      stroke="#ffffff"
      strokeWidth="1.6"
    />
    <path
      d="M12 5v14M9 9h.01M15 9h.01M9 14h.01M15 14h.01"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
