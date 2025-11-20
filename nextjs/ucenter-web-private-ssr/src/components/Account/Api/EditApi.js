/**
 * Owner: willen@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { injectLocale } from 'components/LoadLocale';
import { ICInfoOutlined } from '@kux/icons';
import {
  Button,
  Checkbox,
  Form,
  Radio,
  Select,
  Spin,
  styled,
  Tooltip,
  withSnackbar,
} from '@kux/mui';
import IpAdd from 'components/Account/Api/IpAdd';
import { withRouter } from 'components/Router';
import { message } from 'components/Toast';
import { difference, includes, map } from 'lodash-es';
import { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import FuturesModal from 'routers/AccountPage/FuturesModal';
import { authMapSensorKey } from 'config/base';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { replace } from 'utils/router';
import AlertMessage from './AlertMessage';
import { USE_TYPES } from './constants';
import { getAuthList, ipWhite1AuthList } from './tools';

const EditWrapper = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding-top: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 24px;
  }
`;

const PageTitle = styled.h1`
  position: relative;
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
    font-size: 24px;
    line-height: 130%;
  }
`;

const EditName = styled.div`
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
`;

const EditKey = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
`;

const EditForm = styled.div`
  margin-top: 32px;
`;

const LabelRequired = styled.span`
  margin-right: 6px;
  color: ${(props) => props.theme.colors.secondary};
`;

const QuestionIconLabel = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-left: 2px;
  }
`;

const AuthcheckGroup = styled.div`
  .KuxForm-item {
    .KuxForm-itemRowContainer {
      .KuxCheckbox-group {
        label {
          display: flex;
          align-items: flex-start;
          margin-top: 14px;
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
  .title {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 18px;
  }
  .ip_lable_current {
    display: inline-block;
    margin-left: 4px;
    padding: 0 4px;
    color: #2dbd96;
    font-size: 12px;
    line-height: 16px;
    background: rgba(45, 189, 150, 0.08);
    border-radius: 2px;
    transform: translateY(-2.5px);
    cursor: pointer;
  }
`;

const IpLableCurrent = styled.span`
  display: inline-block;
  margin-left: 20px;
  padding: 0 8px;
  color: ${(props) => props.theme.colors.primary};
  font-size: 12px;
  line-height: 20px;
  background: ${(props) => props.theme.colors.cover8};
  border-radius: 2px;
  border-radius: 2px;
  cursor: pointer;
`;

const EditRadioItem = styled.span`
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
    padding: 0 4px;
    color: ${(props) => props.theme.colors.primary};
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    background: ${(props) => props.theme.colors.cover8};
    border-radius: 2px;
  }

  .warn {
    color: #ed6666;
    background: ${(props) => props.theme.colors.cover8};
  }
`;

const EditSubmit = styled(Button)`
  margin-top: ${({ isBroker, isShowIP }) => (isBroker ? '16px' : isShowIP ? '24px' : '0px')};
  margin-bottom: 8px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
`;

const { FormItem, withForm } = Form;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const CusSelect = styled(Select)`
  .ICSearch_svg__icon {
    width: 20px;
    height: 20px;
  }
  label {
    pointer-events: unset;
  }
`;

@withSnackbar()
@withRouter()
@connect(({ api_key, open_futures }) => ({
  detailData: api_key.detailData,
  verifyData: api_key.verifyData,
  brokerList: api_key.brokerList,
  openContract: open_futures.openContract,
}))
@withForm()
@injectLocale
class EditApi extends Component {
  state = {
    ipAddErr: null,
    currentIpWhitelistStatus: '0',
    formData: {},
  };

  componentDidMount() {
    const { dispatch, openContract, form, detailData } = this.props;
    dispatch({
      type: 'api_key/pullBrokerList',
    });

    // 获取是否开通合约
    if (!openContract) {
      dispatch({
        type: 'open_futures/getOpenStatus',
      });
    }
    const formData = form.getFieldsValue();
    this.setState({ formData });
    // 如果 API 设置有 IP 白名单，则要展示 IP 限制模块
    const currIpWhiteList = detailData?.ipWhitelist || '';
    if (
      (form?.getFieldValue('authGroupMap')?.some((i) => ipWhite1AuthList.includes(i)) ||
        currIpWhiteList.length) &&
      !detailData?.brokerId
    ) {
      this.setState({ currentIpWhitelistStatus: '1' });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.detailData !== prevProps.detailData) {
      const { form, detailData } = this.props;
      const formData = form.getFieldsValue();
      this.setState({ formData });
      // 如果 API 设置有 IP 白名单，则要展示 IP 限制模块
      const currIpWhiteList = detailData?.ipWhitelist || '';
      if (
        (form?.getFieldValue('authGroupMap')?.some((i) => ipWhite1AuthList.includes(i)) ||
          currIpWhiteList.length) &&
        !detailData?.brokerId
      ) {
        this.setState({ currentIpWhitelistStatus: '1' });
      }
    }
  }

  // 确定
  handleNext = (e) => {
    e.preventDefault();
    trackClick(['Confirm', '1']);
    const { form, postSecUrl, onPostSec, bizType, dispatch, onPageToPostSec } = this.props;
    form.validateFields().then(async (values) => {
      const isLimitIp = values.ipWhitelistStatus === '1';
      const { ipWhitelist } = values;
      const hasAddIp = isLimitIp ? !!(ipWhitelist && ipWhitelist.length) : true;
      if (!hasAddIp) {
        this.setState({
          ipAddErr: _t('form.required'),
        });
      }
      if (hasAddIp) {
        const _verifyType = await dispatch({
          type: 'security_new/get_verify_type',
          payload: { bizType },
        });
        const isSecNotChanged = !_verifyType.length;
        const obj = this.handleEditData(values, isLimitIp, ipWhitelist);
        if (isSecNotChanged) {
          this.submitEdit(obj);
        } else {
          dispatch({
            type: 'api_key/cacheVerifyData',
            payload: { verifyType: _verifyType, bizType },
          });
          dispatch({
            type: 'api_key/update',
            payload: { editData: { ...obj } },
          });
          if (onPostSec) onPostSec();

          if (onPageToPostSec) {
            onPageToPostSec();
          } else {
            replace(postSecUrl);
          }
        }
      }
    });
  };

  // 处理编辑数据
  handleEditData = (values, isLimitIp, ipWhitelist) => {
    const { query, detailData } = this.props;
    const { sub: subName } = query;
    const _authGroupMap = {};
    values.authGroupMap.forEach((key) => {
      _authGroupMap[key] = true;
    });
    const submitData = {
      ...detailData,
      ...values,
      authGroupMap: JSON.stringify(_authGroupMap),
      ipWhitelist: isLimitIp ? (ipWhitelist || '').toString() : '',
      subName,
    };
    return submitData;
  };

  // 发起编辑请求
  submitEdit = (data) => {
    const { dispatch, detailData } = this.props;
    const { permissionMap } = detailData;
    // 通过 API_LEADTRADE_FUTURES 权限判断是否带单 api
    const isLeadTradeApi = (permissionMap ?? {})['API_LEADTRADE_FUTURES'];
    dispatch({
      type: 'api_key/updateApi',
      payload: {
        ...data,
        isLeadTradeApi,
      },
    });
  };

  sensorData = (key) => {
    trackClick([key, '1']);
  };

  // 权限改变
  handleAuthChange = (arr) => {
    const { dispatch, form, openContract } = this.props;
    const { setFieldsValue, getFieldValue } = form;
    const oldArr = getFieldValue('authGroupMap');
    const ipWhitelistStatus = getFieldValue('ipWhitelistStatus');
    this.sensorAuthGroupMapData(arr);
    if (
      ipWhitelistStatus !== '1' &&
      arr.indexOf('API_WITHDRAW') !== -1 &&
      oldArr.indexOf('API_WITHDRAW') === -1
    ) {
      dispatch({
        type: 'app/setToast',
        payload: {
          message: _t('api.auth.warning'),
          type: 'warning',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        },
      });
      setFieldsValue({
        ipWhitelistStatus: '1',
      });
    }

    if (!openContract && includes(arr, 'API_FUTURES')) {
      dispatch({
        type: 'open_futures/update',
        payload: { openFuturesVisible: true },
      });
      setFieldsValue({ authGroupMap: arr });
    }
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

  // ip输入框改变
  handleIpListChange = (list) => {
    trackClick(['IPAddress', '1']);
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      ipWhitelist: [...list],
    });

    const formData = form.getFieldsValue();
    this.setState({ ...formData, ipWhitelist: list, ipAddErr: null });
  };

  // 阻止enter键提交
  stopEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  render() {
    const { ipAddErr, formData, currentIpWhitelistStatus } = this.state;
    const { form, detailData, backUrl, brokerList, bizType, query } = this.props;
    const subName = query?.sub;
    const { getFieldValue } = form;
    const {
      apiName,
      apiKey,
      ipWhitelistStatus,
      authGroupMap,
      permissionMap,
      ipWhitelist,
      currentIp,
      brokerId,
    } = detailData;
    const isInApp = !JsBridge.isApp();
    const _authGroupMap = Object.keys(authGroupMap).filter((key) => authGroupMap[key]);
    const limitIPList = ipWhitelist
      ? (ipWhitelist || '').split(',')
      : getFieldValue('ipWhitelist') || [];
    if (limitIPList[0] === '') limitIPList.length = 0;

    // 通过 API_LEADTRADE_FUTURES 权限判断是否带单 api
    const isLeadTradeApi = (permissionMap ?? {})['API_LEADTRADE_FUTURES'];

    const authList = getAuthList(
      !!brokerId || bizType === 'UPDATE_SUB_ACCOUNT_API',
      permissionMap,
      !!subName,
      !!brokerId,
      isLeadTradeApi,
    );

    const closeFuturesModal = () => {
      const formData = form.getFieldsValue();
      const data = formData.authGroupMap.filter((i) => i !== 'API_FUTURES');
      this.setState({ formData: { ...formData, authGroupMap: data } });
      form.setFieldsValue({ authGroupMap: data });
    };

    return apiKey ? (
      <EditWrapper onKeyDown={this.stopEnterSubmit} data-inspector="api_manager_edit_page">
        <PageTitle>{_t('api.edit.title')}</PageTitle>
        <EditName>{apiName}</EditName>
        <EditKey>Key: {apiKey}</EditKey>
        <Form
          form={form}
          onValuesChange={(e) => {
            const newFormData = form.getFieldsValue();
            console.log('newFormData', newFormData);
            let hasClickWarningItem = false; // 判断是否点击了需要提示新增IP的选项

            // 只有选项增多才会去判断该逻辑
            if (newFormData?.authGroupMap?.length > this.state.formData?.authGroupMap?.length) {
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
            }
            // 权限组中包含IP白名单的权限时
            else if (e?.authGroupMap?.some((i) => ipWhite1AuthList.includes(i))) {
              if (newFormData?.ipWhitelist?.length === 0 && !brokerId && hasClickWarningItem) {
                message.warning(_t('rg1uT7ZDZB4kQA3kNVMiy5'));
              }
              this.setState({ currentIpWhitelistStatus: '1' });
              form.setFieldsValue({ ipWhitelistStatus: '1' });
            }
          }}
        >
          <EditForm>
            {brokerId ? (
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
                rules={[{ required: true, message: _t('form.required') }]}
                // validateTrigger="onBlur"
                initialValue={brokerId}
              >
                <CusSelect
                  allowSearch
                  optionFilterProp="label"
                  size="xlarge"
                  options={brokerList}
                />
              </FormItem>
            ) : null}
            <AuthcheckGroup>
              <FormItem
                name="authGroupMap"
                label={_t('api.auth')}
                rules={[{ required: true, message: _t('form.required') }]}
                validateTrigger="onBlur"
                initialValue={_authGroupMap}
              >
                <CheckboxGroup
                  data-testid="checkbox"
                  options={authList}
                  onChange={this.handleAuthChange}
                />
              </FormItem>
            </AuthcheckGroup>

            {!brokerId ? (
              <>
                <div style={{ marginTop: '24px' }}>
                  <IpLable>
                    <LabelRequired>*</LabelRequired>
                    <span className="title">{_t('api.auth.ip.limit')}</span>
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
                </div>
                <Authcheckbox>
                  <FormItem
                    name="ipWhitelistStatus"
                    rules={[{ required: true, message: _t('form.required') }]}
                    validateTrigger="onBlur"
                    initialValue={String(ipWhitelistStatus)}
                  >
                    <RadioGroup
                      onChange={(e, value) => this.sensorData(value === '0' ? 'No' : 'Yes')}
                    >
                      <Radio
                        value="0"
                        disabled={formData?.authGroupMap?.some((i) => ipWhite1AuthList.includes(i))}
                      >
                        <EditRadioItem>
                          {_t('api.NoIp')}
                          <em className="warn">{_t('api.suggest.no')}</em>
                          <span>{_t('api.auth.nolimit.intro')}</span>
                        </EditRadioItem>
                      </Radio>
                      <Radio value="1" data-testid="apiIp">
                        <EditRadioItem>
                          {_t('api.Ip')}
                          <em>{_t('api.suggested')}</em>
                          <span>{_t('api.auth.limit.intro')}</span>
                        </EditRadioItem>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </Authcheckbox>

                {/* 用户手动选择 ｜ 或者有需要展示PI的权限  */}
                {currentIpWhitelistStatus === '1' ||
                formData?.authGroupMap?.some((i) => ipWhite1AuthList.includes(i)) ? (
                    <>
                      {/* 一定不是broker类型 */}
                      {!brokerId && (
                        <IpAdd
                          onChange={this.handleIpListChange}
                          initList={limitIPList}
                          err={ipAddErr}
                        />
                      )}
                    </>
                  ) : null}
                <FormItem
                  label=""
                  style={{ display: 'none' }}
                  name={'ipWhitelist'}
                  initialValue={[...limitIPList]}
                >
                  <div />
                </FormItem>
              </>
            ) : null}

            <FormItem>
              <EditSubmit
                isShowIP={currentIpWhitelistStatus === '1'}
                isBroker={!!brokerId}
                data-testid="btn"
                fullWidth
                size="large"
                onClick={this.handleNext}
              >
                {_t('margin.lend.confirm.ok')}
              </EditSubmit>
            </FormItem>
            <AlertMessage
              useType={brokerId ? USE_TYPES.OTHER : USE_TYPES.API}
              isLeadTradeApi={isLeadTradeApi}
            />
          </EditForm>
        </Form>
        <FuturesModal onClose={closeFuturesModal} />
      </EditWrapper>
    ) : (
      <LoadingWrapper isInApp={isInApp}>
        <Spin spinning type="normal" />
      </LoadingWrapper>
    );
  }
}

export default EditApi;
