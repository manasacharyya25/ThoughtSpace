"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  conversationArcs,
  matchingSubtitles,
  sampleThoughts,
  type ConversationTurn,
} from "@/data/landing-simulator";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

type SimulatorStep = "input" | "matching" | "chat";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
};

function generateKey() {
  const segment = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `TS-${segment}-${suffix}`;
}

export function MatchSimulator() {
  const [step, setStep] = useState<SimulatorStep>("input");
  const [thought, setThought] = useState("");
  const [matchingSubtitle, setMatchingSubtitle] = useState<string>(
    "Analyzing emotional resonance of your thought..."
  );
  const [statusText, setStatusText] = useState("Awaiting your thoughts...");
  const [progressText, setProgressText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [reply, setReply] = useState("");
  const [placeholder, setPlaceholder] = useState("Write a sincere reply...");
  const [showCompletion, setShowCompletion] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);

  const arcKeyRef = useRef<"lonely" | "default">("default");
  const turnIndexRef = useRef(0);
  const userCountRef = useRef(0);
  const strangerCountRef = useRef(0);
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matchingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollChatToBottom = useCallback(() => {
    const el = chatThreadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollChatToBottom();
  }, [messages, isTyping, showCompletion, generatedKey, scrollChatToBottom]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (matchingIntervalRef.current) clearInterval(matchingIntervalRef.current);
    };
  }, []);

  const updateProgress = useCallback((userCount: number, strangerCount: number) => {
    const total = userCount + strangerCount;
    if (total >= 10) {
      setProgressText("Session Complete ✓");
    } else {
      setProgressText(`Exchange Stability: ${total}/10 messages`);
    }
  }, []);

  const appendMessage = useCallback(
    (sender: string, text: string, isUser: boolean) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${prev.length}`, sender, text, isUser },
      ]);
    },
    []
  );

  const triggerStrangerTurn = useCallback(() => {
    const arc = conversationArcs[arcKeyRef.current];
    const turnIndex = turnIndexRef.current;
    if (turnIndex >= arc.length) return;

    const turn: ConversationTurn = arc[turnIndex];

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(true);
      const typingDelay = Math.max(2000, turn.strangerReply.length * 15);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        strangerCountRef.current += 1;
        updateProgress(userCountRef.current, strangerCountRef.current);
        appendMessage("Stranger", turn.strangerReply, false);
        setPlaceholder(`Suggestion: ${turn.guideline}`);
        turnIndexRef.current += 1;

        const total = userCountRef.current + strangerCountRef.current;
        if (total >= 10) {
          setShowCompletion(true);
        }
      }, typingDelay);
    }, 1000);
  }, [appendMessage, updateProgress]);

  const initiateChat = useCallback(
    (userThought: string) => {
      setStep("chat");
      setStatusText("Connected to Anonymous Stranger");
      setMessages([]);
      setShowCompletion(false);
      setGeneratedKey(null);
      turnIndexRef.current = 0;
      userCountRef.current = 1;
      strangerCountRef.current = 0;
      updateProgress(1, 0);
      appendMessage("You", userThought, true);
      triggerStrangerTurn();
    },
    [appendMessage, triggerStrangerTurn, updateProgress]
  );

  const startMatch = () => {
    const trimmed = thought.trim();
    if (!trimmed) {
      setInputError(true);
      setTimeout(() => setInputError(false), 1000);
      return;
    }

    const lower = trimmed.toLowerCase();
    arcKeyRef.current =
      lower.includes("lonely") || lower.includes("alone") ? "lonely" : "default";

    setStep("matching");
    setStatusText("Matching in progress...");
    setProgressText("");
    setMatchingSubtitle("Analyzing emotional resonance of your thought...");

    let subIndex = 0;
    matchingIntervalRef.current = setInterval(() => {
      if (subIndex < matchingSubtitles.length - 1) {
        subIndex += 1;
        setMatchingSubtitle(matchingSubtitles[subIndex]);
      }
    }, 1100);

    setTimeout(() => {
      if (matchingIntervalRef.current) clearInterval(matchingIntervalRef.current);
      initiateChat(trimmed);
    }, 4000);
  };

  const handleUserReply = () => {
    const text = reply.trim();
    if (!text || showCompletion) return;

    setReply("");
    userCountRef.current += 1;
    updateProgress(userCountRef.current, strangerCountRef.current);
    appendMessage("You", text, true);
    triggerStrangerTurn();
  };

  const resetSimulator = () => {
    setStep("input");
    setStatusText("Awaiting your thoughts...");
    setProgressText("");
    setThought("");
    setMessages([]);
    setReply("");
    setShowCompletion(false);
    setGeneratedKey(null);
    setPlaceholder("Write a sincere reply...");
    turnIndexRef.current = 0;
    userCountRef.current = 0;
    strangerCountRef.current = 0;
  };

  return (
    <section
      id="simulator"
      className="border-b border-landing-border px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
            Experience It Now
          </span>
          <h2 className="font-landing-serif mt-2 mb-4 text-3xl text-landing-fg sm:text-5xl">
            The Connection Sandbox
          </h2>
          <p className="mx-auto max-w-xl text-sm text-landing-muted sm:text-base">
            Type a deep thought, a random wonder, or how you feel right now.
            We&apos;ll simulate a live anonymous match to show you what
            conversational chemistry feels like without modern noise.
          </p>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-landing-border bg-black shadow-2xl">
          <div className="flex items-center justify-between border-b border-landing-border bg-landing-card px-6 py-4">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-3 w-3 rounded-full bg-landing-border"
                />
              ))}
            </div>
            <span
              className={cn(
                "font-landing-mono text-xs",
                step === "chat" ? "text-landing-gold" : "text-landing-muted"
              )}
            >
              {statusText}
            </span>
            <span
              className={cn(
                "font-landing-mono text-[10px]",
                progressText.includes("Complete")
                  ? "text-emerald-400"
                  : "text-landing-muted/70"
              )}
            >
              {progressText}
            </span>
          </div>

          <div className="flex min-h-[420px] flex-col justify-between p-6 sm:p-8">
            {step === "input" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block font-landing-serif text-lg italic text-landing-fg">
                    &ldquo;What has been occupying your mind lately that you
                    haven&apos;t spoken aloud?&rdquo;
                  </label>
                  <textarea
                    rows={4}
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    className={cn(
                      "landing-input w-full rounded-lg p-4 text-sm leading-relaxed",
                      inputError && "border-red-500"
                    )}
                    placeholder="I sometimes wonder if the people I've drifted away from ever randomly think of me at the same moment I think of them..."
                  />
                </div>

                <div className="space-y-2">
                  <span className="block font-landing-mono text-xs text-landing-muted">
                    Or click a sample thought to load:
                  </span>
                  <div className="flex flex-col gap-2">
                    {sampleThoughts.map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setThought(sample)}
                        className="landing-quick-prompt w-full rounded-lg p-3 text-left text-xs"
                      >
                        &ldquo;{sample}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startMatch}
                  className="landing-btn-primary w-full rounded-lg py-4 font-landing-mono text-xs uppercase tracking-wider"
                >
                  Send thought into the ether
                </button>
              </div>
            )}

            {step === "matching" && (
              <div className="flex w-full flex-col items-center justify-center space-y-6 py-12 text-center">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 animate-pulse-slow rounded-full border border-landing-gold/30" />
                  <div className="absolute inset-2 rounded-full border border-landing-border" />
                  <div className="mx-auto h-4 w-4 animate-pulse rounded-full bg-landing-gold" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-landing-serif text-lg italic text-landing-fg">
                    Casting your signal...
                  </h4>
                  <p className="mx-auto max-w-sm font-landing-mono text-xs text-landing-muted">
                    {matchingSubtitle}
                  </p>
                </div>
              </div>
            )}

            {step === "chat" && (
              <div className="flex h-[420px] w-full flex-col justify-between">
                <div
                  ref={chatThreadRef}
                  className="mb-4 max-h-[340px] flex-1 space-y-4 overflow-y-auto pr-2 text-sm leading-relaxed"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full flex-col space-y-1",
                        msg.isUser ? "items-end" : "items-start"
                      )}
                    >
                      <span
                        className={cn(
                          "font-landing-mono text-[10px]",
                          msg.isUser ? "text-landing-muted" : "text-landing-gold"
                        )}
                      >
                        {msg.sender} • Just now
                      </span>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg border border-landing-border px-4 py-3 text-left text-sm font-light leading-relaxed",
                          msg.isUser
                            ? "ml-auto rounded-tr-none bg-landing-input"
                            : "mr-auto rounded-tl-none bg-[#070706]"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center space-x-2 py-2 font-landing-mono text-xs italic text-landing-muted">
                      <span>Stranger is writing</span>
                      <span className="flex space-x-1">
                        {[0.1, 0.2, 0.3].map((delay) => (
                          <span
                            key={delay}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-landing-muted"
                            style={{ animationDelay: `${delay}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  )}

                  {showCompletion && (
                    <div className="animate-pulse-slow mt-6 space-y-4 border-t border-landing-border pt-6 text-center">
                      <div className="space-y-1">
                        <h5 className="font-landing-mono text-xs uppercase tracking-wider text-landing-gold">
                          Connection Resonance Met
                        </h5>
                        <p className="mx-auto max-w-md text-[11px] text-landing-muted">
                          You&apos;ve reached an exceptional conversation depth
                          of 10 messages. This ephemeral room is ready to fade,
                          or you can secure it.
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setGeneratedKey(generateKey())}
                          className="w-full rounded-lg bg-landing-gold px-4 py-2 font-landing-mono text-xs font-bold uppercase text-black transition-colors hover:bg-landing-gold-hover sm:w-auto"
                        >
                          Generate Connection Key
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            resetSimulator();
                            scrollToSection("waitlist");
                          }}
                          className="w-full rounded-lg border border-landing-border bg-landing-card px-4 py-2 font-landing-mono text-xs uppercase text-landing-muted transition-colors hover:bg-white/[0.03] sm:w-auto"
                        >
                          Join Waitlist for Real Humans
                        </button>
                      </div>
                    </div>
                  )}

                  {generatedKey && (
                    <div className="mx-auto mt-4 max-w-md space-y-2 rounded-lg border border-landing-gold/30 bg-landing-card/40 p-4 text-left text-xs">
                      <span className="block font-landing-mono text-[10px] uppercase text-landing-gold">
                        Your Ephemeral Connection Key:
                      </span>
                      <div className="flex items-center justify-between rounded border border-landing-border bg-black p-2">
                        <code className="font-landing-mono text-landing-fg">
                          {generatedKey}
                        </code>
                        <span className="text-[10px] text-landing-muted">
                          Active
                        </span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-landing-muted">
                        Write this down. In the full app, sharing this code with
                        your matched partner secures this anonymous private
                        chatroom.
                      </p>
                    </div>
                  )}
                </div>

                {!showCompletion && (
                  <div className="flex gap-2 border-t border-landing-border pt-4">
                    <input
                      type="text"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUserReply();
                      }}
                      placeholder={placeholder}
                      className="landing-input flex-1 rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleUserReply}
                      className="rounded-lg bg-white px-4 py-2 font-landing-mono text-xs font-semibold uppercase text-black transition-colors hover:bg-landing-gold"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center">
          <span className="inline-block font-landing-mono text-xs text-landing-muted">
            *Our simulator uses a responsive script to mimic a real human
            reflection. Real app connections are strictly human-to-human.
          </span>
        </p>
      </div>
    </section>
  );
}
