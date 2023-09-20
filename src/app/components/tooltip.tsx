export interface TooltipOptions {
  msg: string;
  position: { x: number; y: number };
}

export default function Tooltip({ msg, position }: TooltipOptions) {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      {msg}
    </div>
  );
}
