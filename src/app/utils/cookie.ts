import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: any, option?: any) => {
  return cookies.set(name, value, { ...option, expires: new Date(9999, 11)});
}

export const getCookie = (name: string, doNotParse: boolean = false) => {
  return cookies.get(name, { doNotParse });
}