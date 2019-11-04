import { array2Object } from "./utils";

export const INVALID_DATE = "Invalid Date";

export const MS_PER_SECOND = 1000;

export const MS_PER_MINUTE = 60 * MS_PER_SECOND;

export const MS_PER_HOUR = 60 * MS_PER_MINUTE;

export const MS_PER_DATE = 24 * MS_PER_HOUR;

export const MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

export const RULE_PARSE = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/;

export const RULE_FORMAT = /\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SS{1,2}/g;

export const SET_API_HASH = {
  year: "setFullYear",
  Y: "setFullYear",
  month: "setMonth",
  M: "setMonth",
  date: "setDate",
  day: "setDate",
  D: "setDate",
  hour: "setHours",
  H: "setHours",
  minute: "setMinutes",
  m: "setMinutes",
  second: "setSeconds",
  s: "setSeconds",
  millisecond: "setMilliseconds",
  ms: "setMilliseconds"
};
export const GET_API_HASH = {
  year: "getFullYear",
  Y: "getFullYear",
  month: "getMonth",
  M: "getMonth",
  date: "getDate",
  day: "getDate",
  D: "getDate",
  hour: "getHours",
  H: "getHours",
  minute: "getMinutes",
  m: "getMinutes",
  second: "getSeconds",
  s: "getSeconds",
  millisecond: "getMilliseconds",
  ms: "getMilliseconds"
};

export const WEEK_HASH = array2Object("日一二三四五六".split(""));

export const UNIT_HASH = {
  y: "year",
  M: "month",
  D: "day",
  H: "hour",
  m: "minute",
  s: "second",
  ms: "millisecond"
};
