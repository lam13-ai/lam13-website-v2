import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Landmark } from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";
import AIMessage from "@/components/ui/ai-message";
import { PromptInput } from "@/components/ui/ai-chat-input";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const STRATEGY_QUERY = "How should we structure a five-year economic diversification strategy?";

const STRATEGY_RESPONSE =
  "A strong diversification strategy starts by identifying current economic dependencies and the sectors with the greatest growth potential. I would structure it around priority industries, investment, workforce readiness, exports, and delivery governance. Which country is this for, and is the primary goal job creation, export growth, or reduced reliance on one sector?";

const DECK_SLIDES = [
  "Economic Context and Case for Change",
  "Strategic Priorities",
  "Initiative Roadmap",
  "KPI and Governance Framework",
];

/** Microsoft PowerPoint product icon */
const PowerPointIcon = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Microsoft PowerPoint" role="img">
    <rect x="14" y="6" width="28" height="36" rx="2" fill="#ED6C47" />
    <path d="M28 6h12a2 2 0 0 1 2 2v16H28V6Z" fill="#FF8F6B" />
    <path d="M14 24h28v9H14v-9Z" fill="#D35230" />
    <path d="M14 33h28v7a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2v-7Z" fill="#C43E1C" />
    <rect x="4" y="12" width="24" height="24" rx="2" fill="#C43E1C" />
    <text
      x="16"
      y="30.5"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="bold"
      fontSize="18"
      fill="#FFFFFF"
    >
      P
    </text>
  </svg>
);

const deckSteps = [
  "Analysing strategy content",
  "Identifying key executive insights",
  "Structuring the board narrative",
  "Creating visuals and KPI scorecards",
  "Generating editable PowerPoint slides",
];

/** dotted panel shared by both visuals */
const DotPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FBFBFC] [background-image:radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:18px_18px] border border-foreground/10 px-4 py-10 sm:px-8 sm:py-12 flex justify-center">
    {children}
  </div>
);

/** strategy visual: the live-demo chatbot types the query, then the next
 *  slide shows the exchange with the response */
const StrategyVisual = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const [stage, setStage] = useState<"input" | "answer">("input");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (cancelled) return;
        setStage("input");
        setTyped("");
        await wait(1000);
        for (let c = 0; c < STRATEGY_QUERY.length; c++) {
          if (cancelled) return;
          setTyped(STRATEGY_QUERY.slice(0, c + 1));
          await wait(26);
        }
        await wait(900);
        if (cancelled) return;
        setStage("answer");
        await wait(7000);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <DotPanel>
      <div ref={rootRef} className="w-full sm:w-[min(460px,94%)] min-h-[340px] flex items-center justify-center py-2">
        <AnimatePresence mode="wait">
          {stage === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center pointer-events-none"
            >
              <PromptInput
                value={typed}
                onChange={() => undefined}
                placeholder="Ask Lam13 about public strategy…"
                models={["LAM13"]}
                collapsedMaxWidth={380}
                expandedMaxWidth={420}
              />
            </motion.div>
          )}

          {stage === "answer" && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col gap-4"
            >
              <AIMessage from="user" timestamp="09:24">
                {STRATEGY_QUERY}
              </AIMessage>
              <AIMessage
                from="assistant"
                timestamp="09:24"
                copyText={STRATEGY_RESPONSE}
                onRetry={() => undefined}
                onVote={() => undefined}
              >
                {STRATEGY_RESPONSE}
              </AIMessage>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DotPanel>
  );
};

/** PowerPoint demo: Strategy document -> LAM 13 processing -> Generated PowerPoint slides */
const StageLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-display font-bold text-[10.5px] tracking-[0.18em] uppercase text-muted-foreground mb-3 text-center">
    {children}
  </p>
);

/** one mini slide preview in the generated set */
const SlidePreview = ({ index, title }: { index: number; title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45, delay: 0.15 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white border border-foreground/15 aspect-[16/10] p-2.5 flex flex-col shadow-[0_14px_34px_-18px_rgba(0,0,0,0.28)]"
  >
    <span className="h-[3px] w-8 [background:var(--gradient-accent)] mb-1.5" aria-hidden="true" />
    <span className="font-display font-bold text-[9px] leading-[1.3] text-foreground">{title}</span>
    <div className="mt-auto flex items-end gap-1" aria-hidden="true">
      {index === 0 && (
        <>
          <span className="h-1 w-10 bg-black/15" />
          <span className="h-1 w-6 bg-black/10" />
          <span className="h-1 w-8 bg-black/15" />
        </>
      )}
      {index === 1 && (
        <>
          <span className="h-5 w-4 border border-foreground/20 bg-black/[0.04]" />
          <span className="h-5 w-4 border border-foreground/20 bg-black/[0.04]" />
          <span className="h-5 w-4 border border-accent/40 bg-accent/10" />
        </>
      )}
      {index === 2 && (
        <>
          <span className="h-1 w-6 bg-accent/60" />
          <span className="h-1 w-8 bg-black/15" />
          <span className="h-1 w-10 bg-black/10" />
        </>
      )}
      {index === 3 && (
        <>
          <span className="h-2 w-4 bg-black/10" />
          <span className="h-3 w-4 bg-accent/30" />
          <span className="h-4 w-4 bg-accent/60" />
          <span className="h-5 w-4 [background:var(--gradient-accent)]" />
        </>
      )}
    </div>
    <span className="mt-1 font-display text-[8px] text-muted-foreground/70 self-end" aria-hidden="true">
      {String(index + 1).padStart(2, "0")}
    </span>
  </motion.div>
);

const DeckVisual = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const [stepIdx, setStepIdx] = useState(-1);
  const [stage, setStage] = useState<"doc" | "steps" | "slides">("doc");

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (cancelled) return;
        setStage("doc");
        setStepIdx(-1);
        await wait(2600);
        if (cancelled) return;
        setStage("steps");
        for (let i = 0; i < deckSteps.length; i++) {
          if (cancelled) return;
          setStepIdx(i);
          await wait(850);
        }
        if (cancelled) return;
        setStepIdx(deckSteps.length);
        await wait(600);
        if (cancelled) return;
        setStage("slides");
        await wait(6500);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <DotPanel>
      <div ref={rootRef} className="relative w-full sm:w-[min(440px,94%)] min-h-[340px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === "doc" && (
            <motion.div
              key="doc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[340px]"
            >
              <StageLabel>Strategy document</StageLabel>
              <div className="bg-white border border-foreground/15 px-6 py-6 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-11 border border-foreground/20 bg-black/[0.03] flex flex-col justify-center items-center gap-[3px] shrink-0" aria-hidden="true">
                    <span className="h-[2px] w-5 bg-black/25" />
                    <span className="h-[2px] w-5 bg-black/20" />
                    <span className="h-[2px] w-3.5 bg-black/25" />
                  </span>
                  <div>
                    <p className="font-display font-bold text-[13px] leading-tight">National Economic Growth Plan</p>
                    <p className="font-body text-[11.5px] text-muted-foreground mt-0.5">2026–2031 · 48 pages</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2" aria-hidden="true">
                  <span className="h-1.5 w-full bg-black/10" />
                  <span className="h-1.5 w-[85%] bg-black/10" />
                  <span className="h-1.5 w-[70%] bg-black/[0.07]" />
                  <span className="h-1.5 w-[90%] bg-black/[0.07]" />
                </div>
              </div>
            </motion.div>
          )}

          {stage === "steps" && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <StageLabel>LAM 13 processing</StageLabel>
              <div className="bg-white border border-foreground/10 px-5 py-5 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col gap-2.5">
                  {deckSteps.map((step, i) => {
                    if (i > stepIdx) return null;
                    const done = i < stepIdx;
                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2.5 text-[12.5px]"
                      >
                        {done ? (
                          <span
                            className="w-5 h-5 flex items-center justify-center text-accent font-display font-bold text-[13px]"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        ) : (
                          <ThinkingOrb state="working" size={20} theme="light" aria-label="Working" />
                        )}
                        <span className={done ? "text-muted-foreground" : "text-foreground"}>{step}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {stage === "slides" && (
            <motion.div
              key="slides"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <StageLabel>Generated PowerPoint slides</StageLabel>
              <div className="grid grid-cols-2 gap-3">
                {DECK_SLIDES.map((title, i) => (
                  <SlidePreview key={title} index={i} title={title} />
                ))}
              </div>
              <p className="mt-3 text-center text-[12.5px] text-muted-foreground font-body">
                Executive-ready slides, fully editable in PowerPoint.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DotPanel>
  );
};

const Services = () => (
  <section id="services" className="py-24 bg-white" aria-labelledby="svc-h">
    {/* heading */}
    <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-16 text-center">
      <Reveal className="flex justify-center">
        <Eyebrow center>What we do</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 id="svc-h" className="font-display text-[clamp(1.7rem,3.4vw,2.7rem)] mt-4 max-w-[26ch] mx-auto">
          Strategy consulting, delivered by agents.
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="text-muted-foreground mt-4 text-[17px] max-w-[56ch] mx-auto">
          AI-native services across the public sector — from the first framework to the final deliverable.
        </p>
      </Reveal>
    </div>

    {/* 01 — Create public strategies */}
    <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal>
          <div>
            <span className="text-accent inline-block">
              <Landmark size={30} strokeWidth={1.7} />
            </span>
            <h3 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] mt-5">Create and review public strategy</h3>
            <p className="text-muted-foreground mt-4 text-[16px] max-w-[52ch]">
              Develop public sector strategies from the ground up, or stress-test existing national strategies, surface
              gaps, and generate recommendations and content to bridge them.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <StrategyVisual />
        </Reveal>
      </div>
    </div>

    {/* 02 — board decks */}
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="py-16 md:py-20 border-t border-foreground/10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal delay={0.12} className="order-1 md:order-none">
            <DeckVisual />
          </Reveal>
          <Reveal>
            <div>
              <PowerPointIcon />
              <h3 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] mt-5">
                Turn complex strategy into decision-ready slides
              </h3>
              <p className="text-muted-foreground mt-4 text-[16px] max-w-[52ch]">
                Transform detailed strategy documents into clear, executive-ready PowerPoint slides using proven
                strategy layouts and presentation patterns used by leading strategy organisations.
              </p>
              <p className="text-muted-foreground mt-3 text-[16px] max-w-[52ch]">
                Use LAM 13&rsquo;s strategy slide designs or adapt the output to your organisation&rsquo;s existing
                PowerPoint templates, branding, and visual language. Refine the narrative, slides, and visuals through
                follow-up prompts to support executive alignment and decision-making.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
