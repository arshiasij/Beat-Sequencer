import { error } from "console";
import { TileContext } from "../logic/tilecontext";
import Tile from "./tile";
import { useContext } from "react";

interface RowProps {
  rowIndex: number;
}

export default function Row({
  rowIndex,
}: RowProps) {

  const tileContext = useContext(TileContext);

  if (tileContext === undefined) {
    return (
      <div>
        <p>something unexpected has happened.</p>
      </div>
    );
  }
  

  const barsCount = Math.floor(tileContext.tileCount / tileContext.barTileCount);

  
  return (
    <TileContext.Provider value={{...tileContext, rowIndex: rowIndex}}>
    <div className="flex flex-row pt-10 w-full items-stretch">
      <div className="flex justify-center items-center bg-gray-700 py-5 rounded-2xl min-w-[6%] max-w-[6%]">
        <p className="text-nowrap ">
          {tileContext.rows[rowIndex].instrumentName}
        </p>
      </div>
      {Array.from({ length: tileContext.tileCount }).map((_,index) => (
        <Tile
        index={index}
          key={index}/>
      ))}
    </div>
    </TileContext.Provider>
  );
}
