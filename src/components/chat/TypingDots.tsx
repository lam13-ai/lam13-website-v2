// Three soft pulsing dots, shown while an assistant answer is still generating
// (including silent gaps such as the orchestrator running a tool call).
const TypingDots = () => (
  <span className="inline-flex items-center gap-1 align-middle ml-1" aria-label="Generating">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-foreground/40"
        style={{ animation: "rw-dot 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
      />
    ))}
  </span>
);

export default TypingDots;
