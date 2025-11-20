/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import {
  Button,
  Dialog,
  Empty,
  Spin,
  styled,
  Switch,
  Tabs,
  useResponsive,
  useSnackbar,
} from '@kux/mui';
import BrokerListItem from 'components/Account/Api/BrokerListItem';
import { API_TABS } from 'components/Account/Api/constants';
import CreateSuccess from 'components/Account/Api/CreateSuccess';
import ListItem from 'components/Account/Api/ListItem';
import ModalSecForm from 'components/Account/ModalSecurity';
import { Link, withRouter } from 'components/Router';
import SecurityBinding from 'components/SecuritySetting';
import { tenantConfig } from 'config/tenant';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { getCurrentLangFromPath, _t } from 'tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import { push } from 'utils/router';
import storage from 'utils/storage';

const { Tab } = Tabs;

const Wrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledDialog = styled(Dialog)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxModalFooter-root {
      padding: 32px 24px !important;
    }
  }
  .KuxModalFooter-root {
    padding: 24px 32px 32px 32px;
  }
`;

const ExTabs = styled(Tabs)`
  margin-left: 64px;
  margin-top: 25px;
  height: unset;
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-left: 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 10px;
    margin-left: 16px;
  }
`;

const PageTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  padding: 24px 64px;
  font-weight: 600;
  font-size: 24px;
  background: ${({ theme }) => theme.colors.overlay};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    font-size: 18px;
  }
`;

const TitleTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Api_btns = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
  .btnCreate {
    margin-right: 8px;
  }
  .btnTitle {
    margin-right: 8px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 8px;
    button {
      margin-top: 12px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0;
    .btnTitle {
      margin-top: 17px;
    }
    .btnNotice {
      margin-top: 17px;
    }
  }
`;

const Content = styled.div`
  width: 100%;
  padding: 0 64px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
const LoadingWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;

const NoMore = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 32px 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text30};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 16px 0;
    font-size: 14px;
  }
`;

const Withdraw_dialog__switch = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  justify-content: space-between;
`;

const Withdraw_dialog__notice = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  a {
    margin-left: 6px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;
const EmptyBox = styled.div`
  padding-top: 80px;
  display: flex;
  justify-content: center;
`;

// broker账号类型
const BROKER_ACCOUNT_TYPE = 10;

const ApiManageIndex = ({
  apiKeys,
  isNotice,
  isLimitAddr,
  dispatch,
  security,
  loading,
  createSuccessVisible,
  accountSub,
  userInfo,
  query,
  brokerApiKeys,
  leadTraderApiKeys,
  isLeadTraderAccount,
}) => {
  const { currentLang } = useLocale();
  const isSecurity =
    (security.GOOGLE2FA || security.SMS) && security.WITHDRAW_PASSWORD && security.EMAIL;
  const { activationToken, verifyToken } = query || {};
  const { message } = useSnackbar();

  const [activeTab, setActiveTab] = useState(API_TABS.API);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [is_LimitAddr, setIs_LimitAddr] = useState(isLimitAddr);
  const [is_Notice, setIs_Notice] = useState(isNotice);
  const [modalSec, setModalSec] = useState(false);
  const [verifyConfig, setVerifyType] = useState({
    verifyType: [],
    bizType: 'DISABLE_FAV_WITHDRAWAL',
  });

  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const isBrokerAccount = userInfo?.type === BROKER_ACCOUNT_TYPE;

  const listLoading = !!(
    loading.effects['api_key/pullIsLeadTraderAccount'] ||
    loading.effects['api_key/pullLeadTradeApiList'] ||
    loading.effects['api_key/pull'] ||
    loading.effects['api_key/queryBrokerApiKeyList']
  );

  const goCreate = () => {
    trackClick(['Create', '1']);
    dispatch({ type: 'api_key/cacheAddData', payload: {} });
    push(`/account/api/create?activeTab=${activeTab}`);
  };

  const showWithdrawDilog = () => {
    trackClick(['WithdrawAdd', '1']);
    setWithdrawDialogOpen(true);
  };

  const closeWithdrawDialog = (e, reason) => {
    if (reason !== 'backdropClick') {
      trackClick(['WithdrawAdd', '4']);
      setWithdrawDialogOpen(false);
    }
  };

  const showWarnDialog = () => {
    trackClick(['AbnormalAPI', '1']);
    setWarnDialogOpen(true);
  };

  const closeWarnDialog = (e, reason) => {
    if (reason !== 'backdropClick') {
      trackClick(['AbnormalAPI', '4']);
      setWarnDialogOpen(false);
    }
  };

  // 告警切换
  const toggleNoticeStatus = (checked) => {
    trackClick(['AbnormalAPI', '2']);
    setIs_Notice(checked);
  };

  // 提交告警设置
  const submitNoticeStatus = async () => {
    trackClick(['AbnormalAPI', '3']);
    setWarnDialogOpen(false);
    await dispatch({
      type: 'api_key/updateApiIpNoticeStatus',
      payload: {
        isNotice: is_Notice,
      },
    });
    message.success(_t('operation.succeed'));
  };

  // 常用地址切换
  const toggleAddrStatus = (checked) => {
    trackClick(['WithdrawAdd', '2']);
    setIs_LimitAddr(checked);
  };

  // 提交地址设置
  const submitAddrStatus = async (bool) => {
    if (bool === isLimitAddr) {
      message.success(_t('operation.succeed'));
      return false;
    }
    await dispatch({
      type: 'withdrawAddrManage/updateAPIWhiteListStatus',
      payload: {
        isEnabled: bool,
      },
    });
    message.success(_t('operation.succeed'));
  };

  // 获取验证类型
  const getVerifyType = (bizType) => {
    const verifyType = dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
    return verifyType;
  };

  // 打开安全验证弹窗
  const openModalSec = () => {
    setModalSec(true);
  };

  // 提交地址设置的安全校验
  const validAddrSecurity = async () => {
    trackClick(['WithdrawAdd', '3']);
    setWithdrawDialogOpen(false);
    if (is_LimitAddr) {
      submitAddrStatus(true);
    } else {
      const verifyType = await getVerifyType('DISABLE_FAV_WITHDRAWAL');
      if (verifyType[0] && verifyType[0].indexOf('withdraw_password') !== -1) {
        setVerifyType({
          ...verifyConfig,
          verifyType,
        });
        openModalSec();
      } else {
        submitAddrStatus(false);
      }
    }
  };

  // 关闭安全验证modal
  const closeModalSec = () => {
    setModalSec(false);
  };

  // 校验结果回调函数
  const verifyCallback = async (result) => {
    if (result && result.code !== '200') {
      message.error(result.msg);
    } else {
      setModalSec(false);
      submitAddrStatus(false);
    }
  };

  // 激活成功回调
  const successFunc = useCallback(() => {
    dispatch({
      type: 'api_key/pull',
    });
  }, [dispatch]);

  // 去激活
  useEffect(() => {
    if (activationToken && typeof userInfo !== 'undefined') {
      // 先判断能否去执行激活
      const realLang = userInfo?.language || query?.lang || storage.getItem('lang') || currentLang;
      if (!query.lang && realLang === getCurrentLangFromPath()) {
        // 去激活
        dispatch({
          type: 'api_key/goActivation',
          payload: {
            token: activationToken,
          },
        });
      }
    }
  }, [activationToken, currentLang, dispatch, query.lang, userInfo]);

  // 去验证
  useEffect(() => {
    if (verifyToken && typeof userInfo !== 'undefined') {
      // 先判断能否去执行激活
      const realLang = userInfo?.language || storage.getItem('lang') || currentLang;
      if (!query.lang && realLang === getCurrentLangFromPath()) {
        // 去激活
        dispatch({
          type: 'api_key/verifyEmail',
          payload: {
            token: verifyToken,
          },
        });
      }
    }
  }, [verifyToken, currentLang, dispatch, query.lang, userInfo]);

  useEffect(() => {
    if (isBrokerAccount) {
      setActiveTab(API_TABS.BROKER);
    }
  }, [isBrokerAccount]);

  useEffect(() => {
    if (!userInfo) return;
    // 当前账号类型是broker
    if (activeTab === API_TABS.BROKER) {
      dispatch({ type: 'api_key/queryBrokerApiKeyList' });
    } else if (activeTab === API_TABS.LEAD_TRADE_API) {
      dispatch({ type: 'api_key/pullLeadTradeApiList' });
    } else {
      dispatch({ type: 'api_key/pull' });
    }
  }, [activeTab, userInfo]);

  useEffect(() => {
    dispatch({
      type: 'api_key/getApiIpNoticeStatus',
    });
    dispatch({
      type: 'withdrawAddrManage/getAPIWithdrawStatus',
    });
    // Web流量统计
    kcsensorsManualExpose(['ViewH5', '1']);
  }, []);

  useEffect(() => {
    if (withdrawDialogOpen) {
      kcsensorsManualExpose(['WithdrawAdd', '1']);
    }
  }, [withdrawDialogOpen]);

  useEffect(() => {
    if (warnDialogOpen) {
      kcsensorsManualExpose(['AbnormalAPI', '1']);
    }
  }, [warnDialogOpen]);

  useEffect(() => {
    document.body.className = 'no_padding_body';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    setIs_Notice(isNotice);
  }, [isNotice]);

  useEffect(() => {
    setIs_LimitAddr(isLimitAddr);
  }, [isLimitAddr]);

  useEffect(() => {
    setIs_LimitAddr(isLimitAddr);
  }, [withdrawDialogOpen, isLimitAddr]);

  useEffect(() => {
    setIs_Notice(isNotice);
  }, [warnDialogOpen, isNotice]);

  const list = useMemo(() => {
    switch (activeTab) {
      case API_TABS.BROKER:
        return brokerApiKeys;
      case API_TABS.API:
        return apiKeys;
      case API_TABS.LEAD_TRADE_API:
        return leadTraderApiKeys;
      default:
        return [];
    }
  }, [activeTab, brokerApiKeys, apiKeys, leadTraderApiKeys]);

  const Item = useMemo(
    () => (activeTab === API_TABS.BROKER ? BrokerListItem : ListItem),
    [activeTab],
  );

  useEffect(() => {
    if (tenantConfig.api.isLeadTraderAccount) {
      dispatch({ type: 'api_key/pullIsLeadTraderAccount' });
    }
  }, []);

  // 需要安全验证
  if (!isSecurity && _.keys(security || {})?.length > 0) {
    return (
      <div data-inspector="api_page">
        <PageTitle>
          <span>{_t('api.title')}</span>
        </PageTitle>
        <SecurityBinding tip={_t('deposit.requirement')} needEmail />
      </div>
    );
  }
  let title = (
    <PageTitle>
      <span>{_t('api.title')}</span>
      {!accountSub ? (
        <Api_btns>
          <Button className="btnCreate" onClick={goCreate} data-inspector="account_api_create_btn">
            {_t('api.create')}
          </Button>
          <Button
            variant="outlined"
            className="btnTitle"
            onClick={showWithdrawDilog}
            data-inspector="account_api_withdraw_btn"
          >
            {_t('addr.manage.title')}
          </Button>
          <Button
            variant="outlined"
            className="btnNotice"
            onClick={showWarnDialog}
            data-inspector="account_api_warn_btn"
          >
            {_t('api.email.notice.button')}
          </Button>
        </Api_btns>
      ) : null}
    </PageTitle>
  );

  if (isH5) {
    title = (
      <PageTitle>
        <TitleTop>
          <span>{_t('api.title')}</span>
          {!accountSub ? (
            <Button className="btnCreate" onClick={goCreate} size="mini">
              {_t('api.create')}
            </Button>
          ) : null}
        </TitleTop>
        {!accountSub ? (
          <Api_btns>
            <Button variant="outlined" className="btnTitle" onClick={showWithdrawDilog} size="mini">
              {_t('addr.manage.title')}
            </Button>
            <Button variant="outlined" className="btnNotice" onClick={showWarnDialog} size="mini">
              {_t('api.email.notice.button')}
            </Button>
          </Api_btns>
        ) : null}
      </PageTitle>
    );
  }

  return (
    <Wrapper data-inspector="api_page">
      {title}
      {isBrokerAccount || isLeadTraderAccount ? (
        <ExTabs
          value={activeTab}
          size={isH5 ? 'small' : 'large'}
          onChange={(e, val) => setActiveTab(val)}
          indicator={false}
          data-inspector="api_page_tabs"
        >
          {isBrokerAccount ? (
            <Tab
              data-inspector="api_page_broker_tab"
              label={_t('d5rHaA5KVPV3Mst6J4qWHA')}
              value={API_TABS.BROKER}
            />
          ) : null}
          <Tab
            data-inspector="api_page_default_tab"
            label={_t('msbYLHakVpfNKyKdnv83Bs')}
            value={API_TABS.API}
          />
          {isLeadTraderAccount ? (
            <Tab
              data-inspector="api_page_lead-trader-tab"
              label={_t('a94d3f9e657c4000ae1b')}
              value={API_TABS.LEAD_TRADE_API}
            />
          ) : null}
        </ExTabs>
      ) : null}
      {listLoading ? (
        <LoadingWrapper>
          <div>
            <Spin spinning={listLoading} size="small" />
          </div>
        </LoadingWrapper>
      ) : list?.length ? (
        <Content>
          {_.map(list, (item) => {
            const isLeadTradeApi = activeTab === API_TABS.LEAD_TRADE_API;
            const { subName } = item;
            // 带单 api 本质上是子账号的 api，只是业务要求在母账号的列表展示
            // 所以带单 api 要跳到子账号的路由，跳转路径参考：
            // src/routes/AccountPage/SubApiManage/index.js
            const securityUrl = isLeadTradeApi
              ? `/account-sub/api-manager/edit/presecurity/${subName}?apiKey=${item.apiKey}&leadTrade=1`
              : `/account/api/edit/presecurity?apiKey=${item.apiKey}`;
            const editUrl = isLeadTradeApi
              ? `/account-sub/api-manager/edit/${subName}?apiKey=${item.apiKey}&leadTrade=1`
              : `/account/api/edit?apiKey=${item.apiKey}`;
            const activationUrl = isLeadTradeApi
              ? undefined
              : `/account/api/activation?apiKey=${item.apiKey}`;
            const itemQuery = isLeadTradeApi ? { sub: subName } : query;
            return (
              <Item
                securityUrl={securityUrl}
                editUrl={editUrl}
                activationUrl={activationUrl}
                key={item.apiKey}
                accountSub={accountSub}
                query={itemQuery}
                isLeadTradeApi={isLeadTradeApi}
                {...item}
              />
            );
          })}
          <NoMore>{_t('spot.nft.list.noMore')}</NoMore>
        </Content>
      ) : (
        <EmptyBox>
          <Empty />
        </EmptyBox>
      )}
      <StyledDialog
        open={withdrawDialogOpen}
        onCancel={closeWithdrawDialog}
        okText={_t('confirm')}
        cancelText={_t('cancel')}
        onOk={validAddrSecurity}
        title={_t('addr.manage.title')}
        maxWidth={false}
        fullWidth
        data-inspector="account_api_withdraw_dialog"
      >
        <Withdraw_dialog__switch>
          <span> {_t('addr.manage.title')}</span>
          <Switch checked={is_LimitAddr} onChange={toggleAddrStatus} />
        </Withdraw_dialog__switch>
        <Withdraw_dialog__notice>
          <span>{_t('addr.manage.switch.tip')}</span>
          <Link href="/withdraw-addr-manage">{_t('addr.manage.name')}</Link>
        </Withdraw_dialog__notice>
      </StyledDialog>

      <StyledDialog
        open={warnDialogOpen}
        okText={_t('confirm')}
        cancelText={_t('cancel')}
        onCancel={closeWarnDialog}
        onOk={submitNoticeStatus}
        maxWidth={false}
        title={_t('api.email.notice.button')}
        data-inspector="account_api_warn_dialog"
      >
        <Withdraw_dialog__switch>
          <span> {_t('api.email.notice.button')}</span>
          <Switch checked={is_Notice} onChange={toggleNoticeStatus} />
        </Withdraw_dialog__switch>
        <Withdraw_dialog__notice>
          {tenantConfig.api.noFutures ? (
            <span>{_t('3b14956ca3ee4800a94a')}</span>
          ) : (
            <span>{_t('api.email.notice.tips')}</span>
          )}
        </Withdraw_dialog__notice>
      </StyledDialog>

      <ModalSecForm
        verifyConfig={verifyConfig}
        onCancel={closeModalSec}
        visible={modalSec}
        handleResult={verifyCallback}
      />

      <CreateSuccess visible={createSuccessVisible} successFunc={successFunc} />
    </Wrapper>
  );
};

export default withRouter()(
  connect(({ api_key, withdrawAddrManage, user, loading }) => ({
    apiKeys: api_key.apiKeys,
    brokerApiKeys: api_key.brokerApiKeys,
    isNotice: api_key.isNotice,
    isLimitAddr: withdrawAddrManage?.isEnabled,
    security: user.securtyStatus,
    accountSub: user.user && user.user.type === 3, // 是否子账号
    userInfo: user.user,
    loading,
    createSuccessVisible: api_key.createSuccessVisible,
    leadTraderApiKeys: api_key.leadTraderApiKeys,
    isLeadTraderAccount: api_key.isLeadTraderAccount,
  }))(ApiManageIndex),
);
