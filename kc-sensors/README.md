# 神策 Web SDK 集成

针对神策数据分析平台 Web SDK 二次封装

## 接入方式

~~_npm_~~

~~`npm install @kc/sensors`~~

_cdn_ （推荐方式）

测试环境:

`<script src=" https://assets-v2.kucoin.net/common-statics/sensors/kcsensors.min.js"></script>`

生产环境

`<script src="https://assets3.staticimg.com/sensors/kcsensors.min.js"></script>`

## API

npm 安装方式 API 从 '@kc/sensors' 模块导出

cdn 安装方式 API 挂载到全局变量 $KcSensors

---
### `init(config, siteId, pageIdMap)`
---

**Arguments**

- config _(Object)_: 初始化配置

  - config.env _(String)_
  
    除非设置成 'production' 否则 server_url 都走测试环境, 设置成 'development' 开启 log, 也可以通过 log 配置关闭 （开发环境、测试环境 一律设置成 development）

  - config.send_url  _(String)_
  
    send_url 用于修改数据发送地址

  - config.abtest_url _(String)_

    默认为 null，传入分流地址可同时开启 AB 测试功能

  - config.page_view _(Boolean)_

    是否开启全埋点 $pageview 事件, 默认开启

  - config.web_click _(Boolean)_

    是否开启全埋点 $WebClick 事件，默认关闭

  - config.web_stay _(Boolean)_
  
    是否开启全埋点 $WebStay 事件，默认关闭

  - config.web_page_leave _(Boolean)_

    是否开启自定义事件 web_page_leave，用户上报用户停留时长

  - config.log _(Boolean)_
  
    当 env 为 'development' 并且不需要 log 数据信息的时候，配置此选项为 false, 默认为 true

  - config.spa _(Boolean)_
  
    是否为单页，url改变自动采集 $pageview 事件

  - ...restConfig

    神策 SDK init 方法接受的其它配置

- siteId _(String)_ 站点 id
- pageIdMap _(Object)_ 路由 -> 页面 id 的对应关系对象

**Returns**

registerPage _(Function)_: 返回 registerPage 函数，用于设置公共属性

设置公共属性。内置公共属性 `is_login, is_vip, vip_level`

*Arguments*

- config: 自定义公共属性对象, 一般情况下 `config.app_name` 要求传递。用于标识项目。

*Returns*

sensors _(Object)_: 神策 SDK 实例 

---
### `track(event, data)`
---

Event 实体手动埋点方法

**Arguments**

event _(String)_ : 事件名

data _(Object)_ : 事件携带数据

---
### `login(uid, vip_level)`
---

标示用户

**Arguments**

- uid _(String)_ : 用户uid
- vip_level _(String)_: 用户 vip 等级 （注意 Number 转 String）

---
### `trackClick(spm, data)`
---

元素点击事件 `web_click`

**Arguments**

- spm _(Array)_: [blockId _(String)_, eleId _(String)_]  或者 [pageId _(String)_, [blockId _(String)_, eleId _(String)_]] spm 区块和元素
- data _(Object)_: 事件携带的自定义参数

---
### `observeExpose(options)`
---

元素曝光事件 `expose`

调用 `observeExpose` 方法会在内部创建一个 `IntersectionObserver` 实例，并创建对应的 `WeakMap` 缓存对象。返回 `observe` 用于观察元素曝光。 如果对 IntersectionObserver 没有特殊的定制要求，全局维持一个实例就好，可以通过 `context` api 共享 `observe` 方法。

**Arguments**

- options _(Object)_ `IntersectionObserver` 配置对象

**Returns**

observe(ele, getTrackParams) _(Function)_ 用于观察元素曝光

*Arguments*

- ele: 要观察的 DOM 元素，必须是 DOM 对象
- getTrackData _(Function)_: 获取曝光事件需要携带的参数。每次元素进入 viewport 时调用。当返回值是 plainObject 并且 spm 属性是合法的 spm 参数 [blockId _(String)_, eleId _(String)_] 或者 [pageId _(String)_, [blockId _(String)_, eleId _(String)_]], 才进行上报。可以通过此函数返回 false 来手动控制不上报 expose 事件。

*Returns*

unobserve _(Function)_ 调用此函数将停止内部对 DOM 进入 viewport 的观察, 并销毁对应的缓存

---
### `getAnonymousID()`
---

获取用户匿名 ID，一般用于登录、注册后传给后端关联用户

---
### `fastFetchABTest`
---

**Arguments**

- config _(Object)_ 配置对象

  - config.param_name: 实验参数名
  - config.default_value: 实验默认值，请求错误或者超时 result 返回默认值
  - config.value_type: 实验结果数据类型

*Returns*

_(Promise)_

```js
fastFetchABTest({ param_name: 'foo', default_value: 0, value_type: 'Number' }).then(result => {
  // 处理实验结果
})
```

请求 AB 测试结果
## 几点说明

**运行环境**

脚本内部会判断运行环境，如果是 KuCoin 的 app 内部运行，将自动开启 app_js_bridged 配置，用于打通 app, 实际上报将会走 app 进行

**曝光补充**

曝光事件各业务线需求不太一样，对外部提供函数来灵活处理

**关于spm参数**

由于 pv 事件 spm 的 page_id 和路由是一一对应的，任何事件的 page_id 本质上可以在 pageIdMap 对象上获取。业务线自定义事件本不用关心 page_id。但是现在产品要求允许在统一路由下出现不同的 page_id @Suki。spm 改造成允许传递二维数组 [pageId, [blockId, eleId]] 或者一维数组 [blockId, eleId] (模拟函数重载)。事件内部会对 page_id 进行判断，优先读配置的 page_id ，如果读不到，则使用业务传递的 page_id，如果都没有，上报的 page_id 为 `''`。


