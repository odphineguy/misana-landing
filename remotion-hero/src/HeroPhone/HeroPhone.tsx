import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { PhoneFrame } from "./PhoneFrame";
import { SplashScreen } from "./screens/SplashScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { FPS, T, TOTAL_FRAMES } from "./timing";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export const HERO_PHONE_DURATION = TOTAL_FRAMES;
export const HERO_PHONE_FPS = FPS;

export type HeroPhoneProps = {
  // When false the corners outside the phone bezel are filled white
  // (used for the MP4 fallback). When true those corners stay transparent
  // so the WebM/VP9-alpha render is composited cleanly.
  transparentBackground: boolean;
};

export const HeroPhone: React.FC<HeroPhoneProps> = ({ transparentBackground }) => {
  const frame = useCurrentFrame();

  // Soft fade-out at the very end so the loop hand-off into the splash
  // (which itself fades up from white) is seamless.
  const tailFade = interpolate(
    frame,
    [T.holdEnd, T.fadeOutEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Crossfades between screens
  const splashOpacity = interpolate(
    frame,
    [T.splashStart, T.splashStart + 8, T.splashEnd, T.splashToHomeEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const homeOpacity = interpolate(
    frame,
    [T.splashEnd, T.splashToHomeEnd, T.homeEnd, T.homeToChatEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const chatOpacity = interpolate(
    frame,
    [T.homeEnd, T.homeToChatEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparentBackground ? "transparent" : "#ffffff",
      }}
    >
      <PhoneFrame>
        {/* Splash */}
        <div style={{ ...layerStyle, opacity: splashOpacity }}>
          <SplashScreen />
        </div>

        {/* Home */}
        <div style={{ ...layerStyle, opacity: homeOpacity }}>
          <HomeScreen />
        </div>

        {/* Chat (with keyboard + typing handled inside) */}
        <div style={{ ...layerStyle, opacity: chatOpacity }}>
          <ChatScreen />
        </div>

        {/* Tail fade-to-white that bridges the loop back into the splash */}
        <div
          style={{
            ...layerStyle,
            backgroundColor: "#ffffff",
            opacity: tailFade,
            pointerEvents: "none",
          }}
        />
      </PhoneFrame>
    </AbsoluteFill>
  );
};

const layerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
};
