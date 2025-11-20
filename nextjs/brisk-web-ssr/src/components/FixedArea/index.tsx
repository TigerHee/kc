import { useAppStore } from '@/store/app';
import { useIsMobile } from '@kux/design';
import { CompliantBox } from 'gbiz-next/compliantCenter';
import { useMemo } from 'react';
import BackToTop from './BackToTop';
import Gift from './Gift';
import styles from './styles.module.scss';
import Support from './Support';
import Voice from './Voice';

const FixedArea = () => {
  const showDownloadBanner = useAppStore(state => state.showDownloadBanner);
  const isMobile = useIsMobile();

  const bottom = useMemo(() => {
    if (!isMobile) {
      return 48;
    }
    if(showDownloadBanner) {
      return 110;
    }
    return 45;
  }, [isMobile, showDownloadBanner]);

  return (
    <div className={styles.fixedArea} style={{bottom: `${bottom}px`}}>
      <Voice />
      <CompliantBox spm="compliance.header.kurewards.1">
        <Gift />
      </CompliantBox>
      <Support />
      <BackToTop />
    </div>
  );
};

export default FixedArea;
