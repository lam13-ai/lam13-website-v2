import { Play } from "lucide-react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const Walkthrough = () => (
  <section id="video" className="py-24 bg-[#F7F8FA] border-y border-foreground/10" aria-labelledby="walk-h">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="max-w-[720px] mx-auto text-center mb-14">
        <Reveal className="flex justify-center">
          <Eyebrow center>Demo video</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="walk-h" className="font-display text-[clamp(1.7rem,3.4vw,2.7rem)] mt-4">
            A two-minute look under the hood.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-muted-foreground mt-4 text-[17px]">
            How agents plan, research, and assemble a strategy — end to end.
          </p>
        </Reveal>
      </div>

      <Reveal>
        <div
          className="relative overflow-hidden h-[300px] md:h-auto md:aspect-[16/7.4] md:min-h-[280px] flex flex-col items-center justify-center gap-6 cursor-pointer group bg-black [background-image:radial-gradient(60%_90%_at_18%_10%,rgba(255,255,255,0.09),transparent_60%),radial-gradient(55%_80%_at_85%_88%,rgba(255,255,255,0.06),transparent_60%)]"
          role="img"
          aria-label="Product walkthrough video — coming soon"
        >
          <span className="w-[76px] h-[76px] bg-white flex items-center justify-center shadow-[0_14px_40px_rgba(0,0,0,0.4)] transition-all group-hover:scale-110">
            <Play size={26} className="text-black fill-black ml-1" />
          </span>
          <span className="font-display text-[13px] text-white/70 tracking-[0.04em]">
            Product walkthrough — coming soon
          </span>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Walkthrough;
