# 站点统一配置信息

## 使用

使用时将此文件在head标签内引用，它会自动根据入口域名加载对应的站点配置

```
<head>
  <script src="xxx/boot.js" />
</head>
```

之后在应用内可以使用站点配置的全局变量对象
```
window._WEB_RELATION_
```

KuMEX因为项目变量和主站差异很大，这里单独放置到了子目录，使用时加上`sub`参数即可

```
<head>
  <script src="xxx/boot.js?sub=kumex" />
</head>
```

## 开发环境使用

开发使用时，会去加载开发环境的web-domain-relation服务/sites/dev目录下对应项目的配置。
只需要在boot.js加载参数上设置一个特殊参数`dev`，设置其值为项目名即可。

```
<head>
  <script src="xxx/boot.js?dev=next-web" />
</head>
```

KuMEX因为项目变量和主站差异很大，这里单独放置到了子目录，使用时加上`sub`参数即可

```
<head>
  <script src="xxx/boot.js?dev=next-web&sub=kumex" />
</head>
```


## 部署

将此项目clone到nginx静态目录即可

## 配置说明

此配置项目为ES5规范

```
web-domain-relation ( directories: 2, Files: 11 )
 ├─ sites
 │ ├─ dev                    # 开发用配置写在这个目录下，配置为工程名
 │ │ └─ next-web.js
 │ ├─ sandbox.kucoin.com.js  # 构建发布的站点在sites下，以入口域名为文件名
 │ ├─ sandbox.kucoin.io.js
 │ ├─ v2.kucoin.net.js
 │ ├─ www.kubi.cc.js
 │ ├─ www.kucoin.com.js
 │ └─ www.kucoin.io.js
 ├─ .editorconfig
 ├─ README.md
 ├─ boot.js
 └─ package.json
```


## 开发

安装依赖
```
yarn install
```

开发添加配置后，需要`yarn build`，然后将变更提交到仓库，才能继续发布。

## 修改
目前采用模版开发，`tpls/` 目录存放各个站点的模板, 以.xxx.js 为结尾， 如 land.kucoin.xxx.js 为land 的模版，会生成 land.kucoin.net, land.kucoin.com等
  变量说明：
  ```
    // tld 顶级域名
    // tldCN 国内顶级域名
    // entry 文件名中前两位
  ```
  1. 创建某个指定域名(land.kucoin.test)的配置
    1.1 在tpls 目录下方创建land.kucoin.test.js 文件， 内容参考v2.kucoin.net

  2. 新建一个子域的配置，如 test.kucoin.xxx(com、center、top、cc 等)
    2.1 参照www.kucoin.xxx 创建 test.kucoin.xxx.js 文件，填充内容
    2.2 如果需要指定test.kucoin.xxx 中某个域名，参照1 中步骤


## 自动解析版本
出于域名变更的需求，现将bootjs 的生成更改为动态解析，即根据当前引用的域名自动配置；
  1. 增/删/改 域名配置， 请操作 src/tpl.js; tldCN 国内顶级域名配置 在 ```scripts/config.js```;
  2. 由于测试环境的不统一，当前占位对测试环境进行支持
