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
  const loc = circles.find((d) => d.id === hoverLoc);

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
          repr={data.repr}
          urls={data.urls}
          days={data.days}
          hovering={loc?.id === data.id}
          selected={false}
        />
      </div>
    );
  });

  const tooltipElem = loc != null && (
    <Tooltip
      msg={loc.id}
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
