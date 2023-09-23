import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MapContainer from "./map_container";
import { CircleOptions } from "./circle_display";

interface MapFrameOptions {
  circles: CircleOptions[];
  selectedLoc: string | null;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
}

interface TouchData {
  x: number;
  y: number;
  identifier: number;
  new: boolean;
}

export default function MapFrame({
  circles,
  selectedLoc,
  setSelectedLoc,
}: MapFrameOptions) {
  const [zoomRatio, setZoomRatio] = useState(1);
  const [scaledPosition, setScaledPosition] = useState({
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
  });
  const [oldScaledPosition, setOldScaledPosition] = useState(scaledPosition);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    dragInitX: 0,
    dragInitY: 0,
    oldContainerX: 0,
    oldContainerY: 0,
  });
  const [oldPosition, setOldPosition] = useState(position);
  const [touches, setTouches] = useState<TouchData[]>([]);
  const [transformOrigin, setTransformOrigin] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setDragging] = useState(false);
  const [noDrag, setNoDrag] = useState(true);

  const wheelHandler = (e: React.WheelEvent) => {
    const newTransformOrigin = {
      x: e.clientX,
      y: e.clientY,
    };
    const newZoomRatio = Math.min(
      Math.max(0.1, zoomRatio - e.deltaY * 0.005),
      10
    );
    const newPosition = {
      ...position,
      x:
        (scaledPosition.x + newTransformOrigin.x * (zoomRatio - 1)) / zoomRatio,
      y:
        (scaledPosition.y + newTransformOrigin.y * (zoomRatio - 1)) / zoomRatio,
    };
    const newScaledPosition = {
      ...scaledPosition,
      x:
        newZoomRatio * newPosition.x -
        newTransformOrigin.x * (newZoomRatio - 1),
      y:
        newZoomRatio * newPosition.y -
        newTransformOrigin.y * (newZoomRatio - 1),
    };
    setScaledPosition(newScaledPosition);
    setPosition(newPosition);
    setZoomRatio(newZoomRatio);
    setTransformOrigin(newTransformOrigin);
  };
  const mouseDownHandler = (e: React.MouseEvent) => {
    setDragging(true);
    setOldPosition(position);
    setOldScaledPosition(scaledPosition);
    setNoDrag(true);
    setPosition({
      ...position,
      dragInitX: e.clientX,
      dragInitY: e.clientY,
      oldContainerX: position.x,
      oldContainerY: position.y,
    });
    setScaledPosition({
      ...position,
      oldX: scaledPosition.x,
      oldY: scaledPosition.y,
    });
  };
  const mouseMoveHandler = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setNoDrag(false);
    setPosition({
      ...position,
      x: position.oldContainerX + (e.clientX - position.dragInitX) / zoomRatio,
      y: position.oldContainerY + (e.clientY - position.dragInitY) / zoomRatio,
    });
    setScaledPosition({
      ...scaledPosition,
      x: scaledPosition.oldX + e.clientX - position.dragInitX,
      y: scaledPosition.oldY + e.clientY - position.dragInitY,
    });
  };
  const mouseUpHandler = (e: React.MouseEvent) => {
    setDragging(false);
    if (noDrag) {
      setPosition(oldPosition);
      setScaledPosition(oldScaledPosition);
    }
  };
  const touchDownHandler = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      setTouches((touches) =>
        touches.concat({
          x: touch.clientX,
          y: touch.clientY,
          identifier: touch.identifier,
          new: true,
        })
      );
    }
    console.log(e);
  };
  const touchMoveHandler = (e: React.TouchEvent) => {
    const oldTouches = touches;
    const currentTouches = touches.slice();
    for (let i = 0; i < e.touches.length; i++) {
      currentTouches[i] = {
        ...currentTouches[i],
        new: false,
      };
    }
    for (let i = 0; i < e.targetTouches.length; i++) {
      const touch = e.targetTouches[i];
      const idx = touches.findIndex(
        (value) => value.identifier === touch.identifier
      );
      currentTouches[idx] = {
        ...currentTouches[idx],
        x: touch.clientX,
        y: touch.clientY,
      };
    }
    const touchDeltas = currentTouches
      .map((current) => {
        const old = oldTouches.find(
          (data) => data.identifier === current.identifier
        );
        if (old === undefined) return undefined;

        return {
          dx: current.x - old.x,
          dy: current.y - old.y,
          identifier: current.identifier,
        };
      })
      .filter((value) => value !== undefined) as { dx: number; dy: number }[];
    if (touchDeltas.length == 1) {
      setPosition({
        ...position,
        x: position.x + touchDeltas[0].dx / zoomRatio,
        y: position.y + touchDeltas[0].dy / zoomRatio,
      });
      setScaledPosition({
        ...scaledPosition,
        x: scaledPosition.x + touchDeltas[0].dx,
        y: scaledPosition.y + touchDeltas[0].dy,
      });
    } else if (touchDeltas.length == 2) {
      const zoomIdentifiers = oldTouches.map((t) => t.identifier);
      const oldZoomTouches = oldTouches.filter((touch) =>
        zoomIdentifiers.includes(touch.identifier)
      );
      const u1 = touchDeltas[0].dx,
        v1 = touchDeltas[0].dy;
      const u2 = touchDeltas[1].dx,
        v2 = touchDeltas[1].dy;
      const x1 = oldZoomTouches[0].x,
        y1 = oldZoomTouches[0].y;
      const x2 = oldZoomTouches[1].x,
        y2 = oldZoomTouches[1].y;
      const d1 = Math.hypot(x2 - x1, y2 - y1),
        d2 = Math.hypot(x2 + u2 - x1 - u1, y2 + v2 - y1 - v1);
      const cosine =
        (u1 * v1 + u2 * v2) / (Math.hypot(u1, v1) * Math.hypot(u2, v2));

      const newTransformOrigin = {
        x: (x2 + x1) / 2,
        y: (y2 + y1) / 2,
      };

      console.log(
        u1,
        v1,
        u2,
        v2,
        x1,
        y1,
        x2,
        y2,
        d1,
        d2,
        cosine,
        newTransformOrigin
      );
      const newZoomRatio = Math.min(
        Math.max(0.3, zoomRatio + (d2 - d1) * 0.005),
        5
      );
      const newPosition = {
        ...position,
        x:
          (scaledPosition.x + newTransformOrigin.x * (zoomRatio - 1)) /
          zoomRatio,
        y:
          (scaledPosition.y + newTransformOrigin.y * (zoomRatio - 1)) /
          zoomRatio,
      };
      const newScaledPosition = {
        ...scaledPosition,
        x:
          newZoomRatio * newPosition.x -
          newTransformOrigin.x * (newZoomRatio - 1),
        y:
          newZoomRatio * newPosition.y -
          newTransformOrigin.y * (newZoomRatio - 1),
      };
      const newMovedPosition = {
        ...newPosition,
        x: newPosition.x + (u1 + u2) / 2 / zoomRatio,
        y: newPosition.y + (v1 + v2) / 2 / zoomRatio,
      };
      const newMovedScaledPosition = {
        ...newScaledPosition,
        x: newScaledPosition.x + (u1 + u2) / 2,
        y: newScaledPosition.y + (v1 + v2) / 2,
      };
      setScaledPosition(newMovedScaledPosition);
      setPosition(newMovedPosition);
      setZoomRatio(newZoomRatio);
      setTransformOrigin(newTransformOrigin);
    }
    setTouches(currentTouches);
    e.preventDefault();
  };
  const touchEndHandler = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      setTouches((touches) => {
        const idx = touches.findIndex(
          (value) => value.identifier === touch.identifier
        );
        const copy = touches.slice();
        copy.splice(idx, 1);
        return copy;
      });
    }
    console.log(e);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      onWheel={wheelHandler}
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onTouchStart={touchDownHandler}
      onTouchMove={touchMoveHandler}
      onTouchEnd={touchEndHandler}
    >
      <MapContainer
        position={position}
        scaledPosition={scaledPosition}
        ratio={zoomRatio}
        circles={circles}
        transformOrigin={transformOrigin}
        selectedLoc={selectedLoc}
        setSelectedLoc={setSelectedLoc}
      />
    </div>
  );
}
