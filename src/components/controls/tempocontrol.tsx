"use client";
import { useEffect, useState } from "react";

interface TempoControlProps {
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
}

const MIN_BPM = 40;
const MAX_BPM = 300;

function Clamp(value: number) {
  return Math.max(MIN_BPM, Math.min(MAX_BPM, value));
}

export default function TempoControl({ bpm, setBpm }: TempoControlProps) {
  // What is typed is kept as text, so the field can be empty or half-typed while editing.
  // The tempo follows the text as soon as it is a valid number, and an unfinished or
  // out-of-range entry is cleaned up (clamped, or reset if empty) on Enter or blur.
  const [draft, setDraft] = useState(String(bpm));

  useEffect(() => {
    setDraft(String(bpm));
  }, [bpm]);

  function Commit() {
    const typed = parseInt(draft, 10);
    const next = Number.isNaN(typed) ? bpm : Clamp(typed);
    setBpm(next);
    setDraft(String(next));
  }

  function Nudge(amount: number) {
    setBpm(Clamp(bpm + amount));
  }

  function HandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value.replace(/\D/g, "").slice(0, 3);
    setDraft(text);
    const typed = parseInt(text, 10);
    if (typed >= MIN_BPM && typed <= MAX_BPM) setBpm(typed);
  }

  function HandleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const amount = e.shiftKey ? 10 : 1;
    if (e.key === "Enter") {
      Commit();
      e.currentTarget.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      Nudge(amount);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      Nudge(-amount);
    }
  }

  const stepButton =
    "flex h-10 w-10 items-center justify-center rounded-xl bg-gray-600 text-xl leading-none text-white hover:bg-gray-500 active:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-600";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Tempo
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={stepButton}
          onClick={() => Nudge(-1)}
          disabled={bpm <= MIN_BPM}
          aria-label="Decrease tempo"
        >
          −
        </button>
        <div className="flex items-baseline gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={HandleChange}
            onBlur={Commit}
            onKeyDown={HandleKeyDown}
            onFocus={(e) => e.target.select()}
            aria-label="Tempo in beats per minute"
            className="h-10 w-16 rounded-xl bg-gray-900 text-center text-xl font-semibold text-white outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-400">BPM</span>
        </div>
        <button
          type="button"
          className={stepButton}
          onClick={() => Nudge(1)}
          disabled={bpm >= MAX_BPM}
          aria-label="Increase tempo"
        >
          +
        </button>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          aria-label="Tempo slider"
          className="ml-2 hidden w-40 cursor-pointer accent-blue-500 sm:block"
        />
      </div>
    </div>
  );
}
