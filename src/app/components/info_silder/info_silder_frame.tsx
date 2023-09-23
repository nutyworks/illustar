"use client";

import { useState } from "react";
import { CircleOptions } from "../map/circle_display";
import InfoSilderContainer from "./info_slider_container";
import useWindowDimensions from "@/app/utils/get_window_dimensions";

interface InfoSilderFrameOptions {
  circle: CircleOptions | undefined;
}

export default function InfoSilderFrame({ circle }: InfoSilderFrameOptions) {
  let { width, height } = useWindowDimensions();
  const [silderHeight, setSilderHeight] = useState(height - 100);
  const [touchY, setTouchY] = useState(0);
  const touchStartHandler = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    setTouchY(e.touches[0].clientY);
  };
  const touchMoveHandler = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    const newHeight = silderHeight + e.touches[0].clientY - touchY;
    setSilderHeight(newHeight < 0 ? 0 : newHeight);
    setTouchY(e.touches[0].clientY);
  };
  const touchEndHandler = (e: React.TouchEvent) => {
    const diff1 = Math.abs(silderHeight);
    const diff2 = Math.abs(height / 2 - silderHeight);
    const diff3 = Math.abs(height - 100 - silderHeight);

    let newHeight = 0;

    if (diff1 < diff2 && diff1 < diff3) newHeight = 0;
    else if (diff3 < diff1 && diff3 < diff2) newHeight = height - 100;
    else newHeight = height / 2;

    const transitionFrames = 6;
    for (let i = 1; i <= transitionFrames; i++) {
      setTimeout(() => {
        setSilderHeight(
          silderHeight + ((newHeight - silderHeight) / transitionFrames) * i
        );
      }, i * 16.666666);
    }
  };

  return (
    <div
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        transform: `translate(0, ${silderHeight}px)`,
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
