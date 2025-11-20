/**
 * Owner: solar@kupotech.com
 */
import { useEffect, useState } from 'react';
import { getABtestResultBySensorKey } from 'src/utils/abTest';

export function useAB(defaultMode = 'legacy') {
  const [ab, setAb] = useState(defaultMode);
  useEffect(() => {
    (async () => {
      const val = await getABtestResultBySensorKey('assets_enable_sub_account', {
        defaultValue: '0',
        valueType: 'String',
      });

      setAb(val === '0' ? 'legacy' : 'new');
    })();
  }, []);
  return ab;
}
