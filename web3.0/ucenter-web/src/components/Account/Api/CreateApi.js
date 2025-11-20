/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Captcha } from '@kucoin-biz/captcha';
import { BaseDialog } from '@kucoin-biz/userRestricted';
import { ICInfoOutlined } from '@kux/icons';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  styled,
  Tabs,
  Tooltip,
  withSnackbar,
  withTheme,
} from '@kux/mui';
import CreateSuccess from 'components/Account/Api/CreateSuccess';
import IpAdd from 'components/Account/Api/IpAdd';
import { withRouter } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import { searchToJson } from 'helper';
import { difference, includes, map } from 'lodash';
import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import FuturesModal from 'routes/AccountPage/FuturesModal';
import { getSubUserInfo } from 'services/account';
import { authMapSensorKey } from 'src/constants';
import { _t, _tHTML } from 'tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import { push, replace } from 'utils/router';
import AlertMessage from './AlertMessage';
import { API_TABS, TAB_2_USE_TYPE, USE_TYPES } from './constants';
import { getAuthList, ipWhite1AuthList } from './tools';

const { FormItem, withForm } = Form;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { Tab } = Tabs;

const ExTab = styled(Tab)``;

const ApiWrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding-top: 40px;
  .KuxAlert-root {
    margin-top: 10px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 24px;
  }
`;

const CreateApiToast = styled.p`
  [dir='rtl'] & {
    margin-right: 8px;
    margin-left: 8px;
  }
`;

const CusSelect = styled(Select)`
  .ICSearch_svg__icon {
    width: 20px;
    height: 20px;
  }
  label {
    pointer-events: unset;
  }
`;

const InputItemWrapper = styled.div`
  margin-top: 8px;
`;

const PageTitle = styled.h1`
  position: relative;
  justify-content: flex-start;
  margin-bottom: 40px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 34px;
  line-height: 44px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
    font-size: 24px;
    line-height: 130%;
  }
`;

const CusTabs = styled(Tabs)`
  margin-bottom: 32px;
  border-bottom: none !important;
  .KuxTab-TabItem {
    font-size: 18px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
  }
`;

const QuestionIconLabel = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-left: 2px;
  }
`;

const CreatePwdNotice = styled.p`
  margin-bottom: 32px;
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  line-height: 20px;
`;

const AuthcheckGroup = styled.div`
  .KuxForm-item {
    .KuxForm-itemRowContainer {
      .KuxCheckbox-group {
        label {
          display: flex;
          align-items: flex-start;
          margin-top: 20px;
          margin-right: 24px;
          margin-left: 0;

          &.KuxCheckbox-wrapper-disabled {
            opacity: 0.4;
          }

          > span {
            margin-left: 0px;
          }

          .KuxCheckbox-checkbox {
            margin-top: 4px;
          }
        }
      }
    }
  }
`;

const Authcheckbox = styled.div`
  .KuxForm-item {
    .KuxForm-itemRowContainer {
      label {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-top: 12px;
        margin-right: 24px;
        margin-left: 0;

        &.KuxRadio-wrapper-disabled {
          opacity: 0.4;
        }
      }
    }
  }
`;

const IpLable = styled.span`
  .ip_lable_current {
    display: inline-block;
    margin-left: 4px;
    padding: 2px 4px;
    color: #2dbd96;
    font-size: 12px;
    line-height: 16px;
    background: rgba(45, 189, 150, 0.08);
    border-radius: 2px;
    transform: translateY(-2.5px);
    cursor: pointer;
  }
`;

const CreateRadioItem = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  line-height: 22px;

  span {
    display: block;
    color: ${(props) => props.theme.colors.text40};
    font-size: 12px;
    line-height: 20px;
  }

  em {
    position: relative;
    top: -1px;
    margin-left: 4px;
    padding: 2px 4px;
    color: #2dbd96;
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    background: rgba(45, 189, 150, 0.08);
    border-radius: 2px;
  }

  .warn {
    color: #ed6666;
    background: rgba(237, 102, 102, 0.08);
  }
`;

const CreateSubmit = styled(Button)`
  margin-top: ${({ isBroker, isShowIP }) => {
    return isBroker ? '16px' : isShowIP ? '48px' : '24px';
  }};
  margin-bottom: 8px;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 18px;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const LabelRequired = styled.span`
  margin-right: 6px;
  color: ${(props) => props.theme.colors.secondary};
`;

// broker账号类型
const BROKER_ACCOUNT_TYPE = 10;

function AuthRadioGroup({ label, onChange, value, useType, options }) {
  return (
    <LabelWrapper data-inspector="api_create_auth_radio">
      <Label>
        {useType !== USE_TYPES.BROKER && <LabelRequired>*</LabelRequired>}
        {label}
      </Label>
      {useType !== USE_TYPES.BROKER ? (
        <CheckboxGroup options={options} value={value} onChange={onChange} />
      ) : (
        <Alert type="warning" showIcon title={_t('6HNk7zY8Dca8QFHR8x7Pcd')} />
      )}
    </LabelWrapper>
  );
}

function AuthIpRadioGroup({ label, onChange, radioChange, value, useType, disabledNoIp }) {
  const handleChange = (e) => {
    radioChange(e.target.value === '0' ? 'No' : 'Yes');
    onChange(e.target.value);
  };
  return (
    <LabelWrapper style={{ marginTop: 24 }}>
      <Label>
        {useType !== USE_TYPES.BROKER && <LabelRequired>*</LabelRequired>}
        {label}
      </Label>
      {useType === USE_TYPES.API ? (
        <RadioGroup onChange={handleChange} value={value}>
          <Radio value="1">
            <CreateRadioItem data-inspector="api_create_api_ip_limit">
              {_t('api.Ip')}
              <em>{_t('api.suggested')}</em>
              <span>{_t('api.auth.limit.intro')}</span>
            </CreateRadioItem>
          </Radio>
          <Radio value="0" disabled={disabledNoIp}>
            <CreateRadioItem data-inspector="api_create_api_ip_nolimit">
              {_t('api.NoIp')}
              <span>
                {_t('724aaa6228294000a4ff')}
                <em className="warn">{_t('b9874984f2394000aeb3')}</em>
              </span>
            </CreateRadioItem>
          </Radio>
        </RadioGroup>
      ) : (
        <Alert type="warning" showIcon title={_t('o9sEDni4CMwYLv858aZUph')} />
      )}
    </LabelWrapper>
  );
}

const DEFAULT_AUTH_GROUP_OF_NORMAL_API = ['API_COMMON'];
const DEFAULT_AUTH_GROUP_OF_LEAD_TRADE_API = ['API_COMMON', 'API_LEADTRADE_FUTURES'];

@withTheme
@withSnackbar()
@withRouter()
@connect(({ api_key, open_futures, user, loading }) => ({
  createSuccessVisible: api_key.createSuccessVisible,
  addData: api_key.addData,
  brokerList: api_key.brokerList,
  currentIp: api_key.currentIp,
  needCaptcha: api_key.needCaptcha,
  permissionMap: api_key.permissionMap,
  openContract: open_futures.openContract,
  isKycDialogVisible: api_key.isKycDialogVisible,
  userInfo: user.user,
  loading: loading.effects['api_key/pullIsLeadTraderAccount'],
  isLeadTraderAccount: api_key.isLeadTraderAccount,
  leadTradePermissionMap: api_key.leadTradeInfo.permissionMap,
}))
@withForm()
@injectLocale
class CreateApi extends Component {
  constructor(props) {
    super(props);
    const { addData, userInfo, subName } = this.props;
    let { activeTab } = searchToJson() || {};
    // 账号类型不是broker或当前为子账号，移除query中的activeTab参数
    if ((userInfo?.type !== BROKER_ACCOUNT_TYPE || !!subName) && activeTab === USE_TYPES.BROKER) {
      activeTab = '';
    }

    const isLeadTradeApi = activeTab === API_TABS.LEAD_TRADE_API;
    const {
      authGroupMap = isLeadTradeApi
        ? [...DEFAULT_AUTH_GROUP_OF_LEAD_TRADE_API]
        : [...DEFAULT_AUTH_GROUP_OF_NORMAL_API],
      useType = TAB_2_USE_TYPE[activeTab] || USE_TYPES.API,
      ipWhitelist,
    } = addData;
    this.state = {
      ipWhitelist: ipWhitelist || [],
      ipAddErr: null,
      oldAuthGroupMap: authGroupMap,
      useType,
      captchaOpen: false,
      isHostedSub: false,
      currentIpWhitelistStatus: '0',
      formData: {},
      activeTab,
    };
  }

  componentDidMount() {
    const { dispatch, subName, addData, openContract, form } = this.props;
    if (tenantConfig.api.isLeadTraderAccount && !subName) {
      // 仅主站且母账号支持创建带单 api，判断是否具备带单权限
      dispatch({ type: 'api_key/pullIsLeadTraderAccount' });
    }
    dispatch({
      type: 'api_key/pullBrokerList',
    });
    dispatch({
      type: 'api_key/getCreateInfo',
      payload: { subName },
    });

    // 获取是否开通合约
    if (!openContract) {
      dispatch({
        type: 'open_futures/getOpenStatus',
      });
    }

    const formData = form.getFieldsValue();
    this.setState({ formData });

    // Web流量统计
    kcsensorsManualExpose(['ViewH5', '1']);
    // 默认选中
    trackClick(['APItrade', '1']);
    trackClick(['No', '1']);
    this.onCheckIsHostedSub();
    this.onActiveTabChange();
  }

  componentDidUpdate(prevProps, prevState) {
    const { loading, isLeadTraderAccount, dispatch } = this.props;
    const { activeTab } = this.state;
    if (!loading && !isLeadTraderAccount && activeTab === API_TABS.LEAD_TRADE_API) {
      // 无【带单】权限时，离开 【带单 api】 tab
      this.setState({ activeTab: API_TABS.API, useType: USE_TYPES.API });
    }
    if (this.state.activeTab !== prevState.activeTab) {
      this.onActiveTabChange();
    }
    if (!prevProps.isLeadTraderAccount && this.props.isLeadTraderAccount) {
      // 具备带单权限时，拉取创建带单 api key 可用的权限列表
      dispatch({ type: 'api_key/getCreateLeadTradeInfo' });
    }
  }

  // 检查是不是托管子账号
  onCheckIsHostedSub = () => {
    const { subName } = this.props;
    if (!subName) {
      return;
    }
    getSubUserInfo({ subName })
      .then((res) => {
        if (res?.success) {
          const isHostedSubVal = res?.data?.subType === 5;
          const stateParams = { isHostedSub: isHostedSubVal };
          if (isHostedSubVal) {
            stateParams.useType = USE_TYPES.API;
          }
          this.setState(stateParams);
        }
      })
      .catch(() => {
        this.setState({
          isHostedSub: false,
        });
      });
  };

  updateType = (value) => {
    const { message } = this.props;
    this.setState({ activeTab: value, useType: TAB_2_USE_TYPE[value] }, () => {
      if (value === USE_TYPES.OTHER) {
        message.info(
          <CreateApiToast>
            {_t('1535z2EaStB65Hac8tofgG', {
              autoHideDuration: 5000,
            })}
          </CreateApiToast>,
        );
        trackClick(['ThirdpartyAPI', '1']);
      } else {
        trackClick(['APItrade', '1']);
      }
    });
  };

  onSubmit = async () => {
    const { bizType, securityUrl, skipSecCallback, changeRemainRef = () => {}, form } = this.props;
    const { ipWhitelist, useType } = this.state;
    const _values = form.getFieldsValue();
    const isLimitIp = _values.ipWhitelistStatus === '1';
    const values = {
      ..._values,
      useType,
      ipWhitelist: isLimitIp ? (ipWhitelist || '').toString() : '',
    };
    this.handleCacheData(values);

    const verifyType = await this.getVerifyType(bizType);

    this.props.dispatch({
      type: 'api_key/cacheVerifyData',
      payload: { verifyType, bizType },
    });

    if (verifyType && verifyType[0] && verifyType[0].length) {
      changeRemainRef(true);
      replace(securityUrl);
    } else {
      skipSecCallback(values);
    }
  };

  handleNext = async (e) => {
    e.preventDefault();
    trackClick(['Next', '1']);
    const { form, needCaptcha } = this.props;
    const { validateFields } = form;
    return new Promise((resolve) => {
      validateFields().then((values) => {
        const isLimitIp = values.ipWhitelistStatus === '1';
        const { ipWhitelist } = this.state;
        const hasAddIp = isLimitIp ? ipWhitelist && ipWhitelist.length : true;
        if (!hasAddIp) {
          this.setState({
            ipAddErr: _t('form.required'),
          });
          resolve(false);
          return;
        }
        resolve(true);

        if (needCaptcha) {
          this.setState({ captchaOpen: true });
          return;
        }
        this.onSubmit();
      });
    });
  };

  // 存储表单数据
  handleCacheData(values) {
    this.props.dispatch({
      type: 'api_key/cacheAddData',
      payload: { ...values },
    });
  }

  // 校验密码
  handleCheckApiWord = (rule, value, callback) => {
    if (
      (value || '').trim().length < 7 ||
      (value || '').trim().length > 32 ||
      value.indexOf(' ') > -1
    ) {
      callback(_t('form.api.password.error', { min: 7, max: 32 }));
    }
    callback();
  };

  // 校验名称
  handleCheckApiName = (rule, value, callback) => {
    if ((value || '').length < 1 || (value || '').length > 24) {
      callback(_tHTML('form.remark.length.error1', { length: 24 }));
    }
    callback();
  };

  getVerifyType = async (bizType) => {
    return await this.props.dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
  };

  // ip输入框改变
  handleIpListChange = (list) => {
    trackClick(['IPAddress', '1']);
    this.setState({
      ipWhitelist: [...list],
      ipAddErr: null,
    });
  };

  handleAuthGroupMapChange = (value) => {
    const {
      openContract,
      form: { setFieldsValue },
      dispatch,
    } = this.props;
    this.sensorAuthGroupMapData(value);
    if (!openContract && includes(value, 'API_FUTURES')) {
      dispatch({
        type: 'open_futures/update',
        payload: { openFuturesVisible: true },
      });
      // const data = remove(value, (v) => v !== 'API_FUTURES');
      setFieldsValue({ authGroupMap: value });
    }
  };

  // 阻止enter键提交
  stopEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  sensorData = (key) => {
    trackClick([key, '1']);
  };

  sensorAuthGroupMapData = (value) => {
    // 选中才埋点
    const oldArr = this.state.oldAuthGroupMap;
    const diff = difference(value, oldArr);
    if (diff?.length) {
      map(diff, (item) => {
        if (authMapSensorKey[item]) {
          trackClick([authMapSensorKey[item], '1']);
        }
      });
    }
  };

  handlePageToKyc = () => {
    push('/account/kyc');
  };

  cancelPageToKyc = () => {
    this.props.dispatch({
      type: 'api_key/update',
      payload: { isKycDialogVisible: false },
    });
  };

  onActiveTabChange = () => {
    const { addData, form } = this.props;
    const { activeTab } = this.state;
    const isLeadTradeApi = activeTab === API_TABS.LEAD_TRADE_API;
    const {
      authGroupMap = isLeadTradeApi
        ? [...DEFAULT_AUTH_GROUP_OF_LEAD_TRADE_API]
        : [...DEFAULT_AUTH_GROUP_OF_NORMAL_API],
    } = addData;
    form.setFieldsValue({ authGroupMap });
  };

  render() {
    const {
      form,
      createSuccessVisible,
      successUrl,
      addData,
      currentIp,
      permissionMap,
      message,
      brokerList,
      bizType,
      isKycDialogVisible,
      userInfo,
      subName,
      theme,
      isLeadTraderAccount,
      leadTradePermissionMap,
    } = this.props;
    const { getFieldValue } = form;
    const {
      ipAddErr,
      ipWhitelist: ipWhitelistState,
      isHostedSub,
      captchaOpen,
      currentIpWhitelistStatus,
      formData,
      activeTab,
      useType,
    } = this.state;
    const isLeadTradeApi = activeTab === API_TABS.LEAD_TRADE_API;
    const { apiName, passphrase, ipWhitelistStatus = '0', ipWhitelist = '', brokerId } = addData;

    const limitIPList = ipWhitelist ? (ipWhitelist || '').split(',') : ipWhitelistState;
    if (limitIPList[0] === '') limitIPList.length = 0;

    const authList = getAuthList(
      useType === USE_TYPES.OTHER || bizType === 'CREATE_SUB_ACCOUNT_API',
      // 带单 api 用另一套权限列表
      isLeadTradeApi ? leadTradePermissionMap : permissionMap,
      !!subName,
      useType === USE_TYPES.OTHER,
      isLeadTradeApi,
    );

    const closeFuturesModal = () => {
      const formData = form.getFieldsValue();
      const data = formData.authGroupMap.filter((i) => i !== 'API_FUTURES');
      this.setState({ formData: { ...formData, authGroupMap: data } });
      form.setFieldsValue({ authGroupMap: data });
    };

    return (
      <>
        <ApiWrapper onKeyDown={this.stopEnterSubmit} data-inspector="api_manager_create_page">
          <PageTitle>{_t('api.create')}</PageTitle>
          <React.Fragment>
            <CusTabs
              value={activeTab || API_TABS.API}
              onChange={(_, value) => this.updateType(value)}
            >
              {userInfo?.type === BROKER_ACCOUNT_TYPE && !subName ? (
                <Tab
                  label={_t('gduyxNhEGr9Cmuiy7ypJ48')}
                  value={API_TABS.BROKER}
                  data-inspector="api_create_broker_tab"
                />
              ) : null}
              <Tab
                label={_t('iKXfeRek5LRN96cYtAeXv6')}
                value={API_TABS.API}
                data-inspector="api_create_api_tab"
              />
              {!isHostedSub && tenantConfig.api.bindThirdBroker ? (
                <ExTab
                  label={_t('pyH9ucvqsWXAU83y5tDdSB')}
                  value={API_TABS.OTHER}
                  data-inspector="api_create_other_tab"
                />
              ) : null}
              {!subName && isLeadTraderAccount ? (
                <ExTab
                  label={_t('a94d3f9e657c4000ae1b')}
                  value={API_TABS.LEAD_TRADE_API}
                  data-inspector="api_create_lead_trade_tab"
                />
              ) : null}
            </CusTabs>
            <Form
              form={form}
              onValuesChange={(e) => {
                const newFormData = form.getFieldsValue();
                let hasClickWarningItem = false; // 判断是否点击了需要提示新增IP的选项
                if (
                  // 只有选项增多才会去判断该逻辑
                  newFormData?.authGroupMap?.length > this.state.formData?.authGroupMap?.length
                ) {
                  // 原来有几个需要提示的选项
                  const oldNeedWarningItem = this.state.formData?.authGroupMap?.filter((i) =>
                    ipWhite1AuthList.includes(i),
                  );
                  // 现在有几个需要提示的选项
                  const newNeedWarningItem = newFormData?.authGroupMap?.filter((i) =>
                    ipWhite1AuthList.includes(i),
                  );
                  // 如果现在的多于原来的，说明点击了需要提示的选项
                  hasClickWarningItem = newNeedWarningItem.length > oldNeedWarningItem.length;
                }

                this.setState({ formData: { ...newFormData, e } });

                // 如果是用户手动点击无限制
                if (e?.ipWhitelistStatus) {
                  this.setState({ currentIpWhitelistStatus: e.ipWhitelistStatus });
                  form.setFieldsValue({ ipWhitelistStatus: e.ipWhitelistStatus });
                } else if (e?.authGroupMap?.some((i) => ipWhite1AuthList.includes(i))) {
                  if (
                    limitIPList?.length === 0 &&
                    useType === USE_TYPES.API &&
                    hasClickWarningItem
                  ) {
                    message.warning(_t('rg1uT7ZDZB4kQA3kNVMiy5'));
                  }
                  this.setState({ currentIpWhitelistStatus: '1' });
                  form.setFieldsValue({ ipWhitelistStatus: '1' });
                }
              }}
            >
              {useType === USE_TYPES.OTHER && !isHostedSub ? (
                <FormItem
                  label={
                    <QuestionIconLabel>
                      {_t('i7m8cVDcWgvY3wGZnYmKPE')}
                      <Tooltip placement="top" title={_t('vX9p3kmpATVA4A1weMhJCf')}>
                        <ICInfoOutlined />
                      </Tooltip>
                    </QuestionIconLabel>
                  }
                  name="brokerId"
                  validateTrigger="onBlur"
                  initialValue={brokerId || brokerList[0]?.value}
                >
                  <CusSelect
                    size="xlarge"
                    allowSearch
                    optionFilterProp="label"
                    options={brokerList}
                    disabled={!brokerList?.length}
                    onChange={() => this.sensorData('Thirdpartyname')}
                    data-inspector="api_create_broker_select"
                  />
                </FormItem>
              ) : null}
              <InputItemWrapper>
                <FormItem
                  label={_t('api.memo')}
                  name="apiName"
                  rules={[{ validator: this.handleCheckApiName }]}
                  validateTrigger="onBlur"
                  initialValue={apiName}
                >
                  <Input
                    data-testid="api-name"
                    size="xlarge"
                    allowClear={true}
                    onFocus={() => this.sensorData('APIName')}
                    data-inspector="api_create_api_name"
                  />
                </FormItem>
              </InputItemWrapper>

              <InputItemWrapper>
                <FormItem
                  label={_t('api.password')}
                  name="passphrase"
                  rules={[{ validator: this.handleCheckApiWord }]}
                  validateTrigger="onBlur"
                  initialValue={passphrase}
                >
                  <Input
                    type="password"
                    placeholder={_t('pwd.placeholder')}
                    size="xlarge"
                    allowClear={true}
                    onFocus={() => this.sensorData('APIPassphrase')}
                    data-inspector="api_create_api_password"
                  />
                </FormItem>
              </InputItemWrapper>

              <CreatePwdNotice>{_t('api.password.notice')}</CreatePwdNotice>

              <AuthcheckGroup>
                <FormItem
                  label={_t('api.auth')}
                  name="authGroupMap"
                  rules={
                    useType === USE_TYPES.BROKER
                      ? []
                      : [{ required: true, message: _t('form.required') }]
                  }
                  validateTrigger="onBlur"
                >
                  <AuthRadioGroup
                    useType={useType}
                    options={authList}
                    onChange={this.handleAuthGroupMapChange}
                  />
                </FormItem>
              </AuthcheckGroup>

              {useType === USE_TYPES.API ? (
                <React.Fragment>
                  <Authcheckbox>
                    <FormItem
                      label={
                        <IpLable>
                          <span>{_t('api.auth.ip.limit')}</span>
                          <CopyToClipboard
                            text={currentIp}
                            onCopy={() => {
                              message.success(_t('copy.succeed'));
                            }}
                          >
                            <span className="ip_lable_current">
                              {_t('api.ip.current')} &nbsp; {currentIp}
                            </span>
                          </CopyToClipboard>
                        </IpLable>
                      }
                      name="ipWhitelistStatus"
                      rules={
                        useType === USE_TYPES.BROKER
                          ? []
                          : [{ required: true, message: _t('form.required') }]
                      }
                      validateTrigger="onBlur"
                      initialValue={ipWhitelistStatus}
                    >
                      <AuthIpRadioGroup
                        useType={useType}
                        radioChange={(v) => this.sensorData(v === '0' ? 'No' : 'Yes')}
                        disabledNoIp={formData?.authGroupMap?.some((i) =>
                          ipWhite1AuthList.includes(i),
                        )}
                      />
                    </FormItem>
                  </Authcheckbox>
                  {currentIpWhitelistStatus === '1' && useType === USE_TYPES.API ? (
                    <IpAdd
                      onChange={this.handleIpListChange}
                      initList={limitIPList}
                      err={ipAddErr}
                    />
                  ) : null}
                </React.Fragment>
              ) : null}

              <FormItem>
                <CreateSubmit
                  isShowIP={currentIpWhitelistStatus === '1'}
                  isBroker={useType !== USE_TYPES.API}
                  data-testid="submit"
                  data-inspector="api_create_submit"
                  size="large"
                  onClick={this.handleNext}
                  fullWidth
                >
                  {_t('kyc.next.step')}
                </CreateSubmit>
              </FormItem>
            </Form>
          </React.Fragment>
          {useType !== USE_TYPES.BROKER ? (
            <AlertMessage
              useType={useType}
              isLeadTradeApi={activeTab === API_TABS.LEAD_TRADE_API}
            />
          ) : null}
          <CreateSuccess visible={createSuccessVisible} successUrl={successUrl} />
        </ApiWrapper>
        <FuturesModal onClose={closeFuturesModal} />
        <BaseDialog
          theme={theme?.currentTheme}
          onOk={this.handlePageToKyc}
          onCancel={this.cancelPageToKyc}
          visible={isKycDialogVisible}
          title={_t('withdraw.kyc.limit.title')}
          content={_t('aFwLcveb4nJggr7AYamqor')}
          buttonAgree={_t('withdraw.v2.kyc.btn')}
          buttonRefuse={_t('poolx.ac.modal.cancel')}
        />
        <Captcha
          data-testid="captcha"
          bizType="CREATE_API"
          onValidateSuccess={this.onSubmit}
          open={captchaOpen}
          onClose={() => {
            this.setState({ captchaOpen: false });
          }}
        />
      </>
    );
  }
}

export default CreateApi;
