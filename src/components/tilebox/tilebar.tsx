import Tile from "./tile";

interface TileBarProps {
  tileCount: number;
  barTileCount: number;
  selected: boolean[];
  barindex: number;
  TileClickHandler: (rowIndex: number, index: number) => void;
  currentPlayingTile: number;
  rowIndex: number;
  rowColor: string;
}

export default function TileBar({
  tileCount,
  barTileCount,
  selected,
  barindex,
  TileClickHandler,
  currentPlayingTile,
  rowIndex,
  rowColor,
}: TileBarProps) {
  return (
    <div className="flex px-2 w-full">
      {Array(barTileCount).fill(false).map((_, index) => (
        <Tile
          key={index}
          index={4 * barindex + index}
        />
      ))}
    </div>
  );
}
