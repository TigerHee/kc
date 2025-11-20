/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import {
  Alert,
  Box,
  Button,
  Dialog,
  Form,
  Input,
  MDialog,
  styled,
  withResponsive,
  withSnackbar,
  withTheme,
} from '@kux/mui';
import { tenantConfig } from 'config/tenant';
import QRCode from 'qrcode.react';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import appStore from 'static/account/app_store_2.svg';
import appStoreDark from 'static/account/app_store_2_dark.svg';
import authenticatorDark from 'static/account/authenticator-dark.svg';
import authenticatorLight from 'static/account/authenticator-light.svg';
import googlePlay from 'static/account/google_play_2.svg';
import googlePlayDark from 'static/account/google_play_2_dark.svg';
import { _t, _tHTML } from 'tools/i18n';
import { AlertMessage, Code, FormBody, FormTitle, FormWrapper, G2faCode, G2faHelp } from './styled';

const { FormItem, withForm } = Form;

const StyledAlert = styled(Alert)``;

const DialogContentWrap = styled.div`
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

const NewFormTitle = styled(FormTitle)`
  margin: 0 auto;
`;

const StyledStoresWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 8px;
  }
`;

const StyledBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 148px;
  height: 48px;
  border: 0.5px solid;
  border-color: ${({ theme }) =>
    theme.currentTheme === 'light' ? 'rgba(1, 8, 30, 0.16)' : theme.colors.cover8};
  border-radius: 8px;
`;

const StyledImg = styled.img`
  height: 26px;
  margin-top: 2px;
`;

const StyledImgBigger = styled(StyledImg)`
  height: 30px;
`;

const StepTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 8px;
`;

const StepDesc = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const HighlightText = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const SecondText = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 18px */
`;

const DownloadText = styled.span`
  display: inline-block;
  max-width: 84px;
  margin-left: 4px;
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  line-height: 16px;
  word-break: break-all;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 48px;
  }
`;

const CodeWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.cover4};
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 80px;
    height: 80px;
  }
`;

const CopyText = styled(Button)``;

const SubTitle = styled.div`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 18px */
  margin-bottom: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 23.4px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 500;
  }
`;

@withSnackbar()
@withForm()
@withTheme
@withResponsive
@injectLocale
export default class BindG2FAForm extends React.Component {
  state = {
    visible: false,
  };

  showHelp = () => {
    this.setState({ visible: !this.state.visible });
  };

  createQRValue() {
    const { bindKey, user } = this.props;
    // if (!bindKey) return null;
    const isSandBox = IS_SANDBOX || window.location.hostname.indexOf('sandbox') > -1;
    if (isSandBox) {
      return `otpauth://totp/KuCoin-${
        user.email || user.phone
      }?issuer=KuCoinSandBox&secret=${bindKey}`;
    }
    return `otpauth://totp/KuCoin-${user.email || user.phone}?issuer=KuCoin&secret=${bindKey}`;
    // return `otpauth://totp/xxx-KuCoin?secret=${bindKey}`;
  }

  handleSubmit = (e) => {
    const { onSubmit = () => {}, isUpdate, message } = this.props;
    e.preventDefault();
    this.props.form
      .validateFields()
      .then((values) => {
        onSubmit(values, isUpdate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCopy = () => {
    const { message } = this.props;
    message.success(_t('copy.succeed'));
  };

  // 阻止enter键提交
  stopEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  render() {
    const { form, bindKey, loading, isUpdate, responsive, theme, showTitle = true } = this.props;
    const isH5 = !responsive.sm;
    const StyledDialog = isH5 ? MDialog : Dialog;
    const qrValue = this.createQRValue();
    const { visible } = this.state;
    const formItemLayout = {
      required: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    const message = isUpdate ? (
      <AlertMessage>
        <div>{tenantConfig.resetG2fa.tipsMsg(_t)}</div>
        <div onClick={this.showHelp}>{_tHTML('g2fa.bind.help')}</div>
      </AlertMessage>
    ) : (
      <span onClick={this.showHelp}>{_tHTML('g2fa.bind.help')}</span>
    );

    return (
      <FormWrapper>
        <Form form={form} data-testid="form">
          {!!showTitle && <NewFormTitle>{_t('validation.va.g2fa')}</NewFormTitle>}
          <StyledAlert type="warning" description={message} showIcon />
          <Box style={{ height: '40px' }} />
          <FormBody>
            <FormItem {...formItemLayout} label={_t('g2fa.key')}>
              <G2faCode>
                <Title>{_t('g2fa.key')}</Title>
                <SubTitle>{_t('g2fa.bind.tip.2')}</SubTitle>
                <CodeWrapper data-inspector="bind-g2fa-form-qrcode">
                  <QRCode value={qrValue} size={isH5 ? 68 : 100} level="M" />
                </CodeWrapper>
                <Code data-inspector="bind-g2fa-form-code">{bindKey}</Code>
                <CopyToClipboard text={bindKey} onCopy={this.handleCopy}>
                  <CopyText data-inspector="bind-g2fa-form-copy">{_t('copy')}</CopyText>
                </CopyToClipboard>
              </G2faCode>
            </FormItem>
            <Box style={{ height: '16px' }} />
            <FormItem
              {...formItemLayout}
              label={_t('g2fa.code')}
              name="code"
              rules={[
                {
                  required: true,
                  message: _t('form.required'),
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                allowClear={true}
                inputProps={{ maxLength: 6 }}
                id="code"
                size="xlarge"
                onKeyDown={this.stopEnterSubmit}
              />
            </FormItem>
            <Box style={{ height: '16px' }} />
            <Button
              data-inspector="bind-g2fa-confirm"
              loading={loading}
              size="large"
              block
              type="primary"
              onClick={this.handleSubmit}
              fullWidth
            >
              {_t('active')}
            </Button>
          </FormBody>

          <StyledDialog
            title={_t('g2fa.bind.intro')}
            size="medium"
            open={visible}
            show={visible}
            onClose={() => this.setState({ visible: false })}
            onCancel={() => this.setState({ visible: false })}
            onOk={this.showHelp}
            back={false}
            okText={_t('confirm')}
            cancelText={null}
            centeredFooterButton={true}
            okButtonProps={{ size: 'large' }}
          >
            <DialogContentWrap>
              <G2faHelp>
                <div>
                  <StepTitle>Step 1:</StepTitle>
                  <StepDesc style={{ marginBottom: '16px' }}> {_t('g2fa.bind.tip.1')} </StepDesc>
                  <StyledStoresWrap>
                    <StyledBtn
                      href="itms-apps://itunes.apple.com/cn/app/id388497605?mt=8"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <StyledImg
                        src={theme.currentTheme === 'light' ? appStore : appStoreDark}
                        alt="apple store icon"
                      />
                    </StyledBtn>
                    <StyledBtn
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <StyledImg
                        src={theme.currentTheme === 'light' ? googlePlay : googlePlayDark}
                        alt="google store icon"
                      />
                    </StyledBtn>
                    <StyledBtn
                      href="https://assets2.staticimg.com/apps/google/google_authenticator_v5.10.apk"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <StyledImgBigger
                        alt="local"
                        src={
                          theme.currentTheme === 'light' ? authenticatorLight : authenticatorDark
                        }
                      />
                      <DownloadText>{_t('localle.2fa.download')}</DownloadText>
                    </StyledBtn>
                  </StyledStoresWrap>
                </div>
                <div>
                  <StepTitle>Step 2:</StepTitle>
                  <HighlightText className="color-danger">{_t('g2fa.bind.tip.2')}</HighlightText>
                  <SecondText>{_t('g2fa.bind.tip.2.1')}</SecondText>
                </div>
                <div>
                  <StepTitle>Step 3:</StepTitle>
                  <StepDesc>{_t('g2fa.bind.tip.3')}</StepDesc>
                </div>
              </G2faHelp>
            </DialogContentWrap>
          </StyledDialog>
        </Form>
      </FormWrapper>
    );
  }
}
