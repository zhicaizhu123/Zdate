# Zdate

日期时间处理插件

## 安装

```sh
npm install -S zdatejs
```

## 开始使用

引入

```js
import zdate from "zdatejs";
```

### 初始化

`zdate(params?: Date|string|number)`  
params 参数可以为 Date 实例，格式化日期字符串，时间戳或者不传表示当前时间

<details>
<summary>举例</summary>

```js
// 参数为空，表示取当前时间
zdate();
// 参数为Date实例
zdate(new Date());
// 参数为时间戳
zdate(Date.now());
// 参数为格式化字符串
zdate("2019-10-10 10:10:10");
```

</details>

### 获取对应单位时间

- year：年
- month：月
- date：日
- hour：时
- minute：分
- second：秒
- millisecond：毫秒
- week：星期

<details>
<summary>举例</summary>

```js
const year = zdate().year; // 获取年

const month = zdate().month; // 获取月

const date = zdate().date; // 获取日

const hour = zdate().hour; // 获取时

const minute = zdate().minute; // 获取分

const second = zdate().second; // 获取秒

const millisecond = zdate().millisecond; // 获取毫秒

const week = zdate().week; // 获取星期
```

</details>

### 获取对应单位时间

<details>
<summary>举例</summary>

```js
zdate().set("year", 2019); // 设置为2019年
// 或
zdate().set("Y", 2019);

zdate().set("month", 10); // 设置为10月份
// 或
zdate().set("M", 10);

zdate().set("day", 3); // 设置为3日
// 或
zdate().set("date", 3);
// 或
zdate().set("D", 3);

zdate().set("hour", 13); // 设置为13小时
// 或
zdate().set("H", 13);

zdate().set("minute", 23); // 设置为23分钟
// 或
zdate().set("m", 23);

zdate().set("second", 59); // 设置为59秒
// 或
zdate().set("s", 59);

zdate().set("millisecond", 45); // 设置为45毫秒
// 或
zdate().set("ms", 45);
```

</details>

### 格式化时间

`format(str?: string)`  
str 为结合以下字符格式拼接而成的字符串：

- YY: 只显示年份的后两位，如 09,
- YYYY: 显示年份全部信息，如 2019,
- M: 显示实际月份，如 1，12,
- MM: 月份以 2 位数显示，不够则向前填充 0，如 01，12,
- D: 显示实际日，如 1，12,
- DD: 日以 2 位数显示，不够则向前填充 0，如 01，12,
- d: week,
- dd: WEEK_HASH[week],
- H: 显示实际 24 小时制，如 1，23,
- HH: 24 小时制以 2 位数显示，不够则向前填充 0，如 01，12,
- h: 显示实际 12 小时制，如 1，12,
- hh: 12 小时制以 2 位数显示，不够则向前填充 0，如 01，12,
- m: 显示实际分支，如 1，12,
- mm: 分钟以 2 位数显示，不够则向前填充 0，如 01，12,
- s: 显示实际秒，如 1，12,
- ss: 秒以 2 位数显示，不够则向前填充 0，如 01，12,
- S: 显示实际毫秒，如 1，12,
- SSS: 毫秒以 3 位数显示，不够则向前填充 0，如 01，12

<details>
<summary>举例</summary>

```js
const d1 = zdate().format("YYYY-MM-DD"); // 2019-10-24

const d2 = zdate().format("YYYY-MM-DD HH:mm:ss"); // 2019-10-24 14:02:40

const d2 = zdate().format("YYYY年MM月DD日 HH时mm分ss秒"); // 2019年10月24日 14时02分40秒
```

</details>

### 获取指定类型的首末时间

`startOf(unit: string)`  
`endOf(unit: string)`  
unit 有以下几种类型：

- month | M：按照月级别
- date | D：按照日级别
- hour | H：按照小时级别
- minute | m：按照分钟级别
- second | s：按照秒级别

<details>
<summary>举例</summary>

```js
// 假设当前时间为2019-10-24 12:30:30

const startOfMonth = zdate()
  .startOf("month")
  .format("YYYY-MM-DD"); // 2019-10-01
const endOfMonth = zdate()
  .endOf("month")
  .format("YYYY-MM-DD"); // 2019-10-31

const startOfHour = zdate()
  .startOf("hour")
  .format("YYYY-MM-DD HH:mm"); // 2019-10-24 12:00
const endOfHour = zdate()
  .endOf("hour")
  .format("YYYY-MM-DD HH:mm"); // 2019-10-24 12:59
```

</details>

### 设置偏移时间

- 右偏差：`add(offset: number, unit?:string = 'second')`
- 左偏差： `subtract(offset: number, unit?:string = 'second')`  
  其中 offset 和 unit 取值如下：

- offset：偏差值
- unit：与上面介绍的 unit 一致

<details>
<summary>举例</summary>

```js
// 假设当前时间为2019-10-24 12:30:30

const addMonth = zdate()
  .add(1, "month")
  .format("YYYY-MM-DD"); // 2019-11-24
const subtractMonth = zdate()
  .subtract(1, "month")
  .format("YYYY-MM-DD"); // 2019-09-24

const addHour = zdate()
  .add(1, "hour")
  .format("YYYY-MM-DD HH:mm"); // 2019-10-24 13:30
const subtractHour = zdate()
  .subtract(1, "hour")
  .format("YYYY-MM-DD HH:mm"); // 2019-10-24 11:30
```

</details>

### 比较时间

- 时间是否在 date 之前：`isBefore(date, unit?:string="second")`
- 时间是否在 date 之后：`isAfter(date, unit?:string="second")`
- 时间是否在 date 相等：`isSame(date, unit?:string="second")`
- 时间是否在 date1 和 date2 之间：`isBetween(date1, date2, unit?:string="second")`

<details>
<summary>举例</summary>

```js
// 假设当前时间为2019-10-24 12:30:30

const isAfter = zdate().isAfter("2019-10-25", "month"); // => true
const isBefore = zdate().isBefore("2019-10-24 11:30:30", "hour"); // => true

const isSame = zdate().isSame("2019-10-24", "month"); // => true
const isBetween = zdate().isBetween("2019-10-23", "2019-10-25", "month"); // => true
```

</details>

### 转化为时间戳

`valueOf()`

<details>
<summary>举例</summary>

```js
const time = zdate().valueOf();
```

</details>
