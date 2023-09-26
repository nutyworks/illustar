"use client";

import { Dispatch, SetStateAction } from "react";
import { ForceSilderPercentageSetEvent } from "../info_silder/info_silder_frame";
import { ForceLocationEvent } from "./map_frame";

export interface CircleOptions {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  loc: string;
  name: string;
  repr: string | undefined;
  urls: string[];
  days: number[];
  tags: string | undefined;
}

interface CircleDisplayOptions {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  loc: string;
  name: string;
  repr: string | undefined;
  urls: string[];
  days: number[];
  tags: string | undefined;
  hovering: boolean;
  selected: boolean;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
  fireForceLocationEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
  fireForceSilderPercentageSetEvent: Dispatch<
    SetStateAction<ForceSilderPercentageSetEvent>
  >;
}

export default function CircleDisplay(opts: CircleDisplayOptions) {
  return (
    <button
      style={{
        position: "absolute",
        top: opts.yPos,
        left: opts.xPos,
        backgroundColor:
          (opts.selected && "rgba(var(--circle-selected-color))") ||
          (opts.hovering && "rgba(var(--circle-hovering-color))") ||
          "transparent",
        width: opts.width,
        height: opts.height,
      }}
      onClick={(e) => {
        opts.setSelectedLoc(opts.loc);
        opts.fireForceLocationEvent(new ForceLocationEvent(opts.loc));
        opts.fireForceSilderPercentageSetEvent(
          new ForceSilderPercentageSetEvent(0.5)
        );
        e.stopPropagation();
      }}
    ></button>
  );
}
