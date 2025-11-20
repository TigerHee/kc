/**
 * Owner: iron@kupotech.com
 */
import { useTheme } from '@kux/mui';
import QRCode from 'qrcode.react';
import React from 'react';
import { composeSpmAndSave, kcsensorsClick } from '../../common/tools';
import Link from '../../components/Link';
import { useLang } from '../../hookTool';
import { tenantConfig } from '../../tenantConfig';
import { ExICArrowRight2Outlined, OverlayWrapper } from './styled';

const Overlay = ({ currentLang, inTrade, KUCOIN_HOST_CHINA, KUCOIN_HOST }) => {
  const { t } = useLang();
  const theme = useTheme();
  const apkUrl = `${
    currentLang === 'zh_CN' ? KUCOIN_HOST_CHINA : KUCOIN_HOST
  }/download?lang=${currentLang}`;

  console.log('==== trunkLoaded downloadbox');
  return (
    <OverlayWrapper inTrade={inTrade}>
      <div className="title">{t('newhomepage.down.title.2')}</div>
      <div className="QRCode">
        <div className="QRCodeBox">
          <QRCode
            value={tenantConfig.downloadQrOneLinkUrl || apkUrl}
            size={190}
            level="H"
            imageSettings={{
              src: window._BRAND_LOGO_MINI_,
              x: null,
              y: null,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
      </div>
      <Link
        href={`${KUCOIN_HOST}/download`}
        className="more"
        data-modid="appDowload"
        lang={currentLang}
        onClick={() => {
          kcsensorsClick(['navigationDownloadPopup', '1'], {
            pagecate: 'navigationDownloadPopup',
          });
          composeSpmAndSave(`${KUCOIN_HOST}/download`, ['appDowload', '1'], currentLang);
        }}
      >
        {t('newhomepage.down.more')}
        <ExICArrowRight2Outlined size={16} color={theme.colors.primary} />
      </Link>
    </OverlayWrapper>
  );
};

export default Overlay;
