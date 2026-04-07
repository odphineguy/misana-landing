import { Composition } from "remotion";
import {
  HeroPhone,
  HERO_PHONE_DURATION,
  HERO_PHONE_FPS,
  HeroPhoneProps,
} from "./HeroPhone/HeroPhone";
import {
  PrepareAppointment,
  PREPARE_APPT_DURATION,
  PREPARE_APPT_FPS,
  PrepareAppointmentProps,
} from "./PrepareAppointment/PrepareAppointment";

const WIDTH = 540;
const HEIGHT = 1140;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Hero phone — transparent VP9 WebM + solid H.264 MP4 */}
      <Composition
        id="HeroPhone"
        component={HeroPhone}
        durationInFrames={HERO_PHONE_DURATION}
        fps={HERO_PHONE_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ transparentBackground: true } satisfies HeroPhoneProps}
      />
      <Composition
        id="HeroPhoneSolid"
        component={HeroPhone}
        durationInFrames={HERO_PHONE_DURATION}
        fps={HERO_PHONE_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ transparentBackground: false } satisfies HeroPhoneProps}
      />

      {/* Prepare Appointment phone — same dual-render setup */}
      <Composition
        id="PrepareAppointment"
        component={PrepareAppointment}
        durationInFrames={PREPARE_APPT_DURATION}
        fps={PREPARE_APPT_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={
          { transparentBackground: true } satisfies PrepareAppointmentProps
        }
      />
      <Composition
        id="PrepareAppointmentSolid"
        component={PrepareAppointment}
        durationInFrames={PREPARE_APPT_DURATION}
        fps={PREPARE_APPT_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={
          { transparentBackground: false } satisfies PrepareAppointmentProps
        }
      />
    </>
  );
};
