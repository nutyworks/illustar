import { Dispatch, SetStateAction } from "react";
import { CircleOptions } from "../map/circle_display";
import { ForceLocationEvent } from "../map/map_frame";
import { ForceSilderPercentageSetEvent } from "../info_silder/info_silder_frame";

interface SearchResultOptions {
  result: CircleOptions[] | null;
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
  setDay: Dispatch<SetStateAction<number>>;
  setSearching: Dispatch<SetStateAction<boolean>>;
  fireForceCircleIdSetEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
  fireForceSilderPercentageSetEvent: Dispatch<
    SetStateAction<ForceSilderPercentageSetEvent>
  >;
}

export default function SearchResultContainer({
  result,
  setSelectedLoc: setSelectedCircleId,
  setDay,
  setSearching,
  fireForceCircleIdSetEvent,
  fireForceSilderPercentageSetEvent,
}: SearchResultOptions) {
  const resultFound = result?.length ?? 1 > 0;
  const results = result?.map((circle) => {
    return (
      <div
        key={circle.loc + circle.name}
        onClick={() => {
          setSelectedCircleId(circle._id);
          setDay(circle.days[0]);
          setSearching(false);
          window.history.go(-1);
          fireForceCircleIdSetEvent(new ForceLocationEvent(circle._id));
          fireForceSilderPercentageSetEvent(
            new ForceSilderPercentageSetEvent(0.5)
          );
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
          <strong>서클 이름, A01</strong> - 서클 이름 또는 위치로 찾습니다.
        </p>
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

function SearchResultCircle({
  loc,
  name,
  repr,
  days,
  genre_tags,
}: CircleOptions) {
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
          {loc.join(", ")}
          {repr.length > 0 ? " | " + repr.map((r) => r.name).join(", ") : ""}
        </small>
      </p>
      <p>
        <small>{genre_tags}</small>
      </p>
    </div>
  );
}
