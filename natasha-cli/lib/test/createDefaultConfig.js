module.exports = (opts) => {
  // 视情况可配置
  const testMatchTypes = ['spec', 'test'];

  // 视情况配置
  const testMatchPrefix = '';

  return {
    collectCoverageFrom: [
      '**/*.{js,jsx,ts,tsx}',
      '!**/typings/**',
      '!**/types/**',
      '!**/fixtures/**',
      '!**/examples/**',
      '!**/*.d.ts',
      '!**/*.config.{js, jsx, ts, tsx}'
    ].filter(Boolean),
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    global: {
      branches: 80, // 分之覆盖率 eg: if else
      functions: 80, // 函数覆盖率
      lines: 80, // 行数覆盖率，就是代码执行了多少行
      statements: 80 // 语句覆盖率，它其实对应的就是 js 语法上的语句，js 解析成 ast 数中类型为statement
    },
    ...(opts.name && {
      displayName: opts.name
    }),
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    moduleNameMapper: {
      '\\.(css|less|sass|scss|stylus)$': require.resolve('identity-obj-proxy')
    },
    setupFiles: [require.resolve('./setupFile.js')],
    setupFilesAfterEnv: [require.resolve('./setupFilesAfterEnv.js')],
    testEnvironment: 'jsdom',
    testMatch: [
      `${testMatchPrefix}**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`
    ],
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': require.resolve('./transformers/javascript'),
      '^.+\\.(css|less|sass|scss|stylus)$':
        require.resolve('./transformers/css'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|less|sass|scss|stylus|json)$)':
        require.resolve('./transformers/file')
    },
    verbose: true,
    transformIgnorePatterns: [],
    // 用于设置 jest worker 启动的个数
    ...(process.env.MAX_WORKERS
      ? { maxWorkers: Number(process.env.MAX_WORKERS) }
      : {})
  };
};
