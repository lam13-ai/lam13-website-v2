import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const PaperSection = () => (
  <section id="paper" className="py-24 bg-white overflow-hidden border-t border-foreground/10" aria-labelledby="paper-h">
    <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-[1.15fr_1fr] gap-16 items-center">
      <div>
        <Reveal>
          <Eyebrow>The paper</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="paper-h" className="font-display text-[clamp(1.7rem,3.2vw,2.5rem)] mt-4">
            Backed by a <span className="text-gradient-accent">patented</span> methodology.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-muted-foreground mt-4 max-w-[52ch]">
            Our approach isn&rsquo;t a prompt — it&rsquo;s a patented Large Agentic Model architecture for strategy
            work. Read the technical paper behind how Lam13 plans, researches, and reasons.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="flex items-center gap-5 mt-8 flex-wrap">
            <a
              href="#paper"
              className="font-display text-[15px] bg-foreground text-background px-7 py-4 min-h-[52px] inline-flex items-center gap-2.5 transition-all hover:[background:var(--gradient-accent)] hover:text-white group"
              aria-disabled="true"
            >
              Read the paper
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="bg-[#FBFBFC] [background-image:radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:18px_18px] border border-foreground/10 px-4 py-10 sm:px-8 sm:py-14 flex justify-center">
          <div className="relative bg-white border border-foreground/15 w-full sm:w-[min(330px,90%)] px-6 sm:px-7 py-8 pb-10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)]">
            <p className="font-display text-[10px] tracking-[0.18em] mb-4 text-gradient-accent font-bold flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-foreground" aria-hidden="true" />
              PATENT • AGENTIC AI
            </p>
            <h3 className="font-display text-[1.15rem] leading-[1.35]">A Large Agentic Model for Strategy</h3>

            {/* document body: abstract, sectioned skeleton copy, footer */}
            <div className="mt-5 flex flex-col gap-2" aria-hidden="true">
              {[100, 92, 74].map((w, i) => (
                <i key={`a-${i}`} className="block h-1.5 bg-black/10" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-5" aria-hidden="true">
              <i className="block h-2 w-[34%] bg-black/25" />
              <div className="mt-2.5 flex flex-col gap-2">
                {[100, 88, 61].map((w, i) => (
                  <i key={`b-${i}`} className="block h-1.5 bg-black/10" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            <div className="mt-5" aria-hidden="true">
              <i className="block h-2 w-[46%] bg-black/25" />
              <div className="mt-2.5 flex flex-col gap-2">
                {[96, 70].map((w, i) => (
                  <i key={`c-${i}`} className="block h-1.5 bg-black/10" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-display font-bold text-[10.5px] tracking-[0.14em] text-white [background:var(--gradient-accent)] px-3.5 py-2 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
              PATENTED
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default PaperSection;
