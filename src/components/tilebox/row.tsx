import Tile from "./tile";
import TileBar from "./tilebar";

interface RowProps {
  tileCount: number;
  barTileCount: number;
  selected: boolean[];
  TileClickHandler: (rowIndex: number, index: number) => void;
  currentStep: number;
  rowIndex: number;
}

export default function Row({
  tileCount,
  barTileCount,
  selected,
  TileClickHandler,
  currentStep,
  rowIndex,
}: RowProps) {


  const barsCount = Math.floor(tileCount / barTileCount);

  
  return (
    <div className="flex flex-row pt-10 w-full">
      {Array.from({ length: barsCount }).map((_,index) => (
        <TileBar
          tileCount={tileCount}
          key={index}
          selected={selected}
          TileClickHandler={TileClickHandler}
          barindex={index}
          currentPlayingTile={currentStep}
          rowIndex={rowIndex}
          barTileCount={barTileCount}
        />
      ))}
    </div>
  );
}
