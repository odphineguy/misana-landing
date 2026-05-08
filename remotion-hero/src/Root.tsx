import { Composition } from "remotion";
import {
  HeroPhone,
  HERO_PHONE_DURATION,
  HERO_PHONE_FPS,
  HeroPhoneProps,
} from "./HeroPhone/HeroPhone";
import {
  HeroJournal,
  HERO_JOURNAL_DURATION,
  HERO_JOURNAL_FPS,
  HeroJournalProps,
} from "./HeroJournal/HeroJournal";

const WIDTH = 540;
const HEIGHT = 1140;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Hero (current): bilingual symptom-journal flow */}
      <Composition
        id="HeroJournal"
        component={HeroJournal}
        durationInFrames={HERO_JOURNAL_DURATION}
        fps={HERO_JOURNAL_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={
          { transparentBackground: true } satisfies HeroJournalProps
        }
      />
      <Composition
        id="HeroJournalSolid"
        component={HeroJournal}
        durationInFrames={HERO_JOURNAL_DURATION}
        fps={HERO_JOURNAL_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={
          { transparentBackground: false } satisfies HeroJournalProps
        }
      />

      {/* Legacy: chat/Q&A demo, still wired into the "How it works" slot
          until that section is rebuilt. Slated for removal/replacement. */}
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
    </>
  );
};
