import { useAppStore } from '@/store/app';
import { useIsMobile } from '@kux/design';
import dynamic from 'next/dynamic';

const DynamicDownloadBanner = dynamic(() => import('./DynamicDownloadBanner'), {
  ssr: false,
});

const DownloadBanner = () => {
  const isMobile = useIsMobile();
  const showDownloadBanner = useAppStore(state => state.showDownloadBanner);

  if (!isMobile || !showDownloadBanner) {
    return null;
  }

  return <DynamicDownloadBanner />;
};

export default DownloadBanner;
