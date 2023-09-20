"use client";

export interface CircleOptions {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  id: string;
  name: string;
  urls: string[];
  days: number[];
}

export default function CirleDisplay(opts: CircleOptions) {
  return (
    <button
      style={{
        position: "absolute",
        top: opts.yPos,
        left: opts.xPos,
        backgroundColor: "rgb(var(--default-circle-color))",
        borderRadius: 2,
        width: opts.width,
        height: opts.height,
      }}
      onClick={() => alert("You clicked " + opts.id)}
    ></button>
  );
}
