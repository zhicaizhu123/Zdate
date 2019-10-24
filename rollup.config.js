import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
console.log(uglify);
const isProduction = process.env.ENV === "production";

const min = isProduction ? ".min" : "";

const config = {
  input: "src/index.js",
  output: {
    file: `dist/zdate${min}.js`,
    format: "umd",
    name: "Utils"
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**" // 只编译我们的源代码
    })
  ]
};

if (isProduction) {
  config.plugins.push(
    uglify({
      warnings: false,
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true
      }
    })
  );
}

export default config;
