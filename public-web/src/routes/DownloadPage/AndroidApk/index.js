/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { ICCopyOutlined } from '@kux/icons';
import { Button, withSnackbar } from '@kux/mui';
import { isOpenInWechat } from 'helper';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { _t } from 'tools/i18n';
import en_US from './locales/en_US.json';
import zh_CN from './locales/zh_CN.json';
import style from './style.less';

const apkUrl = 'https://assets.staticimg.com/apps/android/kucoin.apk';

@withSnackbar()
@injectLocale
export default class AndroidPage extends React.Component {
  state = {
    wechat: isOpenInWechat(),
  };

  componentDidMount() {
    const { wechat } = this.state;
    if (!wechat) {
      this.downloadApk();
    }
  }

  downloadApk = () => {
    const link = document.createElement('a');
    link.href = apkUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  trans(key) {
    const { isZh } = this.props;

    let local = en_US;
    if (isZh) {
      local = zh_CN;
    }

    return local[key] || key;
  }

  render() {
    const { wechat } = this.state;
    const { message } = this.props;

    return (
      <div className={style.wrapper} data-inspector="download_android_latest_page">
        <div className={style.logo} />
        <div className={style.info}>{wechat && this.trans('desc')}</div>
        <div className={style.link} data-inspector="download_link">
          {wechat && (
            <CopyToClipboard
              text={apkUrl}
              onCopy={() => {
                message.success(_t('copy.succeed'));
              }}
            >
              <Button type="primary" size="small" className="mr-12">
                <ICCopyOutlined size="16" />
                {_t('copy')}
              </Button>
            </CopyToClipboard>
          )}
          {apkUrl}
        </div>
      </div>
    );
  }
}
