"use client";
import { JSXElementConstructor, useState, createContext } from "react";
import Tile from "./tile";
import RhythmPlayer from "../sound/soundplayer";
import Row from "./row";
import AddRow from "../addrow/addrow";
import { TileContext } from "../logic/tilecontext";
import { defaultTimeSignature, StepCount, TimeSignature } from "../logic/timesignatures";
import TempoControl from "../controls/tempocontrol";
import TimeSignatureSelect from "../controls/timesignatureselect";

const instrumentsList = [
  {
    instrumentName: "kick",
    soundPath: "/assets/sounds/kicksound.wav",
  },
  {
    instrumentName: "snare",
    soundPath: "/assets/sounds/snaresound.wav",
  },
  {
    instrumentName: "hihat",
    soundPath: "/assets/sounds/hihatsound.wav",
  },
  {
    instrumentName: "openhat",
    soundPath: "/assets/sounds/openhatsound.wav",
  },
  {
    instrumentName: "clap",
    soundPath: "/assets/sounds/clapsound.wav",
  },
  {
    instrumentName: "tom",
    soundPath: "/assets/sounds/tomsound.wav",
  },
];

export default function RowContainer() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState(defaultTimeSignature);
  const tileCount = StepCount(timeSignature.groups);

  const [selected, setSelected] = useState(
    Array(3)
      .fill(0)
      .map(() => Array(tileCount).fill(false))
  );

  // Keep every row as long as the bar: notes that still fit are kept, new steps start empty
  function TimeSignatureChangeHandler(next: TimeSignature) {
    const nextCount = StepCount(next.groups);
    setTimeSignature(next);
    setSelected((prev) =>
      prev.map((row) => Array.from({ length: nextCount }, (_, step) => row[step] ?? false))
    );
    setCurrentStep((step) => (step >= nextCount ? step % nextCount : step));
  }

  function TileClickHandler(rowIndex: number, colIndex: number) {
    setSelected((prev) =>
      prev.map((row, r) =>
        r === rowIndex ? row.map((on, c) => (c === colIndex ? !on : on)) : row
      )
    );
  }


  const [rows, setRows] = useState([
    {
      instrumentName: "kick",
      soundPath: "/assets/sounds/kicksound.wav",
      color: "bg-green-700",
    },
    {
      instrumentName: "snare",
      soundPath: "/assets/sounds/snaresound.wav",
      color: "bg-red-700",
    },
    {
      instrumentName: "hihat",
      soundPath: "/assets/sounds/hihatsound.wav",
      color: "bg-blue-700",
    },
  ]);

  return (
    <TileContext.Provider
      value={{
        rowIndex: 0,
        rows: rows,
        pattern: selected,
        TileClickHandler: TileClickHandler,
        currentPlayingTile: currentStep,
        tileCount: tileCount,
        groups: timeSignature.groups,
      }}
    >
      <div>
        <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-5 rounded-2xl bg-gray-700 px-6 py-5">
          <TempoControl bpm={bpm} setBpm={setBpm} />
          <TimeSignatureSelect value={timeSignature} onChange={TimeSignatureChangeHandler} />
        </div>
        {rows.map((row, rowIndex) => (
          <Row key={rowIndex} rowIndex={rowIndex} />
        ))}
        {rows.length == 6 ? (
          ""
        ) : (
          <AddRow
            instrumentsList={instrumentsList}
            setRows={setRows}
            setPattern={setSelected}
          />
        )}
        <RhythmPlayer
          bpm={bpm}
          setPattern={setSelected}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </TileContext.Provider>
  );
}
