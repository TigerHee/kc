/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Tooltip } from '@kux/mui';
import { Link } from 'components/Router';
import BreadcrumbLd from 'components/Seo/BreadcrumbLd';
import QRCode from 'qrcode.react';
import React from 'react';
import { connect } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import android_cn_1 from 'static/download_android/cn/set1.jpg';
import android_cn_2 from 'static/download_android/cn/set2.jpg';
import android_cn_3 from 'static/download_android/cn/set3.jpg';
import android_cn_4 from 'static/download_android/cn/set4.jpg';
import android_cn_5 from 'static/download_android/cn/set5.jpg';
import android_en_1 from 'static/download_android/en/set1.jpg';
import android_en_2 from 'static/download_android/en/set2.jpg';
import android_en_3 from 'static/download_android/en/set3.jpg';
import android_en_4 from 'static/download_android/en/set4.jpg';
import android_en_5 from 'static/download_android/en/set5.jpg';
import androidIcon from 'static/download_android/icon.svg';
import { addLangToPath, _t } from 'tools/i18n';
import { push } from 'utils/router';
import HOST from 'utils/siteConfig';
import en_US from './locales/en_US.json';
import zh_CN from './locales/zh_CN.json';
import style from './style.less';

const OuterLink = ({ disabled, currentLang }) => {
  const show = (
    <div className={style.download} data-inspector="download_button">
      <img src={androidIcon} className={style.apple} alt="" />
      {_t('download')}
    </div>
  );
  const apkUrl = `${
    currentLang === 'zh_CN' ? HOST.KUCOIN_HOST_CHINA : HOST.KUCOIN_HOST
  }/download/android-latest`;
  return (
    <div>
      {disabled ? (
        <span className={style.btn}>
          <Tooltip
            placement="top"
            trigger="click"
            tipClass={style.tipClass}
            arrowClass={style.arrowClass}
            title={
              <div style={{ padding: '10px', background: '#fff' }}>
                <QRCode data-inspector="download_qr_code" value={apkUrl} size={192} level="M" />
              </div>
            }
          >
            {show}
          </Tooltip>
        </span>
      ) : (
        <Link to={apkUrl} target="_blank" className={style.btn} rel="noopener noreferrer">
          {show}
        </Link>
      )}
    </div>
  );
};

@connect((state) => {
  const { showDownloadApp, platform } = state.app;

  return {
    showDownloadApp,
    isAndroid: platform === 'ANDROID',
  };
})
@injectLocale
export default class androidPage extends React.Component {
  trans(key) {
    const { isZh } = this.props;

    let local = en_US;
    if (isZh) {
      local = zh_CN;
    }

    return local[key] || key;
  }

  render() {
    const { isAndroid, isZh, currentLang } = this.props;

    return (
      <div className={style.wrapper} data-inspector="download_android_page">
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
        <h2>{this.trans('subtitle')}</h2>
        <h3>{this.trans('note1')}</h3>
        <p> {this.trans('steps.1.1')} </p>
        <p> {this.trans('steps.1.2')} </p>
        <p> {this.trans('steps.1.3')} </p>
        <p> {this.trans('steps.1.4')} </p>
        <LazyImg src={isZh ? android_cn_1 : android_en_1} alt="android_1" />
        <p> {this.trans('steps.1.5')} </p>
        <LazyImg src={isZh ? android_cn_2 : android_en_2} alt="android_2" />
        <p> {this.trans('steps.1.6')} </p>
        <LazyImg src={isZh ? android_cn_3 : android_en_3} alt="android_3" />
        <p> {this.trans('steps.1.7')} </p>
        <h3>{this.trans('note2')}</h3>
        <p> {this.trans('steps.2.1')} </p>
        <p> {this.trans('steps.2.2')} </p>
        <p> {this.trans('steps.2.3')} </p>
        <p> {this.trans('steps.2.4')} </p>
        <LazyImg src={isZh ? android_cn_4 : android_en_4} alt="android_4" />
        <p> {this.trans('steps.2.5')} </p>
        <LazyImg src={isZh ? android_cn_5 : android_en_5} alt="android_5" />
        <OuterLink disabled={!isAndroid} currentLang={currentLang} />
        {/* <img src={androidKucoin} style={{ display: 'none' }} /> */}
      </div>
    );
  }
}
