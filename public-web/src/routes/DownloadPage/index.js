/**
 * Owner: mcqueen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { withResponsive, withTheme } from '@kux/mui';
import clsx from 'clsx';
import QRCode from 'components/QrCodeWithLogo';
import { withRouter } from 'components/Router';
import { COUNTRY_INFO_PULLING_VALUE, isLegalGp } from 'hooks/useCountryInfo';
import React from 'react';
import { connect } from 'react-redux';

import { tenant, tenantConfig } from 'src/config/tenant';
import { checkBackUrlIsSafe } from 'src/helper';
import { _t } from 'src/tools/i18n';
import and_btn2 from 'static/download/and-btn2.svg';
import google_play from 'static/download/google-play.svg';
import ios_btn2 from 'static/download/ios-btn2.svg';
import isIOS from 'utils/isIOS';
import isMobile from 'utils/isMobile';
import { downloadChannel } from './config';
import style from './style.less';

const isThSite = tenant === 'TH';

function hiddenHeaderNavInTrSite() {
  if (tenantConfig.downloadPageConfig.isHideHeaderNav) {
    // 土耳其下载页面隐藏header右侧
    const headerNavRight = document.querySelector('#hook_nav_user');
    if (headerNavRight) {
      headerNavRight.style.display = 'none';
    }
  }
}
hiddenHeaderNavInTrSite();

@withTheme
@connect((state) => {
  const { countryInfo, illegalGpList } = state.app;

  return {
    countryInfo,
    illegalGpList,
  };
})
@withRouter()
@withResponsive
@injectLocale
class DownloadPage extends React.PureComponent {
  state = {};

  componentDidMount() {
    const {
      query: { jump_url },
    } = this.props;
    const isApp = window.navigator.userAgent.includes('KuCoin');
    if (/^(http(s)?:\/\/)/.test(jump_url) && checkBackUrlIsSafe(jump_url) && !isApp) {
      window.location.href = `kucoin:///link?url=${encodeURIComponent(jump_url)}`;
    }
    hiddenHeaderNavInTrSite();
  }

  /** 下载链接 */
  getDownloadLink = (channel, legalGp) => {
    switch (channel) {
      case downloadChannel.appStore:
        return tenantConfig.downloadPageConfig.getAppStoreUrl(legalGp);
      case downloadChannel.apk:
        return tenantConfig.downloadPageConfig.getApkUrl(legalGp);
      case downloadChannel.googlePlay:
        return tenantConfig.downloadPageConfig.getGooglePlayUrl(legalGp);
      default:
        return tenantConfig.downloadPageConfig.getQrUrl(legalGp);
    }
  };

  render() {
    const { countryInfo, illegalGpList, theme } = this.props;
    const { lg } = this.props.responsive;
    const isPulling = COUNTRY_INFO_PULLING_VALUE === countryInfo;
    const legalGp = isLegalGp(countryInfo, illegalGpList);
    const _isIOS = isIOS();
    const _isMobile = isMobile();

    // 移动端 & 非 IOS 设备，或 PC 端
    const showAndroid = (_isMobile && !_isIOS) || !_isMobile;
    // IOS 设备，或 PC 端
    const showIOS = _isIOS || !_isMobile;

    return (
      <section
        className={clsx(style.downSection, {
          [style.downSectionDark]: theme.currentTheme === 'dark',
          [style.downSectionTh]: isThSite,
        })}
        data-inspector="inspector_download_page"
      >
        <div className={style.downContent}>
          <div className={style.left}>
            {isThSite ? (
              <div
                className={clsx(style.cards_th, {
                  [style.cards_th_dark]: theme.currentTheme === 'dark',
                })}
              />
            ) : (
              <div className={style.cards}>
                <div className={style.leftCard}>
                  {/* 把 background-image 图片拿出来加载，提升 LCP */}
                  {/* <img
                      src={appWhiteBg}
                      width="0"
                      height="0"
                      alt="download-bg"
                      style={{ display: 'none' }}
                    /> */}
                  <div className={clsx(style.cardResp, style.cardResp1)}>
                    <div className={clsx(style.cardImg, style.cardImg1)} />
                  </div>
                </div>
                <div className={style.rightCard}>
                  <div className={clsx(style.cardResp, style.cardResp2)}>
                    <div className={clsx(style.cardImg, style.cardImg2)} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={style.right}>
            <div className={clsx(style.info, 'info-dark')}>
              <h1>{window._BRAND_NAME_}</h1>
              {tenantConfig.downloadPageConfig.showDownloadSlogan && (
                <p>{_t('newhomepage.text9')}</p>
              )}
            </div>
            <div className={style.downBox}>
              <div className={clsx(style.downBtns, 'downBtns-dark')}>
                {!isPulling && (
                  <>
                    {showIOS && (
                      <>
                        <h3>iOS</h3>
                        <a
                          data-inspector="inspector_download_apple"
                          className={style.downLoadBtn}
                          href={this.getDownloadLink('appStore', legalGp)}
                          rel="nofollow"
                        >
                          <img src={ios_btn2} alt="ios" />
                        </a>
                      </>
                    )}
                    {showAndroid && (
                      <>
                        <h3 className={showIOS ? style.mt16 : ''}>Android</h3>
                        {/* gp合规才渲染 */}
                        {tenantConfig.downloadPageConfig.isShowGooglePlay(legalGp) && (
                          <a
                            data-inspector="inspector_download_google"
                            className={style.downLoadBtn}
                            href={this.getDownloadLink(downloadChannel.googlePlay, legalGp)}
                            rel="nofollow"
                          >
                            <img src={google_play} alt="" />
                          </a>
                        )}
                        {tenantConfig.downloadPageConfig.isShowApk() && (
                          <a
                            data-inspector="inspector_download_apk"
                            className={clsx(style.downLoadBtn, style.mt12)}
                            href={this.getDownloadLink(downloadChannel.apk, legalGp)}
                            rel="nofollow"
                          >
                            <img src={and_btn2} alt="" />
                          </a>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              <div className={style.qrcode}>
                <QRCode
                  data-inspector="inspector_download_qrcode"
                  value={this.getDownloadLink(downloadChannel.qr, legalGp)}
                  size={lg ? 144 : 132}
                  level="H"
                  cover={window._BRAND_LOGO_MINI_}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default DownloadPage;
