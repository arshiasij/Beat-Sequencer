import { createContext, useContext } from "react";

interface TileContextType {
  rowIndex: number;
  rows: {
    instrumentName: string;
    soundPath: string;
    color: string;
  }[];
  pattern: boolean[][];
  TileClickHandler: (rowIndex: number, colIndex: number) => void;
  currentPlayingTile: number;
  tileCount: number;
  barTileCount: number;
}

export const TileContext = createContext<TileContextType | undefined>(
  undefined
);
