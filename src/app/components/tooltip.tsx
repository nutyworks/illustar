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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -100%)",
        }}
      >
        {msg} AAAAAAAA BBBBBBBB
      </div>
    </div>
  );
}
