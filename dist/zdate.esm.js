function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// 获取数据类型
function isType(type) {
  return function (val) {
    return Object.prototype.toString.call(val) === "[object ".concat(type, "]");
  };
}

function array2Object(arr, key) {
  if (!arr.length) {
    console.warning("传入数组为空");
    return null;
  }

  return arr.reduce(function (acc, val, index) {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
} // 判断是否为Date类型

var isDate = isType("Date"); // 判断是否为String类型

var isString = isType("String"); // 判断是否为Undefined类型

var isUndefined = isType("Undefined");
var isNumber = isType("Number");

var INVALID_DATE = "Invalid Date";
var MS_PER_SECOND = 1000;
var MS_PER_MINUTE = 60 * MS_PER_SECOND;
var MS_PER_HOUR = 60 * MS_PER_MINUTE;
var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
var RULE_PARSE = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/;
var RULE_FORMAT = /\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SS{1,2}/g;
var SET_API_HASH = {
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
var WEEK_HASH = array2Object("日一二三四五六".split(""));
var UNIT_HASH = {
  y: "year",
  M: "month",
  D: "day",
  H: "hour",
  m: "minute",
  s: "second",
  ms: "millisecond"
};

var getUnit = function getUnit(unit) {
  return UNIT_HASH[unit] || unit.toLowerCase();
};

var dateInstance = function dateInstance(date) {
  return date ? new Date(date) : new Date();
};

var startOfYMDHandler = function startOfYMDHandler(y, m, d) {
  return y < 100 && y >= 0 ? new Date(y + 400, m, d) - MS_PER_400_YEARS : new Date(y, m, d).valueOf();
};

var Zdate = function Zdate(date) {
  if (date instanceof ZDate) {
    return date;
  }

  var config = {};

  if (date) {
    config.date = date;
  }

  return new ZDate(config);
};

var ZDate =
/*#__PURE__*/
function () {
  function ZDate(config) {
    _classCallCheck(this, ZDate);

    this._date = this.parse(config.date);
  }

  _createClass(ZDate, [{
    key: "set",
    value: function set(type, val) {
      if (["month", "M"].includes(type)) {
        val = val - 1;
      }

      this._date[SET_API_HASH[type]](val);
    }
  }, {
    key: "parse",
    value: function parse(date) {
      if (isUndefined(date)) return dateInstance();
      if (isDate(date) || isNumber(date)) return dateInstance(date);

      if (isString(date) && RULE_PARSE.test(date)) {
        var list = date.match(RULE_PARSE);

        if (list) {
          return new Date(list[1], list[2] - 1, list[3] || 1, list[4] || 0, list[5] || 0, list[6] || 0, list[7] || 0);
        }
      }

      return dateInstance();
    }
  }, {
    key: "format",
    value: function format() {
      var _format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "YYYY-MM-DD HH:mm:ss";

      var year = this.year,
          month = this.month,
          date = this.date,
          hour = this.hour,
          minute = this.minute,
          second = this.second,
          millisecond = this.millisecond,
          week = this.week;

      var formatHandler = function formatHandler(val, size) {
        return size > 0 ? String(val).padStart(size, "0") : String(val);
      };

      var matches = {
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
      return _format.replace(RULE_FORMAT, function (match) {
        return matches[match] || match;
      });
    }
  }, {
    key: "startEnd",
    value: function startEnd(u) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "start";
      if (!u || !this.isValid() || u === "millisecond") return this;
      var _date = this._date,
          year = this.year,
          month = this.month,
          date = this.date;
      var unit = getUnit(u);
      var time;
      var offset = type === "end" ? 1 : 0;
      var childOffset = type === "end" ? -1 : 0;

      var HMS = function HMS(unitLength) {
        if (type === "end") {
          return _date.valueOf() + unitLength - _date.valueOf() % unitLength - 1;
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
  }, {
    key: "startOf",
    value: function startOf(u) {
      return this.startEnd(u, "start");
    }
  }, {
    key: "endOf",
    value: function endOf(u) {
      return this.startEnd(u, "end");
    }
  }, {
    key: "addSubtract",
    value: function addSubtract(offset, u, direction) {
      var unit = getUnit(u);
      var deviation = direction > 0 ? offset : -offset;

      this._date[SET_API_HASH[unit]](this[unit] + deviation);
    }
  }, {
    key: "add",
    value: function add(offset) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      this.addSubtract(offset, u, 1);
      return this;
    }
  }, {
    key: "subtract",
    value: function subtract(offset) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      this.addSubtract(offset, u, -1);
      return this;
    }
  }, {
    key: "getTime",
    value: function getTime(date) {
      return dateInstance(this.parse(date)).getTime();
    }
  }, {
    key: "isLeapYear",
    value: function isLeapYear(date) {
      var currentDate = this.parse(date);
      var year = currentDate.getFullYear();
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
  }, {
    key: "isBefore",
    value: function isBefore(date) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      return this.endOf(u) > this.parse(date);
    }
  }, {
    key: "isAfter",
    value: function isAfter(date) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      return this.startOf(u) > this.parse(date);
    }
  }, {
    key: "isSame",
    value: function isSame(date) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "s";
      return this.startOf(u) === Zdate(date).startOf(u);
    }
  }, {
    key: "isBetween",
    value: function isBetween(date1, date2) {
      var u = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "s";
      var start = this.startOf(u);
      var end = this.endOf(u);
      var d1 = this.parse(date1);
      var d2 = this.parse(date2);
      return start >= d1 && end <= d2 || start >= d2 && end <= d1;
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return !(this._date.toString() === INVALID_DATE);
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.getTime();
    }
  }, {
    key: "year",
    get: function get() {
      return this._date.getFullYear();
    }
  }, {
    key: "month",
    get: function get() {
      return this._date.getMonth();
    }
  }, {
    key: "date",
    get: function get() {
      return this._date.getDate();
    }
  }, {
    key: "day",
    get: function get() {
      return this._date.getDate();
    }
  }, {
    key: "hour",
    get: function get() {
      return this._date.getHours();
    }
  }, {
    key: "minute",
    get: function get() {
      return this._date.getMinutes();
    }
  }, {
    key: "second",
    get: function get() {
      return this._date.getSeconds();
    }
  }, {
    key: "millisecond",
    get: function get() {
      return this._date.getMilliseconds();
    }
  }, {
    key: "week",
    get: function get() {
      return this._date.getDay();
    }
  }]);

  return ZDate;
}();

export default Zdate;
