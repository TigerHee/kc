/**
 * Owner: will.wang@kupotech.com
 */
import styles from './styles.module.scss';
import useTranslation from '@/hooks/useTranslation';
import { ICWarningOutlined } from '@kux/icons';
 
export default () => {
  const { t } = useTranslation();

  return (
    <mark className={styles.alertWrapper}>
      <ICWarningOutlined size={16} color="rgb(248, 178, 0)" />
      <p className={styles.alert} >
        {t('5SK7ucBeotYCPHosUJ24JP')}
      </p>
    </mark>
  )
}