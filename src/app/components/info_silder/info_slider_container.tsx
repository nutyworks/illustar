import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { CircleOptions } from "../map/circle_display";
import { CircleData, PersonalData } from "@/app/data/personal_circle_data";

interface InfoSilderOptions {
  circle: CircleOptions | undefined;
  personalData: PersonalData;
  setPersonalData: Dispatch<SetStateAction<PersonalData>>;
}

export default function InfoSilderContainer({
  circle,
  personalData,
  setPersonalData,
}: InfoSilderOptions) {
  const [isEditing, setEditing] = useState(false);
  const [editComponent, setEditComponent] = useState(<></>);
  const [newNotes, setNewNotes] = useState("");

  if (circle === undefined) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "rgb(var(--background-rgb))",
          paddingLeft: "1em",
          paddingRight: "1em",
        }}
      >
        <h1>서클을 선택하세요</h1>
      </div>
    );
  }

  const data: CircleData | undefined = personalData.circleDataList[circle._id];
  const isFavorite = data?.favorite ?? false;
  const flag = data?.flag ?? 0;
  const notes = data?.notes ?? "";

  const heartFilled = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="2em"
      viewBox="0 0 512 512"
      fill="rgb(var(--circle-favorite-color))"
    >
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
    </svg>
  );
  const heartEmpty = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="2em"
      viewBox="0 0 512 512"
      fill="rgb(var(--circle-favorite-color))"
    >
      <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
    </svg>
  );
  const flagEmpty = (
    <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512">
      <path d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z" />
    </svg>
  );
  const flagFilled = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="2em"
      viewBox="0 0 448 512"
      fill={`rgb(var(--flag${flag}-color))`}
    >
      <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
    </svg>
  );

  const handleFavorite = () => {
    if (isFavorite) {
      setPersonalData(personalData.setCircleFavorite(circle._id, false));
    } else {
      setPersonalData(personalData.setCircleFavorite(circle._id, true));
    }
  };
  const handleFlag = () => {
    setPersonalData(personalData.setCircleFlag(circle._id, (flag + 1) % 6));
  };
  const handleEdit = () => {
    console.log(newNotes);
    setEditing(false);
    setPersonalData(personalData.setCircleNotes(circle._id, newNotes));
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(var(--background-rgb))",
        width: "100%",
        paddingLeft: "1em",
        paddingRight: "1em",
        overflow: "hidden",
      }}
    >
      {circle.loc} · <DayMarker days={circle.days} />
      <div
        style={{
          marginTop: "2em",
          display: "flex",
          float: "right",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <p onClick={handleFavorite}>{isFavorite ? heartFilled : heartEmpty}</p>
        <p style={{ marginTop: "0.5em" }} onClick={handleFlag}>
          {flag > 0 ? flagFilled : flagEmpty}
        </p>
      </div>
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "baseline",
        }}
      >
        <h2>메모</h2>
        <span
          className="fake-a"
          style={{
            marginTop: "0.75em",
            marginLeft: "0.5em",
          }}
          onClick={() => {
            setEditing(true);
            setEditComponent(
              <>
                <textarea
                  placeholder="메모를 입력하세요"
                  style={{
                    border: "1px solid rgb(var(--border-color))",
                    borderRadius: "0.5em",
                    padding: "0.5em",
                    width: "100%",
                    height: "10em",
                    minHeight: "2.5em",
                  }}
                  onInput={(e) => {
                    setNewNotes((e.target as HTMLInputElement).value);
                  }}
                  defaultValue={notes}
                />
              </>
            );
          }}
        >
          {!isEditing && (notes.length > 0 ? "수정하기" : "추가하기")}
        </span>
      </div>
      {isEditing ? (
        editComponent
      ) : (
        <pre className="normal-font">
          {notes.length > 0 ? (
            notes
          ) : (
            <span style={{ color: "gray" }}>메모 없음</span>
          )}
        </pre>
      )}
      {isEditing && (
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            gap: "0.5em",
          }}
        >
          <button
            style={{
              border: "1px solid rgb(var(--border-color))",
              borderRadius: "0.5em",
              width: "5em",
              padding: "0.5em",
              backgroundColor: "cornflowerblue",
              color: "white",
            }}
            onClick={handleEdit}
          >
            수정
          </button>
          <button
            style={{
              border: "1px solid rgb(var(--border-color))",
              borderRadius: "0.5em",
              padding: "0.5em",
            }}
            onClick={() => setEditing(false)}
          >
            취소
          </button>
        </div>
      )}
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
