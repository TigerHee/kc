# `kc-web-test`

> TODO: description

## Usage

```
// 安装
yarn add kc-web-test

// 在 .kc-web-checker.js 中添加配置
module.exports = {
    ...,

    test: {
        src: ['./src'],// 文件目录， 如果是根目录，那么填写 ./
        exclude: ['node_modules', '.umi'],// 排除的目录
        name: '*.jsx|*.js',// 文件类型，多个类型以| 分割， 如 *.js|*.ts|*.tsx
        type: 'f',// 查找类型，f 代表file, 一般不用更改
        min: 2, // 最小复用数才会被算入覆盖率统计
        genCSV: false, // 是否输出文件扫描结果
        debug: false, // 是否输出最终执行的jest config 到 jest.config.debug.js
        use: "umi test" // 原本test 执行的命令， umi test 或者 jest  等
    },
    // 以下内容为处理项目中有alias 的情况，若无，则不处理
    resolve: {
        extensions:['.js', '.json'], // 文件的扩展名，如果有jsx或者其他的，应当添加
        alias: {
            src: path.join(process.env.cwd, "./src/components")
            ...
        }
    }
}
// 修改package.json  test 命令 
"test": "kc-web-test"

```

### 说明
1. 由于kc/mui 的babel 构建注入es helper, 导致单测失败，处理方式
   * 方法1 更新依赖 @kc/mui@0.7.7-beta.10, 
   * 方法2 在moduleNameMap 添加对应的处理，将所以的组件都映射成一个返回内容

