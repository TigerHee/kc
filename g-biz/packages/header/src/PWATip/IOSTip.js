import { useEffect } from 'react';
import { useTheme } from '@kux/mui';
import { IOSWrapper, InfoWrapper, Logo, InfoDes, InfoTitle, Close, ShareImg } from './styled';
import PWAlogo from '../../static/pwa/pwalogo.svg';
import ShareSvg from '../../static/pwa/share.svg';
import { useLang } from '../hookTool';
import { kcsensorsManualTrack, kcsensorsClick } from '../common/tools';

export default function SafariTip({ onClose }) {
  const theme = useTheme();
  const { t } = useLang();

  useEffect(() => {
    kcsensorsManualTrack(['pwaAlert', '1']);
  }, []);

  const handleClose = () => {
    kcsensorsClick(['pwaClose', '2']);
    onClose && onClose();
  };

  return (
    <IOSWrapper>
      <InfoWrapper>
        <Logo src={PWAlogo} alt="KuCoin" width="36" height="36" />
        <InfoDes>
          <InfoTitle>
            {t('d7BNkE6kbkdBWwS6ZdkdCo')}
            <ShareImg src={ShareSvg} alt="share" width="20" height="20" />
          </InfoTitle>
          <InfoTitle>{t('vLPrfybJ9B942VX1iPp4bz')}</InfoTitle>
        </InfoDes>
      </InfoWrapper>
      <Close onClick={handleClose} alt="Close" width="8" height="8" color={theme.colors.text} />
    </IOSWrapper>
  );
}
