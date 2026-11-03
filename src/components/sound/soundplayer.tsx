import React, { useEffect, useRef, useState, useContext } from "react";
import { Howl } from "howler";
import SoundControls from "./soundcontrols";
import { TileContext } from "../logic/tilecontext";

interface RhythmPlayerProps {
  setPattern: React.Dispatch<React.SetStateAction<any[][]>>;
  bpm: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isTriplet: boolean;
}

const SoundPlayer: React.FC<RhythmPlayerProps> = ({
  setPattern,
  bpm,
  setCurrentStep,
  isTriplet,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundsRef = useRef<Howl[]>([]);

  const tileContext = useContext(TileContext);

  // Initialize sounds once and store them in ref
  useEffect(() => {
    if (tileContext === undefined) return;
    soundsRef.current = tileContext.rows.map(
      (row) => new Howl({ src: [row.soundPath], preload: true })
    );
  }, [tileContext?.rows]);

  const interval = (60 / bpm) * 1000 / (isTriplet ? 6 : 4); // Calculate interval for 16th notes or 16th-note triplets

  useEffect(() => {
    if (tileContext === undefined) return;
    if (isPlaying) {
      const playStep = () => {
        tileContext.pattern.forEach((row, rowIndex) => {
          if (row[tileContext.currentPlayingTile] && soundsRef.current[rowIndex]) {
            soundsRef.current[rowIndex]?.play();
          }
        });

        tileContext.currentPlayingTile =
          (tileContext.currentPlayingTile + 1) % tileContext.pattern[0].length;
        setCurrentStep(tileContext.currentPlayingTile);
      };

      intervalRef.current = setInterval(playStep, interval);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isPlaying, bpm, isTriplet]);

  if (tileContext === undefined) {
    return (
      <div>
        <p>something unexpected has happened.</p>
      </div>
    );
  }

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
      Array(tileContext.rows.length)
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
