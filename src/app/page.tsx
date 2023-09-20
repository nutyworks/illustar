"use client";

import { useState } from "react";
import MapContainer from "./components/map_container";
import MapFrame from "./components/map_frame";
import { circleData } from "./data";

export default function App() {
  return <MapFrame circles={circleData} />;
}
