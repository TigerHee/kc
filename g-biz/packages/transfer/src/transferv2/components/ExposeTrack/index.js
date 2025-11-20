/**
 * Owner: solar@kupotech.com
 */
import { useEffect } from 'react';
import { kcsensorsManualTrack } from '@packages/transfer/src/utils/ga.js';

export default function ExposeTrack({ exposeCondition, children }) {
  useEffect(() => {
    exposeCondition &&
      kcsensorsManualTrack('expose', ['transferPopup', 'selectFromAccount'], {
        account: 'multi',
      });
  }, [exposeCondition]);
  return children;
}
