/**
 * Owner: willen@kupotech.com
 */
import { ICClosePlusOutlined, ICQrcodeOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
// TODO:MULTI_SITE
import downloadLogo from 'static/download/logo-icon.svg';
import { addLangToPath, _t } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
import storage from 'utils/storage';

const { KUCOIN_HOST } = siteConfig;

const DownloadWrapper = styled.div`
  padding: 24px 32px 28px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  margin-bottom: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &:hover #close {
    visibility: visible;
    opacity: 1;
  }
  transition: all 0.3s ease;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    padding: 24px 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 20px 24px;
  }
`;

const Close = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  cursor: pointer;
  transition: opacity 0.2s;

  svg {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;
const ScanQrCodeBox = styled.div`
  padding: 11px 20px;
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  &:hover #download {
    display: flex;
  }
`;

const Text = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
`;
const Divider = styled.span`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.cover12};
  margin: 0 12px;
`;
const QrCodeIcon = styled(ICQrcodeOutlined)`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

const QRCodeBox = styled.div`
  background-color: ${({ theme }) => theme.colors.layer};
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 2px 4px 0px ${(props) => props.theme.colors.divider4},
    0px 0px 1px 0px ${(props) => props.theme.colors.divider4};
  border-radius: 4px;
  overflow: hidden;
  width: 120px;
  height: 120px;
  position: absolute;
  right: -20px;
  top: -124px;
  display: none;
  align-items: center;
  justify-content: center;
`;

const dowUrl = addLangToPath(`${KUCOIN_HOST}/download`);

const OverviewDownload = () => {
  const [hide, setHide] = useState(storage.getItem('overview_hide_download'));

  useEffect(() => {
    storage.setItem('overview_hide_download', hide);
  }, [hide]);

  return hide ? null : (
    <DownloadWrapper data-inspector="account_overview_download">
      <Close id="close" onClick={() => setHide(true)}>
        <ICClosePlusOutlined />
      </Close>
      <Title>{_t('5cE13ENuTXU8hjB7HRBciG')}</Title>
      <ScanQrCodeBox onClick={() => window.open(dowUrl)}>
        <Text>{_t('2qSRv1Cnf3GGm7juAz9HtW')}</Text>
        <Divider />
        <QrCodeIcon />
        <QRCodeBox id="download">
          <QRCode
            level="M"
            size={100}
            includeMargin={false}
            imageSettings={{ src: downloadLogo, height: 24, width: 24, excavate: true }}
            value={dowUrl}
          />
        </QRCodeBox>
      </ScanQrCodeBox>
    </DownloadWrapper>
  );
};

export default OverviewDownload;
