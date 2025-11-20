/**
 * Owner: willen@kupotech.com
 */
import { Alert, Button, Checkbox, styled, Tooltip, withSnackbar, withTheme } from '@kux/mui';
import Dialog from 'components/KuDialog';
import { injectLocale } from 'components/LoadLocale';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import appStore from 'static/account/app_store_2.svg';
import appStoreDark from 'static/account/app_store_2_dark.svg';
import authenticator from 'static/account/authenticator.svg';
import copy from 'static/account/copy.svg';
import googlePlay from 'static/account/google_play_2.svg';
import googlePlayDark from 'static/account/google_play_2_dark.svg';
import { _t } from 'tools/i18n';
import ModalBase from './modalBase';

const AlertCnt = styled.div`
  margin-bottom: 14px;
`;
const Reset2faTitle = styled.p`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
`;
const Reset2faDesc = styled.p`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  line-height: 20px;
`;
const Reset2faDescSpan = styled.span`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  line-height: 20px;
`;
const Stores = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148px;
    height: 48px;
    border: 0.5px solid;
    border-color: ${({ theme }) =>
    theme.currentTheme === 'light' ? 'rgba(1, 8, 30, 0.16)' : theme.colors.cover8};
    border-radius: 4px;
    cursor: pointer;

    img {
      height: 22px;
      margin-top: 2px;
    }

    .imgBigger {
      height: 30px;
    }

    span {
      display: inline-block;
      max-width: 84px;
      margin-left: 12px;
      color: ${({ theme }) => theme.colors.text};
      font-size: 12px;
      line-height: 16px;
      word-break: break-all;
    }
  }
  .height30 {
    height: 30px !important;
  }
`;
const G2faCode = styled.div`
  display: flex;
  margin-bottom: 16px;

  .codeView {
    flex: 1;
    margin-left: 20px;
    padding: 11px 16px;
    background: ${({ theme }) => theme.colors.cover8};
    border-radius: 4px;
    cursor: pointer;

    .code {
      color: ${({ theme }) => theme.colors.text};
      font-size: 14px;
      line-height: 18px;
      word-break: break-all;
    }

    .copyBtn {
      display: flex;
      align-items: center;
      margin-top: 6px;

      .copyIcon {
        margin-right: 4px;
      }

      .text {
        color: ${({ theme }) => theme.colors.primary};
        font-size: 12px;
      }
    }
  }
`;

@withSnackbar()
@injectLocale
@withTheme
class ModalReset2fa extends ModalBase {
  state = {
    checkOk: false,
  };

  changeCheck = () => {
    this.setState({
      checkOk: !this.state.checkOk,
    });
  };

  confirm = () => {
    if (this.state.checkOk) {
      this.setState({
        checkOk: false,
      });
      this.props.onCancel();
    }
  };

  createQRValue() {
    const { curItem: { subName = '', remarks = '' } = {}, g2faKey = '' } = this.props;
    // if (!bindKey) return null;
    const isSandBox = IS_SANDBOX || window.location.hostname.indexOf('sandbox') > -1;
    if (isSandBox) {
      return `otpauth://totp/KuCoin-sub-${
        remarks || subName
      }?issuer=KuCoinSandBox&secret=${g2faKey}`;
    }
    return `otpauth://totp/KuCoin-sub-${remarks || subName}?issuer=KuCoin&secret=${g2faKey}`;
  }

  render() {
    const {
      visible,
      message,
      theme: { currentTheme },
      curItem: { subName = '' } = {},
      g2faKey = '',
      ...rest
    } = this.props;
    const { checkOk = false } = this.state || {};
    const qrValue = this.createQRValue();
    const tipList = [
      {
        path: 'itms-apps://itunes.apple.com/cn/app/id388497605?mt=8',
        img: currentTheme === 'light' ? appStore : appStoreDark,
      },
      {
        path: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
        img: currentTheme === 'light' ? googlePlay : googlePlayDark,
      },
      {
        path: 'https://download.kcsfile.com/apps/google/google_authenticator_v5.10.apk',
        img: authenticator,
        imgClass: 'height30',
        text: _t('localle.2fa.download'),
      },
    ];
    return (
      <Dialog
        open={visible}
        cancelText={null}
        okText={null}
        showCloseX={true}
        title={_t('sub.reset.2fa')}
        footer={null}
        maskClosable={false}
        size="middle"
        style={{ width: '100%', maxWidth: 600, margin: 24 }}
        {...rest}
      >
        <AlertCnt style={{ marginTop: 24 }}>
          <Alert showIcon={false} description={`${_t('subaccount.subaccount')}: ${subName}`} />
        </AlertCnt>
        <Reset2faTitle>{_t('download.step1')}</Reset2faTitle>
        <Reset2faDesc>{_t('download.step1.desc')}</Reset2faDesc>
        <Stores>
          {tipList.map((item, index) => {
            const { path = '', img = '', imgClass = '', text = '' } = item || {};
            return (
              <Tooltip
                key={`path_${index}`}
                placement="bottom"
                arrowPointAtCenter
                getPopupContainer={(trigger) => trigger.parentNode}
                title={
                  <div style={{ background: '#fff', padding: 16 }}>
                    {<QRCode value={path} size={160} level="M" />}
                  </div>
                }
              >
                <span className="btn" key={index}>
                  <img alt="tip-icon" className={imgClass} src={img} />
                  <span>{text}</span>
                </span>
              </Tooltip>
            );
          })}
        </Stores>
        <Reset2faTitle>{_t('download.step2')}</Reset2faTitle>
        <Reset2faDesc>{_t('download.step2.desc')}</Reset2faDesc>
        <G2faCode>
          <QRCode value={qrValue} size={90} level="M" />
          <CopyToClipboard
            text={g2faKey}
            onCopy={() => {
              message.success(_t('copy.succeed'));
            }}
          >
            <div className="codeView">
              <span className="code">{g2faKey}</span>
              <div className="copyBtn">
                <img className="copyIcon" src={copy} alt="copy-icon" />
                <span className="text">{_t('copy')}</span>
              </div>
            </div>
          </CopyToClipboard>
        </G2faCode>
        <Checkbox checked={checkOk} onChange={this.changeCheck}>
          <Reset2faDescSpan>{_t('sub.check2fa')}</Reset2faDescSpan>
        </Checkbox>
        <br />
        <Button
          disabled={!checkOk}
          onClick={this.confirm}
          size="large"
          style={{ width: '100%', marginTop: '8px', marginBottom: '32px' }}
        >
          {_t('margin.lend.confirm.ok')}
        </Button>
      </Dialog>
    );
  }
}

export default ModalReset2fa;
