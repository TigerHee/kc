# 发版前注意事项

#### 若此项目本次迭代需要升级 krn_base_bundle 版本，请保证这次 krn_base_bundle 发布要早于业务包的发布。

#### 请确认 krn_base_bundle 的依赖是否修改为正式版，beta 版将无法进行线上发布。

#### 请确认 package.json 的 appVersion 版本，若本次发版依赖了一些新的原生能力（如依赖了新增的桥或原生的组件），须将此版本号修改为对应 app 版本。其他情况不建议升级 appVersion 以保证更多的用户能更新到。

#### 参考文档

- [RN 新应用开发流程 2023.6.25](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/90581673/RN+2023.6.25)
- [ios模拟器打包地址](https://jenkins.kucoin.net/jenkins/job/AppBuilder/job/iOSTasks/job/iOS%E6%A8%A1%E6%8B%9F%E5%99%A8%E5%8C%85/)
- [ios模拟器下载地址](https://kc-app.s3.ap-northeast-1.amazonaws.com/app/iphonesimulator/KuCoin_debug_ios.zip)
- [使用命令行安装Android Emulator](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/17148152/Android+Emulator)
- [KRN相关](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/17148320/KRN)
- [测试环境 json map URL](https://assets-v2.kucoin.net/react-native-bundle/convert/main/ios/source.json)
- [RTL](https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/198344765/RN+rtl)
- [App 路由](https://k-devdoc.atlassian.net/wiki/spaces/APP/pages/50942647/KuCoin+APP)

启动 whistle 代理
```shell
#!/bin/bash

# 断开公司vpn
pkill GlobalProtect

# 启动w2
w2 start

# 启动mac代理
w2 proxy -x "*.microsoft.com"

```

关闭 whistle 代理
```shell
#!/bin/bash

# 断开公司vpn
pkill GlobalProtect

# 停止mac代理
w2 proxy off

# 关闭w2
w2 stop


```

### 其他业务跳转到 闪兑 链接
`/krn/router?component=kucoin_convert_rn&biz=convert&entry=main`

本地预览调试
- IOS
  ```
  IP: localhost
  PORT: 8082
  moduleName: kucoin_convert_rn
  ```
- Android
 ```
  打开顶部调试开关
  convert
  mian
  kucoin_convert_rn
  ```
