# metadata

此目录存放币种相关的基础数据和类型定义，支持 47 种全球主要法币。

**注意**：此目录主要用于配置和基础数据结构，不应包含复杂的业务逻辑。

## 📦 安装和使用

### 基本导入

```typescript
// 直接导出
import { currencyMap, currencyArray } from '@kucoin-gbiz-next/metadata';

// 全部导出
import * as metadata from '@kucoin-gbiz-next/metadata';
```

### System.js + import-maps 场景

```html
<script type="importmap">
{
  "imports": {
    "@kucoin-gbiz-next/metadata": "https://www.kucoin.com/externals/2022-06-01/metadata.[hash].js"
  }
}
</script>
```
