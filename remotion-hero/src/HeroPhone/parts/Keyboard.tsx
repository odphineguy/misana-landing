import React from "react";

// iOS-style keyboard layout. The component is purely presentational —
// it renders the keys and highlights whichever key is "pressed" right now.

type KeyDef = { label: string; flex?: number; key?: string };

const ROW_1: KeyDef[] = "qwertyuiop".split("").map((c) => ({ label: c.toUpperCase(), key: c }));
const ROW_2: KeyDef[] = "asdfghjkl".split("").map((c) => ({ label: c.toUpperCase(), key: c }));
const ROW_3: KeyDef[] = [
  { label: "⇧", flex: 1.4 },
  ...["z", "x", "c", "v", "b", "n", "m"].map((c) => ({ label: c.toUpperCase(), key: c })),
  { label: "⌫", flex: 1.4 },
];
const ROW_4: KeyDef[] = [
  { label: "123", flex: 1.6 },
  { label: "🌐", flex: 0.9 },
  { label: "space", flex: 5.2, key: " " },
  { label: "return", flex: 2.0 },
];

// Visual constants
const KEY_HEIGHT = 38;
const KEY_RADIUS = 6;
const KEY_GAP = 5;
const KEY_BG = "#ffffff";
const KEY_SHADOW = "0 1px 0 rgba(0,0,0,0.15)";
const KEY_TEXT = "#0f2b3c";
const KB_BG = "#d2d6dc";

export const KEYBOARD_HEIGHT = 270;

export const Keyboard: React.FC<{ pressedKey: string | null }> = ({ pressedKey }) => {
  return (
    <div
      style={{
        width: "100%",
        height: KEYBOARD_HEIGHT,
        backgroundColor: KB_BG,
        padding: "10px 4px 24px",
        fontFamily:
          "-apple-system, system-ui, BlinkMacSystemFont, 'Outfit', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <KeyRow keys={ROW_1} pressed={pressedKey} />
      <KeyRow keys={ROW_2} pressed={pressedKey} indent={20} />
      <KeyRow keys={ROW_3} pressed={pressedKey} />
      <KeyRow keys={ROW_4} pressed={pressedKey} />
    </div>
  );
};

const KeyRow: React.FC<{ keys: KeyDef[]; pressed: string | null; indent?: number }> = ({
  keys,
  pressed,
  indent = 0,
}) => {
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
          k.label === "⇧" || k.label === "⌫" || k.label === "123" || k.label === "🌐" || k.label === "return";
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
              boxShadow: KEY_SHADOW,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isSpace ? 12 : isSpecial ? 13 : 16,
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
