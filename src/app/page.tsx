"use client";

import { useState } from "react";
import MapFrame from "./components/map/map_frame";
import { circleData } from "./data";
import DaySelectButton from "./components/day_select_button";
import dynamic from "next/dynamic";
const InfoSilderFrame = dynamic(
  () => import("./components/info_silder/info_silder_frame"),
  {
    ssr: false,
  }
);

export default function App() {
  const [day, setDay] = useState(0);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const dayCircleData = circleData[day];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "fixed",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <MapFrame
          circles={dayCircleData}
          selectedLoc={selectedLoc}
          setSelectedLoc={setSelectedLoc}
        />
      </div>
      <div
        style={{
          display: "block",
          position: "fixed",
          right: "1em",
          top: "1em",
        }}
      >
        <DaySelectButton day={day} setDay={setDay} />
      </div>
      <div
        style={{
          position: "absolute",
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <InfoSilderFrame
          circle={dayCircleData.find((circle) => circle.id === selectedLoc)}
        />
      </div>
    </div>
  );
}
