import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TabBar } from "../parts/TabBar";
import { Keyboard, KEYBOARD_HEIGHT } from "../parts/Keyboard";
import { T } from "../timing";

const ACCENT = "#1169a0";
const ACCENT_DARK = "#0d5f8a";
const INK = "#0f2b3c";
const MUTED = "#5a7186";
const PANEL = "#ecf4fb";

const USER_MESSAGE = "Headache and fatigue, what should I do?";
const AI_MESSAGE =
  "Drink water, rest in a quiet room, and avoid screens. If pain persists, see a doctor.";

export const ChatScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Typing logic for the user message ────────────────────────────────
  const typingProgress = interpolate(
    frame,
    [T.typingStart, T.typingEnd],
    [0, USER_MESSAGE.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const typedChars = Math.floor(typingProgress);
  const visibleUserText = USER_MESSAGE.slice(0, typedChars);

  // Which key is currently being "pressed"? Each character gets a tiny
  // tap window of N frames at the start of its slot.
  const charSlotFrames =
    (T.typingEnd - T.typingStart) / USER_MESSAGE.length;
  const charIndex = typedChars - 1;
  const charLocalFrame =
    frame - T.typingStart - charIndex * charSlotFrames;
  const justPressed =
    frame >= T.typingStart &&
    frame < T.typingEnd &&
    charIndex >= 0 &&
    charLocalFrame >= 0 &&
    charLocalFrame < charSlotFrames * 0.55;

  let pressedKey: string | null = null;
  if (justPressed) {
    const c = USER_MESSAGE[charIndex];
    if (c) {
      const lower = c.toLowerCase();
      if (/[a-z ]/.test(lower)) pressedKey = lower;
    }
  }

  // ── Keyboard slide-up ────────────────────────────────────────────────
  const kbSpring = spring({
    frame: frame - T.chatRestEnd,
    fps,
    config: { damping: 22, stiffness: 130 },
  });
  const kbTranslate = interpolate(kbSpring, [0, 1], [KEYBOARD_HEIGHT + 60, 0]);

  // ── Send tap pulse ───────────────────────────────────────────────────
  const sendPulse = interpolate(
    frame,
    [T.sendTapStart, T.sendTapStart + 4, T.sendTapEnd],
    [1, 0.86, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── User bubble drop-in ──────────────────────────────────────────────
  const userBubbleIn = spring({
    frame: frame - T.sendTapEnd,
    fps,
    config: { damping: 18, stiffness: 140 },
  });
  const userBubbleOpacity = interpolate(userBubbleIn, [0, 1], [0, 1]);
  const userBubbleY = interpolate(userBubbleIn, [0, 1], [12, 0]);

  // ── AI thinking dots & typing ────────────────────────────────────────
  const aiTypingProgress = interpolate(
    frame,
    [T.aiTypingStart, T.aiTypingEnd],
    [0, AI_MESSAGE.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const aiVisible = AI_MESSAGE.slice(0, Math.floor(aiTypingProgress));

  const aiBubbleIn = spring({
    frame: frame - T.aiDotsStart,
    fps,
    config: { damping: 18, stiffness: 140 },
  });
  const aiBubbleOpacity = interpolate(aiBubbleIn, [0, 1], [0, 1]);
  const aiBubbleY = interpolate(aiBubbleIn, [0, 1], [10, 0]);

  // Whether to show input bar's send button as "active" (after typing starts)
  const inputHasText = visibleUserText.length > 0 && frame < T.sendTapEnd;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* ── Header ───────────────────────────── */}
      <div style={{ padding: "62px 26px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#eef4fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ACCENT,
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(15,43,60,0.06)",
            }}
          >
            +
          </div>
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 42,
            fontWeight: 800,
            color: INK,
            letterSpacing: -1.6,
          }}
        >
          Ask MiSana
        </div>
      </div>

      {/* ── Chat area (scrollable feel) ──────── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "14px 22px 0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Educational disclaimer */}
        <div
          style={{
            backgroundColor: PANEL,
            borderRadius: 22,
            padding: "16px 20px",
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: ACCENT,
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            i
          </div>
          <div style={{ color: MUTED, fontSize: 17, lineHeight: 1.4, fontWeight: 500 }}>
            Educational info from MedlinePlus (NIH). Not a substitute for your doctor.
          </div>
        </div>

        {/* AI welcome bubble */}
        <BotBubble>Hi! How can I help with your health today?</BotBubble>

        {/* User message bubble (after send) */}
        {frame >= T.sendTapEnd && (
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "92%",
              opacity: userBubbleOpacity,
              transform: `translateY(${userBubbleY}px)`,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1580b8, #0d5f8a)",
                color: "#ffffff",
                padding: "20px 26px",
                borderRadius: 32,
                borderBottomRightRadius: 12,
                fontSize: 26,
                lineHeight: 1.32,
                fontWeight: 600,
                boxShadow: "0 8px 22px rgba(13,95,138,0.32)",
              }}
            >
              {USER_MESSAGE}
            </div>
          </div>
        )}

        {/* AI thinking dots / response */}
        {frame >= T.aiDotsStart && (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "94%",
              opacity: aiBubbleOpacity,
              transform: `translateY(${aiBubbleY}px)`,
            }}
          >
            <div
              style={{
                backgroundColor: "#f0f4f8",
                color: INK,
                padding: "20px 26px",
                borderRadius: 32,
                borderBottomLeftRadius: 12,
                fontSize: 26,
                lineHeight: 1.36,
                fontWeight: 600,
                minHeight: 36,
                boxShadow: "0 6px 18px rgba(15,43,60,0.08)",
              }}
            >
              {frame < T.aiTypingStart ? (
                <ThinkingDots />
              ) : (
                <>
                  {aiVisible}
                  {aiVisible.length < AI_MESSAGE.length && <Caret />}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Input bar (sits above keyboard or above tab bar) ── */}
      {/* The bar lifts in lock-step with the keyboard. Once the message
          has been sent the field clears so it reads as a real interaction. */}
      <InputBar
        text={frame >= T.sendTapEnd ? "" : visibleUserText}
        showCaret={frame >= T.keyboardUpEnd && frame < T.sendTapStart}
        sendActive={inputHasText}
        sendPulse={sendPulse}
        keyboardOffset={kbTranslate}
      />

      {/* ── Tab bar ──────────────────────────── */}
      {/* Hide the floating tab bar while the keyboard is up so the input
          can sit flush against the keyboard. */}
      {frame < T.chatRestEnd && <TabBar active="ask" />}

      {/* ── Keyboard ─────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateY(${kbTranslate}px)`,
        }}
      >
        <Keyboard pressedKey={pressedKey} />
      </div>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

const BotBubble: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ alignSelf: "flex-start", maxWidth: "94%" }}>
    <div
      style={{
        fontSize: 16,
        color: ACCENT,
        fontWeight: 800,
        letterSpacing: 0.8,
        marginBottom: 6,
        marginLeft: 6,
      }}
    >
      MISANA
    </div>
    <div
      style={{
        backgroundColor: "#f0f4f8",
        color: INK,
        padding: "20px 26px",
        borderRadius: 32,
        borderBottomLeftRadius: 12,
        fontSize: 24,
        lineHeight: 1.36,
        fontWeight: 600,
        boxShadow: "0 6px 18px rgba(15,43,60,0.08)",
      }}
    >
      {children}
    </div>
  </div>
);

const ThinkingDots: React.FC = () => {
  const frame = useCurrentFrame();
  const dot = (offset: number) => {
    const t = ((frame + offset) % 18) / 18;
    const opacity = 0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI));
    return (
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: "#5a7186",
          marginRight: 6,
          opacity,
        }}
      />
    );
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {dot(0)}
      {dot(6)}
      {dot(12)}
    </span>
  );
};

const Caret: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: 24,
        backgroundColor: INK,
        verticalAlign: "middle",
        marginLeft: 2,
        opacity: visible ? 1 : 0,
      }}
    />
  );
};

const InputBar: React.FC<{
  text: string;
  showCaret: boolean;
  sendActive: boolean;
  sendPulse: number;
  // How many pixels the keyboard has yet to slide up. 0 = fully up.
  keyboardOffset: number;
}> = ({ text, showCaret, sendActive, sendPulse, keyboardOffset }) => {
  // Sit just above the keyboard. When the keyboard is offscreen
  // (keyboardOffset === KEYBOARD_HEIGHT + 60) the bar rests just above
  // the floating tab bar.
  const restingBottom = 110;
  const keyboardBottom = KEYBOARD_HEIGHT - 4;
  const kbProgress = Math.max(
    0,
    Math.min(1, 1 - keyboardOffset / (KEYBOARD_HEIGHT + 60))
  );
  const bottom =
    restingBottom + (keyboardBottom - restingBottom) * kbProgress;

  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom,
        backgroundColor: "#ffffff",
        borderRadius: 36,
        padding: "10px 10px 10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 26px rgba(15,43,60,0.12), 0 0 0 1px rgba(15,43,60,0.05)",
        zIndex: 4,
      }}
    >
      <div
        style={{
          flex: 1,
          fontSize: 22,
          color: text ? INK : "#9aa9b6",
          fontWeight: 500,
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          fontFamily: "Outfit, sans-serif",
        }}
      >
        {text || "Type your health question…"}
        {showCaret && <Caret />}
      </div>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: sendActive
            ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`
            : "#dbe3eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: sendActive ? "#ffffff" : "#8a98a6",
          transform: `scale(${sendPulse})`,
          boxShadow: sendActive
            ? "0 8px 20px rgba(13,95,138,0.32)"
            : "none",
          flexShrink: 0,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 19V5M5 12l7-7 7 7"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
