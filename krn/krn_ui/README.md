# RN 组件库

### 1.调试moduleName怎么看：

填入以下参数
- iOS: 
  ```
  IP: localhost
  PORT: 8082
  moduleName: app
  ```
- Android
  ```
  打开顶部两个调试开关
  ucenter
  main
  app
  ```

```js

// moduleName: app
AppRegistry.registerComponent("app", () => App);

```