# 多租户开发

## 本地开发 mock 数据使用

1. 配置环境变量, 修改环境变量文件 `.env.local`
   1. 设置mock数据所在目录: 环境变量名以 `REACT_MOCK_PATH` 前缀命名来指定mock代码所在的绝对路径, 可指定多个路径
   2. 启用mock: 将变量 `REACT_ENABLE_MOCK` 设置为 `true`
   ```sh
    # 配置示例
    # 启用 mock
    REACT_ENABLE_MOCK=true
    # 设置 mock 代码路径, 变量名只要以 REACT_MOCK_PATH 开头即可
    REACT_MOCK_PATH=/Users/saiya/Developer/kucoin/public-web/mock
    REACT_MOCK_PATH_2=/Users/saiya/Developer/kucoin/main-web/mock
    REACT_MOCK_PATH_platform=/Users/saiya/Developer/kucoin/platform-operation-web/mock
   ```
2. 子应用中安装包 `@kc/mk-plugin-mock`, 子应用主要使用该包提供的typescript类型定义, 若不使用, 则可跳过
3. 在子应用中的mock文件夹中添加mock代码, [参考文档](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/745180635/mock). 更改mock代码后, 刷新页面即可, 无需重启服务器
4. 可以在地址栏中添加查询参数 `?__skip_mock__` 来临时禁用全部接口的mock

## 静态资源改造注意事项
> SRI 的改造中，对部分的手动处理的静态脚本资源增加 **integrity** 字段，如有修改的时候，需要同步修改导出的hash，获取sha384 base64 的摘要方式： openssl dgst -sha384 -binary yourfile.js | openssl base64 -A  

### 涉及范围
1. *index.html* 的 *script* 标签
2. *craco.config* 基座上加载的 *import-map.json* 的框架依赖 

## 主站
yarn start

## 泰国站
启动命令 `yarn start:th`

需要在 .env.local 增加相应线下代理地址（二选一）

```sh
// sit
NGINX_ENV_ORIGIN_TH=https://site-01.th.sit.kucoin.net

// dev
NGINX_ENV_ORIGIN_TH=https://site-01.th.dev.kucoin.net
```

## 土耳其站
启动命令 `yarn start:tr`

需要在 .env.local 增加相应线下代理地址（二选一）

```
// sit
NGINX_ENV_ORIGIN_TR=https://site-01.tr.sit.kucoin.net

// dev
NGINX_ENV_ORIGIN_TR=https://site-01.tr.dev.kucoin.net
```

## 清退平台
启动命令 `yarn start:cl`

需要在 .env.local 增加相应线下代理地址（二选一）

```
// sit
NGINX_ENV_ORIGIN_CL=https://site-01.cl.sit.kucoin.net

// dev
NGINX_ENV_ORIGIN_CL=https://site-01.cl.dev.kucoin.net
```
