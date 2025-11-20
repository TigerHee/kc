/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { useTheme } from '@kux/mui';
import { css } from '@emotion/react';
import { ICAppDownloadOutlined } from '@kux/icons';
import QRCode from 'qrcode.react';
import Link from '../../components/Link';
import downloadLogo from '../../static/download/logo-icon.svg';
import AnimateDropdown from '../AnimateDropdown';
import { useLang } from '../../hookTool';
import { kcsensorsClick } from '../../common/tools';

const useStyles = ({ color }) => {
  return {
    appDownloadWrapper: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: ${color.cover4};
      border-radius: 50%;
      svg {
        margin: 0 6px;
      }
      & img {
        width: 16px;
      }
      &:hover {
        svg {
          fill: ${color.primary};
        }
      }
    `,
    appDownloadIcon: css`
      margin-right: 6px;
    `,
    overlayWrapper: css`
      margin-top: 22px;
      padding: 16px 20px;
      width: 240px;
      background: ${color.base};
      box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      max-height: calc(100vh - 100px);
      overflow: auto;
      & .title {
        color: ${color.text};
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        width: 100%;
        word-break: break-word;
        margin-bottom: 16px;
        white-space: normal;
      }
      & .QRCode {
        margin-bottom: 16px;
        padding: 4px;
        background: #fff;
        & .QRCodeBox {
          background: ${color.base};
          line-height: 1.5;
          position: relative;
        }
      }
      & .more {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
        color: #fff;
        font-size: 14px;
        line-height: 22px;
        text-decoration: none !important;
        border-radius: 4px;
        background: ${color.primary};
      }
    `,
    iconDown: css`
      width: 12px;
      height: 12px;
      margin-left: 4px;
    `,
  };
};

const DownloadBox = (props) => {
  const { currentLang, hostConfig } = props;
  const { KUCOIN_HOST, KUCOIN_HOST_CHINA } = hostConfig;
  const theme = useTheme();
  const { colors } = theme;

  const classes = useStyles({ color: theme.colors });

  const { t } = useLang();

  const Overlay = () => {
    const apkUrl = `${
      currentLang === 'zh_CN' ? KUCOIN_HOST_CHINA : KUCOIN_HOST
    }/download?lang=${currentLang}`;
    return (
      <div css={classes.overlayWrapper}>
        <div className="title">{t('newhomepage.down.title.2')}</div>
        <div className="QRCode">
          <div className="QRCodeBox">
            <QRCode
              value={apkUrl}
              size={200}
              level="M"
              imageSettings={{
                src: downloadLogo,
                x: null,
                y: null,
                height: 38,
                width: 38,
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
            kcsensorsClick(['download', '1']);
          }}
        >
          {t('newhomepage.down.more')}
        </Link>
      </div>
    );
  };
  return (
    <AnimateDropdown
      overlay={<Overlay />}
      trigger="hover"
      anchorProps={{ style: { display: 'block' } }}
      placement="bottom-end"
      keepMounted
    >
      <div css={classes.appDownloadWrapper}>
        <ICAppDownloadOutlined size="20" className="navIcon" color={colors.text} />
      </div>
    </AnimateDropdown>
  );
};

export default DownloadBox;
