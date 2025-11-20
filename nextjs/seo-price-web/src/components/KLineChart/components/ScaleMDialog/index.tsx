/**
 * Owner: sherry.li@kupotech.com
 */
import { MDialog as MDialogMUI, useTheme } from '@kux/mui-next';
import ICCloseSmall from '@/assets/price/ICCloseSmall.svg';
import ScaleBtn from '../ScaleButton';
import styles from './style.module.scss';
import CoinName from '@/components/KLineChart/components/CoinName';
import { useCoinDetailStore } from '@/store/coinDetail';

export default ({ children }) => {
  const scaleChartDialogVisible = useCoinDetailStore((state) => state.scaleChartDialogVisible);
  const updateCoinDetail = useCoinDetailStore(s => s.updateProp);
  const theme = useTheme();

  const closeScaleChartDialogVisible = () => {
    updateCoinDetail({ scaleChartDialogVisible: false })
  };

  return (
    <MDialogMUI
      className={styles.MDDialog}
      headerProps={{
        border: false,
        back: false,
        close: false,
      }}
      title={
        <div className={styles.dialogTitle}>
          <CoinName />
          <div className={styles.rightBtn}>
            <ScaleBtn type="shrink" />
            <div className={styles.closeBtn} onClick={closeScaleChartDialogVisible} style={{ zIndex: theme.zIndices.modal }}>
              <img className={styles.closeSmall} src={ICCloseSmall} alt="close" />
            </div>
          </div>
        </div>
      }
      show={scaleChartDialogVisible}
      onClose={closeScaleChartDialogVisible}
      footer={null}
      maskClosable={true}
    >
      {children ?? null}
    </MDialogMUI>
  );
};
