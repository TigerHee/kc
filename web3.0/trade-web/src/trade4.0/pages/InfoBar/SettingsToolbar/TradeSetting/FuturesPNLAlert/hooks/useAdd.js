/**
 * Owner: clyne@kupotech.com
 */

import { futuresSensors } from 'src/trade4.0/meta/sensors';
import { useDialog } from './usePnlForm';
import { usePnlList } from './usePnlList';

export const useAdd = () => {
  const { setDialog } = useDialog();
  const { list } = usePnlList();
  const isNotAdd = list.length >= 5;
  const onClick = () => {
    setDialog(true);
    // 埋点
    futuresSensors.pnlAlert.pnlAction('4');
  };
  return { onClick, isNotAdd };
};
