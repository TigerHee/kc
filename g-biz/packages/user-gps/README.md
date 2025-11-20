# `user-gps`

> TODO: description

## Usage

```
import pickGPSLocation, { httpTool as httpToolGps } from '@kc/gps';
import { getCsrf } from 'utils/request';

// GPS埋点
  React.useEffect(() => {
    if (user && user.uid) {
      // 该方法需要认证token，故调用前必须添加csrf token
      httpToolGps.addParams({ c:getCsrf() });
      pickGPSLocation();
    }
  }, [user]);
```
