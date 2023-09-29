"use client";

import { Dispatch, SetStateAction } from "react";
import { ForceSilderPercentageSetEvent } from "../info_silder/info_silder_frame";
import { ForceLocationEvent as ForceCircleSetEvent } from "./map_frame";
import { CircleData, PersonalData } from "@/app/data/personal_circle_data";

export interface CircleOptions {
  _id: string;
  pos: { x: number; y: number; w: number; h: number }[];
  loc: string[];
  name: string;
  repr: { name: string; link: string }[];
  info_links: { name: string; link: string }[];
  preorder_links: { name: string; link: string }[];
  netorder_links: { name: string; link: string }[];
  etc_links: { name: string; link: string }[];
  days: number[];
  genre_tags: string | undefined;
  character_tags: string | undefined;
  type_tags: string | undefined;
}

interface CircleDisplayOptions {
  _id: string;
  pos: { x: number; y: number; w: number; h: number };
  hovering: boolean;
  selected: boolean;
  personalData: PersonalData;
  setSelectedCircleId: Dispatch<SetStateAction<string | null>>;
  fireForceCircleSetEvent: Dispatch<SetStateAction<ForceCircleSetEvent>>;
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
        top: opts.pos.y,
        left: opts.pos.x,
        backgroundColor:
          (flag > 0 && `rgb(var(--flag${flag}-color)`) ||
          (favorite && "rgb(var(--circle-favorite-color))") ||
          "rgb(var(--circle-default-color))",
        width: opts.pos.w,
        height: opts.pos.h,
        boxShadow: opts.selected
          ? "0 0px 15px 10px rgba(var(--circle-selected-shadow-color))"
          : "none",
        filter: opts.hovering ? "brightness(150%)" : "",
      }}
      onClick={(e) => {
        opts.setSelectedCircleId(opts._id);
        opts.fireForceCircleSetEvent(new ForceCircleSetEvent(opts._id));
        opts.fireForceSilderPercentageSetEvent(
          new ForceSilderPercentageSetEvent(0.5)
        );
        e.stopPropagation();
      }}
    ></button>
  );
}
