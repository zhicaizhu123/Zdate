// 获取数据类型
function isType(type) {
  return function(val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`;
  };
}

export function array2Object(arr, key) {
  if (!arr.length) {
    console.warning("传入数组为空");
    return null;
  }
  return arr.reduce((acc, val, index) => {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
}

// 判断是否为Date类型
export const isDate = isType("Date");

// 判断是否为String类型
export const isString = isType("String");

// 判断是否为Undefined类型
export const isUndefined = isType("Undefined");
