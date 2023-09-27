"use client";

import { Dispatch, SetStateAction } from "react";
import { ForceSilderPercentageSetEvent } from "../info_silder/info_silder_frame";
import { ForceLocationEvent } from "./map_frame";
import { CircleData, PersonalData } from "@/app/data/personal_circle_data";

export interface CircleOptions {
  _id: string;
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
  _id: string;
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
  personalData: PersonalData;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
  fireForceLocationEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
  fireForceSilderPercentageSetEvent: Dispatch<
    SetStateAction<ForceSilderPercentageSetEvent>
  >;
}

export default function CircleDisplay(opts: CircleDisplayOptions) {
  const data: CircleData | undefined =
    opts.personalData.circleDataList[opts._id];
  const favorite = data?.favorite ?? false;
  const flag = data?.flag ?? 0;

  return (
    <button
      style={{
        position: "absolute",
        top: opts.yPos,
        left: opts.xPos,
        backgroundColor:
          (flag > 0 && `rgb(var(--flag${flag}-color)`) ||
          (favorite &&
            opts.hovering &&
            "rgb(var(--circle-favorite-hovering-color))") ||
          (favorite && "rgb(var(--circle-favorite-color))") ||
          (opts.hovering && "rgba(var(--circle-hovering-color))") ||
          "transparent",
        width: opts.width,
        height: opts.height,
        boxShadow: opts.selected
          ? "0 0px 15px 10px rgba(var(--circle-selected-shadow-color))"
          : "none",
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
