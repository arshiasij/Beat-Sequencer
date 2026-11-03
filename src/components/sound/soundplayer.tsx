import React, { useEffect, useRef, useState, useContext } from "react";
import SoundControls from "./soundcontrols";
import { TileContext } from "../logic/tilecontext";
import {
  GetAudioContext,
  GetLoadedSample,
  LoadSample,
  PlaySample,
  StartTicker,
} from "./audioengine";

interface RhythmPlayerProps {
  setPattern: React.Dispatch<React.SetStateAction<any[][]>>;
  bpm: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isTriplet: boolean;
}

// How far ahead (seconds) notes are scheduled on the audio clock, and how often (ms) the
// scheduler wakes up to top that window up. The window has to outlast any main-thread stall.
const LOOKAHEAD_SECONDS = 0.1;
const TICK_MS = 25;

const SoundPlayer: React.FC<RhythmPlayerProps> = ({
  setPattern,
  bpm,
  setCurrentStep,
  isTriplet,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const tileContext = useContext(TileContext);

  // The scheduler runs outside React renders, so it reads the latest values through refs.
  // That way tile toggles, new rows and tempo changes apply on the next step without a restart.
  const patternRef = useRef<boolean[][]>([]);
  const rowsRef = useRef<{ soundPath: string }[]>([]);
  const stepDurationRef = useRef(0);
  patternRef.current = tileContext?.pattern ?? [];
  rowsRef.current = tileContext?.rows ?? [];
  stepDurationRef.current = 60 / bpm / (isTriplet ? 6 : 4); // 16th notes or 16th-note triplets

  // Decode each row's sample once (cached by path in the audio engine)
  useEffect(() => {
    tileContext?.rows.forEach((row) => LoadSample(row.soundPath));
  }, [tileContext?.rows]);

  useEffect(() => {
    if (tileContext === undefined || !isPlaying) return;

    const ctx = GetAudioContext();
    ctx.resume();

    const tileCount = tileContext.tileCount;
    let step = (tileContext.currentPlayingTile + 1) % tileCount; // resume after the last shown step
    let nextStepTime = ctx.currentTime + 0.05;
    const stepQueue: { step: number; time: number }[] = [];
    const scheduled: { source: AudioBufferSourceNode; time: number }[] = [];
    let frame = 0;

    const ScheduleSteps = () => {
      // If we fell behind (e.g. the context was suspended), skip missed steps instead of
      // firing them all at once, so we stay on the grid
      while (nextStepTime < ctx.currentTime) {
        nextStepTime += stepDurationRef.current;
        step = (step + 1) % tileCount;
      }

      while (nextStepTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
        patternRef.current.forEach((row, rowIndex) => {
          const sample = rowsRef.current[rowIndex] && GetLoadedSample(rowsRef.current[rowIndex].soundPath);
          if (row[step] && sample) {
            scheduled.push({ source: PlaySample(sample, nextStepTime), time: nextStepTime });
          }
        });
        stepQueue.push({ step, time: nextStepTime });
        nextStepTime += stepDurationRef.current;
        step = (step + 1) % tileCount;
      }

      // Forget sources that have already started
      while (scheduled.length && scheduled[0].time <= ctx.currentTime) scheduled.shift();
    };

    // Move the playhead in sync with what is actually being heard
    const DrawPlayhead = () => {
      let current = -1;
      while (stepQueue.length && stepQueue[0].time <= ctx.currentTime) {
        current = stepQueue.shift()!.step;
      }
      if (current !== -1) setCurrentStep(current);
      frame = requestAnimationFrame(DrawPlayhead);
    };

    ScheduleSteps();
    const stopTicker = StartTicker(ScheduleSteps, TICK_MS);
    frame = requestAnimationFrame(DrawPlayhead);

    return () => {
      stopTicker();
      cancelAnimationFrame(frame);
      // Silence notes that were queued in the lookahead window but haven't started yet
      scheduled.forEach(({ source, time }) => {
        if (time > ctx.currentTime) source.stop();
      });
    };
    // Only play/pause should restart the scheduler; everything else is read live through refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

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
