"use client";
import { JSXElementConstructor, useState, createContext } from "react";
import Tile from "./tile";
import RhythmPlayer from "../sound/soundplayer";
import Row from "./row";
import AddRow from "../addrow/addrow";
import { TileContext } from "../logic/tilecontext";

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

interface TileContainerProps {
  tileCount: number;
}

export default function RowContainer({ tileCount }: TileContainerProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [barTileCount, setBarTileCount] = useState(4);
  const [bpm, setBpm] = useState(120);
  const [isTriplet, setIsTriplet] = useState(false);

  const [selected, setSelected] = useState(
    Array(3)
      .fill(0)
      .map(() => Array(tileCount).fill(false))
  );

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
        barTileCount: barTileCount,
      }}
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <label className="text-white">
              BPM:
              <input
                type="number"
                min="40"
                max="300"
                value={bpm}
                onChange={(e) => setBpm(Math.max(40, Math.min(300, parseInt(e.target.value) || 120)))}
                className="ml-2 bg-gray-700 text-white px-2 py-1 rounded w-20"
              />
            </label>
            
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={isTriplet}
                onChange={(e) => setIsTriplet(e.target.checked)}
                className="w-4 h-4"
              />
              Triplet Mode
            </label>
          </div>
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
          isTriplet={isTriplet}
        />
      </div>
    </TileContext.Provider>
  );
}
