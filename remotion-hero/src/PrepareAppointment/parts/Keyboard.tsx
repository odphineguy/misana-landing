import React from "react";

// iOS-style keyboard for the New Entry scene. Renders suggestion strip,
// 4 key rows, and a bottom emoji/mic row. ~420px tall — proportional to
// a real iPhone keyboard relative to the 540×1140 comp.

type KeyDef = { label: string; flex?: number; key?: string };

const ROW_1: KeyDef[] = "qwertyuiop"
  .split("")
  .map((c) => ({ label: c, key: c }));
const ROW_2: KeyDef[] = "asdfghjkl"
  .split("")
  .map((c) => ({ label: c, key: c }));
const ROW_3: KeyDef[] = [
  { label: "⇧", flex: 1.4 },
  ...["z", "x", "c", "v", "b", "n", "m"].map((c) => ({
    label: c,
    key: c,
  })),
  { label: "⌫", flex: 1.4 },
];
const ROW_4: KeyDef[] = [
  { label: "123", flex: 1.6 },
  { label: "space", flex: 5.8, key: " " },
  { label: "return", flex: 2.0 },
];

const KEY_HEIGHT = 50;
const KEY_RADIUS = 7;
const KEY_GAP = 6;
const KEY_BG = "#ffffff";
const KEY_TEXT = "#0f2b3c";
const KB_BG = "#d2d6dc";
const KB_TEXT = "#0f2b3c";

export const KEYBOARD_HEIGHT = 420;

export const Keyboard: React.FC<{
  pressedKey: string | null;
  suggestion: string | null;
}> = ({ pressedKey, suggestion }) => {
  return (
    <div
      style={{
        width: "100%",
        height: KEYBOARD_HEIGHT,
        backgroundColor: KB_BG,
        padding: "8px 6px 14px",
        fontFamily:
          "-apple-system, system-ui, BlinkMacSystemFont, 'Outfit', sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SuggestionBar suggestion={suggestion} />
      <KeyRow keys={ROW_1} pressed={pressedKey} />
      <KeyRow keys={ROW_2} pressed={pressedKey} indent={26} />
      <KeyRow keys={ROW_3} pressed={pressedKey} />
      <KeyRow keys={ROW_4} pressed={pressedKey} />
      <BottomRow />
    </div>
  );
};

const SuggestionBar: React.FC<{ suggestion: string | null }> = ({
  suggestion,
}) => {
  return (
    <div
      style={{
        height: 48,
        display: "grid",
        gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
        alignItems: "center",
        padding: "0 14px",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          color: KB_TEXT,
          fontSize: 22,
          fontWeight: 500,
          textAlign: "left",
          opacity: suggestion ? 1 : 0.55,
        }}
      >
        {suggestion ? `"${suggestion}"` : ""}
      </div>
      <div style={{ width: 1, height: 22, backgroundColor: "#9aa1a8" }} />
      <div />
      <div style={{ width: 1, height: 22, backgroundColor: "#9aa1a8" }} />
      <div />
    </div>
  );
};

const KeyRow: React.FC<{
  keys: KeyDef[];
  pressed: string | null;
  indent?: number;
}> = ({ keys, pressed, indent = 0 }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: KEY_GAP,
        marginBottom: KEY_GAP,
        padding: `0 ${4 + indent / 2}px`,
      }}
    >
      {keys.map((k, i) => {
        const isPressed = k.key !== undefined && pressed === k.key;
        const isSpace = k.label === "space";
        const isSpecial =
          k.label === "⇧" ||
          k.label === "⌫" ||
          k.label === "123" ||
          k.label === "return";
        return (
          <div
            key={i}
            style={{
              flex: k.flex ?? 1,
              height: KEY_HEIGHT,
              borderRadius: KEY_RADIUS,
              backgroundColor: isPressed
                ? "#b8c0c8"
                : isSpecial
                ? "#aab1b9"
                : KEY_BG,
              boxShadow: "0 1px 0 rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isSpace ? 14 : isSpecial ? 16 : 22,
              fontWeight: 500,
              color: KEY_TEXT,
              transform: isPressed ? "scale(0.94)" : "scale(1)",
              transition: "none",
            }}
          >
            {k.label}
          </div>
        );
      })}
    </div>
  );
};

const BottomRow: React.FC = () => {
  return (
    <div
      style={{
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        marginTop: 4,
      }}
    >
      {/* Emoji */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={KB_TEXT}
          strokeWidth="2"
        />
        <circle cx="9" cy="10.5" r="1" fill={KB_TEXT} />
        <circle cx="15" cy="10.5" r="1" fill={KB_TEXT} />
        <path
          d="M8 14.5c1 1.5 2.5 2.2 4 2.2s3-.7 4-2.2"
          stroke={KB_TEXT}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {/* Mic */}
      <svg width="22" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="9"
          y="3"
          width="6"
          height="11"
          rx="3"
          stroke={KB_TEXT}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M5 11a7 7 0 0 0 14 0M12 18v3"
          stroke={KB_TEXT}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
