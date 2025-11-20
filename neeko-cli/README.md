# 国际化工具neeko-cli

用于项目中的语言包导入和导出，提高研发对接国际化工作效率

## Features

- 从.neeko工作目录中解析.csv文件并导入语言包目录
- 从语言包目录中解析语言包(.json, .js)并导出到.neeko工作目录

## Quick Start

### Install

*通过yarn安装*

连接kc私有源https://nac.kucoin.com:1149/，运行命令`yarn global add @kc/neeko`全局安装或者`yarn add @kc/neeko -D`安装到项目

首次必须运行`neeko lokalise -addApiKey xxxxx`命令，设置lokalise ApiKey

### Usage

安装完成后运行`neeko init`命令，此命令创建.neeko工作目录和.neeko.config.js配置文件

**配置**

- `dir: String`
  - Required
  - 语言包目录，目前只支持所有语言包在同级目录
  - e.g.: `./public/locale`

- `standard: String` 
  - Required use export -i | --increment
  - 标准语言包，用于提取语言包差异
  - e.g.: `zh_CN.js`

- `target: String`
  - Required use export -i | --increment
  - 目标语言包，用于提取语言包差异
  - e.g.: `en_US.js`

- `template: String`
  - Required use import
  - 需要解析的语言模版，目前只支持csv
  - 语言模板有一定的要求详见附录
  - e.g.: `template.csv`

- `jsSyntax: String | Function`
  - Required use export .js package
  - 此配置辅助neeko程序提取js语言包的语言对象
  - 如果是字符串配置，neeko会直接拼接该配置和读取到的js文本内容，然后通过`new Function()`创建可执行函数拿到语言对象
  - 如果是函数，函数将接受js文本内容作为参数，neeko用该配置执行的返回值来创建函数，获得语言对象
  - e.g.: \`
    const _KC_PAGE_LANG_LOADER = (key, value) => value;
    return \`

- `jsTemplate: String`
  - Required use import .js package
  - 此配置辅助neeko程序生成js语言包
  - `&{code}`和`&{data}`占位符会被替换成语言代码和语言对象
  - e.g.: `_KC_PAGE_LANG_LOADER("&{code}", &{data})`

- `ext: String`
  - Required
  - 语言包扩展名目前只支持`.js`, `.json`
  - e.g.: `.js`

- `specify: Array`
  - 提取指定的key
  - e.g.: `['main', 'secondary']`

- `projectId: String`
  - lokalise项目id
  - e.g.: `xxx`

- `branch: String`
  - 分支名称
  - e.g.: `xxx`

- `includeTags: Array`
  - lokalise导出数据的范围，仅导出配置的标签对应数据，不配置则导出所有
  - e.g.: `['sprint01', 'sprint03']`

- `groupIds: Array`
  - lokalise创建任务通知到的组，不配置则使用代码中的固定配置
  - e.g.: `[6686]`

- `codeMap: Map`
  - lokalise中该项目的各语言code与当前对接项目的各语言code的一一对应关系
  - e.g.: `{ de_DE: 'de-DE', en: 'en-US' }`


**发起翻译需求.neeko.task.json配置**
```
{
  "title": "", // 必填，任务标题，格式：团队名称_项目名称_迭代名，如：产品中心_kucoin-h5_sprint3
  "tag": "", // 必填，当前所属迭代, 如：sprint3
  "description": "", // 可不填，按需填写，比如：只需要中英翻译，不需要小语种
  "keys": [ // 此次翻译内容列表
    {
      "key": "", // 必填，开发定义的翻译key
      "value": "", // 必填，具体翻译内容，动态字符或者样式需写好，后面直接使用
      "description": "", // 可不填，不填会继承外部description，都没有则为空
      "char_limit": 0 // 可不填，翻译中允许的最大字符数，不填或者填0表示不限制
    }
  ]
}
```


**导出语言包**

  `neeko export <options>`导出语言包到.neeko工作目录

  *options*

  - `-a, --all`: 将所有语言包导出成csv文件
  - `-i, --increment`: 对比配置中的standard和target语言包，提取差异
  - `-s, --specify`: 提取指定key
  - `-e, --excel`: 导出xlsx格式的excel文件

**导入语言包**

  `neeko import <options>`从.neeko目录中的{template}.csv导入语言包

  *options*

  - `-r, --replace`: 替换原来的语言包，不保留差异
  - `-m, --merge`: 合并进入原来的语言包，合并差异

**从lokalise操作语言包**

  `neeko lokalise <options>`从lokalise操作语言包

  *options*

  - `-m, --merge`: 合并进入原来的语言包，合并差异，不删除已不存在的key，替换相同key
  - `-a, --add`: 仅新增key，不删除已不存在的key，不替换相同key
  - `-t, --task`: 发布新的翻译任务，必须先配置好.neeko.task.json再执行
  - `--edit`: 若发布的是修改现有key的任务，需使用此项
  - `--upload`: 谨慎使用，上传本地存在lokalise却不存在的翻译内容到lokalise，尽量只在接入期间使用
  - `--initial`: 上传时使用，设置该项表示是第一次上传，初始化lokalise项目翻译内容时使用

## 附录

### csv语言模版示例

```csv
key,en_US,zh_CN
test,TEST,测试
link,"<a href='https://www.baidu.com'>LINK</a>","<a href='https://www.baidu.com'>链接</a>"
parameter,count{n},数量{n}
```
