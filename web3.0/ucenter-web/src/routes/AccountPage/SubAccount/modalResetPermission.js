/**
 * Owner: mcqueen@kupotech.com
 */
import { ICInfoOutlined } from '@kux/icons';
import { Checkbox, Dialog, Form, px2rem, Spin, styled, Switch, Tooltip, withTheme } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import { formatNumber } from 'helper';
import React from 'react';
import { connect } from 'react-redux';
import withMultiSiteConfig from 'src/hocs/withMultiSiteConfig';
import { _t } from 'tools/i18n';
import { SUB_ACCOUNT_MAP, SUB_ACCOUNT_TYPE_NORMAL, SUB_ACCOUNT_TYPE_VALUE_MAP } from './config';
import ModalBase from './modalBase';

const ModalTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: ${px2rem(30)};
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const Wrapper = styled.div`
  margin-bottom: ${px2rem(16)};
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Left = styled.div``;

const Label = styled.div`
  font-weight: 500;
  font-size: ${px2rem(16)};
  line-height: 130%;
  margin-bottom: ${px2rem(2)};
  color: ${(props) => props.theme.colors.text};
`;

const Position = styled.div`
  p {
    margin: 0;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 500;
    font-size: ${px2rem(12)};
    line-height: 130%;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Desc = styled.div`
  margin-top: ${px2rem(10)};
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  color: #f65454;
`;

const Num = styled.div`
  margin-top: ${px2rem(4)};
  font-weight: 500;
  font-size: ${px2rem(12)};
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

const TermsWrapper = styled.div`
  /* background: rgba(0, 13, 29, 0.04); */
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 12px;
  padding: ${px2rem(16)};
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
`;

const Headline = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

const Rule = styled.div`
  margin-top: ${px2rem(6)};
  position: relative;
  padding-left: ${px2rem(12)};
  color: ${(props) => props.theme.colors.text60};
  &:before {
    position: absolute;
    top: ${px2rem(6)};
    left: 0;
    display: inline-block;
    width: ${px2rem(4)};
    height: ${px2rem(4)};
    background: ${(props) => props.theme.colors.text60};
    border-radius: 50%;
    content: ' ';
  }
`;

const Divider = styled.div`
  margin: ${px2rem(12)} 0;
  border-bottom: ${px2rem(1)} solid ${(props) => props.theme.colors.cover8};
`;

const FormItemWrapper = styled.div`
  .KuxCheckbox-wrapper {
    font-weight: 500;
    span {
      font-size: ${px2rem(12)} !important;
    }
  }
  .KuxForm-itemHelp {
    display: none;
  }
`;

const Icon = styled.div`
  width: ${px2rem(20)};
  height: ${px2rem(20)};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 2px;
`;

const { FormItem, withForm } = Form;

@connect((state) => ({
  subAccountPosition: state.subAccount.subAccountPosition,
  subAccountPermission: state.subAccount.subAccountPermission,
  subAccountTypeAmount: state.subAccount.subAccountTypeAmount,
  loading: state.loading.effects['subAccount/getSubAccountPosition'],
}))
@withTheme
@withForm()
@injectLocale
class ModalResetPermission extends ModalBase {
  requiredFields = ['readed'];
  state = {
    showMarginTip: false,
    showFuturesTip: false,
    [SUB_ACCOUNT_MAP.spot]: 0,
    [SUB_ACCOUNT_MAP.margin]: 0,
    [SUB_ACCOUNT_MAP.futures]: 0,
    [SUB_ACCOUNT_MAP.option]: 0,
    spotNum: 0,
    marginNum: 0,
    futuresNum: 0,
    optionNum: 0,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps?.visible && !this.props?.visible) {
      this.handleDefaultReset(nextProps.subAccountTypeAmount, nextProps?.curItem?.tradeTypes);
    }
  }

  handleDefaultReset = (subAccountTypeAmount, subAccountPermission) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    const hasSpot = subAccountPermission?.includes('Spot'),
      hasMargin = subAccountPermission?.includes('Margin'),
      hasFutures = subAccountPermission?.includes('Futures'),
      hasOption = subAccountPermission?.includes('Option');
    const {
      availableSpotSubQuantity = 0,
      availableMarginSubQuantity = 0,
      availableFuturesSubQuantity = 0,
      availableOptionSubQuantity = 0,
    } = subAccountTypeAmount;
    setFieldsValue({
      [SUB_ACCOUNT_MAP.spot]: hasSpot,
      [SUB_ACCOUNT_MAP.margin]: hasMargin,
      [SUB_ACCOUNT_MAP.futures]: hasFutures,
      [SUB_ACCOUNT_MAP.option]: hasOption,
    });

    this.setState({
      [SUB_ACCOUNT_MAP.spot]: availableSpotSubQuantity,
      [SUB_ACCOUNT_MAP.margin]: availableMarginSubQuantity,
      [SUB_ACCOUNT_MAP.futures]: availableFuturesSubQuantity,
      [SUB_ACCOUNT_MAP.option]: availableOptionSubQuantity,
      spotNum: availableSpotSubQuantity,
      marginNum: availableMarginSubQuantity,
      futuresNum: availableFuturesSubQuantity,
      optionNum: availableOptionSubQuantity,
    });
  };

  onChange = (value, type, key) => {
    if (key) {
      this.setState({ [key]: !value });
    }
    const val = this.state[type];

    this.setState({
      [type]: value ? val - 1 : val + 1,
    });
  };

  onCancel = () => {
    const { form, onCancel, dispatch } = this.props;
    const { resetFields } = form;

    this.setState({
      showMarginTip: false,
      showFuturesTip: false,
    });
    resetFields();
    onCancel();
    dispatch({
      type: 'subAccount/resetCurSubAccount',
    });
  };

  beforeSubmit = (e) => {
    const { subAccountPosition } = this.props;
    const { showMarginTip, showFuturesTip } = this.state;

    if (
      (showMarginTip && subAccountPosition?.hasMargin) ||
      (showFuturesTip && subAccountPosition?.hasFutures)
    ) {
      return;
    }
    this.handleOk(e);
  };

  render() {
    const {
      visible,
      form,
      onCancel,
      subAccountPosition,
      subAccountTypeAmount,
      subAccountPermission,
      loading,
      curItem,
      theme,
      multiSiteConfig,
      ...rest
    } = this.props;
    const { getFieldValue } = form;
    const { showMarginTip, showFuturesTip, spotNum, marginNum, futuresNum, optionNum } = this.state;
    const isDisabled = this.checkIfCanSubmit(this.requiredFields);
    const spotChecked = getFieldValue(SUB_ACCOUNT_MAP.spot),
      marginChecked = getFieldValue(SUB_ACCOUNT_MAP.margin),
      futuresChecked = getFieldValue(SUB_ACCOUNT_MAP.futures),
      optionChecked = getFieldValue(SUB_ACCOUNT_MAP.option);
    // 是否是普通子账号，只有普通子账号才有权限限制
    const isNormalSubType = curItem?.type === SUB_ACCOUNT_TYPE_NORMAL;
    const subUserTypePermissionMap = multiSiteConfig?.accountConfig?.subUserTypePermissionMap || {};
    const currentTypePermission =
      subUserTypePermissionMap[SUB_ACCOUNT_TYPE_VALUE_MAP[curItem?.type]] || [];
    const permissionList = currentTypePermission?.map((type) => type?.toLowerCase()) || [];

    return (
      <Dialog
        size="medium"
        open={visible}
        title={
          <ModalTitle>
            {_t('3W5b14oKhraVVKtdVJBRwc')}
            <Tooltip placement="top-start" title={<span>{_t('ohEMWBFynxTqHmfv1EsY9y')}</span>}>
              <Icon>
                <ICInfoOutlined size="16px" color={theme.colors.text60} alt="star" />
              </Icon>
            </Tooltip>
          </ModalTitle>
        }
        // footer={null}
        onCancel={this.onCancel}
        onOk={this.beforeSubmit}
        style={{ margin: 24 }}
        cancelText={_t('cancel')}
        okText={_t('save')}
        okButtonProps={{
          loading: rest.loading,
          disabled:
            isDisabled ||
            (showMarginTip && subAccountPosition?.hasMargin) ||
            (showFuturesTip && subAccountPosition?.hasFutures),
        }}
        {...rest}
      >
        <Spin spinning={loading}>
          <React.Fragment>
            {permissionList.includes('spot') && (
              <Wrapper>
                <Flex>
                  <Left>
                    <Label>{_t('nTx9HsL3ZWXZudv6E23QcK')}</Label>
                  </Left>
                  <Right>
                    <FormItem noStyle name={SUB_ACCOUNT_MAP.spot} valuePropName="checked">
                      <Switch
                        onChange={(e) => this.onChange(e, 'spotNum')}
                        disabled={spotNum <= 0 && !spotChecked && isNormalSubType}
                      />
                    </FormItem>
                    {isNormalSubType && (
                      <Num>
                        {_t('gdyWy9jXTsQD52uQsM7QE5', { num: spotNum > 0 ? spotNum : '0' })}
                      </Num>
                    )}
                  </Right>
                </Flex>
              </Wrapper>
            )}

            {permissionList.includes('margin') && (
              <Wrapper>
                <Flex>
                  <Left>
                    <Label>{_t('udP6AeMzbwGgMxwKHwWiuN')}</Label>
                    {subAccountPosition?.hasMargin ? (
                      <Position>
                        <p>
                          {_t('fsbYk2Rj8BEnuX9CDWuJQx', {
                            num: formatNumber(subAccountPosition?.marginTotalLiabilityAll, 2),
                          })}
                        </p>
                        <p>
                          {_t('wovuiZgBUguLKQSjUdRTCh', {
                            num: formatNumber(subAccountPosition?.marginTotalLiability, 2),
                          })}
                        </p>
                      </Position>
                    ) : null}
                  </Left>
                  <Right>
                    <FormItem noStyle name={SUB_ACCOUNT_MAP.margin} valuePropName="checked">
                      <Switch
                        onChange={(e) => this.onChange(e, 'marginNum', 'showMarginTip')}
                        disabled={marginNum <= 0 && !marginChecked && isNormalSubType}
                      />
                    </FormItem>
                    {isNormalSubType && (
                      <Num>
                        {_t('gdyWy9jXTsQD52uQsM7QE5', { num: marginNum > 0 ? marginNum : '0' })}
                      </Num>
                    )}
                  </Right>
                </Flex>

                {showMarginTip && subAccountPosition?.hasMargin ? (
                  <Desc>{_t('wojo5Z3x8PvRJJVHg6borW')}</Desc>
                ) : null}
              </Wrapper>
            )}

            {permissionList.includes('futures') && (
              <Wrapper>
                <Flex>
                  <Left>
                    <Label>{_t('39RMYLaRtYHsAF6MPqNcuq')}</Label>
                    {subAccountPosition?.hasFutures ? (
                      <Position>
                        <p>
                          {_t('nej6GdscjzF2EPBZm8xm3k', {
                            num: formatNumber(subAccountPosition?.futuresUSDT, 2),
                          })}
                        </p>
                        <p>
                          {_t('kModMP1QrvNj5S3KuSGDws', {
                            num: formatNumber(subAccountPosition?.futuresBTC),
                          })}
                        </p>
                      </Position>
                    ) : null}
                  </Left>
                  <Right>
                    <FormItem noStyle name={SUB_ACCOUNT_MAP.futures} valuePropName="checked">
                      <Switch
                        onChange={(e) => this.onChange(e, 'futuresNum', 'showFuturesTip')}
                        disabled={futuresNum <= 0 && !futuresChecked && isNormalSubType}
                      />
                    </FormItem>
                    {isNormalSubType && (
                      <Num>
                        {_t('gdyWy9jXTsQD52uQsM7QE5', { num: futuresNum > 0 ? futuresNum : '0' })}
                      </Num>
                    )}
                  </Right>
                </Flex>

                {showFuturesTip && subAccountPosition?.hasFutures ? (
                  <Desc>{_t('dQKB2ZBcYxvNArkt18gVF8')}</Desc>
                ) : null}
              </Wrapper>
            )}

            {permissionList.includes('option') && (
              <Wrapper>
                <Flex>
                  <Left>
                    <Label>{_t('6e9844564e1f4000afd0')}</Label>
                  </Left>
                  <Right>
                    <FormItem noStyle name={SUB_ACCOUNT_MAP.option} valuePropName="checked">
                      <Switch
                        onChange={(e) => this.onChange(e, 'optionNum')}
                        disabled={optionNum <= 0 && !optionChecked && isNormalSubType}
                      />
                    </FormItem>
                    {isNormalSubType && (
                      <Num>
                        {_t('gdyWy9jXTsQD52uQsM7QE5', { num: optionNum > 0 ? optionNum : '0' })}
                      </Num>
                    )}
                  </Right>
                </Flex>
              </Wrapper>
            )}

            <TermsWrapper>
              <Headline>{_t('ptbgWauu1ZzyxJUtRhPe8k')}</Headline>
              <Rule>{_t('aj22CjoqHaUkTuNzy5jmAh')}</Rule>
              <Rule>{_t('kWR74g5iP9kmUbjQN7T2iA')}</Rule>
              <Rule>{_t('drEMEcB9q82MCvtGFaXBLG')}</Rule>
              <Divider />
              <FormItemWrapper>
                <FormItem name="readed" valuePropName="checked">
                  <Checkbox>{_t('aoPCuKEAnR9cJ3u4zSFcNF')}</Checkbox>
                </FormItem>
              </FormItemWrapper>
            </TermsWrapper>
          </React.Fragment>
        </Spin>
      </Dialog>
    );
  }
}

export default withMultiSiteConfig(ModalResetPermission);
