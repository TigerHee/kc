/**
 * Owner: ella.wang@kupotech.com
 */
import React from 'react';
import { useResponsive } from '@kux/mui';
import QRCode from 'components/QrCodeWithLogo';
import { useLocale } from '@kucoin-base/i18n';
import { _t } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
import { Wrapper, Title, Description, IconWrapper, Icon } from './index.style';
import appstore from 'static/mining-pool/appstore.svg';
import googleplay from 'static/mining-pool/googleplay.svg';
import android from 'static/mining-pool/android.svg';

const { KUCOIN_HOST } = siteConfig;

export default () => {
  const { currentLang } = useLocale();
  const responsive = useResponsive();
  const downloadUrl = `${KUCOIN_HOST}/download?lang=${currentLang}`;
  return (
    <Wrapper>
      <header>
        <hgroup>
          <Title>{_t('5n4iq9mKyPeqNVeFJ9MXXh')}</Title>
          <Description>{_t('vaon8pqhFCCk2zxPKyRsJv')}</Description>
        </hgroup>
      </header>
      <QRCode
        value={downloadUrl}
        size={responsive.lg ? 180 : !responsive.sm ? 192 : 152}
        level="M"
      />
      <IconWrapper size={responsive.lg ? 180 : !responsive.sm ? 192 : 152}>
        <Icon src={appstore} />
        <Icon src={googleplay} />
        <Icon src={android} />
      </IconWrapper>
    </Wrapper>
  );
};
