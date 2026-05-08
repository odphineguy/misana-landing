import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { PhoneFrame } from "../HeroPhone/PhoneFrame";
import { NewEntryScreen } from "./screens/NewEntryScreen";
import { SymptomsTrackerScreen } from "./screens/SymptomsTrackerScreen";
import { DoctorBriefSheet } from "./parts/DoctorBriefSheet";
import { FPS, T, TOTAL_FRAMES } from "./timing";

loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const HERO_JOURNAL_DURATION = TOTAL_FRAMES;
export const HERO_JOURNAL_FPS = FPS;

export type HeroJournalProps = {
  transparentBackground: boolean;
};

export const HeroJournal: React.FC<HeroJournalProps> = ({
  transparentBackground,
}) => {
  const frame = useCurrentFrame();

  // Crossfade from New Entry to Symptoms tracker
  const trackerOpacity = interpolate(
    frame,
    [T.toTrackerFadeStart, T.toTrackerFadeEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tail-fade so the loop hand-off is invisible
  const tailFade = interpolate(
    frame,
    [T.holdEnd, T.fadeOutEnd],
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
        {/* Scene A/B: New Entry form (always rendered, fades out as tracker fades in) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - trackerOpacity,
          }}
        >
          <NewEntryScreen />
        </div>

        {/* Scene C: Symptoms tracker (fades in) */}
        {frame >= T.toTrackerFadeStart - 4 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: trackerOpacity,
            }}
          >
            <SymptomsTrackerScreen />
          </div>
        )}

        {/* Doctor Brief sheet — slides up over tracker */}
        <DoctorBriefSheet />

        {/* Tail fade to white for clean loop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ffffff",
            opacity: tailFade,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </PhoneFrame>
    </AbsoluteFill>
  );
};
