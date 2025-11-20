/**
 * Owner: mcqueen@kupotech.com
 */
import { useRequest } from 'ahooks';
import BackToTop from './BackToTop';
import ShareIcon from './Share';
import styles from './style.module.scss';
import { getTenantConfig } from '@/config/tenant';
import useSharePoster from '@/hooks/useSharePoster';

export default () => {
  const showShare = getTenantConfig().showAppShare;
  const handleOpenShare = useSharePoster();
  const { run, loading } = useRequest(handleOpenShare, { manual: true });
  
  return (
    <div className={styles.wrapper}>
      { showShare && <ShareIcon onClick={run} loading={loading} /> }
      <BackToTop />
    </div>
  );
};
