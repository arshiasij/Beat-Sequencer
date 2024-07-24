"use client";
import { JSXElementConstructor, useState, createContext } from "react";
import Tile from "./tile";
import RhythmPlayer from "../sound/soundplayer";
import Row from "./row";
import { Howl } from "howler";
import AddRow from "../addrow/addrow";
import { TileContext } from "../logic/tilecontext";

interface TileContainerProps {
  tileCount: number;
}

export default function RowContainer({ tileCount }: TileContainerProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [barTileCount, setBarTileCount] = useState(4);

  const [selected, setSelected] = useState(
    Array(3)
      .fill(0)
      .map(() => Array(tileCount).fill(false))
  );

  function TileClickHandler(rowIndex: number, colIndex: number) {
    const newSelected = [...selected];
    newSelected[rowIndex][colIndex] = !newSelected[rowIndex][colIndex];
    setSelected(newSelected);
    console.log(selected);
  }


  const instrumentsList = [
    {
      instrumentName: "kick",
      soundPath: "/assets/sounds/kicksound.wav",
      Used: true,
    },
    {
      instrumentName: "snare",
      soundPath: "/assets/sounds/snaresound.wav",
      Used: true,
    },
    {
      instrumentName: "hihat",
      soundPath: "/assets/sounds/hihatsound.wav",
      Used: true,
    },
    {
      instrumentName: "openhat",
      soundPath: "/assets/sounds/openhatsound.wav",
      Used: false,
    },
    {
      instrumentName: "clap",
      soundPath: "/assets/sounds/clapsound.wav",
      Used: false,
    },
    {
      instrumentName: "tom",
      soundPath: "/assets/sounds/tomsound.wav",
      Used: false,
    },
  ];

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
          bpm={120}
          setPattern={setSelected}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </TileContext.Provider>
  );
}
