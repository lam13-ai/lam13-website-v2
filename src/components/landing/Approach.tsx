import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

interface Point {
  sign: "+" | "−";
  text: string;
}

const Points = ({ items }: { items: Point[] }) => (
  <ul className="mt-5 flex flex-col gap-2.5">
    {items.map((p) => (
      <li key={p.text} className="flex gap-2.5 text-sm leading-relaxed items-baseline">
        <span
          className={`font-display font-bold shrink-0 w-3.5 ${p.sign === "+" ? "text-accent" : "text-muted-foreground/60"}`}
          aria-hidden="true"
        >
          {p.sign}
        </span>
        <span className={p.sign === "−" ? "text-muted-foreground" : ""}>{p.text}</span>
      </li>
    ))}
  </ul>
);

const Approach = () => (
  <section id="approach" className="py-24 bg-white border-t border-foreground/10" aria-labelledby="app-h">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="max-w-[720px] mb-14">
        <Reveal>
          <Eyebrow>How we do it</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="app-h" className="font-display text-[clamp(1.7rem,3.4vw,2.7rem)] mt-4">
            A patented agentic methodology.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-muted-foreground mt-4 text-[17px] max-w-[56ch]">
            We combine the best of three agentic approaches — the result reasons at strategy-consulting level.
          </p>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr_1.15fr] gap-5 items-stretch max-w-[560px] md:max-w-none mx-auto">
        <Reveal className="h-full">
          <article className="h-full border border-foreground/15 p-7 hover:border-foreground/50 transition-colors bg-white">
            <p className="font-display font-bold text-[11px] tracking-[0.1em] text-muted-foreground/80 mb-3.5">
              Approach 01
            </p>
            <h3 className="font-display text-xl">Single agent</h3>
            <p className="text-[14.5px] text-muted-foreground mt-2.5">One agent, one task, one goal.</p>
            <Points
              items={[
                { sign: "+", text: "Excels at simple, repetitive tasks" },
                { sign: "+", text: "Cost-effective to run" },
                { sign: "−", text: "Linear reasoning; can’t handle complexity" },
              ]}
            />
          </article>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <article className="h-full border border-foreground/15 p-7 hover:border-foreground/50 transition-colors bg-white">
            <p className="font-display font-bold text-[11px] tracking-[0.1em] text-muted-foreground/80 mb-3.5">
              Approach 02
            </p>
            <h3 className="font-display text-xl">Multi-agent</h3>
            <p className="text-[14.5px] text-muted-foreground mt-2.5">Many agents coordinating toward a bigger goal.</p>
            <Points
              items={[
                { sign: "+", text: "Handles complex, multi-task workflows" },
                { sign: "+", text: "Maximises expertise per task" },
                { sign: "−", text: "Needs heavy coordination; limited big-picture view" },
              ]}
            />
          </article>
        </Reveal>

        <Reveal delay={0.2} className="h-full">
          <div className="h-full p-[3px] [background:var(--gradient-frame)]">
            <article className="h-full bg-white p-7">
              <p className="font-display font-bold text-[11px] tracking-[0.1em] mb-3.5 text-gradient-accent">
                Our Patent
              </p>
              <h3 className="font-display text-xl">Large Agentic Model (LAM)</h3>
              <p className="text-[14.5px] text-muted-foreground mt-2.5">
                Turns powerful LLMs into goal-oriented agents with multi-step reasoning.
              </p>
              <Points
                items={[
                  { sign: "+", text: "Sophisticated big-picture reasoning" },
                  { sign: "+", text: "Decides independently, operates at high sophistication" },
                  { sign: "+", text: "Combines the strengths of both approaches" },
                ]}
              />
            </article>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Approach;
