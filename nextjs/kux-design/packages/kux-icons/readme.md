# @kux/iconpack
本项目为营销组件库使用的图标库, 本库基于 [KC Guidelines](https://www.figma.com/design/979O23gM42ADNiDJkoo8fa/KC-Guidelines-2025?node-id=42510-21824&m=dev) 中的 Icons 部分图标自动生成.

目录 `./src/icon` 及 `./src/icon-map.ts` 为自动生成的代码, 不要修改! 若需调整, 请修改 `scripts` 中的脚本.

## 使用方法
!!图标库应搭配 [`@kux/design`](https://kux.sit.kucoin.net/mk-design/) 使用, 否则图标的自定义属性没有实际效果.

[图标列表](https://kux.sit.kucoin.net/mk-design/?path=/docs/3-图标--api)

安装

`pnpm install @kux/iconpack`


使用
```ts

import { AddfavoritesIcon } from '@kux/iconpack';

<AddfavoritesIcon />

// 图标属性
interface IIconProps extends ComponentProps<'svg'> {
  /**
   * 尺寸 tiny(12)/small(16)/medium(24)/large(32)
   * @default 24
   */
  size?: number | ISizeName;
  /**
   * 图标是否 180 度旋转(方向反转)
   */
  inverted?: boolean;
  /**
   * 是否在rtl模式下对称反转，默认不反转
   * @default false
   */
  rtl?: boolean;
}
```


## 开发说明
### 环境变量配置
复制 `.env.example` 为 `.env`, 访问 <https://www.figma.com/developers/api#authentication> 并登录,
点击右侧 **+ Get personal access token** 获取 token, 设置给环境变量 `FIGMA_API_KEY`

Figma Access Token 有效期只有24小时, 若提示错误 `Failed to fetch components from Figma: Error: 'document' is missing.` 大概率为token 过期, 需要重新生成.

其他环境变量按需修改.

### 构建

```sh
pnpm build
```
