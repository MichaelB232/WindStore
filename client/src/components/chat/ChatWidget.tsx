"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Wrench,
  Loader2,
} from "lucide-react";

interface ToolUsed {
  name: string;
  args: Record<string, any>;
  success?: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolsUsed?: ToolUsed[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  "🔥 Laptop gaming di bawah 20 juta",
  "⚖️ Bandingkan ROG Strix G16 vs Legion 5",
  "💳 Metode pembayaran apa saja yang tersedia?",
  "💼 Laptop ultrabook untuk kerja & kuliah",
];

// Helper untuk merender Markdown bersih tanpa simbol mentah (###, **, *)
function MarkdownMessage({ content }: { content: string }) {
  const formatInline = (text: string): ReactNode[] => {
    const tokens: ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        tokens.push(
          <strong key={match.index} className="font-semibold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        tokens.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 font-mono text-[11.5px]"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        tokens.push(
          <span key={match.index} className="text-indigo-200/90 italic">
            {token.slice(1, -1)}
          </span>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(text.substring(lastIndex));
    }

    return tokens;
  };

  const lines = content.split("\n");
  const renderedElements: ReactNode[] = [];

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      renderedElements.push(<div key={`empty-${index}`} className="h-2" />);
      return;
    }

    // Heading (### atau ## atau #)
    if (line.startsWith("#")) {
      const cleanHeading = line
        .replace(/^#+\s*/, "")
        .replace(/^\*\*|\*\*$/g, "")
        .trim();
      renderedElements.push(
        <div
          key={`h-${index}`}
          className="font-bold text-indigo-300 text-[13.5px] mt-2 mb-1 flex items-center gap-1.5 border-b border-white/10 pb-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
          <span>{formatInline(cleanHeading)}</span>
        </div>
      );
      return;
    }

    // Bullet points (* atau -)
    if (line.startsWith("* ") || line.startsWith("- ")) {
      const cleanItem = line.slice(2).trim();
      renderedElements.push(
        <div
          key={`li-${index}`}
          className="flex items-start gap-2 my-1 pl-1 text-[13px] leading-relaxed text-gray-200"
        >
          <span className="text-indigo-400 mt-1 shrink-0 text-xs">•</span>
          <span className="flex-1">{formatInline(cleanItem)}</span>
        </div>
      );
      return;
    }

    // Numbered list (contoh: 1. Item)
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2].trim();
      renderedElements.push(
        <div
          key={`num-${index}`}
          className="flex items-start gap-2 my-1 pl-1 text-[13px] leading-relaxed text-gray-200"
        >
          <span className="font-mono text-indigo-400 font-semibold text-xs shrink-0 mt-0.5">
            {num}.
          </span>
          <span className="flex-1">{formatInline(itemText)}</span>
        </div>
      );
      return;
    }

    // Normal paragraph line
    renderedElements.push(
      <p
        key={`p-${index}`}
        className="my-0.5 text-[13px] leading-relaxed text-gray-200"
      >
        {formatInline(line)}
      </p>
    );
  });

  return <div className="space-y-0.5">{renderedElements}</div>;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Jangan tampilkan di halaman admin
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedSession = localStorage.getItem("windstore_ai_session_id");
      if (!storedSession) {
        storedSession = "session_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("windstore_ai_session_id", storedSession);
      }
      setSessionId(storedSession);

      const storedMessages = localStorage.getItem("windstore_ai_messages");
      if (storedMessages) {
        try {
          setMessages(JSON.parse(storedMessages));
        } catch (e) {
          console.error("Failed to parse stored chat messages", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      localStorage.setItem("windstore_ai_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId || "default",
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: "msg_" + (Date.now() + 1),
        role: "assistant",
        content: data.reply || "Maaf, tidak ada tanggapan dari asisten.",
        toolsUsed: data.tools_used || [],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "msg_" + (Date.now() + 1),
          role: "assistant",
          content:
            "⚠️ Gagal terhubung ke AI Assistant. Pastikan server agent aktif.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    if (isLoading) return;
    try {
      await fetch("/api/chat/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId || "default" }),
      });
    } catch (e) {
      console.warn("Reset remote error", e);
    }
    setMessages([]);
    localStorage.removeItem("windstore_ai_messages");
  };

  if (isAdmin) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#0f1117]/90 text-white px-3.5 py-2 rounded-full border border-indigo-500/30 shadow-lg text-xs font-medium cursor-pointer hover:border-indigo-500/60 transition-all backdrop-blur-md animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tanya AI WindStore</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Assistant"
          className="relative group p-4 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {isOpen ? (
            <ChevronDown className="w-6 h-6 transition-transform" />
          ) : (
            <Bot className="w-6 h-6 transition-transform group-hover:rotate-12" />
          )}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0f1117]"></span>
          </span>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[430px] h-[600px] max-h-[82vh] flex flex-col bg-[#0f1117] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#141824]/90 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white">
                    WindStore Assistant
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                    Live Agent
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Gemini 2.5 Flash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Mulai percakapan baru"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center px-4 py-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-white mb-1">
                  Halo! Mau cari laptop apa hari ini?
                </h4>
                <p className="text-xs text-gray-400 max-w-[280px] mb-5 leading-relaxed">
                  Saya bisa bantu cek harga real-time, rekomendasi sesuai
                  budget, bandingkan spesifikasi, hingga info toko.
                </p>

                <div className="w-full space-y-2">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider text-left pl-1">
                    Coba tanyakan:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 text-left">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-xs text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-gray-300 hover:text-white transition-all duration-150"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[88%] text-[13.5px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs"
                        : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-xs"
                    }`}
                  >

                    {/* Content Rendering: Markdown formatting for assistant, plain for user */}
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <MarkdownMessage content={msg.content} />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start space-y-1">
                <div className="rounded-2xl rounded-bl-xs bg-white/5 border border-white/10 px-4 py-3 text-xs text-gray-300 flex items-center gap-2.5 shadow-sm">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="animate-pulse">
                    Agent sedang menganalisis katalog...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-[#141824]/90 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanya soal laptop, harga, garansi..."
                disabled={isLoading}
                className="flex-1 bg-white/5 text-white placeholder-gray-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all flex items-center justify-center shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-500 px-1">
              <span>Data dari WindStore Database</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
