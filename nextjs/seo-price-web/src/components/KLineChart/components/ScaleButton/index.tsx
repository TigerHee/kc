/**
 * Owner: will.wang@kupotech.com
 */
import { Button } from '@kux/mui-next';
import styles from './styles.module.scss';
import clsx from 'clsx';

import enlargeSvg from '@/assets/price/enlarge.svg';
import shrinkSvg from '@/assets/price/shrink.svg';
import { useCoinDetailStore } from '@/store/coinDetail';

type ScaleButtonProps = {
  type?: 'enlarge' | 'shrink';
}

export default ({ type = 'enlarge' }: ScaleButtonProps) => {
  const coinDetailStoreUpdate = useCoinDetailStore(s => s.updateProp);
  const changeScaleChartDialogVisible = () => {
    coinDetailStoreUpdate({ scaleChartDialogVisible: type === 'enlarge' ? true : false, })
  };

  return (
    <div className={clsx(styles.scaleBtnWrapper, type === 'shrink' && styles.shrink)}>
      <Button variant="text" onClick={changeScaleChartDialogVisible}>
        <img src={type === 'enlarge' ? enlargeSvg : shrinkSvg} alt="enlarge" />
      </Button>
    </div>
  );
};