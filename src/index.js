import { isDate, isString, isUndefined, isNumber } from "./utils";
import {
  INVALID_DATE,
  RULE_PARSE,
  RULE_FORMAT,
  SET_API_HASH,
  WEEK_HASH,
  UNIT_HASH,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MS_PER_SECOND,
  MS_PER_400_YEARS
} from "./config";

const getUnit = function(unit) {
  return UNIT_HASH[unit] || unit.toLowerCase();
};

const dateInstance = function(date) {
  return date ? new Date(date) : new Date();
};

const startOfYMDHandler = (y, m, d) => {
  return y < 100 && y >= 0
    ? new Date(y + 400, m, d) - MS_PER_400_YEARS
    : new Date(y, m, d).valueOf();
};

const Zdate = function(date) {
  if (date instanceof ZDate) {
    return date;
  }
  const config = {};
  if (date) {
    config.date = date;
  }
  return new ZDate(config);
};

class ZDate {
  constructor(config) {
    this._date = this.parse(config.date);
  }

  get year() {
    return this._date.getFullYear();
  }

  get month() {
    return this._date.getMonth();
  }

  get date() {
    return this._date.getDate();
  }

  get day() {
    return this._date.getDate();
  }

  get hour() {
    return this._date.getHours();
  }

  get minute() {
    return this._date.getMinutes();
  }

  get second() {
    return this._date.getSeconds();
  }

  get millisecond() {
    return this._date.getMilliseconds();
  }

  get week() {
    return this._date.getDay();
  }

  set(type, val) {
    if (["month", "M"].includes(type)) {
      val = val - 1;
    }
    this._date[SET_API_HASH[type]](val);
  }

  parse(date) {
    if (isUndefined(date)) return dateInstance();
    if (isDate(date) || isNumber(date)) return dateInstance(date);
    if (isString(date) && RULE_PARSE.test(date)) {
      const list = date.match(RULE_PARSE);
      if (list) {
        return new Date(
          list[1],
          list[2] - 1,
          list[3] || 1,
          list[4] || 0,
          list[5] || 0,
          list[6] || 0,
          list[7] || 0
        );
      }
    }
    return dateInstance();
  }

  format(format = "YYYY-MM-DD HH:mm:ss") {
    const { year, month, date, hour, minute, second, millisecond, week } = this;
    const formatHandler = (val, size) =>
      size > 0 ? String(val).padStart(size, "0") : String(val);
    const matches = {
      YY: formatHandler(year).slice(-2),
      YYYY: formatHandler(year),
      M: formatHandler(month + 1),
      MM: formatHandler(month + 1, 2),
      D: formatHandler(date),
      DD: formatHandler(date, 2),
      d: week,
      dd: WEEK_HASH[week],
      H: formatHandler(hour),
      HH: formatHandler(hour, 2),
      h: formatHandler(hour % 12),
      hh: formatHandler(hour % 12, 2),
      m: formatHandler(minute),
      mm: formatHandler(minute, 2),
      s: formatHandler(second),
      ss: formatHandler(second, 2),
      S: formatHandler(millisecond),
      SS: formatHandler(millisecond, 2)
    };
    return format.replace(RULE_FORMAT, match => matches[match] || match);
  }

  startEnd(u, type = "start") {
    if (!u || !this.isValid() || u === "millisecond") return this;
    const { _date, year, month, date } = this;
    const unit = getUnit(u);
    let time;
    const offset = type === "end" ? 1 : 0;
    const childOffset = type === "end" ? -1 : 0;
    const HMS = function(unitLength) {
      if (type === "end") {
        return (
          _date.valueOf() + unitLength - (_date.valueOf() % unitLength) - 1
        );
      }
      return Math.floor(_date.valueOf() / unitLength);
    };
    switch (unit) {
      case "year":
        time = startOfYMDHandler(year + offset, 0, 1) + childOffset;
        break;
      case "month":
        time = startOfYMDHandler(year, month + offset, 1) + childOffset;
        break;
      case "day":
        time = startOfYMDHandler(year, month, date + offset) + childOffset;
        break;
      case "hour":
        time = HMS(MS_PER_HOUR);
        break;
      case "minute":
        time = HMS(MS_PER_MINUTE);
        break;
      case "second":
        time = HMS(MS_PER_SECOND);
        break;
    }
    this._date.setTime(time);
    return this;
  }

  startOf(u) {
    return this.startEnd(u, "start");
  }

  endOf(u) {
    return this.startEnd(u, "end");
  }

  addSubtract(offset, u, direction) {
    const unit = getUnit(u);
    const deviation = direction > 0 ? offset : -offset;
    this._date[SET_API_HASH[unit]](this[unit] + deviation);
  }

  add(offset, u = "s") {
    this.addSubtract(offset, u, 1);
    return this;
  }

  subtract(offset, u = "s") {
    this.addSubtract(offset, u, -1);
    return this;
  }

  getTime(date) {
    return dateInstance(this.parse(date)).getTime();
  }

  isLeapYear(date) {
    const currentDate = this.parse(date);
    const year = currentDate.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  isBefore(date, u = "s") {
    return this.endOf(u) > this.parse(date);
  }

  isAfter(date, u = "s") {
    return this.startOf(u) > this.parse(date);
  }

  isSame(date, u = "s") {
    return this.startOf(u) === Zdate(date).startOf(u);
  }

  isBetween(date1, date2, u = "s") {
    const start = this.startOf(u);
    const end = this.endOf(u);
    const d1 = this.parse(date1);
    const d2 = this.parse(date2);
    return (start >= d1 && end <= d2) || (start >= d2 && end <= d1);
  }

  isValid() {
    return !(this._date.toString() === INVALID_DATE);
  }

  valueOf() {
    return this.getTime();
  }
}

export default Zdate;
