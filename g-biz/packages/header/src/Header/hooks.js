/**
 * Owner: solar@kupotech.com
 */
import { getSensorsABResult } from '@utils/sensors';
import { useEffect, useState } from 'react';

// 通用a/b test，适用0对照组 1实现组
export function useAbTest(name) {
  const [initTag, setInitTag] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getSensorsABResult({
          param_name: name,
          default_value: '0',
          value_type: 'String',
        });
        setShow(data === '1');
      } catch (e) {
        console.log('get passkey ab test failed:', e);
      } finally {
        setInitTag(true);
      }
    };
    init();
  }, []);

  return { initTag, show };
}
