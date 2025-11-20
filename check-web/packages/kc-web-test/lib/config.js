function getDefaultConfig() {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`${process.env.PWD}/.kc-web-checker.js`);
  } catch (e) {
    return {};
  }
}

const getConfig = () => {
  const { test: TestConfig } = getDefaultConfig();
  const _config = Object.assign(
    {},
    {
      src: ['./src'], // 文件目录， 如果是根目录，那么填写 ./
      exclude: ['node_modules', '.umi'], // 排除的目录
      name: '*.jsx|*.js', // 文件类型，多个类型以| 分割， 如 *.js|*.ts|*.tsx
      type: 'f', // 查找类型，f 代表file, 一般不用更改
      min: 2, // 最小复用数才会被算入覆盖率统计
      genCSV: false, // 是否输出文件扫描结果
      debug: false, // 是否输出最终执行的jest config 到 jest.config.debug.js
      use: 'umi-test', // 原本test 执行的命令， umi test 或者 jest  等
    },
    TestConfig || {}
  );
  return _config;
};

const baseBranchsPct = 60;
const baseCoverageThreshold = {
  global: {
    branches: 60,
    functions: 60,
    lines: 60,
    statements: 60,
  },
};

module.exports = {
  baseBranchsPct,
  baseCoverageThreshold,
  getDefaultConfig,
  getConfig,
};
