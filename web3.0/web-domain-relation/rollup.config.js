import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import { name, version } from "./package.json";
import { genSiteConfig } from "./scripts/genSiteConfig.js";

const plugins = [
  {
    name: "generate-site-config",
    buildStart() {
      genSiteConfig();
    },
  },
  resolve(),
  replace({
    preventAssignment: true,
    __DIST_PATH__: JSON.stringify(`${name}/${version}`),
  }),
  commonjs(),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "runtime",
    configFile: path.resolve(__dirname, "babel.config.js"),
  }),
  terser(),
];

export default [
  {
    input: "src/index.js",
    output: {
      file: `dist/${name}/${version}/boot.js`,
      format: "umd",
    },
    plugins,
  },
  // 土耳其站 boot.js
  {
    input: "src/site-tr/index.js",
    output: {
      file: `dist/${name}/${version}/boot_tr.js`,
      format: "umd",
    },
    plugins,
  },
  // 泰国 boot.js
  {
    input: "src/site-th/index.js",
    output: {
      file: `dist/${name}/${version}/boot_th.js`,
      format: "umd",
    },
    plugins,
  },
  // 提币平台
  {
    input: "src/site-cl/index.js",
    output: {
      file: `dist/${name}/${version}/boot_cl.js`,
      format: "umd",
    },
    plugins,
  },
  // 澳洲站
  {
    input: "src/site-au/index.js",
    output: {
      file: `dist/${name}/${version}/boot_au.js`,
      format: "umd",
    },
    plugins,
  },
  // 欧洲站
  {
    input: "src/site-eu/index.js",
    output: {
      file: `dist/${name}/${version}/boot_eu.js`,
      format: "umd",
    },
    plugins,
  },
  // DEMO 站
  {
    input: "src/site-demo/index.js",
    output: {
      file: `dist/${name}/${version}/boot_demo.js`,
      format: "umd",
    },
    plugins,
  },
];
