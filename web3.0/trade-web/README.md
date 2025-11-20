# trade-web

开发代理
```
https://gitlab.kucoin.net/kucoin-web/dev-proxy
```

### 添加 xversion

- 在根目录创建 `.xversion` 文件
- 在文件首行写入 `XVersion=xxx` (xxx 为 xversion 的值)
- 在第二行写入 `Desc=xxx` (xxx 为标志字符串的值)
- build 项目

### 添加site-config.json文件
复制下site-config.tpl.json的内容,创建一个site-config.json文件，别提交（.gitignore中已经忽略了）

### 翻译
更新翻译 neeko lokalise -m 

## e2e

[kc-cypress]([kc-cypress](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/544244097/kc-cypress))

```bash
# kc baseUrl: 'https://www.kucoin.com'
kc-cypress open

# tr baseUrl: 'https://www.kucoin.tr'
SITE=TR kc-cypress open

```

[用例账号](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/214631663/kucoin-cypress)
