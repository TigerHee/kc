/**
 * Owner: willen@kupotech.com
 */
import { Tooltip } from '@kux/mui';
import BreadcrumbLd from 'components/Seo/BreadcrumbLd';
import QRCode from 'qrcode.react';
import React from 'react';
import { connect } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { push } from 'utils/router';
import HOST from 'utils/siteConfig';
// import iosKucoin from 'static/global/ios-kucoin.png';
import { injectLocale } from '@kucoin-base/i18n';
import LazyImg from 'src/components/common/LazyImg';
import ios_cn_1 from 'static/download_ios/cn/cn-1.webp';
import ios_cn_2 from 'static/download_ios/cn/cn-2.png';
import ios_cn_3 from 'static/download_ios/cn/cn-3.png';
import ios_cn_4 from 'static/download_ios/cn/cn-4.jpg';
import ios_cn_5 from 'static/download_ios/cn/cn-5.jpg';
import ios_cn_6 from 'static/download_ios/cn/cn-6.png';
import ios_en_1 from 'static/download_ios/en/en-1.webp';
import ios_en_2 from 'static/download_ios/en/en-2.png';
import ios_en_3 from 'static/download_ios/en/en-3.png';
import ios_en_4 from 'static/download_ios/en/en-4.jpg';
import ios_en_5 from 'static/download_ios/en/en-5.jpg';
import ios_en_6 from 'static/download_ios/en/en-6.png';
import en_US from './locales/en_US.json';
import zh_CN from './locales/zh_CN.json';
import style from './style.less';

const OuterLink = ({ disabled, _tHTML, currentLang, ...otherProps }) => {
  const show = (
    <div data-inspector="download_button">
      <svg className={style.apple} width="18px" height="20px" viewBox="0 0 18 20" version="1.1">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Apple-color" fill="#FFFFFF">
            <path
              d="M11.5989458,3.24687764 C12.2671208,2.40487695 12.7736429,1.21478432 12.5904308,0 C11.4983593,0.0740867268 10.2218806,0.75615478 9.47706854,1.645193 C8.79811613,2.45073949 8.24010568,3.6490613 8.45804023,4.81210391 C9.65189337,4.84855935 10.8840672,4.15002837 11.5989458,3.24687764 Z M17.4999829,14.6738452 C17.0222035,15.7134086 16.7922921,16.1779215 16.1768049,17.0987139 C15.3182344,18.3840608 14.1076154,19.9845662 12.6060144,19.9963246 C11.273254,20.0104362 10.9295885,19.1437405 9.12024387,19.1543239 C7.31089924,19.1637314 6.9337063,20.0127871 5.59855146,19.9998537 C4.09814983,19.9869179 2.95099603,18.5428151 2.0924255,17.2574723 C-0.309656385,13.6660319 -0.562317732,9.45013267 0.918927823,7.20754752 C1.97268293,5.61527122 3.63473746,4.68389547 5.19622257,4.68389547 C6.78523388,4.68389547 7.78510611,5.54000866 9.1011006,5.54000866 C10.3775793,5.54000866 11.1547237,4.68154547 12.9928067,4.68154547 C14.3842389,4.68154547 15.8583009,5.42593774 16.9072628,6.71010961 C13.4681916,8.56109862 14.0250069,13.3837817 17.5,14.6738244 L17.4999829,14.6738452 Z"
              id="Shape"
            />
          </g>
        </g>
      </svg>
      {_t('download')}
    </div>
  );
  const iosUrl = `${
    currentLang === 'zh_CN' ? HOST.KUCOIN_HOST_CHINA : HOST.KUCOIN_HOST
  }/download/ios`;

  return (
    <div {...otherProps}>
      {disabled ? (
        <span className={style.btn}>
          <Tooltip
            placement="top"
            trigger="click"
            tipClass={style.tipClass}
            arrowClass={style.arrowClass}
            title={
              <div style={{ padding: '10px', background: '#fff' }}>
                <QRCode data-inspector="download_qr_code" value={iosUrl} size={192} level="M" />
              </div>
            }
          >
            {show}
          </Tooltip>
        </span>
      ) : (
        <a
          href="itms-services://?action=download-manifest&url=https://app.kcsfile.com:4443/apps/ios/enterpriseDeployment.plist"
          target="_blank"
          className={style.btn}
          rel="noopener noreferrer"
        >
          {show}
        </a>
      )}
    </div>
  );
};

@connect((state) => {
  const { showDownloadApp, platform } = state.app;

  return {
    showDownloadApp,
    isIOS: platform === 'IOS',
  };
})
@injectLocale
export default class IOSPage extends React.Component {
  trans(key) {
    const { isZh } = this.props;

    let local = en_US;
    if (isZh) {
      local = zh_CN;
    }

    return local[key] || key;
  }

  render() {
    const { isIOS, isZh, currentLang } = this.props;
    return (
      <div className={style.wrapper} data-inspector="download_ios_page">
        {/* 如果需要去掉这个面包屑，注意去掉巡检用例 */}
        <BreadcrumbLd
          list={[
            { name: _t('home'), route: HOST.KUCOIN_HOST },
            { name: _t('download'), route: '/download' },
            { name: this.trans('title') },
          ]}
          push={push}
          className={style.bread}
          addLangToPath={addLangToPath}
        />
        <h1>{this.trans('title')}</h1>
        <h2>{this.trans('note')}</h2>
        <p>{this.trans('steps.1')}</p>
        <LazyImg src={isZh ? ios_cn_1 : ios_en_1} className={style.img} alt="ios_1" />
        <p>{this.trans('steps.2')}</p>
        <LazyImg src={isZh ? ios_cn_2 : ios_en_2} className={style.img} alt="ios_2" />
        <p>{this.trans('steps.3')}</p>
        <LazyImg src={isZh ? ios_cn_3 : ios_en_3} className={style.img} alt="ios_3" />
        <p>{this.trans('steps.4')}</p>
        <LazyImg src={isZh ? ios_cn_4 : ios_en_4} className={style.img} alt="ios_4" />
        <p>{this.trans('steps.5')}</p>
        <LazyImg src={isZh ? ios_cn_5 : ios_en_5} className={style.img} alt="ios_5" />
        <p>{this.trans('steps.6')}</p>
        <LazyImg src={isZh ? ios_cn_6 : ios_en_6} className={style.img} alt="ios_6" />
        <OuterLink disabled={!isIOS} currentLang={currentLang} />
        {/* <img src={iosKucoin} style={{ display: 'none' }} /> */}
      </div>
    );
  }
}
