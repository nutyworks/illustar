"use client";

export interface CircleOptions {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  id: string;
  name: string;
  repr: string;
  urls: string[];
  days: number[];
}

interface CircleDisplayOptions {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  id: string;
  name: string;
  repr: string;
  urls: string[];
  days: number[];
  hovering: boolean;
  selected: boolean;
}

export default function CirleDisplay(opts: CircleDisplayOptions) {
  return (
    <button
      style={{
        position: "absolute",
        top: opts.yPos,
        left: opts.xPos,
        backgroundColor:
          (opts.hovering && "rgba(var(--circle-hovering-color))") || "",
        width: opts.width,
        height: opts.height,
      }}
      onClick={() => alert("You clicked " + opts.id)}
    ></button>
  );
}
