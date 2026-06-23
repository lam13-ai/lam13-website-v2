// Token-streaming "reasoning" panel.
//
// Streaming phase: a spinner + "Thinking… {Ns}" header, with reasoning text
// accumulating live below a divider and a blinking caret.
// Done phase: collapses to "Thought for {Ns} · ~{N} tokens" with a chevron;
// the body re-expands on click. Visual spec mirrors the provided design.

interface ReasoningWindowProps {
  phase: "streaming" | "done";
  text: string;
  elapsedSeconds: number;
  tokenEst: number;
  expanded: boolean;
  onToggle: () => void;
}

const StarIcon = ({ size, fill }: { size: number; fill: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0 }}>
    <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4Z" />
  </svg>
);

const ReasoningWindow = ({
  phase,
  text,
  elapsedSeconds,
  tokenEst,
  expanded,
  onToggle,
}: ReasoningWindowProps) => {
  const isStreaming = phase === "streaming";
  const isDone = phase === "done";
  const showContent = (isStreaming && text.length > 0) || (isDone && expanded);

  const headerLabel = isStreaming
    ? `Thinking… ${elapsedSeconds}s`
    : `Thought for ${elapsedSeconds}s · ∼${tokenEst} tokens`;

  return (
    <div
      style={{
        border: "1px solid #e5e3df",
        borderRadius: 10,
        background: "#fafaf8",
        overflow: "hidden",
        maxWidth: "48rem",
        width: "100%",
      }}
    >
      {/* Header row */}
      <div
        onClick={isDone ? onToggle : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "10px 14px",
          cursor: isDone ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        {isStreaming ? (
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              border: "1.5px solid #d9d7d3",
              borderTopColor: "#777777",
              animation: "rw-spin 0.75s linear infinite",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
        ) : (
          <StarIcon size={12} fill="#aaaaaa" />
        )}

        <span
          style={{
            flex: 1,
            fontSize: 12.5,
            color: "#888888",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {headerLabel}
        </span>

        {isDone && (
          <span
            style={{
              fontSize: 11,
              color: "#c0bebb",
              fontWeight: 500,
              lineHeight: 1,
              marginRight: 1,
            }}
          >
            {expanded ? "↑" : "↓"}
          </span>
        )}
      </div>

      {/* Divider */}
      {showContent && <div style={{ height: 1, background: "#eceae6" }} />}

      {/* Reasoning text */}
      {showContent && (
        <div
          style={{
            padding: "13px 14px 15px",
            fontSize: 12.5,
            lineHeight: 1.73,
            color: "#666666",
            whiteSpace: "pre-wrap",
            letterSpacing: "-0.005em",
            maxHeight: "24rem",
            overflowY: "auto",
          }}
        >
          {text}
          {isStreaming && (
            <span
              style={{
                display: "inline-block",
                width: 1.5,
                height: "0.85em",
                background: "#bbbbbb",
                verticalAlign: "middle",
                borderRadius: 1,
                marginLeft: 2,
                animation: "rw-blink 1s step-end infinite",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReasoningWindow;
