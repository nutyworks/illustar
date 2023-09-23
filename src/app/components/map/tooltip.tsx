import { CircleOptions } from "./circle_display";

export interface TooltipOptions {
  location: CircleOptions;
  scaledPosition: { x: number; y: number };
  zoomRatio: number;
}

export default function Tooltip({
  location,
  scaledPosition,
  zoomRatio,
}: TooltipOptions) {
  let position = {
    x: (location.xPos + location.width / 2) * zoomRatio + scaledPosition.x,
    y: location.yPos * zoomRatio + scaledPosition.y,
  };
  let top = "",
    left = "",
    transform = "";
  if (position.y > 200) {
    top = "50%";
    left = "50%";
    transform = "translate(-50%, -100%) translateY(-10px)";
    position = {
      x: (location.xPos + location.width / 2) * zoomRatio + scaledPosition.x,
      y: location.yPos * zoomRatio + scaledPosition.y,
    };
  } else {
    top = "50%";
    left = "50%";
    transform = "translate(-50%, 0%) translateY(10px)";
    position = {
      x: (location.xPos + location.width / 2) * zoomRatio + scaledPosition.x,
      y: (location.yPos + location.height) * zoomRatio + scaledPosition.y,
    };
  }
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      <div
        style={{
          position: "absolute",
          border: "1px solid black",
          borderRadius: 5,
          padding: 5,
          backgroundColor: "rgb(var(--tooltip-background-color))",
          color: "rgb(var(--tooltip-color))",
          top: top,
          left: left,
          transform: transform,
          width: "max-content",
        }}
      >
        <center>
          <p style={{ width: "max-content" }}> {location.loc} </p>
          <p style={{ width: "max-content" }}>{location.name}</p>
          <p style={{ width: "max-content" }}>{location.repr}</p>
        </center>
      </div>
    </div>
  );
}
