import { useState } from "react";
import { CirclePicker, ColorResult } from "react-color";

interface ColorWheelProps {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function ColorWheel({ color, setColor }: ColorWheelProps ) {
  

  const HandleColorChange = (color: ColorResult) => {
    setColor(color.hex);
    console.log("aaaaaaaaaaaaaaaaaaaaaaa")
  };

  return (
    <div className="bg-gray-800 flex flex-col items-center p-4 rounded-2xl border border-white">
      <h2 className="text-xl mb-4">Select a Color</h2>
      <CirclePicker color={color} onChangeComplete={HandleColorChange} />
      <div
        className={`mt-4 p-4 border rounded ${( color === "#fff" ) ? "text-black" : ""}`}
        style={{ backgroundColor: color }}
      >
        Selected Color: {color}
      </div>
    </div>
  );
}
