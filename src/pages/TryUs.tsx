import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Menu, Plus, MessageSquare, LogIn, LogOut, Download, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

// Check if a message looks like a report (longer content with structure)
const isReport = (content: string): boolean => {
  const hasLength = content.length > 500;
  const hasHeaders = /^#+\s|^\d+\.\s|^[-*]\s/m.test(content);
  const hasSections = content.includes('\n\n');
  return hasLength || (hasHeaders && hasSections);
};
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL

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


const downloadReport = async (path: string) =>{
  const res = await fetch(`${BACKEND_API_URL}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"path": path}),
  });
  const blob = await res.blob();
  console.log("RESPONSE")
  // 2️⃣ Create temporary URL
  const url = window.URL.createObjectURL(blob);
  console.log(url)
  // 3️⃣ Create invisible <a> and click it
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.pdf"; // filename shown to user
  document.body.appendChild(a);
  a.click();

  // 4️⃣ Cleanup
  a.remove();
  window.URL.revokeObjectURL(url);

}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  reportLink: string
}

const TryUs = () => {

  
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
      reportLink:""
      
    },
  ]);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Start with sidebar closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get logged in user
  const [loggedInUser, setLoggedInUser] = useState<{ user_id:number; name: string; email: string; } | null>(null);
  
  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check Download button
  const[downloadLink, setDownloadLink] = useState("")

  useEffect(() => {
    if (!loggedInUser?.user_id) return;
  
    const fetchChats = async () => {
      const res = await fetch(
        `${BACKEND_API_URL}/get_chats?user_id=${loggedInUser.user_id}`
      );
  
      const data = await res.json();
      console.log(data)
  
      const parsedChats = data.map((chat: any) => ({
        id: chat.chat_id,
        title: chat.text
          ? (() => {
              try {
                const parsed = JSON.parse(chat.text);
                return parsed?.[0]?.question?.slice(0, 30) + "..." || "New conversation";
              } catch {
                return "New conversation";
              }
            })()
          : "New conversation",
        messages: chat.text
          ? parseChatTextToMessages(chat.text)
          : [],
        createdAt: new Date(chat.created_at),
        reportLink: chat.report_link ?? null,
      }));
  
      setChats(parsedChats);
      setActiveChat(parsedChats[0]?.id ?? null);
    };
  
    fetchChats();
  }, [loggedInUser]);
  
  
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
        console.log(userData)
        setLoggedInUser(JSON.parse(userData));
  
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
              title:
                chat.messages.length === 0
                  ? input.trim().slice(0, 30) + "..."
                  : chat.title,
            }
          : chat
      )
    );

    setInput("");
    setIsTyping(true);

    try {
      console.log(activeChat)
      const response = await fetch(BACKEND_API_URL +"/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage.content }],
          "chat_id":activeChat, 
          "user_id":loggedInUser.user_id,
          meta: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log(responseText)
      
      // Try to parse as JSON, otherwise use as plain text
      let assistantContent: string;
      try {
        const data = JSON.parse(responseText);
        console.log(data)
        assistantContent = data.choices?.[0]?.message?.content 
          || data.message?.content 
          || data.content 
          || data.response 
          || responseText;
      } catch {
        assistantContent = responseText;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    } catch (error) {
      console.error("Chat API error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, there was an error connecting to the service. Please try again.",
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
    const res = await fetch(`${BACKEND_API_URL}/chat/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: loggedInUser.user_id }),
    });
  
    const chat = await res.json();
  
    const newChat: Chat = {
      id: chat.chat_id, // REAL UUID
      title: "New conversation",
      messages: [],
      createdAt: new Date(chat.created_at),
      reportLink:""
    };
  
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(chat.chat_id);
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
          bg-background md:bg-secondary/30
          border-r border-border/50
          flex flex-col
          transition-all duration-300 ease-in-out
          overflow-hidden
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between min-w-[280px] md:min-w-[288px]">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="LAM13" className="h-8 md:h-10 w-auto" />
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground/70"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-4 min-w-[280px] md:min-w-[288px]">
          <Button
            onClick={handleNewChat}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-w-[280px] md:min-w-[288px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-2 mb-2 whitespace-nowrap">
            Recent Chats
          </p>
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                activeChat === chat.id
                  ? "bg-accent/20 text-accent"
                  : "hover:bg-secondary/50 text-foreground/70"
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>

        {/* Login CTA or User Info */}
        <div className="p-4 border-t border-border/50 min-w-[280px] md:min-w-[288px]">
          {loggedInUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    Hello, {loggedInUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {loggedInUser.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("lam13_user");
                  setLoggedInUser(null);
                  setChats([{ id: "1", title: "New conversation", messages: [], createdAt: new Date(), reportLink:"" }]);
                  setActiveChat("1");
                }}
                className="w-full gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-accent/10 rounded-lg p-3 mb-3">
                <p className="text-sm text-foreground/80">
                  Sign in to save your chats and access them anywhere.
                </p>
              </div>
              <Link to="/auth">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            </>
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
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <span className="font-medium text-foreground truncate">Lam13.ai</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {currentChat?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 md:p-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4 md:mb-6">
                <Bot className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
                Hello, this is Lam13 and I'm in beta testing.
              </h2>
              <p className="text-muted-foreground text-center max-w-md mb-4 text-sm md:text-base px-4">
                I can help you develop complete national strategies or a subset of them like benchmarks, KPIs or required governance.
              </p>
              <p className="text-foreground font-medium text-center text-sm md:text-base">
                What can I help you with today?
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/50 text-foreground"
                    }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                  </div>
                  {message.role === "user" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-foreground/70" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 md:gap-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                  </div>
                  <div className="bg-secondary/50 rounded-2xl px-3 md:px-4 py-2 md:py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
                              {currentChat?.reportLink && (
                        <div className="mt-6 mb-3 flex justify-center">
                          <Button
                            onClick={() => downloadReport(currentChat.reportLink)}
                            className="
                              flex items-center gap-2
                              rounded-lg
                              bg-accent
                              text-accent-foreground
                              hover:bg-accent/90
                              px-4 py-2
                              text-sm
                            "
                          >
                            <Download className="w-4 h-4" />
                            Download Final Report (PDF)
                          </Button>
                        </div>
)}
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 py-3 px-4 md:p-4 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 md:gap-3 items-end">
              <div className="flex-1 relative">
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
                  className="w-full resize-none rounded-xl border border-border/50 bg-secondary/30 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[44px] md:min-h-[52px] max-h-32 md:max-h-40"
                  rows={1}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-accent hover:bg-accent/90 text-accent-foreground h-[44px] w-[44px] md:h-[52px] md:w-[52px] rounded-xl flex-shrink-0"
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