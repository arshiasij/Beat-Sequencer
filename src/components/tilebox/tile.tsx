"use client";
import { useState } from "react";

interface TileProps {
  index: number;
  selected: boolean;
  TileClickHandler: (rowIndex: number, index: number ) => void;
  currentPlayingTile: number;
  rowIndex: number;
}

export default function Tile({
  index,
  selected,
  TileClickHandler,
  currentPlayingTile,
  rowIndex
}: TileProps) {
  return (
    <button
      className={`block h-full w-full border-gray-900 min-w-10 flex-grow aspect-square border
      ${
        selected && currentPlayingTile == index
          ? "bg-green-700"
          : currentPlayingTile == index
          ? "bg-gray-500"
          : selected
          ? "bg-lime-500"
          : "bg-[#3A3F44]"
      }
      ${
        (index % 4 == 0) ? "rounded-l-2xl" : ""
      }
      ${
        (index % 4 == 3) ? "rounded-r-2xl" : ""
      }
      `}
      onClick={() => TileClickHandler(rowIndex, index)}
    />
  );
}
