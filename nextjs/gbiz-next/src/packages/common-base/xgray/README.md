# `gbiz-next/common-base`

> ssr 架构灰度接入

## Usage

```
import { xgrayCheck, checkIfXgrayNeedReload } from 'gbiz-next/common-base';

const xgrayProjects=['brisk-web','g-biz','kucoin-base-web']
//接入染色接口
await xgrayCheck(xgrayProjects)
```
