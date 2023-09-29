"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import CircleDisplay, { CircleOptions } from "./circle_display";
import Tooltip from "./tooltip";
import { ForceSilderPercentageSetEvent } from "../info_silder/info_silder_frame";
import { ForceLocationEvent } from "./map_frame";
import { PersonalData } from "@/app/data/personal_circle_data";

interface MapOptions {
  day: number;
  circles: CircleOptions[];
  personalData: PersonalData;
  ratio: number;
  position: { x: number; y: number };
  scaledPosition: { x: number; y: number };
  transformOrigin: { x: number; y: number };
  selectedCircleId: string | null;
  setSelectedCircleId: Dispatch<SetStateAction<string | null>>;
  fireForceCircleSetEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
  fireForceSilderPercentageSetEvent: Dispatch<
    SetStateAction<ForceSilderPercentageSetEvent>
  >;
}

export default function MapContainer({
  day,
  circles,
  personalData,
  position,
  scaledPosition,
  ratio,
  transformOrigin,
  selectedCircleId,
  setSelectedCircleId,
  fireForceCircleSetEvent,
  fireForceSilderPercentageSetEvent,
}: MapOptions) {
  const [hoverCircleId, setHoverCircleId] = useState<string | null>(null);
  const loc = circles.find((d) => d._id === hoverCircleId);

  const elements = circles.flatMap((circle) => {
    const xMin = Math.min(...circle.pos.map((p) => p.x)); // circle.xpos
    const xMax = Math.max(...circle.pos.map((p) => p.x + p.w));
    const pWidth = xMax - xMin;
    const yMin = Math.min(...circle.pos.map((p) => p.y)); // circle.ypos
    const yMax = Math.max(...circle.pos.map((p) => p.y + p.h));
    const pHeight = yMax - yMin;

    return (
      <div
        key={circle._id.toString() + circle.loc}
        onMouseEnter={() => setHoverCircleId(circle._id)}
        onMouseLeave={() => setHoverCircleId(null)}
      >
        <CircleDisplay
          _id={circle._id}
          pos={{ x: xMin, y: yMin, w: pWidth, h: pHeight }}
          hovering={loc?._id === circle._id}
          selected={selectedCircleId === circle._id}
          personalData={personalData}
          setSelectedCircleId={setSelectedCircleId}
          fireForceCircleSetEvent={fireForceCircleSetEvent}
          fireForceSilderPercentageSetEvent={fireForceSilderPercentageSetEvent}
        />
      </div>
    );
  });

  const tooltipElem = loc != null && (
    <Tooltip circle={loc} scaledPosition={scaledPosition} zoomRatio={ratio} />
  );

  return (
    <>
      <div
        style={{
          transform:
            `translate(${position.x}px, ${position.y}px)` + `scale(${ratio})`,
          transformOrigin: `${transformOrigin.x - position.x}px ${
            transformOrigin.y - position.y
          }px`,
        }}
      >
        <svg
          style={{
            backgroundImage: `url(/placement.png)`,
            backgroundSize: "3307px 1417px",
            position: "absolute",
            transform: `translate(-520px, -222px)`,
            width: 3307,
            height: 1417,
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        ></svg>
        {elements}
        {day === 1 && <SundayHide />}
        <div
          style={{
            position: "absolute",
            top: 1417,
            left: -400,
            fontSize: "8em",
            width: "1000%",
          }}
        >
          <div>이 웹페이지는 Chrome에 최적화되어 있습니다.</div>
          <div>코딩한 사람: 레몬</div>
          <div>
            데이터 넣은 사람: 레몬,{" "}
            <a
              href="https://github.com/kevin5871"
              target="blank"
              style={{
                fontWeight: 400,
                color: "black",
                textDecoration: "none",
              }}
            >
              sfcatz
            </a>
            , Sunghoon, Trestle
          </div>
          <div>
            <a href="https://forms.gle/5NNg4L6X6JrjHtBb7" target="blank">
              피드백 제출하기
            </a>
          </div>
        </div>
      </div>
      {tooltipElem}
    </>
  );
}

function SundayHide() {
  return [
    { x: 927, y: 730, w: 164, h: 31, color: "#eae8db" },
    { x: 927, y: 761, w: 164, h: 32, color: "#e8d1d1" },
    { x: 1041, y: 268, w: 49, h: 179, color: "#eae8db" },
    { x: 1064, y: 447, w: 26, h: 231, color: "#eae8db" },
    { x: 1197, y: 146, w: 615, h: 48, color: "#d3dedd" },
    { x: 2250, y: 223, w: 179, h: 74, color: "#e9e4cc" },
    { x: 2429, y: 223, w: 10, h: 72, color: "#fbf9ed" },
  ].map(({ x, y, w, h, color }) => (
    <div
      key={x + (y << 12) + (y << 24) + (w << 36) + (h << 48)}
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: color,
        width: w,
        height: h,
      }}
    ></div>
  ));
}
