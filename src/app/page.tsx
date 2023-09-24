"use client";

import { useEffect, useState } from "react";
import { ForceLocationEvent } from "./components/map/map_frame";
import { circleData } from "./data";
import DaySelectButton from "./components/day_select_button";
import dynamic from "next/dynamic";
import SearchBar from "./components/search/search_bar";
import { CircleOptions } from "./components/map/circle_display";
import SearchResultContainer from "./components/search/search_result_container";
const InfoSilderFrame = dynamic(
  () => import("./components/info_silder/info_silder_frame"),
  {
    ssr: false,
  }
);
const MapFrame = dynamic(() => import("./components/map/map_frame"), {
  ssr: false,
});

export default function App() {
  const [day, setDay] = useState(0);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<CircleOptions[] | null>([]);
  const [forceLocationEvent, fireForceLocationEvent] = useState(
    new ForceLocationEvent("")
  );

  const dayCircleData = circleData.filter((circle) =>
    circle.days.includes(day)
  );
  const performSearch = (query: string) => {
    if (query === "") {
      setSearchResult(null);
      return;
    }

    const queries = query.split(" ");

    let res = circleData;
    queries.forEach((q) => {
      if (q.startsWith("#") && q.length > 1)
        res = res.filter((c) => c.tags.includes(q));
      else if (q.startsWith("@") && q.length > 1)
        res = res.filter((c) => c.repr.includes(q.slice(1)));
      else if (q === "*토")
        res = res.filter((c) => c.days.includes(0) && !c.days.includes(1));
      else if (q === "*일")
        res = res.filter((c) => !c.days.includes(0) && c.days.includes(1));
      else res = res.filter((c) => c.name.includes(q));
    });

    setSearchResult(res);
  };
  const submitHandler = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    performSearch(target.value);
  };
  const focusHandler = (e: React.MouseEvent) => {
    if (!isSearching) {
      window.history.pushState({}, "#search", "#search");
    }
    setSearching(true);
  };
  const searchPage = (
    <>
      <div
        style={{
          display: "block",
          position: "fixed",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          overflow: "auto",
          pointerEvents: "all",
          paddingTop: "4.75em",
        }}
      >
        <SearchResultContainer
          result={searchResult}
          setSelectedLoc={setSelectedLoc}
          setDay={setDay}
          setSearching={setSearching}
          fireForceLocationEvent={fireForceLocationEvent}
        />
      </div>
      <div
        style={{
          display: "block",
          position: "fixed",
          width: "100%",
          height: "4.75em",
          backgroundColor: "white",
          borderBottom: "1px solid rgb(var(--border-color))",
          boxShadow: "1px 1px 15px 1px gray",
        }}
      ></div>
    </>
  );
  const infoSilder = (
    <div
      style={{
        position: "absolute",
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <InfoSilderFrame
        circle={dayCircleData.find((circle) => circle.loc === selectedLoc)}
      />
    </div>
  );

  useEffect(() => {
    window.addEventListener("popstate", (e) => {
      if (isSearching) {
        e.preventDefault();
        setSearching(false);
      }
    });
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "fixed",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <MapFrame
          circles={dayCircleData}
          selectedLoc={selectedLoc}
          setSelectedLoc={setSelectedLoc}
          forceLocationEvent={forceLocationEvent}
        />
      </div>
      <div
        style={{
          display: "block",
          position: "fixed",
          right: "1em",
          top: "4.75em",
        }}
      >
        <DaySelectButton day={day} setDay={setDay} />
      </div>
      {isSearching && searchPage}
      <div
        style={{
          display: "block",
          position: "fixed",
          width: "100%",
          padding: "1em",
        }}
      >
        <SearchBar
          setSearchText={setSearchText}
          performSearch={performSearch}
          focusHandler={focusHandler}
          submitHandler={submitHandler}
          searching={isSearching}
          setSearching={setSearching}
        />
      </div>
      {isSearching || infoSilder}
    </div>
  );
}
