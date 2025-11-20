# @kux/app-sdk
app-sdk for Kux Design

组件公共函数础库, 会像全局注入 `app` 对象

## 目录
- [@kux/app-sdk](#kuxapp-sdk)
  - [目录](#目录)
  - [初始化](#初始化)
  - [API](#api)
    - [基本配置](#基本配置)
    - [事件处理](#事件处理)
    - [数据存储](#数据存储)
    - [数据格式化](#数据格式化)
    - [URL \& location 相关信息](#url--location-相关信息)
      - [获取 地址栏中的查询参数](#获取-地址栏中的查询参数)
    - [打开链接地址](#打开链接地址)
      - [解析查询参数](#解析查询参数)
      - [构造 URL](#构造-url)
      - [向URL中添加语言信息](#向url中添加语言信息)
    - [多语言](#多语言)
    - [环境信息 \& 混合应用](#环境信息--混合应用)
    - [其他工具](#其他工具)

## 初始化
本库有环境依赖, 使用前需要进行基础配置:
```ts

app.config({
  // telegram 环境中 设置 tma SDK
  tmaSDK: <isInTma> ? <tmaObj> : false,
  // jsBridge 环境中 设置 JsBridge sdk 对象
  jsBridge: app.isInApp ? <jsBridgeObj> : false,
})
```


## API

### 基本配置
```ts
export interface IAppConfig {
  /**
   * 与服务器的时间差, 值为服务器时间减去本地时间
   * * 需要后端配合, 有一个专门的接口返回当前服务器时间
   * * 实际计算需考虑服务器响应时间, 算法: Math.floor(服务器时间 - 本地时间 + (请求开始时间 - 请求响应时间) / 2))
   * * 设置后通过 app.now() 即可获取与服务器时间一致的时间戳
   */
  timeDiff: number
  /**
   * 前端界面展示使用的时区, 默认 UTC(0 时区)
   * * 会影响 app.formatDateTime 使用的时区默认值
   */
  timeZone: string
  /**
   * 备用语言, 当页面内容区不支持用户语言时的备用语言
   * * 部分需要翻译、地区相关接口可能会使用该语言
   */
  fallbackLang?: string
  /**
   * TMA(Telegram) SDK 对象
   * * 仅在 TMA 环境下设置该对象(也用于在应用中判断是否在 TMA 环境中)
   */
  tmaSDK?: any
  
  /**
   * JsBridge 对象
   * * 仅在 App 环境下设置该对象
   */
  jsBridge?: any
}
// 读取基本配置
function config(): IAppConfig
function config<T extends keyof IAppConfig>(key: T): IAppConfig[T]
// 设置基本配置
function config<T extends keyof IAppConfig>(key: T, val: IAppConfig[T]): void
function config(cfg: Partial<IAppConfig>): void


```

示例
```ts
app.config({
  timeDiff: 0, // 与服务器时间差, 需要有专门的接口可以返回当前服务器时间
  timeZone: 'UTC+8', // 设置前端默认使用 utf8 时区格式化时间
})

/**
 * 返回与服务器时间一致的时间戳
 */
app.now() // 返回时间戳
```

### 事件处理

```ts
/**
 * 监听事件, callback 可返回内容作为对 emit 的回应
 */
app.on(eventName: string, callback: Function)
/**
 * 单次监听事件
 */
app.once(eventName: string, callback: Function)
/**
 * 触发事件
 * * 监听(on)事件中第一个成功的且返回非undefined 的会作为返回结果
 */
app.emit(eventName: string, ...args: any[]): Promise<any>
/**
 * 取消事件监听
 */
app.off(eventName: string | string[], callback?: Function)

/**
 * 内置事件名称 map
 */
app.BUILTIN_EVENT_NAMES
```

示例
```ts
// 监听事件并返回响应结果
app.on('some-event', function (arg1, arg2) {
  return 'response ' + arg1 + arg2
})

// 触发事件, 使用 promise 方式获取结果
app.emit('some-event', 'hello', 'world')
  .then(console.log)

// 取消事件监听
app.off('some-event')
```

事件处理基于类 `app.EventHub` 实现, 业务中有需要的可以拓展本类来实现自定义的事件系统.


### 数据存储
```ts
export interface IStorageOptions {
  /**
   * 存储的区域
   * * local: localStorage, 若不可用则回退至 sessionStorage 或 memory
   * * session: sessionStorage, 若不可用则回退至 memory
   * * memory: 内存
   */
  area: 'local' | 'session' | 'memory'
  /**
   * 命名空间, 及底层存储key的前缀, 默认 'kucoinv2'
   */
  namespace?: string
  /**
   * 是否公开存储, 即不使用站点前缀, 默认为 false
   * 仅在共享站中需要共享的信息(如kc_theme) 才需要将该值设置为true
   * @default false
   */
  isPublic?: boolean
}
// 获取本地存储的值, 默认从 localStorage 读取(若不可用, 则从 sessionStorage 或者 memory 中)
//  会尝试JSON.parse, 若失败则返回原始值
app.storage(key: string)
// 高级的读取方法
app.storage(options: IStorageOptions, key: string)

// 存储内容
app.storage(key: string, val: any)
app.storage(options: IStorageOptions, key: string, val: any)

// 删除存储的内容, 最后一个参数为 null / undefined 即删除
app.storage(key: string, val: null) 
app.storage(options: IStorageOptions, key: string, val: null)
```

示例
```ts
// 读取
const version = app.storage('app-version');
// 写入
app.storage('app-version', '1.2.3');
// 删除
app.storage('app-version', null);

// 写入到内存, 并使用自定义存储的前缀
app.storage({area: 'memory', namespace: 'mk'}, 'version', '1.1.1')

```


### 数据格式化
```ts
// 格式化日期
app.formatDateTime(date: string  | number | Date, options: IFormatDateTimeOptions): string
export interface IFormatDateTimeOptions extends Intl.DateTimeFormatOptions {
  /**
   * 语言, 默认为当前语言
   */
  lang?: string;
}

// 格式化数字
app.formatNumber(number: number | string, options: IFormatNumberOptions): string
export interface IFormatNumberOptions extends Intl.NumberFormatOptions {
  /**
   * 语言, 默认为当前语言
   */
  lang?: string;
  /**
   * 是否显示符号, 负数始终显示符号 -
   * * 若为true, 正数会显示 +
   */
  showSign?: boolean;
}
```

示例

```ts
// 根据 app.config 配置的 timeZone 来格式化时间, 默认为 utc0
const timeString = app.formatDateTime(Date.now())

// 使用用户浏览器本地时区来格式化时间, timeZone 传如 falsy 值即可
const timeLocalString = app.formatDateTime(Date.now(), {
  timeZone: null
})

const numberString = app.formatNumber(1222323.232323, { showSign: true});
```


### URL & location 相关信息

#### 获取 地址栏中的查询参数
```ts
app.param() // => 返回全部查询参数
app.param('<query-name>') // => 获取指定参数的查询参数
// 若查询参数只有key没有value, 则其值为空字符串
//  如 `?abc&ddd=&ccc=223`, 查询参数 abc、 ddd 值均为空字符串 ''
```

### 打开链接地址

根据环境自动打开相应的链接地址

```ts
app.openLink(options: IOpenLinkOptions)
export interface IOpenLinkOptions {
  /**
   * 统一的链接地址
   * * 若对应平台有传其专有地址, 则该链接地址将被忽略
   */
  link?: string
  /**
   * web 页面路径
   */
  webLink?: string
  /**
   * app 页面路径
   */
  appLink?: string
  /**
   * tma(tg 小程序中) 页面路径
   */
  tmaLink?: string
  /**
   * 打开方式
   * 
   * app 中:
   * * external 使用系统浏览器, 其他则使用 app 内置webview
   * 
   * web 中:
   * * new/external: 使用新窗口
   * * replace: 替换当前页面(默认行为)
   * 
   * tma 不支持制定打开方式
   * 
   */
  open?: 'new' | 'replace' | 'external'
}
```

示例:
```ts
app.openLink({
  webLink: '/trade',
  appLink: '/trade',
  tmaLink: 'https://www.kucoin.com/trade'
})
```


#### 解析查询参数
```ts
/**
 * * url 省略则使用当前浏览器地址栏url
 * * url 可以是带query的完整路径.也可以是部分路径, 也可以只有 query 本身
 */
app.utils.searchToJson(url?: string): Record<string, any>
```

示例
```ts
const params =  app.utils.searchToJson() // 效果同 app.param()

const customParams = app.utils.searchToJson('abc=23&sss')
```

#### 构造 URL

```ts
app.utils.buildURL(path: string, options: IBuildURLOptions = {}): string

export interface IBuildURLOptions {
  /**
   * 是否为 app 路径
   * * true 时 lang 参数会被忽略, 返回为 app 使用的相对路径而非带域名的完整路径
   */
  isAppPath?: boolean
  /**
   * 是否清除已有的查询参数
   */
  clearQuery?: boolean
  /**
   * 是否清除 hash 参数
   */
  clearHash?: boolean
  /**
   * 额外追加的查询参数
   */
  query?: Record<string, any>
  /**
   * 路径语言
   * * 若为 false, 则不追加语言到路径
   * * 若为 string, 则使用该语言
   * * 默认使用当前语言替换路径中的语言 
   */
  lang?: string | false
}
```

示例
```ts
const appPath = app.utils.buildURL('/trade?aaa=23', {
  isAppPath: true,
  clearQuery: true,
  query: {
    currency: 'BTC-USDT'
  }
}); // => '/trade?currency=BTC-USDT


// 假设当前host为 http://www.kucoin.com
const webPath = app.utils.buildURL('/trade?aaa=23', {
  // 将语言指定为繁体中文
  lang: 'zh_HK',
  query: {
    currency: 'BTC-USDT'
  }
}); // => 'http://www.kucoin.com/zh-hant/trade?aaa=23&currency=BTC-USDT

```

#### 向URL中添加语言信息
```ts
/**
 * lang 不传则使用当前语言
 */
app.utils.addLang2Path(path: string, lang?: string): string
```

示例
```ts
// 假设当前语言为默认语言(英文)
app.utils.addLang2Path('https://www.kucoin.com/referral') // https://www.kucoin.com/referral
app.utils.addLang2Path('https://www.kucoin.com/zh-hant/referral') // https://www.kucoin.com/referral
app.utils.addLang2Path('https://www.kucoin.com/zh-hant/referral', 'ja') // https://www.kucoin.com/ja/referral


// 非 kc 相关域名不做处理
app.utils.addLang2Path('https://www.unkown.com/zh-hant/referral', 'ja') // https://www.unkown.com/zh-hant/referral

```

### 多语言
```ts
// 获取当前语言
app.lang // => en_US

// 是否为 RTL 语言
app.isRTL // => true / false

// 设置语言
// 在 web 3.0 中不需要手动调用该方法, 即使调用也应当在修改语言的接口调用成功后再调用
app.setLang(lang: string) // 会触发事件 `app:lang-changed`(app.BUILTIN_EVENT_NAMES.LANG_CHANGED), 可通过 app.on 监听


/**
 * 转换语言风格
 * @param lang 语言
 * @param style 风格
 *    * path 路径中使用: 全小写, 大部分取语言前两位, 如 en, 少部分取完整语言, 如 zh-hant
 *    * standard 标准: 以'-'分隔, 前部分小写, 后部分大写, 如: zh-HK, en-US
 *    * underscore 下划线: 以'_'分隔, 前部分小写, 后部分大写, 如: zh_HK, en_US
 * @returns 转换后的语言
 */
app.utils.convertLangStyle(lang: string, style: 'path' | 'standard' | 'underscore' = 'underscore'): string

```

### 环境信息 & 混合应用
```ts

/**
 * 判断是否处于 KC App 中
 * 通过UA 判断
 */
app.isInApp // true / false

/**
 * 判断是否在 tg 小程序中
 * 若 app.config 设置了 tmaSDK, 则 为 true
 */
app.isTMA // true / false

/**
 * 判断当前是否为SSR环境 
 */
app.isSSR // true / false

/**
 * 在 kc app 中调用JS bridge 能力, 非KC App 中调用无任何效果, 也不会报错
 */
app.hybrid: {
  /**
   * 监听事件
   * 相当于 JsBridge.listenNativeEvent.on(eventName, callback)
   */
  on(eventName: string, callback: Function)
  /**
   * 取消事件监听
   * 相当于 JsBridge.listenNativeEvent.off(eventName, callback)
   */
  off(eventName: string, callback?: Function)
  /**
   * 调用JS Bridge 方法
   * 相当于: JsBridge.open({type: 'func', params: { name: funcName, ...params } }, callback);
   * * callback 不传的话, 将返回promise, 可以通过promise获取返回结果
   * * app.hybrid.call('getUserInfo').then(data => console.log(data))
   */
  call(funcName: string, params: any = {}, callback?: (res: any) => void)
  /**
   * 对 混合应用 进行配置
   * 相当于: JsBridge!.open({ type: 'event', params: { name: featureName, ...options } }, callback)
   */
  config(featureName: string, options: any = {}, callback?: (res: any) => void)
}

/**
 * 混合应用 特性支持情况判断, 若非 KC App, appMeta 为空对象
 */
app.appMeta: {
  // 客户端版本号
  version: string
  // 支持H5注入登录的版本
  supportCookieLogin: boolean
  // 支持多海报分享的版本
  supportGallery: boolean
  // 支持app的设备指纹token
  supportAppToken: boolean
  //新版分享
  supportNewShare: boolean
  /** 支持获取用户信息 */
  supportGetUserInfo: boolean
}

// 比如访问 app.appMeta.supportNewShare 判断是否支持新版分享

```


### 其他工具
```ts
/**
 * 获取全局对象, 兼容各种环境 ssr, csr
 * * window环境下为 window
 * * 服务器端即为 globalThis
 */
app.global

/**
 * 判断类型
 * * 支持检测类型: number, string, boolean, symbol, undefined, null,
 * * array, object, nullable, iterable, plainobject, date
 * ---
 * * nullable: undefined or null
 * * plainobject: normal plain object
 * * iterable: array, map, typedArray, set, etc.
 */
app.is(val: any, typeName: string)
/**
 * 比较版本号大小, 仅支持标准的三段式版本号
 *  > => 1
 *  = => 0
 *  < => -1
 */
app.utils.compareVersion(ver1: string, ver2: string): number

/**
* 等待 INP, 避免阻塞UI
*/
app.utils.waitForINP(): Promise<void>

/**
 * 深度比较对象
 */
app.utils.isDeepEqual(a: any, b: any): boolean
/**
 * 转义 html 字符串
 */
app.utils.escapeHtml(str: string): string
/**
 * 使用 html template tag 对 html 进行 xss 过滤
 */
app.utils.filterXssHTML(html: string, options: IXssOptions)
export interface IXssOptions {
  /**
   * 允许使用的标签, allowTags 和 ignoreTags 同时存在时, 优先使用 allowTags
   */
  allowTags?: string[];
  /**
   * 禁用的标签
   */
  ignoreTags?: string[];
  /**
   * 允许的属性, allowAttrs 和 ignoreAttrs 同时存在时, 优先使用 allowAttrs
   */
  allowAttrs?: string[];
  /**
   * 禁用的属性
   */
  ignoreAttrs?: string[];
  /**
   * 允许的事件, 为空则全部禁用
   */
  allowEvents?: string[];
  /**
   * URL协议白名单, 避免 javascript: 等危险协议
   */
  allowProtocols?: string[];
}
```
