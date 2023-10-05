import { Dispatch, SetStateAction } from "react";

export default function DaySelectButton({
  day,
  setDay,
}: {
  day: number;
  setDay: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div>
      <button
        onClick={() => setDay(0)}
        style={{
          padding: "0.5em 0.75em 0.5em 0.75em",
          backgroundColor:
            day === 0
              ? "rgb(var(--saturday-color))"
              : "rgb(var(--background-rgb))",
          border: "1px solid rgb(var(--border-color))",
          borderTopLeftRadius: "0.5em",
          borderBottomLeftRadius: "0.5em",
          color:
            day !== 0
              ? "rgb(var(--saturday-color))"
              : "rgb(var(--background-rgb))",
          fontSize: "1em",
          cursor: "pointer",
        }}
      >
        토
      </button>
      <button
        onClick={() => setDay(1)}
        style={{
          padding: "0.5em 0.75em 0.5em 0.75em",
          backgroundColor:
            day === 1
              ? "rgb(var(--sunday-color))"
              : "rgb(var(--background-rgb))",
          border: "1px solid rgb(var(--border-color))",
          borderLeft: "transparent",
          borderTopRightRadius: "0.5em",
          borderBottomRightRadius: "0.5em",
          color:
            day !== 1
              ? "rgb(var(--sunday-color))"
              : "rgb(var(--background-rgb))",
          fontSize: "1em",
          cursor: "pointer",
        }}
      >
        일
      </button>
    </div>
  );
}
