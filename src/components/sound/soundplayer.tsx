import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import SoundControls from "./soundcontrols";

interface RhythmPlayerProps {
  tileCount: number;
  pattern: boolean[][];
  setPattern: React.Dispatch<React.SetStateAction<any[][]>>;
  soundPaths: { soundPath: string }[];
  bpm: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const SoundPlayer: React.FC<RhythmPlayerProps> = ({
  tileCount,
  pattern,
  setPattern,
  soundPaths,
  bpm,
  currentStep,
  setCurrentStep,
}) => {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sounds = soundPaths.map((row) => new Howl({ src: [row.soundPath] }));

    if (isPlaying) {
      const interval = 60 / bpm / 4; // Calculate interval for 16th notes
      let i = 0;

      const playStep = () => {
        pattern.forEach((row, rowIndex) => {
          if (row[currentStep] && sounds) {
            sounds[rowIndex]?.play();
          }
        });
        currentStep = (currentStep + 1) % pattern[0].length;
        setCurrentStep(currentStep);
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
  }, [isPlaying, pattern, bpm]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleStopClick = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleResetClick = () => {
    setPattern(
      Array(6)
        .fill(0)
        .map(() => Array(tileCount).fill(false))
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
