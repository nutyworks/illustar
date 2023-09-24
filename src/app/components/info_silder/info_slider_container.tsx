import { CircleOptions } from "../map/circle_display";

interface InfoSilderOptions {
  circle: CircleOptions | undefined;
}

export default function InfoSilderContainer({ circle }: InfoSilderOptions) {
  if (circle === undefined) {
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
        <h1>서클을 선택하세요</h1>
      </div>
    );
  }

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
      {circle.loc} · <DayMarker days={circle.days} />
      <h1>{circle.name}</h1>
      <p>{circle.repr}</p>
      <p>{circle.tags}</p>
      <ul>
        {circle.urls.map((url, idx) => (
          <li key={idx}>
            <a href={url} target="blank">
              Link #{idx + 1}: {url.split("/")[2]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DayMarker({ days }: { days: number[] }) {
  if (days.includes(0) && days.includes(1)) {
    return <span>양일</span>;
  } else if (days.includes(0)) {
    return <span style={{ color: "rgb(var(--saturday-color))" }}>토요일</span>;
  } else {
    return <span style={{ color: "rgb(var(--sunday-color))" }}>일요일</span>;
  }
}
