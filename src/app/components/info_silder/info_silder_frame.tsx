"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { CircleOptions } from "../map/circle_display";
import InfoSilderContainer from "./info_slider_container";
import useWindowDimensions from "@/app/utils/get_window_dimensions";
import { PersonalData } from "@/app/data/personal_circle_data";

interface InfoSilderFrameOptions {
  circle: CircleOptions | undefined;
  personalData: PersonalData;
  setPersonalData: Dispatch<SetStateAction<PersonalData>>;
  forceSilderPercentageSetEvent: ForceSilderPercentageSetEvent;
  silderPercentage: number;
  setSilderPercentage: Dispatch<SetStateAction<number>>;
}

export class ForceSilderPercentageSetEvent {
  used: boolean;
  percentage: number;

  constructor(percentage: number) {
    this.used = false;
    this.percentage = percentage;
  }
}

export default function InfoSilderFrame({
  circle,
  personalData,
  setPersonalData,
  forceSilderPercentageSetEvent,
  silderPercentage,
  setSilderPercentage,
}: InfoSilderFrameOptions) {
  let { width, height } = useWindowDimensions();
  const isSidebar = width >= 800;
  const [touchY, setTouchY] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const setSilderPercentageForce = (newPercentage: number) => {
    const transitionFrames = 6;
    for (let i = 1; i <= transitionFrames; i++) {
      setTimeout(() => {
        setSilderPercentage(
          silderPercentage +
            ((newPercentage - silderPercentage) / transitionFrames) * i
        );
      }, i * 16.666666);
    }
  };
  const mouseDownHandler = (e: React.MouseEvent) => {
    setDragging(true);
    setTouchY(e.clientY);
  };
  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPercentage =
      silderPercentage + (e.clientY - touchY) / (height - 100);
    setSilderPercentage(Math.max(0, Math.min(newPercentage, 1)));
    setTouchY(e.clientY);
    e.stopPropagation();
  };
  const mouseUpHandler = (e: React.MouseEvent) => {
    const diff1 = Math.abs(silderPercentage);
    const diff2 = Math.abs(0.5 - silderPercentage);
    const diff3 = Math.abs(1 - silderPercentage);

    let newPercentage = 0;

    if (diff1 < diff2 && diff1 < diff3) newPercentage = 0;
    else if (diff3 < diff1 && diff3 < diff2) newPercentage = 1;
    else newPercentage = 0.5;

    setSilderPercentageForce(newPercentage);
    setDragging(false);
    e.stopPropagation();
  };
  const touchStartHandler = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    setTouchY(e.touches[0].clientY);
    e.stopPropagation();
  };
  const touchMoveHandler = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    const newPercentage =
      silderPercentage + (e.touches[0].clientY - touchY) / (height - 100);
    setSilderPercentage(Math.max(0, Math.min(newPercentage, 1)));
    setTouchY(e.touches[0].clientY);
    e.stopPropagation();
  };
  const touchEndHandler = (e: React.TouchEvent) => {
    const diff1 = Math.abs(silderPercentage);
    const diff2 = Math.abs(0.5 - silderPercentage);
    const diff3 = Math.abs(1 - silderPercentage);

    let newPercentage = 0;

    if (diff1 < diff2 && diff1 < diff3) newPercentage = 0;
    else if (diff3 < diff1 && diff3 < diff2) newPercentage = 1;
    else newPercentage = 0.5;

    setSilderPercentageForce(newPercentage);
    e.stopPropagation();
  };

  if (!forceSilderPercentageSetEvent.used) {
    forceSilderPercentageSetEvent.used = true;
    setSilderPercentageForce(forceSilderPercentageSetEvent.percentage);
  }

  const sildeContainer = (
    <div
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        height: "100%",
        marginBottom: -1,
        backgroundColor: "rgb(var(--background-rgb))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 -5px 10px 1px rgb(var(--shadow-color))",
      }}
    >
      <p
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: 100,
          height: 6,
          backgroundColor: "rgb(var(--silder-handle-color))",
          borderRadius: 3,
        }}
      ></p>
      <InfoSilderContainer
        circle={circle}
        personalData={personalData}
        setPersonalData={setPersonalData}
      />
    </div>
  );

  const sideContainer = (
    <div
      style={{
        width: "100%",
        height: "100%",
        paddingTop: "4.75em",
        background: "rgb(var(--background-rgb))",
        boxShadow: "1px 0 10px 1px gray",
      }}
    >
      <InfoSilderContainer
        circle={circle}
        personalData={personalData}
        setPersonalData={setPersonalData}
      />
    </div>
  );

  return isSidebar && circle === undefined ? (
    <></>
  ) : (
    <div
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        transform: `translate(0, ${
          isSidebar ? 0 : silderPercentage * (height - 100)
        }px)`,
        pointerEvents: "all",
      }}
      onTouchStart={touchStartHandler}
      onTouchMove={touchMoveHandler}
      onTouchEnd={touchEndHandler}
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
    >
      {isSidebar ? sideContainer : sildeContainer}
    </div>
  );
}
