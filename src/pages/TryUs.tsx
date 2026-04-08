import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Menu, Plus, MessageSquare, LogIn, LogOut, Download, X, Trash2, MoreHorizontal, Edit, Copy, ThumbsUp, ThumbsDown, RotateCcw, Search, Loader2, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import { getAuth, getAccessToken, getActiveChatId, setActiveChatId, clearAuth } from "@/lib/auth";
import logo from "@/assets/lamlogo.png";

// Check if a message looks like a report (longer content with structure)
const isReport = (content: string): boolean => {
  const hasLength = content.length > 500;
  const hasHeaders = /^#+\s|^\d+\.\s|^[-*]\s/m.test(content);
  const hasSections = content.includes('\n\n');
  return hasLength || (hasHeaders && hasSections);
};
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL
const BACKEND_WS_URL = import.meta.env.VITE_BACKEND_WS_URL || BACKEND_API_URL.replace(/^http/, "ws")
const STEP2_API_URL = import.meta.env.VITE_STEP2_API_URL || "http://localhost:8001"
const STEP2_WS_URL = import.meta.env.VITE_STEP2_WS_URL || "ws://localhost:8001"
const STEP6_API_URL = import.meta.env.VITE_STEP6_API_URL || "http://localhost:8002"
// Force debug on by default unless explicitly set to "false"
const DEBUG = (import.meta.env.VITE_DEBUG ?? 'true') !== 'false';

const STEP6_MESSAGES = [
  "Analyzing sector context and requirements...",
  "Searching global best practices and frameworks...",
  "Researching country-specific data and insights...",
  "Evaluating regulatory and policy landscape...",
  "Identifying key stakeholders and dependencies...",
  "Establishing strategic pillars and structure...",
  "Formulating tailored framework recommendations...",
  "Synthesizing findings and insights...",
  "Validating against global standards...",
  "Finalizing research and preparing results..."
];

const debug = (...args: any[]) => {
  if (DEBUG) console.log(...args);
};

// Last-resort spacing fixer for smashed tokens (e.g., "Hello.World" → "Hello. World")
const addMissingSpaces = (text: string): string => {
  if (!text) return text;
  return text
    // Add space after sentence punctuation when followed immediately by a word char
    .replace(/([.!?])([A-Za-z0-9])/g, "$1 $2")
    // Add space after commas/colons/semicolons when followed by a word char
    .replace(/([,;:])([A-Za-z0-9])/g, "$1 $2")
    // Add space between lowercase/number and uppercase when no space exists (simple word join)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");
};

// Fix malformed markdown from streaming (e.g., bold markers split across lines)
const fixMarkdown = (text: string): string => {
  if (!text) return text;
  return text
    // Fix: (Recommended)\n** → (Recommended)**
    .replace(/\(Recommended\)\s*\n\s*\*\*/g, '(Recommended)**')
    // Fix: **\n- → **\n\n- (ensure blank line before next bullet)
    .replace(/\*\*\s*\n\s*-/g, '**\n\n-');
};

const downloadReport = async (link: string) => {
  if (!link) return;
  if (link.startsWith("http://") || link.startsWith("https://")) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }
  alert("Report download link is not available.");
};

// Debug helper to visualize whitespace characters
const logChars = (label: string, text: string, limit = 200) => {
  if (!DEBUG) return;
  const slice = text.slice(0, limit);
  const visual = slice.replace(/\s/g, (c) => {
    if (c === ' ') return '·';
    if (c === '\n') return '\\n';
    if (c === '\r') return '\\r';
    if (c === '\t') return '\\t';
    return `<${c.charCodeAt(0)}>`;
  });
  const codes = slice.split('').map((c) => c.charCodeAt(0));
  console.log(`[${label}] len=${text.length} preview="${visual}" codes=${codes}`);
};

// Smartly re-add spaces between streamed chunks when backend sends tokens without whitespace
const smartAppend = (prev: string, next: string): string => {
  if (!next) return prev;
  if (!prev) return next;

  const prevLast = prev.slice(-1);
  const nextFirst = next[0];
  const startsListItem = /^[-*+]\s/.test(next) || /^\d+\.\s/.test(next);
  
  console.log('[SMART-APPEND]', { 
    prevLast: JSON.stringify(prevLast), 
    nextFirst: JSON.stringify(nextFirst), 
    next: JSON.stringify(next),
    prevLast10: JSON.stringify(prev.slice(-10))
  });

  // If the next chunk starts a markdown list, ensure it begins on a new line
  if (startsListItem && !prev.endsWith('\n')) {
    console.log('[SMART-APPEND] Inserting newline before list item');
    return prev + '\n' + next;
  }

  // If next already starts with whitespace, just append (don't add another space)
  if (/\s/.test(nextFirst)) {
    console.log('[SMART-APPEND] Next starts with space, direct append');
    return prev + next;
  }
  
  // If previous ends with whitespace, just append
  if (/\s/.test(prevLast)) {
    console.log('[SMART-APPEND] Prev ends with space, direct append');
    return prev + next;
  }

  // Don't insert spaces before punctuation / closers
  if (/^[,;:!?)}\]]/.test(nextFirst)) return prev + next;

  // Don't split contractions / hyphenated words
  if (/^['’\-]/.test(nextFirst)) return prev + next;

  // Add a space after common markdown markers at the start of a line (e.g. "#", "-", "1.")
  const lastLine = prev.split(/\r?\n/).pop() ?? "";
  if (/^(#{1,6}|>|[-*+])$/.test(lastLine) || /^\d+\.$/.test(lastLine)) {
    return prev + " " + next;
  }

  const isWordChar = (c: string) => /[A-Za-z0-9]/.test(c);

  // Add space after punctuation or closers when the next chunk clearly starts a new word
  if (/[,:;!?)]$/.test(prevLast) && isWordChar(nextFirst)) return prev + " " + next;
  if (/[.?!)]$/.test(prevLast) && isWordChar(nextFirst)) return prev + " " + next;

  return prev + next;
};

// Robust SSE parser (handles chunk boundaries, multiple data: lines per event, \r\n line endings)
const createSSEParser = (onData: (data: string) => void) => {
  let buffer = "";

  const feed = (chunk: string) => {
    buffer += chunk;

    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? "";

    for (const ev of events) {
      const lines = ev.split(/\r?\n/);
      const dataLines: string[] = [];

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        // SSE spec: strip "data:" and optional single space after colon
        let payload = line.slice(5); // Remove "data:"
        if (payload.startsWith(" ")) payload = payload.slice(1); // Remove single leading space
        console.log('[SSE-LINE]', JSON.stringify(line), '-> payload:', JSON.stringify(payload));
        dataLines.push(payload);
      }

      // Empty events (no data: lines) represent paragraph breaks
      if (dataLines.length === 0) {
        onData("");
        continue;
      }

      const data = dataLines.join("\n");
      if (DEBUG) console.log('[SSE-PARSED-DATA]', JSON.stringify(data));
      if (data === "[DONE]") continue;

      onData(data);
    }
  };

  const flush = () => {
    if (!buffer) return;
    // Force an event boundary so the last partial event is processed.
    feed("\n\n");
  };

  return { feed, flush };
};

// Parse generation payload from response
const parseGenerationPayload = (text: string): any | null => {
  const startMarker = "__GENERATION_PAYLOAD_START__";
  const endMarker = "__GENERATION_PAYLOAD_END__";
  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) return null;
  try {
    const jsonStr = text.slice(startIdx + startMarker.length, endIdx).trim();
    return JSON.parse(jsonStr);
  } catch { return null; }
};

// Remove generation payload from visible text
const removeGenerationPayload = (text: string): string => {
  const startMarker = "__GENERATION_PAYLOAD_START__";
  const endMarker = "__GENERATION_PAYLOAD_END__";
  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) return text;
  return text.slice(0, startIdx) + text.slice(endIdx + endMarker.length);
};

// Remove DATA block from visible text
const removeDataBlock = (text: string): string => {
  const dataMarkers = ["DATA:", "\nDATA:", "\n\nDATA:", "  DATA:"];
  for (const marker of dataMarkers) {
    const pos = text.indexOf(marker);
    if (pos !== -1) {
      return text.slice(0, pos).trim();
    }
  }
  return text;
};

// Parse research request from response
const parseResearchRequest = (text: string): any | null => {
  console.log('[RESEARCH-PARSE] Checking text for RESEARCH_REQUEST, length:', text.length);
  // If __STEP6_START__ is present, research already happened - don't trigger again
  if (text.includes('__STEP6_START__')) {
    console.log('[RESEARCH-PARSE] __STEP6_START__ found, skipping (already processed)');
    return null;
  }
  const markers = ["RESEARCH_REQUEST:", "\nRESEARCH_REQUEST:", "\n\nRESEARCH_REQUEST:"];
  for (const marker of markers) {
    const pos = text.indexOf(marker);
    if (pos !== -1) {
      console.log('[RESEARCH-PARSE] Found marker at position:', pos);
      const afterMarker = text.substring(pos + marker.length).trim();
      console.log('[RESEARCH-PARSE] After marker (trimmed):', afterMarker.substring(0, 100));
      const jsonMatch = afterMarker.match(/^(\{[^}]*\})/);
      console.log('[RESEARCH-PARSE] JSON match:', jsonMatch);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          console.log('[RESEARCH-PARSE] Successfully parsed:', parsed);
          return parsed;
        } catch (e) {
          console.log('[RESEARCH-PARSE] Parse error:', e);
          return null;
        }
      }
    }
  }
  console.log('[RESEARCH-PARSE] No RESEARCH_REQUEST found');
  return null;
};

// Remove RESEARCH_REQUEST block from visible text  
const removeResearchRequest = (text: string): string => {
  const markers = ["RESEARCH_REQUEST:", "\nRESEARCH_REQUEST:", "\n\nRESEARCH_REQUEST:"];
  for (const marker of markers) {
    const pos = text.indexOf(marker);
    if (pos !== -1) {
      // Find the end of the JSON block
      const afterMarker = text.substring(pos + marker.length);
      const jsonEnd = afterMarker.indexOf('\n\n');
      if (jsonEnd !== -1) {
        return text.slice(0, pos) + afterMarker.slice(jsonEnd + 2);
      } else {
        // Try to match JSON block
        const jsonMatch = afterMarker.match(/^\s*\{[^}]*\}/);
        if (jsonMatch) {
          return text.slice(0, pos) + afterMarker.slice(jsonMatch[0].length);
        }
        return text.slice(0, pos);
      }
    }
  }
  return text;
};

// Clean all internal blocks from message while preserving formatting
const cleanMessage = (text: string): string => {
  if (!text) return text;
  
  let cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\\n/g, '\n');
  cleaned = removeGenerationPayload(cleaned);
  cleaned = removeDataBlock(cleaned);
  cleaned = removeResearchRequest(cleaned);
  
  // Preserve whitespace and formatting
  return cleaned.trim();
};

const formatEmbeddedJsonForDisplay = (text: string): string => {
  if (!text || !text.includes('"request_received"')) return text;

  const deFenced = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const start = deFenced.indexOf("{");
  const end = deFenced.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return text;

  const candidate = deFenced.slice(start, end + 1).trim();
  try {
    const parsed = JSON.parse(candidate);
    const pretty = JSON.stringify(parsed, null, 2);
    const before = deFenced.slice(0, start).trimEnd();
    const after = deFenced.slice(end + 1).trimStart();
    const jsonBlock = `\`\`\`json\n${pretty}\n\`\`\``;
    return [before, jsonBlock, after].filter(Boolean).join("\n\n").trim();
  } catch {
    return text;
  }
};

const parseChatTextToMessages = (text: string): Message[] => {
  try {
    const qaPairs = JSON.parse(text); // [{ question, answer }]
    if (!Array.isArray(qaPairs)) return [];

    const messages: Message[] = [];

    qaPairs.forEach((pair: any, index: number) => {
      if (pair.question) {
        messages.push({
          id: `q-${index}`,
          role: "user",
          content: pair.question,
          timestamp: new Date(),
        });
      }

      if (pair.answer) {
        messages.push({
          id: `a-${index}`,
          role: "assistant",
          content: pair.answer,
          timestamp: new Date(),
        });
      }
    });

    return messages;
  } catch (e) {
    console.error("Failed to parse chat text", e);
    return [];
  }
};

// Download content as a file
const downloadAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  hasDocument?: boolean;
  docName?: string;
  payload?: any; // Store generation payload
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  is_ready?: boolean;
  is_available?: boolean;
  report_link?: string;
}

interface ChatStreamResult {
  response: string;
  title?: string;
  agentFinals?: Array<Record<string, any>>;
}

interface UploadDocumentResult {
  sessionId: string;
  messageId: string;
  message: string;
  documentInfo?: Record<string, any>;
}

const TryUs = () => {
  // SEO meta tags
  useEffect(() => {
    document.title = "Try Lam13.ai - AI Strategy Consulting Demo | Lam13.ai";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Experience Lam13.ai's AI-powered strategy consulting. Develop national strategies, benchmarks, KPIs, and governance recommendations with our advanced agentic AI.");
    }
  }, []);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [threadsLoaded, setThreadsLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedMessageId, setUploadedMessageId] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [thinkingText, setThinkingText] = useState<string>("");
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const step6IntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isThinkingActiveRef = useRef(false);

  // Report generation progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<string>("");
  const [eshmunGenerating, setEshmunGenerating] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const chatWsRef = useRef<WebSocket | null>(null);

  // Streaming state
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const incomingRef = useRef("");
  const renderedRef = useRef("");
  const animationRef = useRef<number>();
  const isStreamingRef = useRef(false);
  const loadedConversationRef = useRef<string>("");

  // Smooth streaming render loop - keeps running while streaming
  const startRenderLoop = () => {
    isStreamingRef.current = true;
    const MAX_CHARS_PER_FRAME = 3; // Slower for smoother effect

    const renderFrame = () => {
      if (!isStreamingRef.current) return;

      const incoming = incomingRef.current;
      const rendered = renderedRef.current;

      if (rendered.length < incoming.length) {
        const nextChars = incoming.slice(rendered.length, rendered.length + MAX_CHARS_PER_FRAME);
        renderedRef.current += nextChars;
        setStreamText(renderedRef.current);
      }

      // Keep loop running while streaming is active
      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);
  };

  const stopRenderLoop = () => {
    isStreamingRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  // Initialize mobile state immediately from window to prevent flicker
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  
  // Start with sidebar closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const [loggedInUser, setLoggedInUser] = useState<{ userId: string; name: string; email: string } | null>(null);
  const accessToken = getAccessToken();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${getAccessToken()}`,
  });

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (chatWsRef.current) {
        chatWsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setLoggedInUser({
        userId: auth.userId,
        name: auth.fullName || auth.email.split("@")[0],
        email: auth.email,
      });
      const storedSessionId = getActiveChatId();
      if (storedSessionId) {
        setActiveChat(storedSessionId);
      }
      return;
    }
    setLoggedInUser(null);
  }, []);

  useEffect(() => {
    const loadChatThreads = async () => {
      if (!accessToken) {
        setThreadsLoaded(true);
        return;
      }
      try {
        const res = await fetch(`${BACKEND_API_URL}/chat/`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          setThreadsLoaded(true);
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          const fallbackId = createSessionId();
          setChats([
            {
              id: fallbackId,
              title: "New conversation",
              messages: [],
              createdAt: new Date(),
            },
          ]);
          setActiveChat(fallbackId);
          setThreadsLoaded(true);
          return;
        }

        const restoredChats: Chat[] = data.map((item: any) => ({
          id: item.sessionId,
          title: item.title || "New conversation",
          messages: [],
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        }));

        setChats(restoredChats);

        const storedSessionId = getActiveChatId();
        const hasStored = storedSessionId && restoredChats.some((c) => c.id === storedSessionId);
        setActiveChat(hasStored ? storedSessionId : restoredChats[0].id);
        setThreadsLoaded(true);
      } catch (err) {
        console.error("Failed to load chat threads:", err);
        setThreadsLoaded(true);
      }
    };

    loadChatThreads();
  }, [accessToken]);

  useEffect(() => {
    if (!activeChat) return;
    setActiveChatId(activeChat);
  }, [activeChat]);

  const currentChat = chats.find((c) => c.id === activeChat);

  useEffect(() => {
    const controller = new AbortController();
    const loadConversation = async () => {
      if (!threadsLoaded || !activeChat || !accessToken) return;
      if (loadedConversationRef.current === activeChat) return;

      try {
        const res = await fetch(`${BACKEND_API_URL}/chat/${activeChat}`, {
          headers: getAuthHeaders(),
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const messages: Message[] = (data.messages || [])
          .filter((m: any) => m.role === "user" || m.role === "assistant")
          .map((m: any, idx: number) => ({
            id: m.id || `${activeChat}-${idx}`,
            role: m.role,
            content: m.content,
            hasDocument: Boolean(m.has_document),
            docName: m.doc_name || undefined,
            timestamp: new Date(),
          }));

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  title: data.title || chat.title,
                  messages,
                  ...(data.reportUrl ? { is_ready: true, report_link: data.reportUrl } : {}),
                }
              : chat
          )
        );
        if (data.eshmunReportGeneratingStatus === "in_progress") {
          setEshmunGenerating(true);
        } else if (data.eshmunReportGeneratingStatus === "completed") {
          setEshmunGenerating(false);
        }
        loadedConversationRef.current = activeChat;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.error("Failed to load conversation:", err);
      }
    };

    loadConversation();
    return () => controller.abort();
  }, [threadsLoaded, activeChat, accessToken]);

  // Poll Eshmun status while a strategy report is being generated.
  // When the backend flips to "completed", refetch the conversation so the
  // updated AI message (with filename + URL) replaces the spinner pill — no
  // page reload required.
  useEffect(() => {
    if (!eshmunGenerating || !activeChat || !accessToken) return;

    const sessionForPoll = activeChat;
    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch(
          `${BACKEND_API_URL}/eshmun/status/${sessionForPoll}`,
          { headers: getAuthHeaders() }
        );
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (data.status !== "completed") return;

        const convRes = await fetch(`${BACKEND_API_URL}/chat/${sessionForPoll}`, {
          headers: getAuthHeaders(),
        });
        if (cancelled || !convRes.ok) return;
        const conv = await convRes.json();
        const refreshed: Message[] = (conv.messages || [])
          .filter((m: any) => m.role === "user" || m.role === "assistant")
          .map((m: any, idx: number) => ({
            id: m.id || `${sessionForPoll}-${idx}`,
            role: m.role,
            content: m.content,
            hasDocument: Boolean(m.has_document),
            docName: m.doc_name || undefined,
            timestamp: new Date(),
          }));

        if (cancelled) return;
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === sessionForPoll ? { ...chat, messages: refreshed } : chat
          )
        );
        setEshmunGenerating(false);
      } catch (err) {
        console.error("[eshmun-poll] error:", err);
      }
    };

    const interval = window.setInterval(tick, 25000);
    // Fire one immediate check so users who land on a completed chat don't
    // wait a full cycle.
    tick();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [eshmunGenerating, activeChat, accessToken]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 120;
  };

  useEffect(() => {
    if (shouldAutoScrollRef.current || isTyping) {
      scrollToBottom();
    }
  }, [currentChat?.messages.length, isTyping, activeChat]);

  // Expose retrigger function globally for debugging
  useEffect(() => {
    (window as any).retriggerStep2 = () => {
      const chat = chats.find(c => c.id === activeChat);
      const lastMsg = [...(chat?.messages || [])].reverse().find(m => m.payload?.type === "READY_TO_LAUNCH");
      if (lastMsg?.payload) {
        console.log('[RETRIGGER] Found payload, triggering Step2');
        startReportGeneration(lastMsg.payload);
      } else {
        console.log('[RETRIGGER] No payload found in messages');
        const lastAssistant = [...(chat?.messages || [])].reverse().find(m => m.role === 'assistant');
        console.log('[RETRIGGER] Last assistant message content:', lastAssistant?.content?.substring(0, 500));
        console.log('[RETRIGGER] Has DATA block?', lastAssistant?.content?.includes('DATA:'));
        console.log('[RETRIGGER] Has GENERATION_PAYLOAD?', lastAssistant?.content?.includes('__GENERATION_PAYLOAD_START__'));
      }
    };
    
    // Manual trigger with hardcoded payload
    (window as any).manualTriggerStep2 = (country: string, issue: string, entity: string, email: string, framework: string[], actionPlan: string[]) => {
      const payload = {
        type: "READY_TO_LAUNCH",
        data: {
          country,
          issue,
          entity,
          email,
          framework,
          action_plan: actionPlan,
        }
      };
      console.log('[MANUAL-TRIGGER] Triggering with payload:', payload);
      startReportGeneration(payload);
    };
  }, [chats, activeChat]);

  // Start report generation and connect to WebSocket for progress
  const startReportGeneration = async (payload: any) => {
    // Reuse existing clientId if reconnecting, otherwise generate new one
    const clientId = wsRef.current?.url?.split('/ws/')[1] || `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    debug('[STEP2] Starting report generation with clientId:', clientId);
    setIsGenerating(true);
    setIsTyping(false); // Clear typing state to avoid duplicate thinking text
    setCurrentProgress("Starting report generation...");

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;
    const reconnectDelay = 3000; // 3 seconds
    let shouldReconnect = true; // Track if we should keep reconnecting

    const connectWebSocket = () => {
      const ws = new WebSocket(`${STEP2_WS_URL}/ws/${clientId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        debug("[STEP2-WS] Connected to Step 2");
        setCurrentProgress("Connected to report service");
        reconnectAttempts = 0; // Reset on successful connection
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          debug('[STEP2-WS] Message received:', data);
          if (data.message) {
            // Remove emojis and special characters
            const cleanMessage = data.message.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|🚀|📡|✅|❌|⚠️/gu, '').trim();
            setCurrentProgress(cleanMessage);
            setThinkingText(cleanMessage);
          }
          if (data.type === "pipeline_complete" || data.type === "pipeline_completed") {
            debug('[STEP2-WS] Pipeline complete, report_link:', data.report_link);
            shouldReconnect = false; // Stop reconnecting when pipeline completes
            setIsGenerating(false);
            setThinkingText("✓ Report is ready!");
            
            // Update chat with report link if provided (logged-in users)
            if (data.report_link) {
              console.log('[DOWNLOAD] Received report_link from WebSocket:', data.report_link);
              setChats(prev => prev.map(chat => 
                chat.id === activeChat 
                  ? { ...chat, is_ready: true, report_link: data.report_link }
                  : chat
              ));
              console.log('[DOWNLOAD] Updated chat with report_link');
            } else if (!loggedInUser) {
              // Anonymous users don't get report_link, they get email
              console.log('[DOWNLOAD] Anonymous user - report sent via email');
            } else {
              console.warn('[DOWNLOAD] No report_link in WebSocket message for logged-in user');
            }
            
            // Clear thinking text after 3 seconds
            setTimeout(() => setThinkingText(""), 3000);
          }
        } catch (e) {
          debug("[STEP2-WS] Non-JSON message:", event.data);
        }
      };

      ws.onerror = (error) => {
        debug('[STEP2-WS] Error:', error);
        setCurrentProgress("Connection error - reconnecting...");
      };
      
      ws.onclose = () => {
        debug("[STEP2-WS] Disconnected");
        wsRef.current = null;
        
        // Attempt to reconnect if pipeline still running
        if (shouldReconnect && reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          debug(`[STEP2-WS] Reconnecting... attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
          setCurrentProgress(`Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`);
          setTimeout(connectWebSocket, reconnectDelay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          debug('[STEP2-WS] Max reconnection attempts reached');
          setCurrentProgress("Connection lost. Report will be sent via email.");
        }
      };
    };

    // Initial connection
    connectWebSocket();

    // Call Step 2 API
    try {
      const requestBody = {
        fields: {
          country: payload.data.country,
          issue: payload.data.issue,
          "entity name": payload.data.entity,
          "framework pillars": payload.data.framework,
          "action plan": payload.data.action_plan,
        },
        email: payload.data.email,
        client_id: clientId,
        update_interval: 30,
        user_id: loggedInUser?.userId ? String(loggedInUser.userId) : "",
        chat_id: activeChat,
      };
      
      console.log('[DOWNLOAD] Sending to Step2:', {
        user_id: requestBody.user_id,
        chat_id: requestBody.chat_id,
        client_id: requestBody.client_id
      });
      debug('[STEP2-API] Calling /api/run with payload:', payload);
      
      const response = await fetch(`${STEP2_API_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        debug('[STEP2-API] Failed with status:', response.status);
        setCurrentProgress("Failed to start report generation");
        setIsGenerating(false);
      } else {
        debug('[STEP2-API] Successfully triggered, status:', response.status);
      }
    } catch (error) {
      debug("[STEP2-API] Error:", error);
      setCurrentProgress("Could not connect to report service");
      setIsGenerating(false);
    }
  };

  // Start Step6 analysis with fake streaming progress
  const startStep6Analysis = async (researchRequest: any) => {
    debug('[STEP6] Starting analysis with request:', researchRequest);
    setIsThinkingExpanded(true);
    setThinkingText(STEP6_MESSAGES[0]);
    debug('[STEP6] Set thinking text to:', STEP6_MESSAGES[0]);
    debug('[STEP6] isThinkingExpanded set to true');
    
    let messageIndex = 0;
    step6IntervalRef.current = setInterval(() => {
      if (messageIndex < STEP6_MESSAGES.length - 1) {
        messageIndex++;
        setThinkingText(STEP6_MESSAGES[messageIndex]);
        debug('[STEP6] Updated thinking text to:', STEP6_MESSAGES[messageIndex]);
      }
    }, 5000); // 5 seconds per step
  };

  const uploadDocumentToThread = async (
    sessionId: string,
    messageId: string,
    file: File
  ): Promise<UploadDocumentResult> => {
    const form = new FormData();
    form.append("file", file);
    form.append("messageId", messageId);
    form.append("message", `Uploaded document: ${file.name}`);

    const response = await fetch(`${BACKEND_API_URL}/chat/${sessionId}/messages/upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: form,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.detail || `Upload error: ${response.status}`);
    }

    return response.json();
  };

  const sendToBackend = async (
    sessionId: string,
    message: string,
    messageId?: string,
    uploadedMessageId?: string
  ) => {
    const form = new FormData();
    form.append("message", message);
    if (messageId) {
      form.append("messageId", messageId);
    }
    if (uploadedMessageId) {
      form.append("uploadedMessageId", uploadedMessageId);
    }
    form.append("sessionId", sessionId);

    const response = await fetch(`${BACKEND_API_URL}/chat/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: form,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.detail || `Chat error: ${response.status}`);
    }

    return response.json();
  };

  const streamChatOverWebSocket = async (
    sessionId: string,
    message: string,
    messageId?: string,
    uploadedMessageId?: string
  ): Promise<ChatStreamResult> => {
    return new Promise((resolve, reject) => {
      const token = getAccessToken();
      if (!token) {
        reject(new Error("Please sign in first."));
        return;
      }

      const ws = new WebSocket(`${BACKEND_WS_URL}/chat/ws/${sessionId}`);
      chatWsRef.current = ws;
      const startedAt = Date.now();
      let lastFrameAt = Date.now();
      const watchdog = window.setInterval(() => {
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        const idle = Math.round((Date.now() - lastFrameAt) / 1000);
        console.log(
          `[CHAT-WS] waiting... elapsed=${elapsed}s idle=${idle}s streamed_chars=${incomingRef.current.length}`
        );
      }, 15000);

      let sentMessage = false;
      let resolved = false;

      const finish = (result: ChatStreamResult) => {
        if (resolved) return;
        resolved = true;
        window.clearInterval(watchdog);
        resolve(result);
      };

      const fail = (error: string) => {
        if (resolved) return;
        resolved = true;
        window.clearInterval(watchdog);
        reject(new Error(error));
      };

      ws.onopen = () => {
        console.log(`[CHAT-WS] open session=${sessionId}`);
        ws.send(JSON.stringify({ token }));
      };

      ws.onmessage = (event) => {
        try {
          lastFrameAt = Date.now();
          const data = JSON.parse(event.data);
          console.log(`[CHAT-WS] frame type=${data.type} elapsed=${Math.round((Date.now() - startedAt) / 1000)}s`);
          if (data.type === "auth" && !sentMessage) {
            sentMessage = true;
            ws.send(JSON.stringify({ message, messageId, uploadedMessageId }));
            return;
          }
          if (data.type === "start") {
            return;
          }
          if (data.type === "event") {
            if (typeof data.content === "string" && data.content.trim()) {
              setThinkingText(data.content);
              setIsThinkingExpanded(true);
            }
            return;
          }
          if (data.type === "stream") {
            incomingRef.current += data.content || "";
            return;
          }
          if (data.type === "end") {
            const finalRaw = data?.metadata?.chatbotResponse || incomingRef.current || "";
            const cleaned = fixMarkdown(addMissingSpaces(cleanMessage(finalRaw)));
            if (data.metadata?.eshmunReportGeneratingStatus === "in_progress") {
              setEshmunGenerating(true);
            }
            ws.close();
            finish({
              response: cleaned,
              title: data?.metadata?.title,
              agentFinals: Array.isArray(data?.metadata?.agentFinals) ? data.metadata.agentFinals : [],
            });
            return;
          }
          if (data.type === "error") {
            ws.close();
            fail(data.content || "Streaming failed.");
          }
        } catch {
          // Ignore malformed frames.
        }
      };

      ws.onerror = () => {
        console.error(`[CHAT-WS] error session=${sessionId}`);
        ws.close();
        fail("WebSocket connection failed.");
      };

      ws.onclose = () => {
        chatWsRef.current = null;
        window.clearInterval(watchdog);
        console.log(`[CHAT-WS] close session=${sessionId} resolved=${resolved}`);
        if (!resolved) {
          fail("WebSocket connection closed unexpectedly.");
        }
      };
    });
  };

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    if (!activeChat || !accessToken) {
      alert("Please sign in and select a chat first.");
      return;
    }

    const pendingMessageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSelectedFile(file);
    setUploadedMessageId(pendingMessageId);
    setIsUploadingFile(true);
    try {
      const uploaded = await uploadDocumentToThread(activeChat, pendingMessageId, file);
      setUploadedMessageId(uploaded.messageId || pendingMessageId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Upload failed";
      alert(msg);
      setSelectedFile(null);
      setUploadedMessageId("");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const clearUploadedDocument = () => {
    if (isUploadingFile) return;
    setSelectedFile(null);
    setUploadedMessageId("");
  };

  const handleSend = async () => {
    const hasInputPayload = Boolean(input.trim() || uploadedMessageId);

    if (!hasInputPayload || isTyping || isUploadingFile) return;
    if (!accessToken) {
      alert("Please sign in first.");
      return;
    }

    const text = input.trim() || (selectedFile ? `Analyze uploaded document: ${selectedFile.name}` : "");
    const finalUserMessageId = uploadedMessageId || `${Date.now().toString()}-user`;
    const userContent = text;
    const userMessage: Message = {
      id: finalUserMessageId,
      role: "user",
      content: userContent,
      hasDocument: Boolean(uploadedMessageId || selectedFile),
      docName: selectedFile?.name,
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0 && chat.title === "New conversation" && userContent
                  ? userContent.slice(0, 30) + "..."
                  : chat.title,
            }
          : chat
      )
    );

    setInput("");
    setIsTyping(true);
    setThinkingText("");
    setIsThinkingExpanded(false);

    const aiMessageId = `${Date.now()}-assistant`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
      )
    );

    setStreamingMessageId(aiMessageId);
    setStreamText("");
    incomingRef.current = "";
    renderedRef.current = "";
    startRenderLoop();

    try {
      let responseText = "";
      let generatedTitle: string | undefined;
      try {
        const wsResult = await streamChatOverWebSocket(
          activeChat,
          text,
          finalUserMessageId,
          uploadedMessageId || undefined
        );
        responseText = wsResult.response || "No response";
        generatedTitle = wsResult.title;

        // Extract Kothar report URL from agentFinals
        const kotharFinal = (wsResult.agentFinals || []).find(
          (f: Record<string, any>) => f.agent === "kothar" && f.report_url
        );
        const kotharReportUrl = kotharFinal?.report_url || "";

        // Detect eshmun fire-and-forget dispatch
        const eshmunFinal = (wsResult.agentFinals || []).find(
          (f: Record<string, any>) => f.agent === "eshmun" && f.generating === true
        );
        if (eshmunFinal) setEshmunGenerating(true);

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== activeChat) return chat;
            return {
              ...chat,
              ...(kotharReportUrl ? { is_ready: true, report_link: kotharReportUrl } : {}),
              messages: chat.messages,
            };
          })
        );
      } catch (wsError) {
        console.warn("WS streaming failed, fallback to HTTP:", wsError);
        const httpResult = await sendToBackend(
          activeChat,
          text,
          finalUserMessageId,
          uploadedMessageId || undefined
        );
        responseText = httpResult.response || "No response";
        generatedTitle = httpResult.title;
        incomingRef.current = responseText;
      }

      stopRenderLoop();
      setStreamText(responseText);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === aiMessageId ? { ...m, content: responseText } : m
                ),
                title: generatedTitle || chat.title,
              }
            : chat
        )
      );
      setSelectedFile(null);
      setUploadedMessageId("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Chat failed";
      stopRenderLoop();
      setStreamText(msg);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === aiMessageId ? { ...m, content: msg } : m
                ),
              }
            : chat
        )
      );
    } finally {
      setStreamingMessageId(null);
      setThinkingText("");
      setIsThinkingExpanded(false);
      setIsTyping(false);
    }
  };

  const createSessionId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID().split("-").join("");
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleNewChat = () => {
    const chatId = createSessionId();
    const newChat: Chat = {
      id: chatId,
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(chatId);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    if (!accessToken) return;

    try {
      await fetch(`${BACKEND_API_URL}/chat/${chatId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error("Delete API error:", error);
    }

    setChats((prev) => {
      const next = prev.filter((chat) => chat.id !== chatId);
      if (!next.length) {
        const fallback = {
          id: createSessionId(),
          title: "New conversation",
          messages: [],
          createdAt: new Date(),
        };
        setActiveChat(fallback.id);
        return [fallback];
      }
      if (activeChat === chatId) {
        setActiveChat(next[0].id);
      }
      return next;
    });
  };

  const canRegenerateMessage = (chat: Chat | undefined, message: Message, index: number) => {
    if (!chat || !accessToken || isTyping) return false;
    if (message.role !== "assistant") return false;
    if (index !== chat.messages.length - 1) return false;
    const previous = chat.messages[index - 1];
    return Boolean(previous && previous.role === "user" && previous.content?.trim());
  };

  const handleRegenerate = async (message: Message) => {
    if (!activeChat || !currentChat || !accessToken) return;

    const messageIndex = currentChat.messages.findIndex((m) => m.id === message.id);
    if (!canRegenerateMessage(currentChat, message, messageIndex)) return;
    const previousUser = currentChat.messages[messageIndex - 1];
    if (!previousUser) return;

    setIsTyping(true);
    setThinkingText("");
    setIsThinkingExpanded(false);
    const aiMessageId = `${Date.now()}-assistant`;
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages.slice(0, messageIndex), aiMessage],
            }
          : chat
      )
    );

    setStreamingMessageId(aiMessageId);
    setStreamText("");
    incomingRef.current = "";
    renderedRef.current = "";
    startRenderLoop();

    try {
      let responseText = "";
      let generatedTitle: string | undefined;
      try {
        const wsResult = await streamChatOverWebSocket(activeChat, previousUser.content);
        responseText = wsResult.response || "No response";
        generatedTitle = wsResult.title;
      } catch (wsError) {
        console.warn("WS regenerate failed, fallback to HTTP:", wsError);
        const httpResult = await sendToBackend(activeChat, previousUser.content, previousUser.id);
        responseText = httpResult.response || "No response";
        generatedTitle = httpResult.title;
        incomingRef.current = responseText;
      }

      stopRenderLoop();
      setStreamText(responseText);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === aiMessageId ? { ...m, content: responseText } : m
                ),
                title: generatedTitle || chat.title,
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error regenerating response:", error);
    } finally {
      setStreamingMessageId(null);
      setThinkingText("");
      setIsThinkingExpanded(false);
      setIsTyping(false);
    }
  };

  const handleRenameChat = async (chatId: string) => {
    const newName = prompt('Enter new chat name:');
    if (!newName?.trim()) return;
    if (!accessToken) return;

    try {
      const response = await fetch(`${BACKEND_API_URL}/chat/${chatId}/rename`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newName.trim(),
        })
      });

      if (response.ok) {
        setChats(prev => prev.map(chat =>
          chat.id === chatId
            ? { ...chat, title: newName.trim() }
            : chat
        ));
      } else {
        alert('Error renaming chat');
      }
    } catch (error) {
      console.error('Error renaming chat:', error);
      alert('Error renaming chat');
    }
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="h-[100dvh] flex bg-background relative overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile
            ? `fixed w-[280px] h-full z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `relative ${sidebarOpen ? "w-72" : "w-0"}`
          }
          bg-[#f9f9f9]
          flex flex-col
          transition-all duration-300 ease-in-out
          overflow-hidden
        `}
      >
        {/* Sidebar Header */}
        <div className="p-3 flex items-center justify-between min-w-[280px] md:min-w-[288px]">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="LAM13" className="h-8 w-auto" />
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-500 hover:bg-gray-200/50"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info - Moved to top */}
        <div className="px-3 pb-2 min-w-[280px] md:min-w-[288px]">
          {loggedInUser ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-200/50 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700 truncate">{loggedInUser.name}</span>
            </div>
          ) : (
            <Link to="/auth" className="block">
              <Button className="w-full bg-[#1A2F4B] hover:bg-[#1A2F4B]/90 text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </Button>
            </Link>
          )}
        </div>

        {/* New Chat & Search */}
        <div className="px-3 space-y-1 min-w-[280px] md:min-w-[288px]">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
            New chat
          </button>
          {isSearching ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                autoFocus
              />
              <button onClick={() => { setIsSearching(false); setSearchQuery(""); }}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearching(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              Search chats
            </button>
          )}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 pt-4 pb-3 min-w-[280px] md:min-w-[288px]">
          <p className="text-xs text-gray-400 px-3 mb-2">Your chats</p>
          <div className="space-y-0.5">
            {chats
              .filter(chat => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                if (chat.title.toLowerCase().includes(q)) return true;
                return chat.messages.some(m => m.content.toLowerCase().includes(q));
              })
              .map((chat) => (
              <div
                key={chat.id}
                className={`group relative rounded-lg transition-colors ${
                  activeChat === chat.id
                    ? "bg-gray-200/70"
                    : "hover:bg-gray-200/50"
                }`}
              >
                <button
                  onClick={() => handleSelectChat(chat.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 text-sm text-gray-700"
                >
                  <span className="truncate flex-1">{chat.title}</span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 h-auto w-auto rounded hover:bg-gray-300/50 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleRenameChat(chat.id)} className="gap-2">
                      <Edit className="w-4 h-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)} className="gap-2 text-red-600">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 md:h-16 border-b border-border/50 flex items-center px-3 md:px-4 gap-3 md:gap-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground/70"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Lam13.ai" className="w-8 h-8 object-contain flex-shrink-0" />
            <span className="font-medium text-foreground truncate">Lam13.ai</span>
          </Link>
        </header>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="flex-1 overflow-y-auto min-h-0"
        >
          {currentChat?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-start md:items-center justify-center p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-left md:text-center">
                Hello this is Lam13, what can I do for you today?
              </h2>
              <p className="text-muted-foreground text-left md:text-center max-w-md mb-4 text-sm md:text-base">
                I am in Beta testing and I can help you develop complete reports for national strategies or a subset of them like benchmarks, KPIs or required governance.
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
              {currentChat?.messages.map((message, index) => {
                const isLastAssistantMessage = message.role === "assistant" &&
                  index === currentChat.messages.length - 1;
                const canRegenerate = canRegenerateMessage(currentChat, message, index);
                const renderedAssistantText = formatEmbeddedJsonForDisplay(
                  cleanMessage(streamingMessageId === message.id ? streamText : message.content)
                );

                return (
                <div
                  key={message.id}
                  className={`group flex gap-2 md:gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <div
                      className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
                        message.role === "user"
                          ? "bg-secondary/80 text-foreground ml-auto max-w-[90%] md:max-w-[85%]"
                          : "text-foreground max-w-[90%] md:max-w-[85%]"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none [&>p]:whitespace-pre-wrap [&>p]:mb-4 [&>ul]:mb-3 [&>ul]:ml-4 [&>ul]:list-disc [&>ol]:mb-3 [&>ol]:ml-4 [&>ol]:list-decimal [&>li]:mb-1 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-2 [&>h3]:font-medium [&>h3]:mb-1">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              p: ({children}) => <p className="mb-4">{children}</p>,
                              table: ({children}) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full border-collapse border border-border/40 text-xs">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({children}) => <thead className="bg-muted/50">{children}</thead>,
                              th: ({children}) => <th className="border border-border/40 px-3 py-2 text-left font-semibold">{children}</th>,
                              td: ({children}) => <td className="border border-border/40 px-3 py-2 align-top">{children}</td>,
                            }}
                          >
                            {renderedAssistantText}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          {message.hasDocument && (
                            <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/50 px-2 py-1">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-[11px] text-muted-foreground">
                                {message.docName || "Document attached"}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {message.role === "assistant" && loggedInUser && message.id === currentChat?.messages[currentChat.messages.length - 1]?.id && currentChat?.is_ready && currentChat?.report_link && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 mb-2">Your report is ready!</p>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => downloadReport(currentChat.report_link!)}
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Download className="w-4 h-4" />
                            Download Report
                          </Button>
                        </div>
                      )}
                    </div>
                    {message.role === "assistant" && (() => {
                      const isErrorMessage = message.content.toLowerCase().includes("our servers are currently overloaded") || 
                                             message.content.toLowerCase().includes("our servers are overloaded") || 
                                             message.content.toLowerCase().includes("please try again");
                      const isEmptyResponse = message.content.trim() === "";
                      const showAlways = (isErrorMessage || isEmptyResponse) && isLastAssistantMessage;
                      return (
                      <div className={`flex items-center gap-1 mt-2 transition-opacity duration-200 ${
                        showAlways 
                          ? "opacity-100" 
                          : "opacity-0 group-hover:opacity-100"
                      }`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-secondary/80 rounded-md"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(message.content);
                            } catch (err) {
                              console.error('Failed to copy text:', err);
                            }
                          }}
                          title="Copy message"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:bg-secondary/80 rounded-md"
                          disabled
                          title="Like (coming soon)"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:bg-secondary/80 rounded-md"
                          disabled
                          title="Dislike (coming soon)"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </Button>
                        {canRegenerate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-secondary/80 rounded-md"
                            onClick={() => handleRegenerate(message)}
                            title="Regenerate response"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {message.payload && message.payload.type === "READY_TO_LAUNCH" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-secondary/80 rounded-md text-accent"
                            onClick={() => startReportGeneration(message.payload)}
                            title="Retrigger Step 2"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      );
                    })()}
                  </div>
                </div>
                );
              })}
              {isTyping && (
                <div className="flex gap-2 md:gap-4">
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="inline-block w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
                      <span>Thinking{thinkingText ? "..." : "..."}</span>
                      {thinkingText && (
                        <span className="text-xs">
                          {isThinkingExpanded ? "▼" : "▶"}
                        </span>
                      )}
                    </button>
                    {isThinkingExpanded && thinkingText && (
                      <div className="mt-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3 max-w-md">
                        {thinkingText}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!isTyping && !isGenerating && thinkingText && (
                <div className="flex gap-2 md:gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    {thinkingText.includes("ready") ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        {thinkingText}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span className="inline-block w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                        <span className="animate-pulse">{thinkingText}</span>
                      </div>
                    )}
                    {currentChat?.report_link && thinkingText.includes("ready") && (
                      <Button
                        onClick={() => downloadReport(currentChat.report_link!)}
                        className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground w-fit"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {isGenerating && (
                <div className="flex gap-2 md:gap-4">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span className="inline-block w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                    <span className="animate-pulse">{currentProgress}</span>
                  </div>
                </div>
              )}
              {eshmunGenerating && (
                <div className="flex gap-2 md:gap-4">
                  <div className="flex items-center gap-2 text-sm text-blue-600 p-3 bg-blue-50 rounded-lg">
                    <span className="inline-block w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
                    <span>Your strategy document is being generated and will be sent to your email.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 p-3 md:p-4 bg-background/80 backdrop-blur-sm flex-shrink-0 sticky bottom-0">
          <div className="max-w-7xl mx-auto">
            {selectedFile && (
              <div className="mb-2 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-foreground truncate">
                      {selectedFile.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isUploadingFile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Uploading...</span>
                      </>
                    ) : (
                      <span className="text-xs text-green-600">Ready</span>
                    )}
                    {!isUploadingFile && (
                      <button
                        type="button"
                        onClick={clearUploadedDocument}
                        className="text-muted-foreground hover:text-foreground"
                        title="Remove uploaded file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 md:gap-3 items-stretch h-[52px] md:h-[56px]">
              <input
                id="pdf-upload-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0] || null;
                  await handleFileSelect(file);
                  e.currentTarget.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="h-full w-[52px] md:w-[56px] rounded-xl flex-shrink-0"
                disabled={isUploadingFile}
                onClick={() => document.getElementById("pdf-upload-input")?.click()}
                title="Upload PDF"
              >
                +
              </Button>
              <div className="flex-1 relative h-full">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about public sector strategy..."
                  className="w-full h-full resize-none rounded-xl border border-border/50 bg-secondary/30 px-3 md:px-4 py-3 md:py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 overflow-hidden"
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={(!input.trim() && !uploadedMessageId) || isTyping || isUploadingFile}
                className="bg-accent hover:bg-accent/90 text-accent-foreground h-full w-[52px] md:w-[56px] rounded-xl flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
            {!loggedInUser && (
              <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-2 md:mt-3">
                We're in beta testing. Sign in to save conversations and unlock full
                capabilities.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TryUs;
