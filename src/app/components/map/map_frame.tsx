import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MapContainer from "./map_container";
import { CircleOptions } from "./circle_display";
import useWindowDimensions from "@/app/utils/get_window_dimensions";
import { ForceSilderPercentageSetEvent } from "../info_silder/info_silder_frame";

export class ForceLocationEvent {
  value: string;
  used: boolean;
  constructor(value: string) {
    this.value = value;
    this.used = false;
  }
}

interface MapFrameOptions {
  day: number;
  circles: CircleOptions[];
  selectedLoc: string | null;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
  forceLocationEvent: ForceLocationEvent;
  fireForceLocationEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
  fireForceSilderPercentageSetEvent: Dispatch<
    SetStateAction<ForceSilderPercentageSetEvent>
  >;
}

interface TouchData {
  x: number;
  y: number;
  identifier: number;
  new: boolean;
}

export default function MapFrame({
  day,
  circles,
  selectedLoc,
  setSelectedLoc,
  forceLocationEvent,
  fireForceLocationEvent,
  fireForceSilderPercentageSetEvent,
}: MapFrameOptions) {
  const { width, height } = useWindowDimensions();
  const [zoomRatio, setZoomRatio] = useState(0.1);
  const [scaledPosition, setScaledPosition] = useState({
    x: (width - 330.7 / 1.5) / 2,
    y: (height - 141.7 / 1.5) / 2,
    oldX: 0,
    oldY: 0,
  });
  const [oldScaledPosition, setOldScaledPosition] = useState(scaledPosition);
  const [position, setPosition] = useState({
    x: ((width - 330.7 / 1.5) / 2) * 10,
    y: ((height - 141.7 / 1.5) / 2) * 10,
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

  if (!forceLocationEvent.used) {
    forceLocationEvent.used = true;

    const floc = circles.find((circle) => circle.loc === selectedLoc);

    if (floc !== undefined) {
      const newX = -(floc.xPos + floc.width / 2 - width / 2);
      const newY = -(floc.yPos + floc.height / 2 - height / 4);
      const newR = 1;

      const oldX = position.x;
      const oldY = position.y;
      const oldSX = scaledPosition.x;
      const oldSY = scaledPosition.y;
      const oldR = zoomRatio;

      const transitionFrames = 10;
      for (let i = 1; i <= transitionFrames; i++) {
        setTimeout(() => {
          setZoomRatio(oldR + ((newR - oldR) * i) / transitionFrames);
          setPosition({
            ...position,
            x: oldX + ((newX - oldX) * i) / transitionFrames,
            y: oldY + ((newY - oldY) * i) / transitionFrames,
          });
          setScaledPosition({
            ...scaledPosition,
            x: oldSX + ((newX - oldSX) * i) / transitionFrames,
            y: oldSY + ((newY - oldSY) * i) / transitionFrames,
          });
        }, 16.666666 * i);
      }
    }
  }

  const wheelHandler = (e: React.WheelEvent) => {
    console.log(e);
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
  };
  const touchMoveHandler = (e: React.TouchEvent) => {
    const oldTouches = touches;
    const currentTouches = touches.slice();
    for (let i = 0; i < currentTouches.length; i++) {
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

      const newZoomRatio = Math.min(
        Math.max(0.1, zoomRatio + (d2 - d1) * 0.005),
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
  };
  const touchEndHandler = (e: React.TouchEvent) => {
    touchMoveHandler(e);
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
  };

  const debugStr = touches
    .map(
      (touch) =>
        `Touch#${touch.identifier} ${touch.new} (${touch.x}, ${touch.y})`
    )
    .join(" | ");

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
      onTouchCancel={touchEndHandler}
    >
      <MapContainer
        day={day}
        position={position}
        scaledPosition={scaledPosition}
        ratio={zoomRatio}
        circles={circles}
        transformOrigin={transformOrigin}
        selectedLoc={selectedLoc}
        setSelectedLoc={setSelectedLoc}
        fireForceLocationEvent={fireForceLocationEvent}
        fireForceSilderPercentageSetEvent={fireForceSilderPercentageSetEvent}
      />
    </div>
  );
}
