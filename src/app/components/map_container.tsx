"use client";

import React, { useState } from "react";
import CirleDisplay, { CircleOptions } from "./circle_display";
import Tooltip from "./tooltip";

interface MapOptions {
  circles: CircleOptions[];
  ratio: number;
  position: { x: number; y: number };
  scaledPosition: { x: number; y: number };
  transformOrigin: { x: number; y: number };
}

export default function MapContainer({
  circles,
  position,
  scaledPosition,
  ratio: zoomRatio,
  transformOrigin,
}: MapOptions) {
  const [hoverLoc, setHoverLoc] = useState<string | null>(null);

  const elements = circles.map((data) => {
    return (
      <div
        key={data.id}
        onMouseEnter={() => setHoverLoc(data.id)}
        onMouseLeave={() => setHoverLoc(null)}
      >
        <CirleDisplay
          xPos={data.xPos}
          yPos={data.yPos}
          width={data.width}
          height={data.height}
          id={data.id}
          name={data.name}
          urls={data.urls}
          days={data.days}
        />
      </div>
    );
  });

  const loc = circles.find((d) => d.id === hoverLoc);

  const tooltipElem = loc != null && (
    <Tooltip
      msg={loc.id}
      position={{
        x: (loc?.xPos + loc?.width / 2) * zoomRatio + scaledPosition.x,
        y: loc?.yPos * zoomRatio + scaledPosition.y,
      }}
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
