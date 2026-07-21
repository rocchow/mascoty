"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import DrainSwirl from "./DrainSwirl";

type Stage =
  | "idle"
  | "typing"
  | "thinking"
  | "revealing-sheet"
  | "swirling"
  | "preview"
  | "complete";

const PROMPT_TEXT = 'Help me create a mascot for my brand Mascoty named "M"';

function TypingCursor() {
  return (
    <span className="inline-block w-0.5 h-5 bg-accent ml-0.5 animate-blink" />
  );
}

function AISpinner() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="relative h-5 w-5">
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 border-t-accent animate-spin-dots" />
      </div>
      <span className="text-sm text-accent-hover font-medium">
        Creating your mascot...
      </span>
    </div>
  );
}

function Confetti() {
  const colors = ["#6366F1", "#8B5CF6", "#FFC857", "#FF7D7D", "#C4B5FD"];
  const pieces = useRef(
    Array.from({ length: 24 }).map((_, i) => ({
      color: colors[i % colors.length],
      left: `${5 + ((i * 17 + 7) % 90)}%`,
      top: `${-10 + (i % 4) * 8}%`,
      delay: `${(i * 37) % 500}ms`,
      duration: `${1.2 + ((i * 13) % 500) / 500}s`,
      size:
        i % 3 === 0
          ? "w-2 h-2"
          : i % 3 === 1
            ? "w-1.5 h-1.5"
            : "w-1 h-3",
      rounded: i % 3 === 2 ? "" : "rounded-full",
    }))
  );
  return (
    <div className="absolute -inset-10 pointer-events-none overflow-hidden">
      {pieces.current.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.size} ${p.rounded}`}
          style={{
            backgroundColor: p.color,
            left: p.left,
            top: p.top,
            animation: `confetti-fall ${p.duration} ease-in ${p.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function LiveDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const [typedLength, setTypedLength] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const startDemo = useCallback(() => {
    setStage("typing");
    setTypedLength(0);
    setHasPlayed(true);
  }, []);

  useEffect(() => {
    if (stage !== "idle" || hasPlayed) return;
    const timeout = setTimeout(startDemo, 1500);
    return () => clearTimeout(timeout);
  }, [stage, hasPlayed, startDemo]);

  useEffect(() => {
    if (stage !== "typing") return;
    if (typedLength >= PROMPT_TEXT.length) {
      const timeout = setTimeout(() => setStage("thinking"), 600);
      return () => clearTimeout(timeout);
    }
    const speed = 30 + Math.random() * 20;
    const timeout = setTimeout(() => setTypedLength((l) => l + 1), speed);
    return () => clearTimeout(timeout);
  }, [stage, typedLength]);

  useEffect(() => {
    if (stage !== "thinking") return;
    const timeout = setTimeout(() => setStage("revealing-sheet"), 2200);
    return () => clearTimeout(timeout);
  }, [stage]);

  useEffect(() => {
    if (stage !== "revealing-sheet") return;
    sheetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timeout = setTimeout(() => setStage("swirling"), 2600);
    return () => clearTimeout(timeout);
  }, [stage]);

  useEffect(() => {
    if (stage !== "swirling") return;
    const timeout = setTimeout(() => setStage("preview"), 750);
    return () => clearTimeout(timeout);
  }, [stage]);

  useEffect(() => {
    if (stage !== "preview") return;
    const timeout = setTimeout(() => setStage("complete"), 400);
    return () => clearTimeout(timeout);
  }, [stage]);

  const showSheet =
    stage === "revealing-sheet" ||
    stage === "swirling" ||
    stage === "preview" ||
    stage === "complete";
  const showPreview = stage === "preview" || stage === "complete";
  const swirling = stage === "swirling";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border-2 border-border bg-white dark:bg-[#1a1830] shadow-xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-border dark:from-[#1e1b3a] dark:to-[#252240]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted font-mono">mascoty.ai</span>
          </div>
        </div>

        {/* Demo content */}
        <div className="p-6 md:p-10 flex flex-col">
          {/* Input area */}
          <div
            className={`rounded-xl border-2 transition-all duration-300 ${
              stage === "typing"
                ? "border-accent shadow-md shadow-accent/10"
                : "border-border"
            } bg-card px-4 py-3 mb-6`}
          >
            <div className="flex items-center gap-3">
              <div className="text-accent">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="flex-1 text-base text-foreground min-h-[28px] flex items-center">
                {stage === "idle" && !hasPlayed && (
                  <span className="text-muted">
                    Describe your mascot idea...
                  </span>
                )}
                {stage === "idle" && hasPlayed && (
                  <span className="text-foreground">{PROMPT_TEXT}</span>
                )}
                {stage !== "idle" && (
                  <>
                    <span>{PROMPT_TEXT.slice(0, typedLength)}</span>
                    {stage === "typing" && <TypingCursor />}
                  </>
                )}
              </div>
              {stage === "idle" && (
                <button
                  onClick={startDemo}
                  className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors cursor-pointer animate-pulse-glow"
                >
                  {hasPlayed ? "Replay" : "Try it"}
                </button>
              )}
            </div>
          </div>

          {/* AI thinking */}
          {stage === "thinking" && (
            <div className="animate-fade-in-up">
              <div className="rounded-xl bg-accent-light border border-accent/10 mb-6">
                <AISpinner />
                <div className="px-4 pb-3">
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-accent/10 animate-shimmer w-3/4" />
                    <div className="h-2 rounded-full bg-accent/10 animate-shimmer w-1/2" />
                    <div className="h-2 rounded-full bg-accent/10 animate-shimmer w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Character sheet reveal → swirl → website preview */}
          {showSheet && (
            <div ref={sheetRef} className="animate-fade-in-up relative">
              <Confetti />
              {(stage === "revealing-sheet" || stage === "swirling") && (
                <div className="flex justify-center mb-4 animate-speech-pop">
                  <div className="relative bg-card rounded-xl px-6 py-2.5 shadow-lg border border-border">
                    <span className="text-lg font-bold text-foreground">
                      Tada!
                    </span>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
                  </div>
                </div>
              )}
              {stage === "complete" && (
                <div className="flex justify-center mb-4 animate-speech-pop">
                  <div className="relative bg-card rounded-xl px-6 py-2.5 shadow-lg border border-border">
                    <span className="text-lg font-bold text-foreground">
                      Ready to ship ✨
                    </span>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
                  </div>
                </div>
              )}
              <div className="relative rounded-xl overflow-hidden border border-border shadow-lg bg-card aspect-[1400/900]">
                {/* Website preview: sits underneath, revealed as the drain empties */}
                {(swirling || showPreview) && (
                  <div
                    className="absolute inset-0 transition-opacity ease-out"
                    style={{
                      opacity: 1,
                      transitionDuration: "600ms",
                    }}
                  >
                    <Image
                      src="/mascoty_website_preview.png"
                      alt="Mascoty on your website"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 900px"
                    />
                  </div>
                )}
                {/* Character sheet: static image before swirl, WebGL drain during */}
                {!swirling && !showPreview && (
                  <div className="absolute inset-0">
                    <Image
                      src="/mascoty.png"
                      alt="Mascoty Character Sheet"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 900px"
                      priority
                    />
                  </div>
                )}
                {swirling && (
                  <div className="absolute inset-0">
                    <DrainSwirl
                      src="/mascoty.png"
                      playing
                      durationMs={750}
                      className="w-full h-full block"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replay */}
      {stage === "complete" && (
        <div className="flex justify-center animate-fade-in-up py-4">
          <button
            onClick={() => setStage("idle")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-accent hover:text-accent-hover hover:bg-accent-light transition-colors cursor-pointer"
          >
            Replay demo
          </button>
        </div>
      )}
    </div>
  );
}
