import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { PhoneFrame } from "../HeroPhone/PhoneFrame";
import { PrepareAppointmentScreen } from "./PrepareAppointmentScreen";
import { FPS, T, TOTAL_FRAMES } from "./timing";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export const PREPARE_APPT_DURATION = TOTAL_FRAMES;
export const PREPARE_APPT_FPS = FPS;

export type PrepareAppointmentProps = {
  transparentBackground: boolean;
};

export const PrepareAppointment: React.FC<PrepareAppointmentProps> = ({
  transparentBackground,
}) => {
  const frame = useCurrentFrame();

  // Subtle tail-fade so the loop hand-off is invisible.
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
        <PrepareAppointmentScreen />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ffffff",
            opacity: tailFade,
            pointerEvents: "none",
          }}
        />
      </PhoneFrame>
    </AbsoluteFill>
  );
};
