import { useEffect, useState } from "react";
import MapContainer from "./map_container";
import { CircleOptions } from "./circle_display";

interface MapFrameOptions {
  circles: CircleOptions[];
}

function calcDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export default function MapFrame({ circles }: MapFrameOptions) {
  const [zoomRatio, setZoomRatio] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    dragInitX: 0,
    dragInitY: 0,
    oldContainerX: 0,
    oldContainerY: 0,
  });
  const [touches, setTouches] = useState({
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
  });
  const [transformOrigin, setTransformOrigin] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setDragging] = useState(false);
  const [isZooming, setZooming] = useState(false);
  const [tl, setTl] = useState(0);

  const wheelHandler = (e: React.WheelEvent) => {
    setZoomRatio(() => zoomRatio - e.deltaY * 0.005);
    setTransformOrigin({
      x: e.clientX + position.x,
      y: e.clientY + position.y,
    });
    console.log(zoomRatio);
  };
  const mouseDownHandler = (e: React.MouseEvent) => {
    setDragging(true);
    setPosition({
      ...position,
      dragInitX: e.clientX,
      dragInitY: e.clientY,
      oldContainerX: position.x,
      oldContainerY: position.y,
    });
  };
  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      ...position,
      x: position.oldContainerX + e.clientX - position.dragInitX,
      y: position.oldContainerY + e.clientY - position.dragInitY,
    });
  };
  const mouseUpHandler = (e: React.MouseEvent) => {
    setDragging(false);
  };
  const touchDownHandler = (e: React.TouchEvent) => {
    if (e.touches.length == 1) {
      setZooming(false);
      setDragging(true);
      setPosition({
        ...position,
        dragInitX: e.touches[0].clientX,
        dragInitY: e.touches[0].clientY,
        oldContainerX: position.x,
        oldContainerY: position.y,
      });
    } else if (e.touches.length == 2) {
      setZooming(true);
      setDragging(false);
      setTouches({
        p1: {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        },
        p2: {
          x: e.touches[1].clientX,
          y: e.touches[1].clientY,
        },
      });
      e.preventDefault();
    }
  };
  const touchMoveHandler = (e: React.TouchEvent) => {
    setTl(e.touches.length);
    if (isDragging) {
      setPosition({
        ...position,
        x: position.oldContainerX + e.touches[0].clientX - position.dragInitX,
        y: position.oldContainerY + e.touches[0].clientY - position.dragInitY,
      });
    } else if (isZooming) {
      setTransformOrigin({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2 + position.x,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2 + position.y,
      });
      const before = calcDistance(
        touches.p1.x,
        touches.p1.y,
        touches.p2.x,
        touches.p2.y
      );
      const after = calcDistance(
        e.touches[0].clientX,
        e.touches[0].clientY,
        e.touches[1].clientX,
        e.touches[1].clientY
      );

      setZoomRatio((ratio) => ratio + (after - before) * 0.005);

      setTouches({
        p1: { x: e.touches[0].clientX, y: e.touches[0].clientY },
        p2: { x: e.touches[1].clientX, y: e.touches[1].clientY },
      });
    }
    e.preventDefault();
  };
  const touchUpHandler = (e: React.TouchEvent) => {
    setDragging(false);
    setZooming(false);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "90%",
          overflow: "hidden",
          border: "1px black solid",
        }}
        onWheel={wheelHandler}
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHandler}
        onTouchStart={touchDownHandler}
        onTouchMove={touchMoveHandler}
        onTouchEnd={touchUpHandler}
      >
        <MapContainer
          position={position}
          ratio={zoomRatio}
          circles={circles}
          transformOrigin={transformOrigin}
        />
      </div>
      {touches.p1.x} {touches.p1.y} {touches.p2.x} {touches.p2.y} {tl}
    </>
  );
}
