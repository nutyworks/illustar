import { CircleOptions } from "./circle_display";

export interface TooltipOptions {
  circle: CircleOptions;
  scaledPosition: { x: number; y: number };
  zoomRatio: number;
}

export default function Tooltip({
  circle,
  scaledPosition,
  zoomRatio,
}: TooltipOptions) {
  const xMin = Math.min(...circle.pos.map((p) => p.x)); // circle.xpos
  const xMax = Math.max(...circle.pos.map((p) => p.x + p.w));
  const width = xMax - xMin;
  const yMin = Math.min(...circle.pos.map((p) => p.y)); // circle.ypos
  const yMax = Math.max(...circle.pos.map((p) => p.y + p.h));
  const height = yMax - yMin;
  let position = {
    x: (xMin + width / 2) * zoomRatio + scaledPosition.x,
    y: yMin * zoomRatio + scaledPosition.y,
  };
  let top = "",
    left = "",
    transform = "";
  if (position.y > 200) {
    top = "50%";
    left = "50%";
    transform = "translate(-50%, -100%) translateY(-10px)";
    position = {
      x: (xMin + width / 2) * zoomRatio + scaledPosition.x,
      y: yMin * zoomRatio + scaledPosition.y,
    };
  } else {
    top = "50%";
    left = "50%";
    transform = "translate(-50%, 0%) translateY(10px)";
    position = {
      x: (xMin + width / 2) * zoomRatio + scaledPosition.x,
      y: (yMin + height) * zoomRatio + scaledPosition.y,
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
          <p style={{ width: "max-content" }}> {circle.loc.join(", ")} </p>
          <p style={{ width: "max-content" }}>{circle.name}</p>
          <p style={{ width: "max-content" }}>
            {circle.repr.map((r) => r.name).join(", ")}
          </p>
        </center>
      </div>
    </div>
  );
}
