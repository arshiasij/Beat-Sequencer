import RhythmPlayer from "./soundplayer";
import PlayIconLg from "../../../public/assets/icons/play-icon-large";
import PauseIconLg from "../../../public/assets/icons/pause-icon-large";
import ResetIconLg from "../../../public/assets/icons/reset-svgrepo-com";

interface SoundControlProps {
  isPlaying: boolean;
  handleStopClick: () => void;
  handlePlayClick: () => void;
  handleResetClick: () => void;
}

export default function SoundControls( { isPlaying, handleStopClick, handlePlayClick, handleResetClick}: SoundControlProps) {
  return (
    <div className="flex w-full justify-around">
      {" "}
      {isPlaying ? (
        <button onClick={handleStopClick} disabled={!isPlaying} className="block">
          <PauseIconLg IconColor="#FFF" />
        </button>
      ) : (
        <button onClick={handlePlayClick} disabled={isPlaying} className="block">
          <PlayIconLg IconColor="#FFF" />
        </button>
      )}{" "}
      <button onClick={handleResetClick} className="block">
        <ResetIconLg IconColor="#FFF" />
        </button>
    </div>
  );
}
