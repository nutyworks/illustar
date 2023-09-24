"use client";

import { useState } from "react";
import { CircleOptions } from "../map/circle_display";
import InfoSilderContainer from "./info_slider_container";
import useWindowDimensions from "@/app/utils/get_window_dimensions";

interface InfoSilderFrameOptions {
  circle: CircleOptions | undefined;
  forceSilderPercentageSetEvent: ForceSilderPercentageSetEvent;
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
  forceSilderPercentageSetEvent,
}: InfoSilderFrameOptions) {
  let { width, height } = useWindowDimensions();
  const [silderPercentage, setSilderPercentage] = useState(1);
  const [touchY, setTouchY] = useState(0);
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
  const touchStartHandler = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    setTouchY(e.touches[0].clientY);
  };
  const touchMoveHandler = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    const newPercentage =
      silderPercentage + (e.touches[0].clientY - touchY) / (height - 100);
    setSilderPercentage(Math.max(0, Math.min(newPercentage, 1)));
    setTouchY(e.touches[0].clientY);
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
  };

  if (!forceSilderPercentageSetEvent.used) {
    forceSilderPercentageSetEvent.used = true;
    setSilderPercentageForce(forceSilderPercentageSetEvent.percentage);
  }

  return (
    <div
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        transform: `translate(0, ${silderPercentage * (height - 100)}px)`,
        pointerEvents: "all",
      }}
      onTouchStart={touchStartHandler}
      onTouchMove={touchMoveHandler}
      onTouchEnd={touchEndHandler}
    >
      <div
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: "2em",
          width: "100%",
          marginBottom: -1,
          backgroundColor: "rgb(var(--background-rgb))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 -5px 10px 1px rgb(var(--shadow-color))",
        }}
      >
        <p
          style={{
            width: 100,
            height: 6,
            backgroundColor: "rgb(var(--silder-handle-color))",
            borderRadius: 3,
          }}
        ></p>
      </div>
      <InfoSilderContainer circle={circle} />
    </div>
  );
}
