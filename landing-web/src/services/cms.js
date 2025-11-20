/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';
import { v2ApiHosts } from 'config';

const { CMS } = v2ApiHosts;

/**
 * 组件列表
 */
export async function pullComponents(keys) {
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
  return pull(`${CMS}/cms/components?${param}`);
}
