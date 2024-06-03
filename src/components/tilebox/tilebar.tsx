import Tile from "./tile";

interface TileBarProps {
  tileCount: number;
  barTileCount: number;
  selected: boolean[];
  barindex: number;
  TileClickHandler: (rowIndex: number, index: number) => void;
  currentPlayingTile: number;
  rowIndex: number;
}

export default function TileBar({
  tileCount,
  barTileCount,
  selected,
  barindex,
  TileClickHandler,
  currentPlayingTile,
  rowIndex,
}: TileBarProps) {
  return (
    <div className="flex px-2 w-full">
      {Array(barTileCount).fill(false).map((_, index) => (
        <Tile
          key={index}
          selected={selected[4 * barindex + index]}
          TileClickHandler={TileClickHandler}
          index={4 * barindex + index}
          currentPlayingTile={currentPlayingTile}
          rowIndex={rowIndex}
        />
      ))}
    </div>
  );
}
