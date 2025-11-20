/**
 * Owner: iron@kupotech.com
 */
import { get } from '@tools/request';

// 登录
export function pullComponents(keys) {
  /* {
  "success": true,
  "code": 0,
  "msg": "string",
  "timestamp": 0,
  "items": [
    {
      "key": "string", // key
      "compiled_html": "string", // 编译后的HTML
      "location": 0, // 1body，2head
    }
  ]
} */
  const param = `keys=${JSON.stringify(keys)}`;
  return get(`/cms/components?${param}`);
}
