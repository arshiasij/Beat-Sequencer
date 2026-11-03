"use client";
import { useState, useContext } from "react";
import { TileContext } from "../logic/tilecontext";
import { GroupEdges } from "../logic/timesignatures";

interface TileProps {
  index: number;
}

export default function Tile({
  index,
}: TileProps) {


  const tileContext = useContext(TileContext);

  if (tileContext === undefined) {
    return (
      <div>
        <p>something unexpected has happened.</p>
      </div>
    );
  }

  const color = tileContext.rows[tileContext.rowIndex].color;
  const edges = GroupEdges(tileContext.groups, index);

  return (
    <button
      className={`block h-full w-full border-gray-900 min-w-6 flex-grow aspect-square border 
      ${
        tileContext?.pattern[tileContext.rowIndex][index] && (tileContext.currentPlayingTile == index)
          ? `${color} brightness-50`
          : tileContext.currentPlayingTile == index
          ? "bg-gray-500"
          : tileContext.pattern[tileContext.rowIndex][index]
          ? `${color}`
          : "bg-[#3A3F44]"
      }
      ${
        edges.first ? "rounded-l-2xl ml-2" : ""
      }
      ${
        edges.last ? "rounded-r-2xl mr-2" : ""
      }
      `}
      onClick={() => tileContext.TileClickHandler(tileContext.rowIndex, index)}
    />
  );
}
