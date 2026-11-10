import { Button } from "@/components/ui/Button";
import { gutter } from "@/lib/design";
import { Reveal } from "@/components/motion/Reveal";
import { StoryPath } from "@/components/features/StoryPath";

/**
 * "Powerful Features. Designed to Perform." — told as one climb: a single line runs through
 * four circles (Plan, Build, Rehearse, Finish) that fill as you scroll, each with its feature story.
 */
export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24" aria-labelledby="features-heading">
      <div className={`pb-6 pt-12 lg:pb-0 lg:pt-[calc(30*var(--d))] ${gutter}`}>
        <Reveal>
          <h2 id="features-heading" className="display text-[clamp(52px,9.4vw,172px)]">
            Four tools. One Hyrox race.
          </h2>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="lede">
              From your first goal time to the last wall ball: a Hyrox pace calculator, a station drill
              library and full race simulation, in one training app.
            </p>
            <Button href="/features" className="w-[183px] shrink-0">
              Explore Features
            </Button>
          </div>
        </Reveal>
      </div>
      <StoryPath />
    </section>
  );
}
