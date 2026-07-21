"use client";

import { useCallback, useEffect, useState } from "react";
import LiveDemo from "./LiveDemo";
import FreeTrialGenerator from "./FreeTrialGenerator";

type Mode = "demo" | "trial";

const TRIGGER_HASH = "#try-now";

export default function HeroExperience() {
  const [mode, setMode] = useState<Mode>("demo");

  const startTrial = useCallback(() => {
    setMode("trial");
    // Normalize the hash back to #try so the deep-link doesn't keep firing on reload.
    if (typeof window !== "undefined" && window.location.hash === TRIGGER_HASH) {
      history.replaceState(null, "", "#try");
    }
    // Bring the trial into view (LiveDemo may have scrolled elsewhere).
    requestAnimationFrame(() => {
      document
        .getElementById("try")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === TRIGGER_HASH) {
        startTrial();
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [startTrial]);

  return (
    <div id="try" className="scroll-mt-24">
      {mode === "demo" ? (
        <LiveDemo onStartTrial={startTrial} />
      ) : (
        <FreeTrialGenerator />
      )}
    </div>
  );
}
