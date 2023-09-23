"use client";

import { Dispatch, SetStateAction } from "react";

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
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
}

export default function CirleDisplay(opts: CircleDisplayOptions) {
  return (
    <button
      style={{
        position: "absolute",
        top: opts.yPos,
        left: opts.xPos,
        backgroundColor:
          (opts.selected && "rgba(var(--circle-selected-color))") ||
          (opts.hovering && "rgba(var(--circle-hovering-color))") ||
          "",
        width: opts.width,
        height: opts.height,
      }}
      onClick={() => opts.setSelectedLoc(opts.id)}
    ></button>
  );
}
