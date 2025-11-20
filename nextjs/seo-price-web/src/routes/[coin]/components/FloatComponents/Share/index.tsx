/**
 * Owner: mcqueen@kupotech.com
 */
import { ICShareOutlined } from '@kux/icons';
import { Button } from '@kux/mui-next';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import { trackClick } from 'gbiz-next/sensors';
import styles from './index.module.scss';


export default (props: {
  onClick: () => void;
  loading?: boolean;
}) => {
  const router = useRouter();
  const coin = router?.query.coin;
  const coinDict = useCategoriesStore((state) => state.coinDict);

  const coinObj = (coin && coinDict) ? coinDict[coin as string] : null;

  const handleShare = () => {
    trackClick(['Share', '1'], { symbol: coinObj?.currencyName || coin });
    props.onClick();
  };

  return (
    <Button variant="text" onClick={handleShare} className={styles.buttonWrapper} loading={props.loading}>
      {props.loading ? null : (
        <>
          <ICShareOutlined size="16" color="#1D1D1D" />
          <p className={styles.text}>Share</p>
        </>
      )}
    </Button>
  );
};
