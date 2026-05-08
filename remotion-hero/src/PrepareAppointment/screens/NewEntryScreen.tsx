import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { T } from "../timing";
import { Keyboard, KEYBOARD_HEIGHT } from "../parts/Keyboard";

const ACCENT = "#1169a0";
const ACCENT_DARK = "#0d5f8a";
const INK = "#0f2b3c";
const MUTED = "#5a7186";
const CHIP_BORDER = "rgba(15,43,60,0.18)";
const CARD_BORDER = "rgba(15,43,60,0.08)";
const CARD = "#ffffff";
const PAGE_BG = "#f4f6f8";
const SCALE_BG = "#e9ecef";
const NOTES_TEXT = "Poor sleep last night — only ~4 hours.";

const SYMPTOMS: { name: string; icon: keyof typeof CHIP_ICONS | "none" }[] = [
  { name: "Headache", icon: "headache" },
  { name: "Dizziness", icon: "dizziness" },
  { name: "Fatigue", icon: "fatigue" },
  { name: "Nausea", icon: "none" },
  { name: "Body pain", icon: "body" },
  { name: "Chest pain", icon: "heart-line" },
  { name: "Cough", icon: "lips" },
  { name: "Sore throat", icon: "wave" },
  { name: "Fever", icon: "thermo" },
  { name: "Shortness of breath", icon: "lungs" },
  { name: "Stomach pain", icon: "none" },
  { name: "Back pain", icon: "back" },
  { name: "Insomnia", icon: "moon" },
  { name: "Anxiety", icon: "brain" },
  { name: "Heart palpitations", icon: "heart-fill" },
  { name: "Swelling", icon: "warn" },
];

const QUICK_TAGS = ["Sleep", "Stress", "Food", "Weather", "Position", "Work"];

export const NewEntryScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
  });

  // Scroll up animation — content translates up to reveal Notes
  const scrollProgress = interpolate(
    frame,
    [T.scrollStart, T.scrollEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scrollY = interpolate(scrollProgress, [0, 1], [0, -820]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: PAGE_BG,
        overflow: "hidden",
      }}
    >
      {/* Top header — sticks above the scrolling content */}
      <TopHeader headerIn={headerIn} />

      {/* Scrolling content */}
      <div
        style={{
          position: "absolute",
          top: 138,
          left: 0,
          right: 0,
          transform: `translateY(${scrollY}px)`,
          padding: "0 18px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <FeelCard headerIn={headerIn} />
        <SeverityCard />
        <MedsCard />
        <HealthDataCard />
        <NotesCard />
        <QuickTagsRow />
        <SaveButton />
      </div>

      {/* Keyboard: slides up from below once scroll completes */}
      <KeyboardLayer />
    </div>
  );
};

// ── Keyboard with slide-up + key-press sync ───────────────────────────────

const KeyboardLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide up between kbUpStart and kbUpEnd
  const slide = spring({
    frame: frame - T.kbUpStart,
    fps,
    config: { damping: 26, stiffness: 130 },
  });
  const translateY = interpolate(slide, [0, 1], [KEYBOARD_HEIGHT, 0]);

  if (frame < T.kbUpStart - 2) return null;

  // Sync pressed key with typewriter
  let pressedKey: string | null = null;
  if (frame >= T.notesTypeStart && frame <= T.notesTypeEnd + 4) {
    const fracChars =
      ((frame - T.notesTypeStart) /
        (T.notesTypeEnd - T.notesTypeStart)) *
      NOTES_TEXT.length;
    const idx = Math.floor(fracChars);
    const ch = NOTES_TEXT[idx];
    if (ch !== undefined) {
      pressedKey = ch === " " ? " " : ch.toLowerCase();
    }
  }

  // Suggestion bar: show last completed word in quotes (iOS predictive feel)
  const typedSoFar = NOTES_TEXT.slice(
    0,
    Math.max(
      0,
      Math.floor(
        interpolate(
          frame,
          [T.notesTypeStart, T.notesTypeEnd],
          [0, NOTES_TEXT.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      )
    )
  );
  const words = typedSoFar.trim().split(/\s+/);
  const lastWord =
    words.length > 1 && words[words.length - 1] !== ""
      ? words[words.length - 1]
      : words.length > 1
      ? words[words.length - 2]
      : null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: `translateY(${translateY}px)`,
        zIndex: 5,
      }}
    >
      <Keyboard pressedKey={pressedKey} suggestion={lastWord} />
    </div>
  );
};

// ── Top header (Cancel pill + New entry title) ────────────────────────────

const TopHeader: React.FC<{ headerIn: number }> = ({ headerIn }) => {
  return (
    <>
      {/* Backdrop strip: covers the area behind the header so scrolling
          content doesn't bleed through. Sits below the header chrome but
          above the scrolling form content. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 138,
          backgroundColor: PAGE_BG,
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
          opacity: headerIn,
          transform: `translateY(${(1 - headerIn) * 10}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 18,
            padding: "10px 20px",
            backgroundColor: "#ffffff",
            borderRadius: 22,
            fontSize: 22,
            fontWeight: 700,
            color: INK,
            boxShadow:
              "0 6px 16px rgba(15,43,60,0.10), 0 0 0 1px rgba(15,43,60,0.06)",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          Cancel
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: INK,
            letterSpacing: -0.6,
            fontFamily: "Outfit, sans-serif",
          }}
        >
          New entry
        </div>
      </div>
    </>
  );
};

// ── "What do you feel?" card ──────────────────────────────────────────────

const FeelCard: React.FC<{ headerIn: number }> = ({ headerIn }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headache select pop animation
  const isHeadacheSelected = frame >= T.headacheTap;
  const selectProgress = isHeadacheSelected
    ? spring({
        frame: frame - T.headacheTap,
        fps,
        config: { damping: 12, stiffness: 220 },
      })
    : 0;
  const selectScale = interpolate(selectProgress, [0, 0.5, 1], [1, 1.08, 1]);

  return (
    <Card>
      <SectionHeader
        icon={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect
              x="3.5"
              y="3.5"
              width="17"
              height="17"
              rx="3"
              fill={ACCENT}
            />
            <path
              d="M9 8h6M9 12h4"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1.2" fill="#ffffff" />
          </svg>
        }
        title="What do you feel?"
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 14,
        }}
      >
        {SYMPTOMS.map((s, i) => {
          const stagger = spring({
            frame: frame - (4 + i * 1.2),
            fps,
            config: { damping: 24, stiffness: 160 },
          });
          const isSelected = s.name === "Headache" && isHeadacheSelected;
          return (
            <SymptomChip
              key={s.name}
              name={s.name}
              icon={s.icon}
              selected={isSelected}
              scale={isSelected ? selectScale : 1}
              opacity={Math.min(1, stagger * Math.min(1, headerIn * 1.2))}
            />
          );
        })}
      </div>
    </Card>
  );
};

const SymptomChip: React.FC<{
  name: string;
  icon: string;
  selected: boolean;
  scale: number;
  opacity: number;
}> = ({ name, icon, selected, scale, opacity }) => {
  const bg = selected ? ACCENT : "#ffffff";
  const fg = selected ? "#ffffff" : INK;
  const border = selected ? ACCENT : CHIP_BORDER;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 999,
        backgroundColor: bg,
        border: `1.5px solid ${border}`,
        color: fg,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: -0.2,
        transform: `scale(${scale})`,
        opacity,
        boxShadow: selected
          ? "0 6px 18px rgba(17,105,160,0.32)"
          : "0 1px 0 rgba(15,43,60,0.04)",
        fontFamily: "Outfit, sans-serif",
        transition: "none",
      }}
    >
      {icon !== "none" && CHIP_ICONS[icon as keyof typeof CHIP_ICONS]?.(fg)}
      {name}
    </div>
  );
};

// ── Severity card ─────────────────────────────────────────────────────────

const SeverityCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labels = ["Mild", "Some", "Moderate", "Severe", "Very bad"];
  const isSelected = frame >= T.severityTap;
  const selectIndex = 2; // 3 Moderate (0-indexed)

  const pop = isSelected
    ? spring({
        frame: frame - T.severityTap,
        fps,
        config: { damping: 12, stiffness: 220 },
      })
    : 0;
  const scale = interpolate(pop, [0, 0.5, 1], [1, 1.16, 1]);

  return (
    <Card>
      <SectionHeader
        icon={<GaugeIcon />}
        title="How severe?"
      />
      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "0 6px",
        }}
      >
        {[1, 2, 3, 4, 5].map((n, i) => {
          const active = isSelected && i === selectIndex;
          return (
            <div
              key={n}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: active ? ACCENT : SCALE_BG,
                  color: active ? "#ffffff" : INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  transform: active ? `scale(${scale})` : undefined,
                  boxShadow: active
                    ? "0 6px 18px rgba(17,105,160,0.30)"
                    : "none",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: active ? ACCENT : "#94a3b8",
                  letterSpacing: -0.2,
                }}
              >
                {labels[i]}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ── Meds card ─────────────────────────────────────────────────────────────

const MedsCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isChecked = frame >= T.medsTap;
  const fillProgress = isChecked
    ? spring({
        frame: frame - T.medsTap,
        fps,
        config: { damping: 14, stiffness: 200 },
      })
    : 0;

  return (
    <Card>
      <SectionHeader icon={<PillIcon />} title="Did you take your meds today?" />
      <div
        style={{
          marginTop: 14,
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: INK,
              letterSpacing: -0.4,
              lineHeight: 1.05,
            }}
          >
            Lisinopril
          </div>
          <div
            style={{
              fontSize: 16,
              color: MUTED,
              marginTop: 4,
            }}
          >
            40mg
          </div>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            border: `2px solid ${isChecked ? ACCENT : "#cbd5dc"}`,
            backgroundColor: isChecked
              ? `rgba(17,105,160,${fillProgress})`
              : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isChecked && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="22"
                strokeDashoffset={22 - 22 * fillProgress}
              />
            </svg>
          )}
        </div>
      </div>
    </Card>
  );
};

// ── Health data automatic card ────────────────────────────────────────────

const HealthDataCard: React.FC = () => {
  return (
    <div
      style={{
        alignSelf: "center",
        backgroundColor: "#ffe4dc",
        borderRadius: 18,
        padding: "16px 22px",
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginTop: 6,
        boxShadow: "0 6px 16px rgba(231,123,93,0.14)",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          backgroundColor: "#e75c3c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="4.5"
            y="4.5"
            width="15"
            height="15"
            rx="2.5"
            fill="#ffffff"
          />
          <path
            d="M9.5 9.5h5M9.5 12.5h3.5"
            stroke="#e75c3c"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M11 16.5c0-.6.4-1 1-1s1 .4 1 1c0 .8-1 1.4-1 1.4s-1-.6-1-1.4Z"
            fill="#e75c3c"
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
          }}
        >
          Health data (automatic)
        </div>
        <div
          style={{
            fontSize: 18,
            color: MUTED,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18 }}>🚶</span>
          132
        </div>
      </div>
    </div>
  );
};

// ── Notes card (label + textarea) ─────────────────────────────────────────

const NotesCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Type out the message char-by-char between notesTypeStart and notesTypeEnd
  const typedChars = Math.max(
    0,
    Math.floor(
      interpolate(
        frame,
        [T.notesTypeStart, T.notesTypeEnd],
        [0, NOTES_TEXT.length],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    )
  );
  const typedText = NOTES_TEXT.slice(0, typedChars);
  const showPlaceholder = typedChars === 0;

  // Caret blink
  const showCaret =
    frame >= T.notesTypeStart - 6 &&
    frame < T.notesTypeEnd + 18 &&
    Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NotesIcon />
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: INK,
            letterSpacing: -0.4,
          }}
        >
          Notes (optional)
        </div>
      </div>
      <div style={{ fontSize: 16, color: MUTED, marginLeft: 38 }}>
        Context that helps spot patterns over time
      </div>
      <div
        style={{
          marginTop: 6,
          backgroundColor: "#ffffff",
          border: `1.5px solid ${CARD_BORDER}`,
          borderRadius: 16,
          padding: "16px 18px",
          minHeight: 120,
          fontSize: 18,
          lineHeight: 1.4,
          color: showPlaceholder ? "#9aa9b6" : INK,
          fontWeight: 500,
          fontFamily: "Outfit, sans-serif",
          whiteSpace: "pre-wrap",
        }}
      >
        {showPlaceholder
          ? "e.g., poor sleep, stress, food, weather, position when it started"
          : typedText}
        {showCaret && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 22,
              backgroundColor: ACCENT,
              marginLeft: 2,
              verticalAlign: "middle",
            }}
          />
        )}
      </div>
    </div>
  );
};

// ── Quick-add tag chips ───────────────────────────────────────────────────

const QuickTagsRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sleepActive = frame >= T.sleepTap;
  const sleepPop = sleepActive
    ? spring({
        frame: frame - T.sleepTap,
        fps,
        config: { damping: 12, stiffness: 220 },
      })
    : 0;
  const sleepScale = interpolate(sleepPop, [0, 0.5, 1], [1, 1.18, 1]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
      {QUICK_TAGS.map((tag) => {
        const isSleep = tag === "Sleep";
        const active = isSleep && sleepActive;
        return (
          <div
            key={tag}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              backgroundColor: active ? ACCENT : "#e6f0f8",
              color: active ? "#ffffff" : ACCENT,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: -0.2,
              fontFamily: "Outfit, sans-serif",
              transform: active ? `scale(${sleepScale})` : undefined,
              boxShadow: active
                ? "0 6px 16px rgba(17,105,160,0.28)"
                : "none",
            }}
          >
            + {tag}
          </div>
        );
      })}
    </div>
  );
};

// ── Save entry button ─────────────────────────────────────────────────────

const SaveButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enabled = frame >= T.saveButtonEnable;
  const enableProgress = enabled
    ? spring({
        frame: frame - T.saveButtonEnable,
        fps,
        config: { damping: 22, stiffness: 160 },
      })
    : 0;

  const tap = frame >= T.saveTap
    ? spring({
        frame: frame - T.saveTap,
        fps,
        config: { damping: 8, stiffness: 200 },
      })
    : 0;
  const tapScale = interpolate(tap, [0, 0.5, 1], [1, 0.96, 1]);

  // Color blends from gray → blue
  const bgGray = "#cbd5dc";
  const r = interpolate(enableProgress, [0, 1], [0xcb, 0x11]);
  const g = interpolate(enableProgress, [0, 1], [0xd5, 0x69]);
  const b = interpolate(enableProgress, [0, 1], [0xdc, 0xa0]);
  const bg = enabled
    ? `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
    : bgGray;

  return (
    <div
      style={{
        marginTop: 8,
        marginBottom: 24,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${tapScale})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 64,
          borderRadius: 32,
          background: bg,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -0.4,
          fontFamily: "Outfit, sans-serif",
          boxShadow: enabled
            ? "0 12px 28px rgba(13,95,138,0.32)"
            : "none",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <path
            d="M7.5 12.5l3 3 6-6"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Save entry
      </div>
    </div>
  );
};

// ── Shared card / section header ──────────────────────────────────────────

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      backgroundColor: CARD,
      border: `1px solid ${CARD_BORDER}`,
      borderRadius: 22,
      padding: "20px 22px",
      boxShadow: "0 4px 16px rgba(15,43,60,0.04)",
    }}
  >
    {children}
  </div>
);

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
}> = ({ icon, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    {icon}
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: INK,
        letterSpacing: -0.4,
      }}
    >
      {title}
    </div>
  </div>
);

// ── Icons ─────────────────────────────────────────────────────────────────

const GaugeIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={ACCENT}
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M8 14a4 4 0 0 1 8 0"
      stroke={ACCENT}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 12l3-3"
      stroke={ACCENT}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PillIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect
      x="2.8"
      y="9"
      width="18.4"
      height="6"
      rx="3"
      transform="rotate(-35 12 12)"
      fill={ACCENT}
    />
    <line
      x1="9"
      y1="6"
      x2="15"
      y2="18"
      stroke="#ffffff"
      strokeWidth="2"
      transform="rotate(-35 12 12)"
    />
  </svg>
);

const NotesIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="3"
      fill={ACCENT}
    />
    <path
      d="M8 9h8M8 12h8M8 15h5"
      stroke="#ffffff"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

// Inline glyphs for the symptom chips. All take the desired color and
// render at ~16px. Some symptoms intentionally render no icon.
const CHIP_ICONS = {
  headache: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12a7 7 0 0 1 14 0v4a3 3 0 0 1-3 3h-1v-3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11s1-1.4 2-1.4S12 11 12 11s.5-1 1.5-1 1.5 1 1.5 1"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  dizziness: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="2" stroke={color} strokeWidth="1.6" />
      <path
        d="M9 13l2-3 2 3-4 7M13 10l3 1M11 16l3 1"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  fatigue: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="8"
        width="14"
        height="8"
        rx="1.5"
        stroke={color}
        strokeWidth="1.6"
      />
      <rect x="17" y="10" width="2.5" height="4" rx="0.5" fill={color} />
      <rect x="5" y="10" width="3" height="4" rx="0.5" fill={color} />
    </svg>
  ),
  body: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5.5" r="2" stroke={color} strokeWidth="1.6" />
      <path
        d="M12 8v6M9 11h6M10 14l-1 6M14 14l1 6"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  "heart-line": (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 19s-7-4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 9c0 6-7 10-7 10Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line
        x1="3"
        y1="20"
        x2="21"
        y2="4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  lips: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 14c0-2 3-3 7-3s7 1 7 3c0 2-3 4-7 4s-7-2-7-4Z"
        stroke={color}
        strokeWidth="1.6"
      />
      <path d="M5 14c1-2 4-3 7-3s6 1 7 3" stroke={color} strokeWidth="1.4" />
    </svg>
  ),
  wave: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h2l1-4 2 8 2-12 2 14 2-9 2 5 2-3h3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  thermo: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 4a2 2 0 0 0-4 0v10.5a4 4 0 1 0 4 0V4Z"
        stroke={color}
        strokeWidth="1.6"
      />
      <line x1="14.5" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.4" />
      <line x1="14.5" y1="10" x2="16" y2="10" stroke={color} strokeWidth="1.4" />
      <circle cx="12" cy="17" r="1.6" fill={color} />
    </svg>
  ),
  lungs: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v8M9 8c0 4-3 6-3 9 0 1 1 2 2 2s3-1 3-3V8c0-1-1-2-1-2s-1 0-1 2ZM15 8c0 4 3 6 3 9 0 1-1 2-2 2s-3-1-3-3V8c0-1 1-2 1-2s1 0 1 2Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  back: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="13" cy="5" r="2" stroke={color} strokeWidth="1.6" />
      <path
        d="M13 7v4l-3 2 1 4 3-2 2 5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9c2 0 3 1 3 2"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  moon: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 14a8 8 0 1 1-9-11 6 6 0 0 0 9 11Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M5 5l1.5 1.5M5 5L3.5 6.5M5 5V3"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  brain: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 5a3 3 0 0 0-3 3 2.5 2.5 0 0 0-1 4 2.5 2.5 0 0 0 1 4 2.5 2.5 0 0 0 3 2.5 3 3 0 0 0 6 0 2.5 2.5 0 0 0 3-2.5 2.5 2.5 0 0 0 1-4 2.5 2.5 0 0 0-1-4 3 3 0 0 0-3-3 3 3 0 0 0-3 1 3 3 0 0 0-3-1Z"
        stroke={color}
        strokeWidth="1.4"
      />
      <path
        d="M12 5v14"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  "heart-fill": (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M12 19s-7-4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 9c0 6-7 10-7 10Z" />
    </svg>
  ),
  warn: (color: string) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4l9 16H3l9-16Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="10"
        x2="12"
        y2="14"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill={color} />
    </svg>
  ),
};
