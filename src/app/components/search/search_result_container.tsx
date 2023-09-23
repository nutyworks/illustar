import { CircleOptions } from "../map/circle_display";

interface SearchResultOptions {
  result: CircleOptions[];
}

export default function SearchResultContainer({ result }: SearchResultOptions) {
  const results = result.map((circle) => {
    return (
      <div key={circle.id + circle.name}>
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

function SearchResultCircle({ id, name, repr, days }: CircleOptions) {
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
