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
          padding: 10,
          paddingLeft: 12,
          backgroundColor:
            day === 0
              ? "rgb(var(--saturday-color))"
              : "rgb(var(--background-rgb))",
          border: "1px solid rgb(var(--border-color))",
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          color:
            day !== 0
              ? "rgb(var(--saturday-color))"
              : "rgb(var(--background-rgb))",
          fontSize: "1em",
          cursor: "pointer",
        }}
      >
        토요일
      </button>
      <button
        onClick={() => setDay(1)}
        style={{
          padding: 10,
          paddingRight: 12,
          backgroundColor:
            day === 1
              ? "rgb(var(--sunday-color))"
              : "rgb(var(--background-rgb))",
          border: "1px solid rgb(var(--border-color))",
          borderLeft: "transparent",
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          color:
            day !== 1
              ? "rgb(var(--sunday-color))"
              : "rgb(var(--background-rgb))",
          fontSize: "1em",
          cursor: "pointer",
        }}
      >
        일요일
      </button>
    </div>
  );
}
