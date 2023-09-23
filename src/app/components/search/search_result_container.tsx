import { Dispatch, SetStateAction } from "react";
import { CircleOptions } from "../map/circle_display";
import { ForceLocationEvent } from "../map/map_frame";

interface SearchResultOptions {
  result: CircleOptions[];
  setSelectedLoc: Dispatch<SetStateAction<string | null>>;
  setSearching: Dispatch<SetStateAction<boolean>>;
  fireForceLocationEvent: Dispatch<SetStateAction<ForceLocationEvent>>;
}

export default function SearchResultContainer({
  result,
  setSelectedLoc,
  setSearching,
  fireForceLocationEvent,
}: SearchResultOptions) {
  const results = result.map((circle) => {
    return (
      <div
        key={circle.loc + circle.name}
        onClick={() => {
          setSelectedLoc(circle.loc);
          setSearching(false);
          fireForceLocationEvent(new ForceLocationEvent(circle.loc));
        }}
      >
        <SearchResultCircle {...circle} />
      </div>
    );
  });

  return (
    <>
      <div>{results}</div>
    </>
  );
}

function SearchResultCircle({ loc: id, name, repr, days }: CircleOptions) {
  return (
    <div
      style={{
        padding: "0.5em 1em 0.5em 1em",
        borderBottom: "1px solid rgb(var(--border-color))",
      }}
    >
      {id}
      <h2>{name}</h2>
      {repr}
    </div>
  );
}
