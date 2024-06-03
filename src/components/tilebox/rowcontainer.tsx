"use client";
import { useState } from "react";
import Tile from "./tile";
import RhythmPlayer from "../sound/soundplayer";
import Row from "./row";
import { Howl } from "howler";

interface TileContainerProps {
  tileCount: number;
}

export default function RowContainer({ tileCount }: TileContainerProps) {

  function TileClickHandler(rowIndex: number, colIndex: number) {
    const newSelected = [...selected];
    newSelected[rowIndex][colIndex] = !newSelected[rowIndex][colIndex];
    setSelected(newSelected);
    console.log(colIndex);
  }

  const [currentStep, setCurrentStep] = useState(-1);
  const [barTileCount, setBarTileCount] = useState(4);


  const [selected, setSelected] = useState(
    Array(6)
      .fill(0)
      .map(() => Array(tileCount).fill(false))
  );

  const soundPaths = [
    { soundPath: "/assets/sounds/kicksound.wav" },
    { soundPath: "/assets/sounds/snaresound.wav" },
    { soundPath: "/assets/sounds/hihatsound.wav" },
    { soundPath: "/assets/sounds/openhatsound.wav" },
    { soundPath: "/assets/sounds/clapsound.wav" },
    { soundPath: "/assets/sounds/tomsound.wav" },
  ];

  return (
    <div>
      {[0, 1, 2, 3, 4, 5].map((rowIndex) => (
        <Row
          barTileCount={barTileCount}
          key={rowIndex}
          selected={selected[rowIndex]}
          TileClickHandler={TileClickHandler}
          currentStep={currentStep}
          rowIndex={rowIndex}
          tileCount={tileCount}
        />
      ))}

      <RhythmPlayer
        tileCount={tileCount}
        bpm={120}
        pattern={selected}
        setPattern={setSelected}
        soundPaths={soundPaths}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </div>
  );
}
