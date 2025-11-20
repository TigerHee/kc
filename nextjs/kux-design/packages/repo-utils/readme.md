# @kux/repo-utils
项目构建相关的工具函数

包含:
* vite proxy 设置函数 `configProxy(origin: string)`
* 文件操作相关函数
  * `copyDir(src: string, dest: string)`
  * `copyFile(src: string, dest: string)`
  * `getFilePath(dir: string, finder: (f: string) => boolean)`
