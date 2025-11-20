/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Alert, Box, Button, Checkbox, Spin, styled, withResponsive } from '@kux/mui';
import { withRouter } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import { formatNumber } from 'src/helper';
import ModalSecurity from 'src/routes/AccountPage/SubAccount/modalSecurity';
import icon from 'static/FreezeApply/ic_refresh.svg';
import { _t } from 'tools/i18n';
import {
  AlertWrapper,
  Btn,
  checkStyle,
  Confirm,
  ContainerWrapper,
  ContentWrapper,
  Desc,
  freezeSubStyle,
  PositionCont,
  PositionItem,
  PositionRow,
  PositionTitle,
  Remind,
  RemindTitle,
  SpanTitle,
  Tiplist,
  Title,
} from '../styled';

const CheckboxWrapper = styled.div`
  .KuxCheckbox-inner {
    background: none;
    border-color: ${(props) => props.theme.colors.text60};
  }
  .KuxCheckbox-checked {
    .KuxCheckbox-inner {
      background: ${(props) => props.theme.colors.text};
      border-color: ${(props) => props.theme.colors.text};
    }
  }
  [dir='rtl'] & {
    .KuxCheckbox-wrapper span {
      margin-right: unset;
      margin-left: 6px;
    }
  }
  .KuxCheckbox-wrapper {
    span {
      &:nth-of-type(2) {
        margin-right: 6px;
        margin-left: 6px;
      }
    }
  }
`;

const bizType = 'SELF_FROZEN_RISK_VERIFY';
@connect((state) => {
  const { userChecked, email, freezeSub, hasSubUser, positionInfo } = state.account_freeze;
  const { phone, nickname, subAccount } = state.user.user || {};
  const getPositionInfoLoading = state.loading.effects['account_freeze/getPositionInfo'];
  const freezeLoading = state.loading.effects['account_freeze/confirmFreezeNew'];
  return {
    userChecked,
    email,
    phone,
    freezeSub,
    nickname,
    subAccount,
    hasSubUser,
    getPositionInfoLoading,
    freezeLoading,
    positionInfo,
  };
})
@withResponsive
@withRouter()
@injectLocale
export default class ConfirmFreeze extends React.PureComponent {
  state = {
    step: 1,
    visible: false,
    verifyType: [],
  };

  componentDidMount() {
    this.getSub();
  }

  getSub = () => {
    const {
      dispatch,
      query: { code },
    } = this.props;
    const _code =
      code || encodeURIComponent(qs.parse(window.location.search, { decode: false }).code);
    dispatch({
      type: 'account_freeze/hasSubUser',
      payload: {
        code: _code,
      },
    });
  };

  handleCheckChange = (e) => {
    const { dispatch } = this.props;
    const { checked } = e.target;
    dispatch({
      type: 'account_freeze/update',
      payload: {
        userChecked: checked,
      },
    });
  };

  handleConfirmFreeze = async () => {
    const {
      dispatch,
      freezeSub,
      query: { code },
    } = this.props;
    const _code =
      code || encodeURIComponent(qs.parse(window.location.search, { decode: false }).code);
    const { checkVerify } = await dispatch({
      type: 'account_freeze/confirmFreezeNew',
      payload: {
        code: _code,
        freezeSub,
      },
    });
    if (checkVerify) this.getVerifyType();
  };

  handleFreezeSub = (e) => {
    const { dispatch } = this.props;
    const { checked } = e.target;
    dispatch({
      type: 'account_freeze/update',
      payload: {
        freezeSub: checked,
      },
    });
  };

  beforeFreeze = async () => {
    const { step } = this.state;
    const { dispatch } = this.props;
    try {
      const { data, success } = await dispatch({
        type: 'account_freeze/getPositionInfo',
      });

      if (success) {
        if (data?.hasMargin === false && data?.hasFutures === false) {
          if (step === 2) {
            this.setState({ step: 1 });
            return;
          }
          this.handleConfirmFreeze();
        } else {
          if (step === 2) return;
          this.setState({ step: 2 });
        }
      }
    } catch (error) {
      if (step === 2) {
        this.setState({ step: 1 });
        return;
      }
      this.handleConfirmFreeze();
    }
  };

  getVerifyType = async () => {
    const { dispatch } = this.props;
    const verifyType = await dispatch({
      type: `security_new/get_verify_type`,
      payload: { bizType },
    });

    if (verifyType && verifyType.length === 0) {
      this.handleConfirmFreeze();
    } else {
      this.setState({
        visible: true,
        verifyType,
      });
    }
  };

  goMargin = () => {
    const { positionInfo } = this.props;
    const url = positionInfo?.marginTotalLiabilityAll
      ? '/assets/margin-account/margin'
      : '/assets/margin-account/isolated';
    const newWindow = window.open(url);
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  goFutures = () => {
    const newWindow = window.open(`${tenantConfig.account.featureTradeUrl}/XBTUSDTM`);
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  onCloseModal = () => {
    this.setState({
      visible: false,
    });
  };

  onRefresh = () => {
    this.beforeFreeze();
  };

  callback = async (result) => {
    if (result && result.code === '200') {
      this.setState({
        visible: false,
      });
      this.handleConfirmFreeze();
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: `notice/feed`,
        payload: { type: 'message.error', message: result.msg },
      });
    }
  };

  render() {
    const { step, visible, verifyType } = this.state;
    const {
      userChecked,
      email,
      phone,
      freezeSub,
      nickname,
      subAccount,
      hasSubUser,
      getPositionInfoLoading,
      freezeLoading,
      positionInfo,
      responsive,
    } = this.props;

    const isH5 = !responsive?.sm;

    return (
      <ContainerWrapper data-inspector="confirm_freeze_page">
        <ContentWrapper>
          <Back />
          <Box style={{ height: isH5 ? '24px' : '52px' }} />
          <Title>{_t('freeze.account')}</Title>
          <Confirm>
            {_t('freeze.account.confirm', {
              email: nickname || subAccount || email || phone || '',
            })}
          </Confirm>
          {step === 1 ? (
            <>
              <Remind>
                <SpanTitle>{tenantConfig.freeze.remindTitle(_t)}</SpanTitle>
                <Tiplist>
                  <li>{_t('freeze.account.tip.2')}</li>
                  <li>{_t('freeze.account.tip.3')}</li>
                  <li>{_t('freeze.account.tip.4')}</li>
                  <li>{_t('freeze.account.tip.5')}</li>
                  <li>{_t('freeze.account.tip.6')}</li>
                  <li>{tenantConfig.freeze.remindTips(_t)}</li>
                  <li>{_t('8NBVkrxPvmgqLXwCYfM7Lz')}</li>
                </Tiplist>
              </Remind>
              {hasSubUser ? (
                <AlertWrapper>
                  <Alert
                    type="warning"
                    description={
                      <>
                        <CheckboxWrapper css={freezeSubStyle}>
                          <Checkbox checked={freezeSub} onChange={this.handleFreezeSub}>
                            {_t('cn3EsyMzTUqn5JCR7BzX8w')}
                          </Checkbox>
                          <Desc>{tenantConfig.freeze.subUserDesc(_t)}</Desc>
                        </CheckboxWrapper>
                      </>
                    }
                    showIcon={false}
                  />
                </AlertWrapper>
              ) : null}
              <CheckboxWrapper css={checkStyle}>
                <Checkbox checked={userChecked} size="basic" onChange={this.handleCheckChange}>
                  {_t('freeze.account.affirm')}
                </Checkbox>
              </CheckboxWrapper>
              <Button
                style={{ width: '100%', marginTop: '24px' }}
                size="large"
                variant="contained"
                disabled={!userChecked}
                onClick={this.beforeFreeze}
                loading={getPositionInfoLoading || freezeLoading}
              >
                {_t('aggree.freeze.account')}
              </Button>
            </>
          ) : (
            <>
              <RemindTitle>
                <span>{tenantConfig.freeze.repaidDesc(_t)}</span>
                <Btn onClick={this.onRefresh}>
                  <img src={icon} alt="refrech-icon" />
                  {_t('8WqAf7kVTSn6NutrHcCwpG')}
                </Btn>
              </RemindTitle>
              <Spin spinning={getPositionInfoLoading} style={{ width: '100%' }}>
                <PositionCont>
                  {positionInfo?.hasMargin ? (
                    <PositionItem>
                      <div>
                        <PositionTitle>{_t('udP6AeMzbwGgMxwKHwWiuN')}</PositionTitle>
                        <PositionRow>
                          <span>
                            {_t('fsbYk2Rj8BEnuX9CDWuJQx', {
                              num: formatNumber(positionInfo?.marginTotalLiabilityAll, 2),
                            })}
                          </span>
                          <span>
                            {_t('wovuiZgBUguLKQSjUdRTCh', {
                              num: formatNumber(positionInfo?.marginTotalLiability, 2),
                            })}
                          </span>
                        </PositionRow>
                      </div>
                      <div>
                        <Button variant="outlined" size="mini" onClick={this.goMargin}>
                          {_t('3EysFSn5bEDHQTZpeJgC7a')}
                        </Button>
                      </div>
                    </PositionItem>
                  ) : null}
                  {positionInfo?.hasFutures ? (
                    <PositionItem>
                      <div>
                        <PositionTitle>{_t('39RMYLaRtYHsAF6MPqNcuq')}</PositionTitle>
                        <PositionRow>
                          <span>
                            {_t('nej6GdscjzF2EPBZm8xm3k', {
                              num: formatNumber(positionInfo?.futuresUSDT, 2),
                            })}
                          </span>
                          <span>
                            {_t('kModMP1QrvNj5S3KuSGDws', {
                              num: formatNumber(positionInfo?.futuresBTC),
                            })}
                          </span>
                        </PositionRow>
                      </div>
                      <div>
                        <Button variant="outlined" size="mini" onClick={this.goFutures}>
                          {_t('hHRbFLLmCUKLuEmuoGWGwn')}
                        </Button>
                      </div>
                    </PositionItem>
                  ) : null}
                </PositionCont>
              </Spin>
            </>
          )}
        </ContentWrapper>

        <ModalSecurity
          onCancel={this.onCloseModal}
          visible={visible}
          callback={this.callback}
          verifyType={verifyType}
          bizType={bizType}
          modalTitle={_t('security.verify')}
        />
      </ContainerWrapper>
    );
  }
}
