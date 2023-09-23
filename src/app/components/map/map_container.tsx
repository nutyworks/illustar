"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import CircleDisplay, { CircleOptions } from "./circle_display";
import Tooltip from "./tooltip";

interface MapOptions {
  circles: CircleOptions[];
  ratio: number;
  position: { x: number; y: number };
  scaledPosition: { x: number; y: number };
  transformOrigin: { x: number; y: number };
  selectedLoc: string | null;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
}

export default function MapContainer({
  circles,
  position,
  scaledPosition,
  ratio: zoomRatio,
  transformOrigin,
  selectedLoc,
  setSelectedLoc,
}: MapOptions) {
  const [hoverLoc, setHoverLoc] = useState<string | null>(null);
  const loc = circles.find((d) => d.loc === hoverLoc);

  const elements = circles.map((data) => {
    return (
      <div
        key={data.loc}
        onMouseEnter={() => setHoverLoc(data.loc)}
        onMouseLeave={() => setHoverLoc(null)}
      >
        <CircleDisplay
          xPos={data.xPos}
          yPos={data.yPos}
          width={data.width}
          height={data.height}
          loc={data.loc}
          name={data.name}
          repr={data.repr}
          urls={data.urls}
          days={data.days}
          tags={data.tags}
          hovering={loc?.loc === data.loc}
          selected={selectedLoc === data.loc}
          setSelectedLoc={setSelectedLoc}
        />
      </div>
    );
  });

  const tooltipElem = loc != null && (
    <Tooltip
      location={loc}
      scaledPosition={scaledPosition}
      zoomRatio={zoomRatio}
    />
  );

  return (
    <>
      <div
        style={{
          transform:
            `translate(${position.x}px, ${position.y}px)` +
            `scale(${zoomRatio})`,
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
      </div>
      {tooltipElem}
    </>
  );
}
