import { Dispatch, SetStateAction } from "react";

interface SearchBarOptions {
  setSearchText: Dispatch<SetStateAction<string>>;
  performSearch: (query: string) => void;
  focusHandler: React.FocusEventHandler;
  submitHandler: React.FormEventHandler;
  searching: boolean;
  setSearching: Dispatch<SetStateAction<boolean>>;
}

export default function SearchBar({
  setSearchText,
  performSearch,
  focusHandler,
  submitHandler,
  searching,
  setSearching,
}: SearchBarOptions) {
  const inputHandler = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    const ie = e.nativeEvent as InputEvent;
    console.log(target.value, ie);
    setSearchText(target.value);
    performSearch(target.value);
  };
  const searchIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
  );
  const backArrowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
    </svg>
  );
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
      <p
        onClick={() => setSearching(false)}
        style={{
          margin: "auto",
        }}
      >
        {searching ? backArrowIcon : searchIcon}
      </p>
      <input
        type="Back"
        placeholder="부스 검색"
        style={{
          marginLeft: "0.5em",
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
