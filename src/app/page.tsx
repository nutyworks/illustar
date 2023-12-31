"use client";

import { useEffect, useMemo, useState } from "react";
import { ForceLocationEvent } from "./components/map/map_frame";
import { circleData } from "./data";
import DaySelectButton from "./components/day_select_button";
import dynamic from "next/dynamic";
import SearchBar from "./components/search/search_bar";
import { CircleOptions } from "./components/map/circle_display";
import SearchResultContainer from "./components/search/search_result_container";
import { ForceSilderPercentageSetEvent } from "./components/info_silder/info_silder_frame";
import { getCookie, setCookie } from "./utils/cookie";
import {
  PersonalData,
  createPersonalCircleDataFromCookieStr_migrate1,
  generatePersonalDataFromObject,
} from "./data/personal_circle_data";

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
  const [day, setDay] = useState(1);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isSearching, setSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<CircleOptions[] | null>(
    null
  );
  const [silderPercentage, setSilderPercentage] = useState(1);
  const [forceLocationEvent, fireForceLocationEvent] = useState(
    new ForceLocationEvent("")
  );
  const [forceSilderPercentageSetEvent, fireForceSilderPercentageSetEvent] =
    useState(new ForceSilderPercentageSetEvent(1));

  useMemo(() => {
    const oldFavorite = (getCookie("favorites", true) as string) ?? "";

    if (oldFavorite.length > 0) {
      const data = createPersonalCircleDataFromCookieStr_migrate1(oldFavorite);
      setCookie("favorites", "");
      setCookie("personalData", data);
    } else if (
      ((getCookie("personalData", true) as string) ?? "").length == 0
    ) {
      setCookie("personalData", new PersonalData([]));
    }
  }, []);

  const [personalData, setPersonalData] = useState<PersonalData>(
    generatePersonalDataFromObject(getCookie("personalData"))
  );

  useMemo(() => {
    setCookie("personalData", personalData);
  }, [personalData]);

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
        res = res.filter(
          (c) =>
            c.genre_tags?.includes(q) ||
            c.character_tags?.includes(q) ||
            c.type_tags?.includes(q)
        );
      else if (q.startsWith("@") && q.length > 1)
        res = res.filter((c) =>
          c.repr
            ?.flatMap((x) => x.name)
            .join(";")
            .includes(q.slice(1))
        );
      else if (q === "*토")
        res = res.filter((c) => c.days.includes(0) && !c.days.includes(1));
      else if (q === "*일")
        res = res.filter((c) => !c.days.includes(0) && c.days.includes(1));
      else res = res.filter((c) => c.name.includes(q) || c.loc.includes(q));
    });

    setSearchResult(res);
  };
  const submitHandler = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    performSearch(target.value);
    e.stopPropagation();
  };
  const focusHandler = (e: React.MouseEvent) => {
    if (!isSearching) {
      window.history.pushState({}, "#search", "#search");
    }
    setSearching(true);
    e.stopPropagation();
  };
  const searchPage = (
    <>
      <div
        className="searchBar"
        style={{
          boxShadow: "1px 0 10px 1px gray",
          display: "block",
          position: "fixed",
          height: "100%",
          backgroundColor: "white",
          overflow: "auto",
          pointerEvents: "all",
          paddingTop: "4.75em",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <SearchResultContainer
          result={searchResult}
          setSelectedLoc={setSelectedCircleId}
          setDay={setDay}
          setSearching={setSearching}
          fireForceCircleIdSetEvent={fireForceLocationEvent}
          fireForceSilderPercentageSetEvent={fireForceSilderPercentageSetEvent}
        />
      </div>
      <div
        className="searchBar"
        style={{
          display: "block",
          position: "fixed",
          height: "4.75em",
          backgroundColor: "white",
          borderBottom: "1px solid rgb(var(--border-color))",
        }}
        onClick={(e) => e.stopPropagation()}
      ></div>
    </>
  );
  const infoSilder = (
    <div
      className="searchBar"
      style={{
        position: "absolute",
        display: "block",
        height: "100%",
        pointerEvents: "none",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <InfoSilderFrame
        circle={dayCircleData.find((circle) => circle._id === selectedCircleId)}
        personalData={personalData}
        setPersonalData={setPersonalData}
        forceSilderPercentageSetEvent={forceSilderPercentageSetEvent}
        silderPercentage={silderPercentage}
        setSilderPercentage={setSilderPercentage}
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
          day={day}
          circles={dayCircleData}
          personalData={personalData}
          selectedCircleId={selectedCircleId}
          setSelectedCircleId={setSelectedCircleId}
          forceLocationEvent={forceLocationEvent}
          setSilderPercentage={setSilderPercentage}
          fireForceCircleSetEvent={fireForceLocationEvent}
          fireForceSilderPercentageSetEvent={fireForceSilderPercentageSetEvent}
        />
      </div>
      <div
        className="daySelectButton"
        style={{
          display: "block",
          position: "fixed",
        }}
      >
        <DaySelectButton day={day} setDay={setDay} />
      </div>
      {isSearching && searchPage}
      {isSearching || infoSilder}
      <div
        className="searchBar"
        style={{
          display: "block",
          position: "fixed",
          padding: "1em",
          transform: `translateY(${
            silderPercentage < 0.25 ? (0.25 - silderPercentage) * -1000 : 0
          }px)`,
        }}
        onClick={(e) => e.stopPropagation()}
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
    </div>
  );
}
