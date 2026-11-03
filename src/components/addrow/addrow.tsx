import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import ColorWheel from "./colorwheel";
import { TileContext } from "../logic/tilecontext";

interface AddRowProps {
  setPattern: React.Dispatch<React.SetStateAction<any[][]>>
  instrumentsList: {
    instrumentName: string;
    soundPath: string;
}[]
  setRows: React.Dispatch<React.SetStateAction<{
    instrumentName: string;
    soundPath: string;
    color: string;
}[]>>
}

export default function AddRow({ setPattern, instrumentsList, setRows }: AddRowProps) {
  const [addActive, setAddActive] = useState(false);
  const [instrumentActive, setInstrumentActive] = useState(false);
  const [colorActive, setColorActive] = useState(false);
  const instrumentMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);


  const [color, setColor] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<string>("");

  const addRowContext = useContext(TileContext);

  function HandleMenuClicks(
    active: boolean,
    setActive: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setActive(!active);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (instrumentMenuRef.current && !instrumentMenuRef.current.contains(event.target as Node)) {
      setInstrumentActive(false);
    };
     if (colorMenuRef.current && !colorMenuRef.current.contains(event.target as Node)) {
      setColorActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (addRowContext === undefined) {
    return (
      <div>
        <p>something unexpected has happened.</p>
      </div>
    );
  }

  const pattern = addRowContext.pattern;
  const rows = addRowContext.rows;

  // An instrument is used if a row already plays it
  function IsUsed(instrumentName: string) {
    return rows.some(row => row.instrumentName == instrumentName);
  }

  const firstVisibleIndex = instrumentsList.findIndex(instrument => !IsUsed(instrument.instrumentName));

  function AddRowHandler(selectedInstrument: string, color: string) {
    const instrument = instrumentsList.find(instrument => instrument.instrumentName == selectedInstrument);
    if (!instrument || IsUsed(selectedInstrument) || color === "") return;

    const newRows = [...rows, {instrumentName: selectedInstrument, soundPath: instrument.soundPath, color: `bg-[${color}]`}]
    const newPattern = [...pattern, Array(addRowContext!.tileCount).fill(false)]
    setAddActive(false);
    setRows(newRows);
    setPattern(newPattern);
    setColor("");
    setSelectedInstrument("");
  }


  return (
    <div className="flex items-stretch pt-10">
      <button
        className={`flex justify-center items-center ${
          addActive ? "bg-gray-800" : "bg-gray-700"
        } py-5 rounded-2xl min-w-[6%] max-w-[6%]`}
        onClick={() => HandleMenuClicks(addActive, setAddActive)}
      >
        <p>add</p>
      </button>
      <div
        className={`${
          addActive ? "" : "hidden"
        } bg-gray-700 rounded-2xl flex w-full justify-between items-center mx-2 py-5 px-10`}
      >
        <div className="h-full relative" ref={instrumentMenuRef}>
          <button
            className="h-full"
            onClick={() =>
              HandleMenuClicks(instrumentActive, setInstrumentActive)
            }
          >
            <p className="font-semibold">instrument{`${selectedInstrument ? ": " : ""}${selectedInstrument}`}</p>
          </button>
          <div className={`${instrumentActive ? "" : "hidden"}`}>
            <ul className="absolute top-8 bg-gray-800 border border-white rounded-2xl text-center">
              {instrumentsList.map((instrument, index) => (
                <li
                  className={`${
                    IsUsed(instrument.instrumentName) ? "hidden" : ""
                  } py-3 px-5 border border-x-0 border-b-0 ${
                    index == firstVisibleIndex ? "border-y-0" : "border-t-gray-600"
                  }`}
                  key={index}
                >
                  <button onClick={() => (setSelectedInstrument(instrument.instrumentName))}>{instrument.instrumentName}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-full relative flex flex-col items-center" ref={colorMenuRef}>
          <button
            className="h-full"
            onClick={() => HandleMenuClicks(colorActive, setColorActive)}
          >
            <p className={`${(color === "") ? "bg-gray-800" : `bg-[${color}]`} px-8 py-4 rounded-xl font-semibold`}>Color</p>
          </button>
          <div className={`${colorActive ? "" : "hidden"} absolute top-8`}>
            <ColorWheel color={color} setColor={setColor} />
          </div>
        </div>

        <button
          className="h-full disabled:opacity-40"
          disabled={selectedInstrument === "" || color === ""}
          onClick={() => AddRowHandler(selectedInstrument, color)}
        >
          <p className="font-semibold">add</p>
          </button>
      </div>
    </div>
  );
}
