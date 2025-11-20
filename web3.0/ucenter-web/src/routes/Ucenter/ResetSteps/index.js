/**
 * Owner: lori@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Form, Steps, withSnackbar } from '@kux/mui';
import Authentication from 'components/Authentication';
import CommonSecurity from 'components/NewCommonSecurity';
import QuestionSecurity from 'components/QuestionSecurity';
import requireProps from 'hocs/requireProps';
import { isEqual } from 'lodash';
import React, { Fragment } from 'react';
import { _t } from 'tools/i18n';
import Finish from '../Finish';
import PageHeader from '../SelectType/PageHeader';
import {
  AuthBlock,
  Block,
  Main,
  Security24h,
  StepsWrapper,
  StyledForm,
  WapperBody,
  Wrapper,
} from './styled';

const { Step } = Steps;
const { withForm } = Form;

@withSnackbar()
@withForm()
@requireProps({
  allowTypes: (v, props) => {
    return v != null || props.currentStep !== 0;
  },
})
@injectLocale
export default class ResetSteps extends React.Component {
  handleSecurityInit = (secHandle) => {
    const { token } = this.props;
    secHandle.update({ token }, 'extraParams');
  };

  handleSecuritySuccess = (result) => {
    if (result.success) {
      this.props.onSecuritySuccess();
    } else {
      this.props.message.error(result.msg);
    }
  };

  isShowAlertMsg = () => {
    const { bizType } = this.props;
    return ['REBINDING_PHONE', 'REBINDING_GOOGLE_2FA'].includes(bizType);
  };

  render() {
    const {
      form,
      extraSteps = [],
      bizType,
      allowTypes,
      prompt = null,
      namespace,
      token,
      currentStep,
      onAuthSubmit,
      nextStep,
    } = this.props;
    const isInApp = JsBridge.isApp();

    // 有安全验证
    const hasSecurity = allowTypes && allowTypes.length > 0;

    // 安全验证是问题验证or邮箱手机验证
    const securityCom = isEqual(allowTypes, [['self_question']])
      ? {
          component: (
            <QuestionSecurity
              namespace={namespace}
              bizType={bizType}
              token={token}
              nextStep={nextStep}
            />
          ),
          title: _t('security.verify'),
        }
      : {
          component: (
            <Block>
              {/* <Title>{_t('security.verify')}</Title> */}
              {this.isShowAlertMsg() && bizType !== 'REBINDING_GOOGLE_2FA' && (
                <Alert
                  type="warning"
                  showIcon={false}
                  description={<Security24h>{_t('e5779574017e4000aab6')}</Security24h>}
                />
              )}
              {prompt}
              <StyledForm>
                <CommonSecurity
                  submitBtnTxt={_t('next')}
                  bizType={bizType}
                  form={form}
                  allowTypes={allowTypes}
                  onInit={this.handleSecurityInit}
                  callback={this.handleSecuritySuccess}
                />
              </StyledForm>
            </Block>
          ),
          title: _t('security.verify'),
        };

    // 身份验证
    const identityCom = {
      component: (
        <AuthBlock>
          <Authentication
            prompt={
              this.isShowAlertMsg() && (
                <Alert
                  type="warning"
                  description={
                    <Fragment>
                      <div>1.{_t('e5779574017e4000aab6')}</div>
                      <div>2.{_t('security.auth.notkyc')}</div>
                    </Fragment>
                  }
                />
              )
            }
            namespace={namespace}
            onSubmit={onAuthSubmit}
            nextStep={nextStep}
            uploadParams={{
              token,
              bizType,
            }}
          />
        </AuthBlock>
      ),
      title: _t('identity.verify'),
    };

    const commonSteps = hasSecurity ? [securityCom] : [];

    // 只要是通过手机重置谷歌验证都没有身份认证
    if (!allowTypes?.join().includes('my_sms')) {
      commonSteps.push(identityCom);
    }

    commonSteps.push(...extraSteps);

    const isNarrowMode = hasSecurity && currentStep === 0;

    return (
      <Wrapper>
        <WapperBody isNarrowMode={isNarrowMode}>
          <Main>
            {!isInApp && (
              <PageHeader
                onClick={() => window.history.go(-1)}
                title={
                  namespace === 'reset_g2fa'
                    ? _t('selfService.resetGoogle')
                    : _t('selfService.resetPhone')
                }
              />
            )}
            {currentStep >= commonSteps.length ? null : (
              <StepsWrapper>
                <Steps current={currentStep} labelPlacement="vertical" size="small">
                  {commonSteps.map((step, index) => (
                    <Step title={step.title} key={index} />
                  ))}
                  <Step title={_t('done')} />
                </Steps>
              </StepsWrapper>
            )}
            {currentStep >= commonSteps.length ? (
              <Finish isPhone={namespace === 'rebind_phone'} />
            ) : (
              <span>{commonSteps[currentStep].component}</span>
            )}
          </Main>
        </WapperBody>
      </Wrapper>
    );
  }
}
