"use client";

import { useEffect, useRef, useState } from "react";
import {
  acceptedChatFollowups,
  simulatedCastEchoes,
  whisperStreamCards,
} from "@/data/landing-simulator";
import { cn } from "@/lib/utils";

type FeedTab = "browse" | "mine";

type WhisperEcho = {
  id: string;
  strangerPseudonym: string;
  text: string;
};

type UserCast = {
  id: string;
  content: string;
  timestamp: string;
  echoes: WhisperEcho[];
  status: "awaiting" | "echoed";
};

type AcceptedChatMessage = {
  sender: string;
  text: string;
  isUser?: boolean;
  isSystemPrompt?: boolean;
};

export function AboutUsWhisperStream() {
  const [activeTab, setActiveTab] = useState<FeedTab>("browse");
  const [showAcceptedChat, setShowAcceptedChat] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPrompt, setModalPrompt] = useState("");
  const [modalReply, setModalReply] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  const [castInput, setCastInput] = useState("");
  const [myCasts, setMyCasts] = useState<UserCast[]>([]);
  const [acceptedChatHistory, setAcceptedChatHistory] = useState<
    AcceptedChatMessage[]
  >([]);
  const [acceptedReply, setAcceptedReply] = useState("");
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = chatHistoryRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [acceptedChatHistory, isStrangerTyping]);

  const switchTab = (tab: FeedTab) => {
    setActiveTab(tab);
    setShowAcceptedChat(false);
  };

  const openModal = (prompt: string) => {
    setModalPrompt(prompt);
    setModalReply("");
    setModalOpen(true);
  };

  const submitCast = () => {
    const content = castInput.trim();
    if (!content) return;

    setCastInput("");
    const castId = `cast-${Date.now()}`;
    const newCast: UserCast = {
      id: castId,
      content,
      timestamp: "Just now",
      echoes: [],
      status: "awaiting",
    };

    setMyCasts((prev) => [newCast, ...prev]);

    setTimeout(() => {
      setMyCasts((prev) =>
        prev.map((cast) =>
          cast.id === castId
            ? {
                ...cast,
                status: "echoed" as const,
                echoes: simulatedCastEchoes.map((echo) => ({ ...echo })),
              }
            : cast
        )
      );
    }, 3500);
  };

  const acceptEcho = (castId: string, echoId: string) => {
    const cast = myCasts.find((c) => c.id === castId);
    const echo = cast?.echoes.find((e) => e.id === echoId);
    if (!cast || !echo) return;

    setAcceptedChatHistory([
      { sender: "You (Your Cast)", text: cast.content, isSystemPrompt: true },
      { sender: "Stranger", text: echo.text, isUser: false },
    ]);
    setShowAcceptedChat(true);
    setAcceptedReply("");
  };

  const exitAcceptedChat = () => {
    setShowAcceptedChat(false);
    setActiveTab("mine");
    setAcceptedChatHistory([]);
    setIsStrangerTyping(false);
  };

  const sendAcceptedReply = () => {
    const text = acceptedReply.trim();
    if (!text) return;

    setAcceptedReply("");
    setAcceptedChatHistory((prev) => [
      ...prev,
      { sender: "You", text, isUser: true },
    ]);

    setTimeout(() => {
      setIsStrangerTyping(true);
      setTimeout(() => {
        setIsStrangerTyping(false);
        const response =
          acceptedChatFollowups[
            Math.floor(Math.random() * acceptedChatFollowups.length)
          ];
        setAcceptedChatHistory((prev) => [
          ...prev,
          { sender: "Stranger", text: response, isUser: false },
        ]);
      }, 2000);
    }, 500);
  };

  const submitModalReply = () => {
    if (!modalReply.trim()) return;
    setModalOpen(false);
    setModalReply("");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="playground"
        className="border-b border-landing-border bg-black px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
              Dual Interaction Mechanics
            </span>
            <h2 className="font-landing-serif mt-2 mb-4 text-3xl text-gray-100 sm:text-5xl">
              The Live Whisper Feed
            </h2>
            <p className="mx-auto max-w-xl text-sm text-landing-muted sm:text-base">
              Respond directly to someone else&apos;s raw thought, or cast your
              own into the stream and let others send responses. Accept a
              response to open a direct private thread.
            </p>
          </div>

          <div
            className={cn(
              "simulator-card-stage mx-auto w-full max-w-6xl",
              !hasEnteredView && "simulator-card-stage-enter-pending",
              hasEnteredView && "simulator-card-stage-pop-in"
            )}
          >
            <div className="simulator-card-backdrop" aria-hidden="true" />
            <div className="simulator-card-attention simulator-card-front relative z-10 overflow-hidden rounded-2xl border border-landing-border bg-black shadow-2xl">
              <div className="flex items-center justify-between border-b border-landing-border bg-landing-card px-6 py-4">
                <div className="flex space-x-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full bg-[#ff5f57]"
                    aria-hidden="true"
                  />
                  <span
                    className="inline-block h-3 w-3 rounded-full bg-[#febc2e]"
                    aria-hidden="true"
                  />
                  <span
                    className="inline-block h-3 w-3 rounded-full bg-[#28c840]"
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "font-landing-mono text-xs",
                    showAcceptedChat ? "text-landing-gold" : "text-landing-muted"
                  )}
                >
                  {showAcceptedChat ? "Connected" : "Whisper Stream"}
                </span>
              </div>

              <div className="p-6 sm:p-8">
          {!showAcceptedChat && (
            <div className="mx-auto mb-12 flex max-w-md justify-center space-x-2 border-b border-landing-border pb-4">
              <button
                type="button"
                onClick={() => switchTab("browse")}
                className={cn(
                  "flex-1 py-2 font-landing-mono text-xs uppercase tracking-wider transition-all",
                  activeTab === "browse"
                    ? "border-b-2 border-landing-gold text-landing-gold"
                    : "text-landing-muted hover:text-gray-200"
                )}
              >
                Browse & Reply
              </button>
              <button
                type="button"
                onClick={() => switchTab("mine")}
                className={cn(
                  "flex-1 py-2 font-landing-mono text-xs uppercase tracking-wider transition-all",
                  activeTab === "mine"
                    ? "border-b-2 border-landing-gold text-landing-gold"
                    : "text-landing-muted hover:text-gray-200"
                )}
              >
                Your Cast & Echoes
              </button>
            </div>
          )}

          {activeTab === "browse" && !showAcceptedChat && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {whisperStreamCards.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col justify-between rounded-xl border border-landing-border bg-[#0c0c0b] p-6 transition-colors duration-300 hover:border-gray-700"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-landing-mono text-xs text-landing-muted">
                      <span>{card.tag}</span>
                      <span>{card.time}</span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-gray-200">
                      &ldquo;{card.prompt}&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openModal(card.prompt)}
                    className="mt-6 flex w-full items-center justify-between border-t border-landing-border pt-4 font-landing-mono text-xs text-landing-gold transition-colors hover:text-white"
                  >
                    <span>Send an anonymous response</span>
                    <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "mine" && !showAcceptedChat && (
            <div className="mx-auto max-w-2xl space-y-8">
              <div className="space-y-4 rounded-xl border border-landing-border bg-[#0a0a09] p-6">
                <label className="block font-landing-serif text-lg italic text-gray-200">
                  Cast a whisper out to the world...
                </label>
                <textarea
                  rows={3}
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  className="about-us-input w-full rounded-lg p-4 text-sm leading-relaxed"
                  placeholder="Type a feeling or raw realization. Once cast, anonymous minds in our network can view and whisper responses back to you..."
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={submitCast}
                    className="rounded-lg bg-white px-6 py-2 font-landing-mono text-xs font-semibold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-landing-gold"
                  >
                    Cast Whisper
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {myCasts.length === 0 ? (
                  <div className="py-12 text-center font-landing-mono text-xs text-landing-muted">
                    No whispers cast by you yet. Use the composer above to
                    start.
                  </div>
                ) : (
                  myCasts.map((cast) => (
                    <div
                      key={cast.id}
                      className="space-y-4 rounded-xl border border-landing-border bg-[#0c0c0b] p-6"
                    >
                      <div className="flex items-center justify-between font-landing-mono text-xs text-landing-muted">
                        <span>Your Cast Whisper</span>
                        <span>{cast.timestamp}</span>
                      </div>
                      <p className="text-sm font-light italic leading-relaxed text-gray-200">
                        &ldquo;{cast.content}&rdquo;
                      </p>

                      {cast.status === "awaiting" && (
                        <div className="flex items-center space-x-2 py-2 font-landing-mono text-xs italic text-landing-muted">
                          <span>Scanning the ether for echoes</span>
                          <span className="flex space-x-1">
                            {[0, 0.2, 0.4].map((delay) => (
                              <span
                                key={delay}
                                className="h-1 w-1 animate-ping rounded-full bg-landing-muted"
                                style={{ animationDelay: `${delay}s` }}
                              />
                            ))}
                          </span>
                        </div>
                      )}

                      {cast.status === "echoed" && (
                        <>
                          <div className="mt-4 border-t border-landing-border pt-4">
                            <span className="mb-3 block font-landing-mono text-[10px] uppercase tracking-wider text-landing-gold">
                              Incoming Responses ({cast.echoes.length})
                            </span>
                          </div>
                          <div className="space-y-3">
                            {cast.echoes.map((echo) => (
                              <div
                                key={echo.id}
                                className="relative space-y-3 overflow-hidden rounded-lg border border-landing-border bg-black p-4"
                              >
                                <div className="flex items-center justify-between font-landing-mono text-[11px] text-landing-muted">
                                  <span>Anonymous Stranger</span>
                                  <span className="text-emerald-400">
                                    Resonance matched
                                  </span>
                                </div>
                                <p className="text-xs italic leading-relaxed text-gray-300">
                                  &ldquo;{echo.text}&rdquo;
                                </p>
                                <div className="flex justify-end pt-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      acceptEcho(cast.id, echo.id)
                                    }
                                    className="rounded-lg bg-landing-gold px-3 py-1.5 font-landing-mono text-[10px] font-bold uppercase text-black transition-all hover:bg-landing-gold-hover"
                                  >
                                    Accept Response & Chat 1-to-1
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showAcceptedChat && (
            <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-landing-border bg-[#0a0a09] p-6">
              <div className="flex items-center justify-between border-b border-landing-border pb-4">
                <button
                  type="button"
                  onClick={exitAcceptedChat}
                  className="flex items-center space-x-2 font-landing-mono text-xs text-landing-muted transition-colors hover:text-landing-gold"
                >
                  <span>← Return to Feed</span>
                </button>
                <span className="font-landing-mono text-xs text-landing-gold">
                  Active Ephemeral Connection
                </span>
              </div>

              <div
                ref={chatHistoryRef}
                className="max-h-[280px] min-h-[200px] space-y-4 overflow-y-auto pr-1"
              >
                {acceptedChatHistory.map((msg, index) => {
                  if (msg.isSystemPrompt) {
                    return (
                      <div
                        key={index}
                        className="mb-2 space-y-1 rounded-lg border border-landing-border bg-landing-gold/[0.03] p-3 text-left"
                      >
                        <span className="block font-landing-mono text-[9px] uppercase text-landing-gold">
                          Origin Post:
                        </span>
                        <p className="text-xs italic text-landing-muted">
                          &ldquo;{msg.text}&rdquo;
                        </p>
                      </div>
                    );
                  }

                  const isUser = msg.isUser;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex w-full flex-col space-y-1",
                        isUser ? "items-end" : "items-start"
                      )}
                    >
                      <span
                        className={cn(
                          "font-landing-mono text-[10px]",
                          isUser ? "text-landing-muted" : "text-landing-gold"
                        )}
                      >
                        {msg.sender} • Just now
                      </span>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg border border-landing-border px-4 py-3 text-sm font-light leading-relaxed",
                          isUser
                            ? "ml-auto rounded-tr-none bg-about-us-input text-right"
                            : "mr-auto rounded-tl-none bg-[#070706] text-left"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {isStrangerTyping && (
                  <p className="py-2 font-landing-mono text-xs italic text-landing-muted">
                    Stranger is writing{" "}
                    <span className="animate-pulse">...</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 border-t border-landing-border pt-4">
                <input
                  type="text"
                  value={acceptedReply}
                  onChange={(e) => setAcceptedReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendAcceptedReply();
                  }}
                  placeholder="Continue the conversation..."
                  className="about-us-input flex-1 rounded-lg px-4 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={sendAcceptedReply}
                  className="rounded-lg bg-white px-4 py-2 font-landing-mono text-xs font-semibold text-black transition-colors hover:bg-landing-gold"
                >
                  Send
                </button>
              </div>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-6 rounded-xl border border-landing-border bg-[#0a0a09] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
                Direct Resonance
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-landing-muted transition-colors hover:text-gray-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="rounded-lg border border-landing-border bg-[#111110] p-4">
              <span className="mb-1 block font-landing-mono text-[10px] uppercase text-landing-muted">
                Prompt:
              </span>
              <p className="text-sm font-light italic text-gray-300">
                {modalPrompt}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-landing-mono text-xs text-landing-muted">
                Your sincere reply:
              </label>
              <textarea
                rows={3}
                value={modalReply}
                onChange={(e) => setModalReply(e.target.value)}
                className="about-us-input w-full rounded-lg p-3 text-sm"
                placeholder="Write how you truly feel..."
              />
            </div>

            <button
              type="button"
              onClick={submitModalReply}
              className="about-us-btn-primary w-full rounded py-3 font-landing-mono text-xs font-bold uppercase tracking-wider"
            >
              Transmit Response
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex max-w-sm items-start space-x-3 rounded-lg border border-landing-gold/30 bg-[#121211] px-6 py-4 text-gray-200 shadow-xl transition-opacity",
          showAlert ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <span className="font-bold text-landing-gold">✓</span>
        <div>
          <h5 className="font-landing-mono text-xs font-bold uppercase text-landing-gold">
            Transmitted
          </h5>
          <p className="mt-1 text-xs text-landing-muted">
            Your reply has been anonymously matched into the virtual stream.
          </p>
        </div>
      </div>
    </>
  );
}
