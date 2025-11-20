const path = require("path");

function getDefaultConfig() {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`${process.env.PWD}/.kc-web-checker.js`);
  } catch (e) {
    return {};
  }
}

const getDepConfig = () => {
  const { depOptions } = getDefaultConfig();
  const root = process.env.PWD;
  const _config = Object.assign(
    {},
    {
      projectRoot: path.join(root, "src"),
      alias: {
        scripts: "../scripts",
        static: "../cdnAssets/static",
        src: ".",
        helper: "./helper",
        config: "./config",
        codes: "./codes",
        paths: "./paths",
        utils: "./utils",
        tools: "./tools",
        hocs: "./hocs",
        routes: "./routes",
        models: "./models",
        services: "./services",
        selector: "./selector",
        components: "./components",
        meta: "./meta",
        common: "./common",
        hooks: "./hooks",
        theme: "./theme",
      },
    },
    depOptions || {}
  );
  return _config;
};

module.exports = {
  getDepConfig,
};
