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

const DECK_QUERY =
  "Turn our 5-year economic growth plan into a 15-slide board presentation for ministers. Highlight the evidence, priorities, KPIs, and decisions required.";

const DECK_EDIT_QUERY = "Make the opening more urgent and simplify the KPI slide.";

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
  "Generating an editable PowerPoint deck",
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

/** animated deck generation: query → AI processing steps → generating → slide */
const DeckVisual = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const [stepIdx, setStepIdx] = useState(-1);
  const [stage, setStage] = useState<
    "query" | "steps" | "gen" | "image" | "editPrompt" | "editGen" | "editImage"
  >("query");
  const [editTyped, setEditTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (cancelled) return;
        setStage("query");
        setStepIdx(-1);
        await wait(1800);
        if (cancelled) return;
        setStage("steps");
        for (let i = 0; i < deckSteps.length; i++) {
          if (cancelled) return;
          setStepIdx(i);
          await wait(850);
        }
        if (cancelled) return;
        setStepIdx(deckSteps.length);
        setStage("gen");
        await wait(2600);
        if (cancelled) return;
        setStage("image");
        await wait(4200);
        // the user asks for an edit: a small input appears over the slide,
        // the edit request types in, then the deck regenerates
        if (cancelled) return;
        setStage("editPrompt");
        setEditTyped("");
        await wait(700);
        for (let c = 0; c < DECK_EDIT_QUERY.length; c++) {
          if (cancelled) return;
          setEditTyped(DECK_EDIT_QUERY.slice(0, c + 1));
          await wait(26);
        }
        await wait(800);
        if (cancelled) return;
        setStage("editGen");
        await wait(2400);
        if (cancelled) return;
        setStage("editImage");
        await wait(5200);
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
          {stage === "query" && (
            <motion.div
              key="query"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-foreground text-background px-5 py-4 max-w-[92%] text-[12.5px] leading-relaxed font-display"
            >
              {DECK_QUERY}
            </motion.div>
          )}

          {stage === "steps" && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white border border-foreground/10 px-5 py-5 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.2)]"
            >
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
            </motion.div>
          )}

          {stage === "gen" && (
            <motion.div
              key="gen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative border border-foreground/10 bg-white aspect-[16/10] w-full overflow-hidden"
              aria-label="Generating deck preview"
            >
              <div
                className="absolute inset-5 animate-pulse [background-image:radial-gradient(circle,rgba(0,0,0,0.18)_2px,transparent_2px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_60%_at_45%_45%,#000_30%,transparent_100%)]"
                aria-hidden="true"
              />
              <span className="absolute top-3 left-4 font-body text-[13px] text-muted-foreground">Working…</span>
            </motion.div>
          )}

          {stage === "image" && (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full"
            >
              <img
                src="/deckslide.png"
                alt="Generated board deck slide"
                className="w-full border border-foreground/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3)]"
              />
              <p className="mt-3 text-center text-[12.5px] text-muted-foreground font-body">
                First draft generated — a 15-slide ministerial board deck, fully editable.
              </p>
            </motion.div>
          )}

          {stage === "editPrompt" && (
            <motion.div
              key="editPrompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative w-full"
            >
              <img
                src="/deckslide.png"
                alt="Generated board deck slide"
                className="w-full border border-foreground/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3)]"
              />
              {/* selection pin marking the edit point on the slide */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[16%] top-[30%]"
                aria-hidden="true"
              >
                <span className="relative flex size-4">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-50 animate-ping" />
                  <span className="relative inline-flex size-4 rounded-full bg-accent border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
                </span>
              </motion.span>

              {/* multiline edit input below the slide, so the slide stays visible */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 }}
                className="mt-3 flex justify-center"
              >
                <div className="w-full max-w-[380px] bg-white rounded-2xl border border-foreground/15 shadow-[0_14px_36px_-10px_rgba(0,0,0,0.3)] px-4 pt-3 pb-2">
                  <div className="min-h-[38px] text-[12.5px] leading-relaxed font-body whitespace-pre-wrap">
                    {editTyped ? (
                      <span className="text-foreground">{editTyped}</span>
                    ) : (
                      <span className="text-muted-foreground/70">Tell Lam13 what to edit…</span>
                    )}
                  </div>
                  <div className="flex justify-end pt-1">
                    <span
                      className={
                        "size-7 shrink-0 rounded-full flex items-center justify-center transition-colors " +
                        (editTyped.length === DECK_EDIT_QUERY.length
                          ? "bg-foreground text-white"
                          : "bg-black/10 text-foreground/50")
                      }
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {stage === "editGen" && (
            <motion.div
              key="editGen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative border border-foreground/10 bg-white aspect-[16/10] w-full overflow-hidden"
              aria-label="Applying edits to the deck"
            >
              <div
                className="absolute inset-5 animate-pulse [background-image:radial-gradient(circle,rgba(0,0,0,0.18)_2px,transparent_2px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_60%_at_45%_45%,#000_30%,transparent_100%)]"
                aria-hidden="true"
              />
              <span className="absolute top-3 left-4 font-body text-[13px] text-muted-foreground">
                Applying edits…
              </span>
            </motion.div>
          )}

          {stage === "editImage" && (
            <motion.div
              key="editImage"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full"
            >
              <img
                src="/deckafteredit.png"
                alt="Edited board deck slide"
                className="w-full border border-foreground/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3)]"
              />
              <p className="mt-3 text-center text-[12.5px] text-muted-foreground font-body">
                Edits applied — the opening is more urgent and the KPI slide is simplified.
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
            <h3 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] mt-5">Create public strategies.</h3>
            <p className="text-muted-foreground mt-4 text-[16px] max-w-[52ch]">
              Turn your objectives into structured public strategies with clear frameworks, benchmark research,
              prioritized initiatives, measurable KPIs, and defined governance.
            </p>
            <p className="text-muted-foreground mt-3 text-[16px] max-w-[52ch]">
              The AI organizes the content into a coherent storyline, suggests slide titles, and refines the strategy
              through follow-up prompts, ready to take into the room.
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
                Turn complex strategy into a decision-ready board deck.
              </h3>
              <p className="text-muted-foreground mt-4 text-[16px] max-w-[52ch]">
                Transform detailed strategy documents into clear, executive-level presentations built around the
                decisions that matter. The AI structures your evidence, strategic priorities, initiatives, KPIs,
                governance, and next steps into a focused narrative for senior stakeholders.
              </p>
              <p className="text-muted-foreground mt-3 text-[16px] max-w-[52ch]">
                Use follow-up prompts to strengthen the storyline, simplify complex slides, adjust the level of detail,
                or refine the visuals. When the presentation is ready, export it as a fully editable PowerPoint for
                final review and delivery.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
