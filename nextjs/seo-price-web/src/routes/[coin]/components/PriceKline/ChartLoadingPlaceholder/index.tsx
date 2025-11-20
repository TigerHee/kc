import useTranslation from "@/hooks/useTranslation"
import { useCoinDetailStore } from "@/store/coinDetail";
import styles from './styles.module.scss';

export default function ChartLoadingPlaceholder () {
  const { t } = useTranslation();
  const coinInfo = useCoinDetailStore(s => s.coinInfo);
  
  return (
    <div className={styles.wrapper}>
      {t('phmmKzGNUxdFAVL55uf8Dm', { coinName: coinInfo.coinName, coinCode: coinInfo.code })}
    </div>
  )
}