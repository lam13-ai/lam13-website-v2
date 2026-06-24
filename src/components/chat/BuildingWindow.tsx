// Kothar PPTX "building" panel.
//
// Running phase: a spinner + "Building your slides… {phase}" header, with the
// live build log accumulating below a divider.
// Done phase: collapses to "Slides built" with a chevron and exposes a Download
// button for the generated deck. Failed phase: shows an error line.
// Visual spec mirrors ReasoningWindow so the two panels read as siblings.

interface BuildingWindowProps {
  status: "running" | "completed" | "failed";
  text: string;        // accumulated build log
  phase?: string;      // current pipeline phase (e.g. "render")
  pptxUrl?: string;    // download link once completed
  error?: string;
  expanded: boolean;
  onToggle: () => void;
  onDownload?: (url: string) => void;
}

const SlideIcon = ({ size, fill }: { size: number; fill: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth={2} style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <line x1="3" y1="20" x2="21" y2="20" />
  </svg>
);

const BuildingWindow = ({
  status,
  text,
  phase,
  pptxUrl,
  error,
  expanded,
  onToggle,
  onDownload,
}: BuildingWindowProps) => {
  const isRunning = status === "running";
  const isDone = status === "completed";
  const isFailed = status === "failed";
  const collapsible = isDone || isFailed;
  const showContent = (isRunning && text.length > 0) || ((isDone || isFailed) && expanded);

  const headerLabel = isRunning
    ? `Building your slides…${phase ? ` ${phase}` : ""}`
    : isDone
    ? "Slides built"
    : "Slide generation failed";

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
        onClick={collapsible ? onToggle : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "10px 14px",
          cursor: collapsible ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        {isRunning ? (
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
          <SlideIcon size={13} fill={isFailed ? "#c98a8a" : "#9aa89a"} />
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

        {collapsible && (
          <span style={{ fontSize: 11, color: "#c0bebb", fontWeight: 500, lineHeight: 1, marginRight: 1 }}>
            {expanded ? "↑" : "↓"}
          </span>
        )}
      </div>

      {/* Divider */}
      {showContent && <div style={{ height: 1, background: "#eceae6" }} />}

      {/* Build log */}
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
          {isFailed && error ? error : text}
        </div>
      )}

      {/* Download CTA */}
      {isDone && pptxUrl && (
        <>
          <div style={{ height: 1, background: "#eceae6" }} />
          <div style={{ padding: "12px 14px" }}>
            <button
              onClick={() => onDownload?.(pptxUrl)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                background: "#16a34a",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download slides
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BuildingWindow;
