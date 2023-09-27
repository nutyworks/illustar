import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: any, option?: any) => {
  return cookies.set(name, value, { ...option, expires: "never" });
}

export const getCookie = (name: string, doNotParse: boolean = false) => {
  return cookies.get(name, { doNotParse });
}