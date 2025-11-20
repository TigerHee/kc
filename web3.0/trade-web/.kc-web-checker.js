/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-26 22:54:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-05 11:09:11
 * @FilePath: /trade-web/.kc-web-checker.js
 * @Description:
 */
module.exports = {
  test: {
    src: ['./src'], // 文件目录， 如果是根目录，那么填写 ./
    exclude: [
      'node_modules',
      '.umi',
      'src/models',
      'src/services',
      'src/components/Margin/sensors.js',
      'src/pages/Trade3.0',
      'src/components/KcTransferModal/config.js',
      'src/trade4.0/pages',
      'src/trade4.0/services',
      'src/trade4.0/storageKey/chart.js',
      '/(.*)/style.js',
      'src/trade4.0/components/mui/Alert.js', // kux/mui引入未改
      'src/trade4.0/components/mui/Form.js', // kux/mui引入未改
      'src/trade4.0/components/mui/Input.js', // kux/mui引入未改
      'src/trade4.0/meta', // 常量定义目录
      'src/common/models/base.js', // models
      'src/common/models/polling.js', // models
      'src/trade4.0/hooks/common/useMemoizedFn.js', // ahooks源码
      'src/trade4.0/layouts/moduleConfig.js', // 模块配置文件
      'src/trade4.0/hooks/pageInit/useComponentsInit.js',
      'src/runtime-config.js', // 变量文件
      'src/components/App/index.js', // App 文件
      'src/components/Router/index.js', // Router 文件，没逻辑
      'src/utils/delay.js', // saga 对象
      'src/utils/request.js',
      'src/codes.js', // 常亮不需要UT
    ], // 排除的目录
    name: '*.jsx|*.js', // 文件类型，多个类型以| 分割， 如 *.js|*.ts|*.tsx
    type: 'f', // 查找类型，f 代表file, 一般不用更改
    min: 2, // 最小复用数才会被算入覆盖率统计
    genCSV: true, // 是否输出文件扫描结果
    debug: false, // 是否输出最终执行的jest config 到 jest.config.debug.js
    use: 'jest',
  },
  // 以下内容为处理项目中有alias 的情况，若无，则不处理
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': `${__dirname}/src/trade4.0`,
      '@mui': `${__dirname}/src/trade4.0/components/mui`,
      '@/pages/Orderbook': `${__dirname}/src/trade4.0/pages/Orderbook`,
      src: `${__dirname}/src`,
      codes: `${__dirname}/src/codes`,
      assets: `${__dirname}/src/assets`,
      components: `${__dirname}/src/components`,
      hooks: `${__dirname}/src/hooks`,
      hocs: `${__dirname}/src/hocs`,
      models: `${__dirname}/src/models`,
      pages: `${__dirname}/src/pages`,
      pipeline: `${__dirname}/src/pipeline`,
      services: `${__dirname}/src/services`,
      themes: `${__dirname}/src/themes`,
      style: `${__dirname}/src/style`,
      utils: `${__dirname}/src/utils`,
      config: `${__dirname}/src/runtime-config`,
      helper: `${__dirname}/src/helper`,
      paths: `${__dirname}/src/paths`,
    },
  },
};
