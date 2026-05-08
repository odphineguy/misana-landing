import { Composition } from "remotion";
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
      {/* Hero: bilingual symptom-journal flow → renders to ../hero.{webm,mp4} */}
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
    </>
  );
};
