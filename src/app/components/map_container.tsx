"use client";

import React, { useState } from "react";
import CirleDisplay, { CircleOptions } from "./circle_display";
import Tooltip from "./tooltip";

interface MapOptions {
  circles: CircleOptions[];
  ratio: number;
  position: { x: number; y: number };
  transformOrigin: { x: number; y: number };
}

export default function MapContainer({
  circles,
  position,
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

  const tooltipX = circles.find((d) => d.id === hoverLoc)?.xPos ?? 0;
  const tooltipY = circles.find((d) => d.id === hoverLoc)?.yPos ?? 0;

  const tooltipElem = hoverLoc != null && (
    <Tooltip msg={hoverLoc} position={{ x: tooltipX, y: tooltipY }} />
  );

  return (
    <div
      style={{
        transform:
          `translate(${position.x}px, ${position.y}px)` + `scale(${zoomRatio})`,
        transformOrigin: `${transformOrigin.x - position.x}px ${
          transformOrigin.y - position.y
        }px`,
      }}
    >
      <div
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
      ></div>
      {tooltipElem}
      {elements}
    </div>
  );
}
