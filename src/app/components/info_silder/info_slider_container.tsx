import { CircleOptions } from "../map/circle_display";

interface InfoSilderOptions {
  circle: CircleOptions | undefined;
}

export default function InfoSilderContainer({ circle }: InfoSilderOptions) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(var(--background-rgb))",
        paddingLeft: "1em",
        paddingRight: "1em",
      }}
    >
      {circle?.loc}
      <h1>{circle?.name ?? "서클을 선택하세요"}</h1>
    </div>
  );
}
