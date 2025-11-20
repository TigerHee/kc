import { LoadingContainer } from '@/components/KLineChart/components/LoadingSpin';
import useTranslation from '@/hooks/useTranslation';
import styles from './styles.module.scss';
import Image from 'next/image';

import KlineNodata from '@/assets/coinDetail/kline_nodata.svg';

export default () => {
  const { t } = useTranslation()

  return (
    <LoadingContainer>
      <div className={styles.noDataStatus}>
        <Image style={{ marginBottom: '8px' }} src={KlineNodata} width={'101'} height={'100'} alt="kline no data" />
        <p className={styles.klineNodataText}>{t('cjhY9gzVdFVp97TbjipUBu')}</p>
      </div>
    </LoadingContainer>
  )
}
