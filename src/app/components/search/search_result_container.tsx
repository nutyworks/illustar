import { Dispatch, SetStateAction } from "react";
import { CircleOptions } from "../map/circle_display";
import { ForceLocationEvent } from "../map/map_frame";

interface SearchResultOptions {
  result: CircleOptions[] | null;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
  setDay: Dispatch<SetStateAction<number>>;
  setSearching: Dispatch<SetStateAction<boolean>>;
  fireForceLocationEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
}

export default function SearchResultContainer({
  result,
  setSelectedLoc,
  setDay,
  setSearching,
  fireForceLocationEvent,
}: SearchResultOptions) {
  const resultFound = result?.length ?? 1 > 0;
  const results = result?.map((circle) => {
    return (
      <div
        key={circle.loc + circle.name}
        onClick={() => {
          setSelectedLoc(circle.loc);
          setDay(circle.days[0]);
          setSearching(false);
          window.history.pushState({}, "#", null);
          fireForceLocationEvent(new ForceLocationEvent(circle.loc));
        }}
      >
        <SearchResultCircle {...circle} />
      </div>
    );
  });

  const empty = (
    <div
      style={{
        width: "100%",
        padding: "1em",
      }}
    >
      <center>
        <p>
          <strong>서클을 찾을 수 없습니다</strong>
        </p>
      </center>
    </div>
  );
  const searchHelp = (
    <div
      style={{
        width: "100%",
        padding: "1em",
      }}
    >
      <center>
        <p>
          <strong>#태그</strong> - 태그가 포함된 서클을 찾습니다.
        </p>
        <p>
          <strong>@작가</strong> - 작가가 포함된 서클을 찾습니다.
        </p>
        <p>
          <strong>*토, *일</strong> - 해당 요일에만 참가하는 서클을 찾습니다.
        </p>
      </center>
    </div>
  );

  return <div>{resultFound ? results ?? searchHelp : empty}</div>;
}

function SearchResultCircle({ loc, name, repr, days, tags }: CircleOptions) {
  const dayType =
    days.includes(0) && days.includes(1)
      ? "양일"
      : days.includes(0)
      ? "토요일"
      : "일요일";
  return (
    <div
      style={{
        alignContent: "center",
        padding: "0.5em 1em 0.5em 1em",
        borderBottom: "1px solid rgb(var(--border-color))",
        backgroundColor:
          dayType === "양일"
            ? "transparent"
            : dayType === "토요일"
            ? "rgb(var(--saturday-color), 20%)"
            : "rgb(var(--sunday-color), 20%)",
      }}
    >
      {name}
      <p>
        <small>
          {loc} {dayType} {repr}
        </small>
      </p>
      <p>
        <small>{tags}</small>
      </p>
    </div>
  );
}
