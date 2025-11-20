# @kux/tsconfig
项目公共的 tsconfig 配置

## 配置列表
```sh
.
├── base.json # 公共基础配置
├── jsx.json # jsx 相关配置

```

## 使用方法
1. 在包的 package.json 的 `devDependencies` 增加:
  `"@kux/tsconfig": "*"`
2. 在包的 `tsconfig.json` 中根据需要继承相关配置:
  ```json
  {
     "extends": "@kux/tsconfig/jsx",
     // 以下为自定义配置
     "compilerOptions": {
       "baseUrl": ".",
       "allowImportingTsExtensions": false,
       "noEmit": false,
       "declaration": true,
       "outDir": "dist",
       "paths": {
         "@/*": [
           "src/*"
         ]
       }
     },
     "include": ["src/**/*"]
  }
  ```
