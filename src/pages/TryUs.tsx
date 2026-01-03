import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Menu, Plus, MessageSquare, LogIn, LogOut, Download, X, Trash2, MoreHorizontal, Edit, Copy, ThumbsUp, ThumbsDown, RotateCcw, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import logo from "@/assets/lamlogo.png";

// Check if a message looks like a report (longer content with structure)
const isReport = (content: string): boolean => {
  const hasLength = content.length > 500;
  const hasHeaders = /^#+\s|^\d+\.\s|^[-*]\s/m.test(content);
  const hasSections = content.includes('\n\n');
  return hasLength || (hasHeaders && hasSections);
};
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL
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

// Download report from backend
const downloadReport = async (path: string) => {
  console.log('[DOWNLOAD] Starting download for path:', path);
  try {
    const res = await fetch(`${BACKEND_API_URL}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
    
    if (!res.ok) {
      console.error('[DOWNLOAD] Download failed with status:', res.status);
      throw new Error(`Download failed: ${res.status}`);
    }
    
    console.log('[DOWNLOAD] Received response, creating blob...');
    const blob = await res.blob();
    console.log('[DOWNLOAD] Blob size:', blob.size, 'bytes');
    
    // Extract filename from Content-Disposition header
    const contentDisposition = res.headers.get('Content-Disposition');
    let filename = 'report.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    console.log('[DOWNLOAD] Using filename:', filename);
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    console.log('[DOWNLOAD] Download complete');
  } catch (error) {
    console.error('[DOWNLOAD] Download error:', error);
    throw error;
  }
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

const TryUs = () => {


  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    },
  ]);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingText, setThinkingText] = useState<string>("");
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const step6IntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Report generation progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  // Streaming state
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const incomingRef = useRef("");
  const renderedRef = useRef("");
  const animationRef = useRef<number>();
  const isStreamingRef = useRef(false);

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

  // Start with sidebar closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get logged in user
  const [loggedInUser, setLoggedInUser] = useState<{ user_id:number; name: string; email: string; } | null>(null);

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    if (!loggedInUser?.user_id) return;

    const fetchChats = async () => {
      const res = await fetch(
        `${BACKEND_API_URL}/get_chats?user_id=${loggedInUser.user_id}`
      );

      const data = await res.json();

      const parsedChats = await Promise.all(
        data.map(async (chat: any) => {
          // Fetch full chat history for each chat
          const historyRes = await fetch(
            `${BACKEND_API_URL}/chat/${chat.chat_id}/history?user_id=${loggedInUser.user_id}`
          );
          const historyData = await historyRes.json();

          return {
            id: chat.chat_id,
            title: chat.preview || "New conversation",
            messages: historyData.history ? parseChatTextToMessages(JSON.stringify(historyData.history)) : [],
            createdAt: new Date(chat.created_at),
            is_ready: chat.is_ready || false,
            is_available: chat.is_available || false,
            report_link: chat.report_link || null,
          };
        })
      );

      setChats(parsedChats);
      setActiveChat(parsedChats[0]?.id ?? null);
    };

    fetchChats();
  }, [loggedInUser]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
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
    const userData = localStorage.getItem("lam13_user");
    if (userData) {
      try {
        console.log("Raw userData from localStorage:", userData)
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser)
        console.log("user_id type:", typeof parsedUser.user_id, "value:", parsedUser.user_id)
        setLoggedInUser(parsedUser);

      } catch {
        setLoggedInUser(null);
      }
    }
  }, []);

  const currentChat = chats.find((c) => c.id === activeChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

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
        user_id: loggedInUser?.user_id ? String(loggedInUser.user_id) : "",
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Update chat with user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              // Only update title if it's still "New conversation" and no custom title exists
              title:
                chat.messages.length === 0 && chat.title === "New conversation"
                  ? input.trim().slice(0, 30) + "..."
                  : chat.title,
            }
          : chat
      )
    );

    setInput("");
    setIsTyping(true);
    setThinkingText("");
    setIsThinkingExpanded(false);

    try {
      console.log(activeChat)

      // Get current chat and build full message history
      const currentChatData = chats.find(c => c.id === activeChat);
      const fullMessageHistory = [
        ...(currentChatData?.messages || []).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: userMessage.content }
      ];

      const response = await fetch(BACKEND_API_URL +"/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: fullMessageHistory,
          "chat_id":activeChat,
          "user_id":loggedInUser?.user_id ?? "",
          meta: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body reader");
      }

      const decoder = new TextDecoder();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      // Initialize streaming
      setStreamingMessageId(aiMessage.id);
      setStreamText("");
      incomingRef.current = "";
      renderedRef.current = "";

      // Add empty message and start render loop
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );

      setIsTyping(false);
      startRenderLoop();

      try {
        const sse = createSSEParser((content) => {
          console.log('[SSE-DATA]:', JSON.stringify(content), 'codes:', content.split('').map(c => c.charCodeAt(0)).join(','));
          
          if (content.startsWith('thinking:')) {
            setThinkingText(content.slice(9).trim());
            return;
          }

          // Check for Step6 start marker
          if (content.includes('__STEP6_START__')) {
            debug('[STEP6] Detected STEP6_START marker, showing thinking');
            startStep6Analysis({});
            return;
          }

          // Handle special formatting tokens from OpenAI
          let normalized = content;
          
          if (content === '  ') {
            // Two spaces = newline after colon or list items
            normalized = '\n';
          } else if (content === '') {
            // Empty = paragraph break
            normalized = '\n\n';
          } else if (incomingRef.current.endsWith(':') && content === '-') {
            // Colon followed by dash needs newline between them
            normalized = '\n-';
          } else if (incomingRef.current.endsWith(':') && content === '*') {
            // Colon followed by asterisk needs newline between them
            normalized = '\n*';
          } else if (content === '**' && /\n$/.test(incomingRef.current)) {
            // Standalone ** after newline (likely closing bold on wrong line) - append to previous line
            normalized = '**';
          } else if (/\)\s*$/.test(incomingRef.current) && /^[\s]*[-*]/.test(content)) {
            // Closing parenthesis (with optional trailing space) followed by bullet marker (with optional leading space)
            normalized = '\n' + content.trimStart();
          } else if (/\)\s*$/.test(incomingRef.current) && content === '**') {
            // Closing parenthesis followed by ** (likely bold marker before bullet)
            normalized = '**';
          } else if (incomingRef.current.endsWith('**') && /^[-*]/.test(content)) {
            // Double asterisk followed by bullet marker - add newline before bullet
            normalized = '\n' + content;
          } else if (content.includes(')-') || content.includes(')*')) {
            // Content contains closing paren followed by bullet marker - add newline before marker
            normalized = content.replace(/\)(-|\*)/g, ')\n$1');
          } else if (content.includes(')**')) {
            // Content contains closing paren followed by ** - add newline before **
            normalized = content.replace(/\)\*\*/g, ')\n**');
          } else if (content.includes('**-') || content.includes('***')) {
            // Content contains ** followed by bullet marker - add newline before bullet
            normalized = content.replace(/\*\*(-|\*)/g, '**\n$1');
          }
          
          console.log('[BEFORE-APPEND] incoming:', incomingRef.current.length, 'normalized:', JSON.stringify(normalized));
          incomingRef.current += normalized;
          console.log('[AFTER-APPEND] incoming:', incomingRef.current.length);
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            debug('[STREAM] Done reading, incoming length:', incomingRef.current.length);
            sse.flush();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          
          console.log('[CHUNK-RAW]:', JSON.stringify(chunk));
          
          // Parse SSE safely (handles chunk boundaries & preserves whitespace)
          sse.feed(chunk);
        }
      } finally {
        reader.releaseLock();
        setThinkingText("");

        debug('[STREAM] Before cleaning, incoming length:', incomingRef.current.length);
        
        // Check for generation payload and trigger report generation
        const payload = parseGenerationPayload(incomingRef.current);
        console.log('[PAYLOAD-CHECK] Full response:', incomingRef.current);
        console.log('[PAYLOAD-CHECK] Parsed payload:', payload);
        if (payload && payload.type === "READY_TO_LAUNCH") {
          debug('[STEP2] Payload detected, triggering report generation:', payload);
          startReportGeneration(payload);
        } else {
          console.log('[PAYLOAD-CHECK] No valid payload found or type mismatch');
        }

        // Check for research request and trigger Step6
        // Remove only GENERATION_PAYLOAD and DATA blocks, preserve text formatting
        let cleaned = removeGenerationPayload(incomingRef.current);
        cleaned = removeDataBlock(cleaned);
        cleaned = removeResearchRequest(cleaned);
        
        // Preserve whitespace and formatting, but patch obvious missing spaces
        cleaned = addMissingSpaces(cleaned);
        
        // Fix malformed markdown from streaming
        incomingRef.current = fixMarkdown(cleaned);
        
        debug('[STREAM] After cleaning, incoming length:', incomingRef.current.length);
        logChars('CLEANED-FINAL', incomingRef.current);

        // Wait for render loop to catch up before stopping
        const waitForRender = () => {
          debug('[RENDER] Waiting - rendered:', renderedRef.current.length, 'incoming:', incomingRef.current.length);
          if (renderedRef.current.length < incomingRef.current.length) {
            requestAnimationFrame(waitForRender);
          } else {
            debug('[RENDER] Caught up! Setting final streamText');
            // Ensure streamText is fully updated
            setStreamText(incomingRef.current);
            stopRenderLoop();
            
            debug('[RENDER] Committing to chat store, content length:', incomingRef.current.length);
            // Commit to chat store with payload
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === activeChat
                  ? {
                      ...chat,
                      messages: chat.messages.map(msg =>
                        msg.id === aiMessage.id
                          ? { ...msg, content: incomingRef.current, payload: payload }
                          : msg
                      )
                    }
                  : chat
              )
            );

            debug('[RENDER] Clearing streamingMessageId');
            setStreamingMessageId(null);
            
            // Hide thinking after stream completes
            if (step6IntervalRef.current) {
              clearInterval(step6IntervalRef.current);
              step6IntervalRef.current = null;
            }
            setThinkingText("");
            setIsThinkingExpanded(false);
            debug('[STEP6] Cleared thinking after stream complete');
          }
        };
        
        debug('[STREAM] Starting waitForRender');
        requestAnimationFrame(waitForRender);
      }
    } catch (error) {
      console.error("Chat API error:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Our servers are currently overloaded since we are in a beta-launch, please try again.",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async () => {
    if (!loggedInUser?.user_id) return;

    const res = await fetch(`${BACKEND_API_URL}/chat/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: loggedInUser.user_id }),
    });

    const chat = await res.json();

    const newChat: Chat = {
      id: chat.chat_id,
      title: chat.preview || "New conversation",
      messages: [],
      createdAt: new Date(chat.created_at),
      is_ready: false,
      is_available: false,
      report_link: null,
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(chat.chat_id);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const response = await fetch(`${BACKEND_API_URL}/chat/${chatId}?user_id=${loggedInUser.user_id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setChats(prev => prev.filter(chat => chat.id !== chatId));

        // If deleted chat was active, switch to first remaining chat or create new one
        if (activeChat === chatId) {
          const remainingChats = chats.filter(chat => chat.id !== chatId);
          if (remainingChats.length > 0) {
            setActiveChat(remainingChats[0].id);
          } else {
            handleNewChat();
          }
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleRegenerate = async (message: Message) => {
    if (!activeChat || !currentChat) return;

    const messageIndex = currentChat.messages.findIndex(m => m.id === message.id);
    if (messageIndex < 0) return;

    // Keep messages before the one being regenerated
    const messagesBeforeRegenerate = currentChat.messages.slice(0, messageIndex);

    // Immediately remove the message being regenerated
    setChats(prev => prev.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: messagesBeforeRegenerate }
        : chat
    ));

    setIsTyping(true);
    setThinkingText("");
    setIsThinkingExpanded(false);

    try {
      const response = await fetch(BACKEND_API_URL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesBeforeRegenerate.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          chat_id: activeChat,
          user_id: loggedInUser?.user_id || null,
          meta: { regenerate: true },
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body reader");

      const decoder = new TextDecoder();

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      // Initialize streaming
      setStreamingMessageId(aiMessage.id);
      setStreamText("");
      incomingRef.current = "";
      renderedRef.current = "";

      // Add empty message and start render loop
      setChats(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...messagesBeforeRegenerate, aiMessage] }
          : chat
      ));

      setIsTyping(false);
      startRenderLoop();

      try {
        const sse = createSSEParser((content) => {
          if (content.startsWith("thinking:")) {
            setThinkingText(content.slice(9).trim());
            return;
          }

          // Handle special formatting tokens from OpenAI
          let normalized = content;
          if (content === '  ') {
            normalized = '\n';
          } else if (content === '') {
            normalized = '\n\n';
          } else if (incomingRef.current.endsWith(':') && content === '-') {
            normalized = '\n-';
          } else if (incomingRef.current.endsWith(':') && content === '*') {
            normalized = '\n*';
          } else if (content === '**' && /\n$/.test(incomingRef.current)) {
            // Standalone ** after newline (likely closing bold on wrong line) - append to previous line
            normalized = '**';
          } else if (/\)\s*$/.test(incomingRef.current) && /^[\s]*[-*]/.test(content)) {
            // Closing parenthesis (with optional trailing space) followed by bullet marker (with optional leading space)
            normalized = '\n' + content.trimStart();
          } else if (/\)\s*$/.test(incomingRef.current) && content === '**') {
            // Closing parenthesis followed by ** (likely bold marker before bullet)
            normalized = '**';
          } else if (incomingRef.current.endsWith('**') && /^[-*]/.test(content)) {
            // Double asterisk followed by bullet marker - add newline before bullet
            normalized = '\n' + content;
          } else if (content.includes(')-') || content.includes(')*')) {
            // Content contains closing paren followed by bullet marker - add newline before marker
            normalized = content.replace(/\)(-|\*)/g, ')\n$1');
          } else if (content.includes(')**')) {
            // Content contains closing paren followed by ** - add newline before **
            normalized = content.replace(/\)\*\*/g, ')\n**');
          } else if (content.includes('**-') || content.includes('***')) {
            // Content contains ** followed by bullet marker - add newline before bullet
            normalized = content.replace(/\*\*(-|\*)/g, '**\n$1');
          }

          if (DEBUG) console.log('[STREAM-APPEND-REGEN]', { appended: normalized, incomingLen: incomingRef.current.length });
          incomingRef.current += normalized;
          if (DEBUG) logChars('STREAM-INCOMING-REGEN', incomingRef.current);
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            sse.flush();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE safely (handles chunk boundaries & preserves whitespace)
          sse.feed(chunk);

        }
      } finally {
        reader.releaseLock();
        setThinkingText("");

        // Check for research request and trigger Step6
        const researchRequest = parseResearchRequest(incomingRef.current);
        console.log('[STEP6-TRIGGER-REGEN] Research request result:', researchRequest);
        if (researchRequest) {
          debug('[STEP6-REGEN] Research request detected:', researchRequest);
          await startStep6Analysis(researchRequest);
        }

        // Clean all internal blocks from final content
        let cleaned = cleanMessage(incomingRef.current);
        cleaned = addMissingSpaces(cleaned);
        incomingRef.current = fixMarkdown(cleaned);

        setTimeout(() => {
          renderedRef.current = incomingRef.current;
          setStreamText(incomingRef.current);
          stopRenderLoop();

          setChats(prev => prev.map(chat =>
            chat.id === activeChat
              ? {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === aiMessage.id
                      ? { ...msg, content: incomingRef.current }
                      : msg
                  )
                }
              : chat
          ));

          setStreamingMessageId(null);
        }, 100);
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
      // Restore original state on error
      setChats(prev => prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: currentChat.messages }
          : chat
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleRenameChat = async (chatId: string) => {
    const newName = prompt('Enter new chat name:');
    if (!newName?.trim()) return;

    try {
      const response = await fetch(`${BACKEND_API_URL}/chat/${chatId}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: loggedInUser.user_id,
          new_title: newName.trim()
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
    <div className="h-screen flex bg-background relative">
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

        {/* User Info */}
        <div className="p-3 border-t border-gray-200 min-w-[280px] md:min-w-[288px]">
          {loggedInUser ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-200/50 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700 truncate">{loggedInUser.name}</span>
            </div>
          ) : (
            <Link to="/auth">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-200/50 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <LogIn className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-600">Sign in</span>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
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
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="Lam13.ai" className="w-8 h-8 object-contain flex-shrink-0" />
            <span className="font-medium text-foreground truncate">Lam13.ai</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {currentChat?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-start md:items-center justify-center p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-left md:text-center">
                Hello this is Lam13, what can I do for you today?
              </h2>
              <p className="text-muted-foreground text-left md:text-center max-w-md mb-4 text-sm md:text-base">
                I am in Beta testing and I can help you develop complete national strategies or a subset of them like benchmarks, KPIs or required governance.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
              {currentChat?.messages.map((message, index) => {
                const isLastAssistantMessage = message.role === "assistant" &&
                  index === currentChat.messages.length - 1;

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
                          ? "bg-secondary/80 text-foreground ml-auto max-w-[85%] md:max-w-[70%]"
                          : "text-foreground max-w-[85%] md:max-w-[70%]"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none [&>p]:whitespace-pre-wrap [&>p]:mb-4 [&>ul]:mb-3 [&>ul]:ml-4 [&>ul]:list-disc [&>ol]:mb-3 [&>ol]:ml-4 [&>ol]:list-decimal [&>li]:mb-1 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-2 [&>h3]:font-medium [&>h3]:mb-1">
                          <ReactMarkdown
                            remarkPlugins={[remarkBreaks]}
                            components={{
                              p: ({children}) => <p className="mb-4">{children}</p>
                            }}
                          >
                            {streamingMessageId === message.id ? cleanMessage(streamText) : cleanMessage(message.content)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                      {message.role === "assistant" && loggedInUser && message.id === currentChat?.messages[currentChat.messages.length - 1]?.id && currentChat?.is_ready && currentChat?.report_link && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 mb-2">✓ Your report is ready and has been sent to your email!</p>
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
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                        {isLastAssistantMessage && (
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
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-foreground/70" />
                    </div>
                  )}
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
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 p-3 md:p-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 md:gap-3 items-stretch h-[52px] md:h-[56px]">
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
                disabled={!input.trim() || isTyping}
                className="bg-accent hover:bg-accent/90 text-accent-foreground h-full w-[52px] md:w-[56px] rounded-xl flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
            {!loggedInUser && (
              <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-2 md:mt-3">
                This is a demo. Sign in to save conversations and unlock full
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
