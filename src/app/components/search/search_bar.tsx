import { Dispatch, SetStateAction } from "react";
import { CircleOptions } from "../map/circle_display";
import { Input } from "postcss";

interface SearchBarOptions {
  setSearchText: Dispatch<SetStateAction<string>>;
  performSearch: (query: string) => void;
  focusHandler: React.FocusEventHandler;
  submitHandler: React.FormEventHandler;
  setSearching: Dispatch<SetStateAction<boolean>>;
}

export default function SearchBar({
  setSearchText,
  performSearch,
  focusHandler,
  submitHandler,
  setSearching,
}: SearchBarOptions) {
  const inputHandler = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const ie = e.nativeEvent as InputEvent;
    console.log(target.value, ie);
    setSearchText(target.value);
    performSearch(target.value);
  };
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "2em",
        border: "1px solid rgb(var(--border-color))",
        background: "rgb(var(--background-rgb))",
        padding: "0.5em",
        paddingLeft: "1em",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
      }}
    >
      <p onClick={() => setSearching(false)}>Back</p>
      <input
        type="Back"
        placeholder="부스 검색"
        style={{
          width: "100%",
          fontSize: "1.25em",
        }}
        onInput={inputHandler}
        onSubmit={submitHandler}
        onFocus={focusHandler}
      />
    </div>
  );
}
