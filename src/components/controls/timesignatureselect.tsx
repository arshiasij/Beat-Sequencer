"use client";
import { timeSignatures, TimeSignature } from "../logic/timesignatures";

interface TimeSignatureSelectProps {
  value: TimeSignature;
  onChange: (timeSignature: TimeSignature) => void;
}

export default function TimeSignatureSelect({ value, onChange }: TimeSignatureSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="time-signature"
        className="text-xs font-semibold uppercase tracking-wider text-gray-400"
      >
        Time signature
      </label>
      <select
        id="time-signature"
        value={value.label}
        onChange={(e) => {
          const next = timeSignatures.find((signature) => signature.label === e.target.value);
          if (next) onChange(next);
        }}
        className="h-10 cursor-pointer rounded-xl bg-gray-900 px-4 text-xl font-semibold text-white outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-blue-500"
      >
        {timeSignatures.map((signature) => (
          <option key={signature.label} value={signature.label}>
            {signature.label}
          </option>
        ))}
      </select>
    </div>
  );
}
