import React, { useEffect, useRef, useState, useContext } from "react";
import { Howl } from "howler";
import SoundControls from "./soundcontrols";
import { TileContext } from "../logic/tilecontext";

interface RhythmPlayerProps {
  setPattern: React.Dispatch<React.SetStateAction<any[][]>>;
  bpm: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const SoundPlayer: React.FC<RhythmPlayerProps> = ({
  setPattern,
  bpm,
  setCurrentStep,
}) => {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tileContext = useContext(TileContext);

  if (tileContext === undefined) {
    return (
      <div>
        <p>something unexpected has happened.</p>
      </div>
    );
  }

  useEffect(() => {
    const sounds = tileContext.rows.map((row) => new Howl({ src: [row.soundPath] }));

    if (isPlaying) {
      const interval = 60 / bpm / 4; // Calculate interval for 16th notes
      let i = 0;

      const playStep = () => {
        tileContext.pattern.forEach((row, rowIndex) => {
          if (row[tileContext.currentPlayingTile] && sounds) {
            sounds[rowIndex]?.play();
          }
        });
        tileContext.currentPlayingTile = (tileContext.currentPlayingTile + 1) % tileContext.pattern[0].length;
        setCurrentStep(tileContext.currentPlayingTile);
        console.log(i++);
        if (i % 80 == 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(playStep, interval * 1000);
        }
      };

      intervalRef.current = setInterval(playStep, interval * 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isPlaying, tileContext.pattern, bpm]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleStopClick = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleResetClick = () => {
    setIsPlaying(false);
    setPattern(
      Array(6)
        .fill(0)
        .map(() => Array(tileContext.tileCount).fill(false))
    );
    setCurrentStep(-1);
  };

  return (
    <SoundControls
      isPlaying={isPlaying}
      handlePlayClick={handlePlayClick}
      handleStopClick={handleStopClick}
      handleResetClick={handleResetClick}
    />
  );
};

export default SoundPlayer;
