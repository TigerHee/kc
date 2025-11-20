/**
 * Owner: willen@kupotech.com
 */
import { ICInfoOutlined, ICOrdersHistoryOutlined, ICSearchOutlined } from '@kux/icons';
import {
  Box,
  Button,
  Input,
  numberFormat,
  styled,
  Tabs,
  Tooltip,
  withResponsive,
  withSnackbar,
  withTheme,
} from '@kux/mui';
import AccountHeader from 'components/Account/AccountHeader';
import CoinCurrency from 'components/common/CoinCurrency';
import SubTransferFailedModal from 'components/KuxTransferModal/MultiFailedModal';
import SubAccountTransferModal from 'components/KuxTransferModal/SubAccountTransferModal';
import ModalForbid from 'components/Tips/modalForbid';
import { setNumToPrecision } from 'helper';
import requireProps from 'hocs/requireProps';
import React from 'react';
import { connect } from 'react-redux';
import { unBindHostedSubAccount } from 'services/account';
import { ACCOUNT_CODE } from 'src/components/KuxTransferModal/config';
import { injectLocale } from 'src/components/LoadLocale';
import AssetsWebCompManager from 'src/mfRemoteComponents/AssetsWebCompManager';
import { getABtestResultBySensorKey } from 'src/utils/abTest';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import AccountsTable from './accountsTable';
import Protect from './components/protectNew';
import { ACCOUNT_TYPE_LIST, SUB_ACCOUNT_MAP } from './config';
import ModalAdd from './modalAdd';
import ModalBindHosted from './modalBindHosted';
import ModalBindHostedApprove from './modalBindHostedApprove';
import ModalModify from './modalModify';
import ModalOpenTrade from './modalOpenTrade';
import ModalReset2fa from './modalReset2fa';
import ModalResetPermission from './modalResetPermission';
import ModalResetPwd from './modalResetPwd';
import ModalResetTradingPwd from './modalResetTradingPwd';
import ModalSecurity from './modalSecurity';
import ModalStatus from './modalStatus';

const { UniversalTransferModal, UniversalTransferMultiFailedModal } = AssetsWebCompManager;

const Content = styled.div`
  padding: 40px 64px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 32px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px;
  }
  .hide {
    display: none;
  }
`;
const SubHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 20px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 20px;
  }
`;
const SubHeaderLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  flex: 1;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 16px;
  }
`;
const AssetsItem = styled.div`
  margin-right: 60px;
`;
const TotalAssets = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 12px;
  }
`;
const AssetsInfo = styled.div`
  display: flex;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const EmphisisText = styled.span`
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
  &.small {
    font-size: 24px;
  }
`;
const LightTxt = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  margin-left: 6px;
  display: inline-block;
  color: ${({ theme }) => theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const ListTypeBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .approve {
    margin-left: 32px;
    color: ${({ theme }) => theme.colors.complementary};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    cursor: pointer;
  }
`;
const SubHeaderRight = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.down('lg')} {
    justify-content: flex-start;
    width: 100%;
    ${(props) => props.theme.breakpoints.down('sm')} {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
const IptSearch = styled.div`
  width: 100%;
  max-width: 240px;
  min-width: 150px;
`;
const RightBtn = styled(Button)`
  margin-left: 12px;
  background: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
`;
const DelegationIcon = styled(ICOrdersHistoryOutlined)`
  font-size: 20px;
  margin-right: 6px;
  color: ${({ theme }) => theme.colors.icon};
`;
const SearchIcon = styled(ICSearchOutlined)`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.icon40};
`;

const BIZ = 'UNFROZEN_SUB_ACCOUNT';
// 弹窗对应的二次安全校验key
const _2faModal = 'modalReset2fa';
// 解除托管子账号绑定
const unBindHostedModal = 'unBindHosted';

const bizTypeMap = {
  modalResetPwd: 'RESET_SUB_ACCOUNT_PASSWORD',
  modalResetTradingPwd: 'RESET_SUB_ACCOUNT_WITHDRAWAL_PASSWORD',
  [_2faModal]: 'RESET_SUB_ACCOUNT_2FA',
  addAccount: 'CREATE_SUB_ACCOUNT',
  resetPermission: 'UPDATE_SUB_TRADE_TYPE',
  [unBindHostedModal]: 'HOSTED_SUB_UNBIND_TRADE',
};

const modalSecurityTitleMap = {
  [unBindHostedModal]: _t('38Ans2wHZH3H27gFwSgV9o'),
};
const modalSecuritySubmitTxtMap = {
  [unBindHostedModal]: _t('2ME8aJuVQsLfsZ5ZyBxxq9'),
};

const mapToArr = (values) => {
  try {
    let tradeTypes = [];
    for (let i in SUB_ACCOUNT_MAP) {
      if (values[SUB_ACCOUNT_MAP[i]]) tradeTypes.push(SUB_ACCOUNT_MAP[i]);
    }
    return tradeTypes;
  } catch (error) {
    return [];
  }
};

// 当前modal、value
let _value = {};

@withTheme
@withResponsive
@withSnackbar()
@connect((state) => {
  const { securtyStatus = {}, user = {} } = state.user;
  const { isSub = false, oesSubEnabled = false } = user || {};
  const { g2faKey } = state.account_security;
  const { subBatchFailedCurrencies } = state.transfer || {};
  const {
    records = [],
    pagination,
    accountsMoney,
    totalAmount,
    baseCurrency,
    keywords = '',
    hasLoadTotalAmount,
    subAccountTypeAmount,
    oesCustodyList = [],
    accountListType,
    tradeTeamAccountData,
    hostedTotalAmount,
  } = state.subAccount;
  const {
    WITHDRAW_PASSWORD,
    SMS,
    // EMAIL,
    GOOGLE2FA,
  } = securtyStatus;
  const verifyOpen = SMS || GOOGLE2FA;
  const withdrawOpen = WITHDRAW_PASSWORD;
  const loadingList = state.loading.effects['subAccount/getAccountList'];
  const remarkModifying = state.loading.effects['subAccount/modifyRemark'];
  const statusChanging = state.loading.effects['subAccount/freezeOrUnfreezeSubAccount'];
  const resetPwd = state.loading.effects['subAccount/resetPwdSubAccount'];
  const resetTradingPwd = state.loading.effects['subAccount/resetTradingPwdSubAccount'];
  const addingAccount = state.loading.effects['subAccount/createSubAccountNew'];

  return {
    WITHDRAW_PASSWORD,
    SMS,
    // EMAIL,
    GOOGLE2FA,
    g2faKey,
    verifyOpen,
    withdrawOpen,
    accounts: records,
    pagination,
    loadingList,
    accountsMoney,
    totalAmount,
    baseCurrency,
    remarkModifying,
    statusChanging,
    keywords,
    resetPwd,
    resetTradingPwd,
    isSub,
    // 是否允许创建 oes 资金托管子账号
    oesSubEnabled,
    oesCustodyList,
    hasLoadTotalAmount,
    subBatchFailedCurrencies,
    subAccountTypeAmount,
    addingAccount,
    accountListType,
    isTradeTeamAccount: tradeTeamAccountData.isTradeTeamAccount,
    applyingSubUserCount: tradeTeamAccountData.applyingSubUserCount,
    hostedTotalAmount,
    user,
  };
})
@requireProps({
  verifyOpen(value) {
    return value !== undefined;
  },
})
@injectLocale
class PageSubAccount extends React.Component {
  state = {
    modalOpen: null,
    modalSecurity: false,
    curItem: {},
    curAccount: null,
    _modal: '',
    isEdit: false,
    isModalBindHostedOpen: false,
    isModalBindHostedApproveOpen: false,
    isOpenTradeOpen: false,
    subBatchFailedCurrencies: null,
    isUseNewTransferModal: false,
  };

  model = 'subAccount';

  setSubBatchFailedCurrencies = (newValue) => this.setState({ subBatchFailedCurrencies: newValue });

  dispatchWrapper = (type, payload = {}, others = {}, model = '') => {
    const _model = model || this.model || '';
    return this.props.dispatch({
      type: `${_model}/${type}`,
      payload,
      ...others,
    });
  };

  componentDidMount() {
    this.search();
    this.props.dispatch({
      type: 'subAccount/getSafeWords',
    });
    this.props.dispatch({
      type: 'subAccount/getSubAccountTypeAmount',
    });
    this.props.dispatch({
      type: 'subAccount/getOESCustodyList',
    });
    console.log('theme', this.props.theme);
    getABtestResultBySensorKey('assets_enable_new_universal_transfer', {
      defaultValue: '0',
      valueType: 'String',
    }).then((val) => {
      this.setState({
        isUseNewTransferModal: val === '1',
      });
    });
  }

  search = () => {
    const { withdrawOpen, verifyOpen } = this.props;
    if (!withdrawOpen || !verifyOpen) {
      return;
    }
    // 先获取账号资产，然后获取账号
    // this.dispatchWrapper('getSubAccountAmount');
    this.dispatchWrapper('getAccountList', {
      refreshAmount: true,
    });
    this.dispatchWrapper('getAccountBalancne');
    this.dispatchWrapper('getTradeTeamsInfo');
  };

  // 切换modal的显示隐藏
  swithModal = (modal = null, callback = () => {}) => {
    this.setState(
      {
        modalOpen: typeof modal === 'string' ? modal : null,
      },
      typeof callback === 'function' ? callback : null,
    );
  };

  hideTransferModal = (success) => {
    this.swithModal(null, () => {
      if (success === true) {
        this.search();
      }
    });
  };

  setCur = (item) => {
    this.setState({
      curItem: item,
      isEdit: true,
    });
  };

  switchModalSecurity = (isOpen = false, verifyType) => {
    this.setState({
      modalSecurity: isOpen === true,
      verifyType: isOpen === true ? verifyType : [],
    });
  };

  // 冻结，解冻账户
  handleStatus = async (_curItem) => {
    const { curItem } = this.state;
    const { status } = _curItem || curItem;
    if (status === 3) {
      const verifyType = await this.dispatchWrapper(
        'get_verify_type',
        {
          bizType: BIZ,
        },
        {},
        'security_new',
      );
      if (verifyType && verifyType.length === 0) {
        this.onOk({}, 'modalStatus');
      } else {
        this.setState({
          _modal: 'modalStatus',
        });
        _value = {};
        this.switchModalSecurity(true, verifyType);
      }
    } else {
      this.onOk({}, 'modalStatus');
    }
  };

  handleCallback = async () => {
    this.switchModalSecurity(false);
    // await this.onOk(null, 'modalStatus');
    this.swithModal(null);
    // this.handleTableChange();
  };

  handleVerifyCallback = async (result) => {
    const { _modal = '' } = this.state || {};
    if (result && result.code === '200') {
      this.switchModalSecurity(false);
      this.onOk(_value || {}, _modal || 'modalStatus');
    } else {
      this.dispatchWrapper(
        'feed',
        {
          type: 'message.error',
          message: result.msg,
        },
        {},
        'notice',
      );
    }
  };

  onOk = async (values, modal) => {
    const { message, keywords } = this.props;
    if (modal === unBindHostedModal) {
      unBindHostedSubAccount(values)
        .then((res) => {
          if (res?.success) {
            message.success(_t('s9cPqcNJzwnQ2y8uH2kQkM'));
            this.dispatchWrapper('getAccountList', {
              refreshAmount: true,
            });
          }
        })
        .catch((err) => {
          err?.msg && message.error(err?.msg);
        });
      return;
    }

    if (modal === _2faModal) {
      // 立即重置2fa，需要获取key
      const _key = await this.props.dispatch({
        type: 'account_security/getG2FAKey',
      });
      values = {
        ...values,
        key: _key,
      };
    }

    const { curItem } = this.state;
    return this.dispatchWrapper(
      'submit',
      {
        values,
        modal,
      },
      {
        subAccount: curItem,
      },
    ).then((res) => {
      if (res && res.code === '200') {
        if (modal !== _2faModal) message.success(_t('convert.order.status.success'));
        this.handleCallback();
        this.dispatchWrapper('getAccountList', {
          refreshAmount: true,
        });
        if (modal === _2faModal) {
          this.swithModal(_2faModal);
        }
        // 新增，更新子账户后重新拉账户数
        if (modal === 'addAccount' || modal === 'resetPermission') {
          this.props.dispatch({
            type: 'subAccount/getSubAccountTypeAmount',
          });
        }
        if (modal === 'addAccount') {
          const item = res?.data || {};
          if (item?.subType === 5) {
            this.onOpenModalBindHosted(item);
          }
        }
      }
    });
  };

  handleTableChange = (page) => {
    this.dispatchWrapper('getAccountList', {
      page,
    });
  };

  handleTableSearch = () => {
    this.dispatchWrapper('getAccountList', {
      page: 1,
    });
  };

  handleSearchInput = (e) => {
    this.props.dispatch({
      type: 'subAccount/updSearch',
      payload: e.target.value || '',
    });
  };

  /**
   * 提交之前的校验
   */
  beforeSubmit = async (values, modal) => {
    const verifyType = await this.dispatchWrapper(
      'get_verify_type',
      {
        bizType: bizTypeMap[modal],
      },
      {},
      'security_new',
    );
    if (verifyType && verifyType.length === 0) {
      // 不需要校验
      this.onOk(values, modal);
    } else {
      this.setState({
        _modal: modal,
      });
      _value = values;
      this.swithModal(null);
      this.switchModalSecurity(true, verifyType);
    }
  };

  handleFailedModalClose = () => {
    if (this.state.isUseNewTransferModal) {
      this.setSubBatchFailedCurrencies(null);
    } else {
      this.props.dispatch({
        type: 'transfer/update',
        payload: {
          subBatchFailedCurrencies: null,
        },
      });
    }
  };

  onAdd = async (values, modal) => {
    const postData = {
      subName: values.subName,
      remarks: values.remarks,
      password: values.password,
      tradeTypes: mapToArr(values),
      type: values.type,
    };

    if (values.custodyCode) {
      postData.custodyCode = values.custodyCode;
    }

    const verifyType = await this.dispatchWrapper(
      'get_verify_type',
      {
        bizType: bizTypeMap.addAccount,
      },
      {},
      'security_new',
    );

    if (verifyType && verifyType.length === 0) {
      this.onOk(postData, modal);
    } else {
      this.setState({
        _modal: modal,
      });
      _value = postData;
      this.swithModal(null);
      this.switchModalSecurity(true, verifyType);
    }
  };

  // 打开绑定交易团队弹窗
  onOpenModalBindHosted = (item) => {
    this.setState({
      isModalBindHostedOpen: true,
      curItem: item,
    });
  };

  // 打开开通交易
  onOpenModalOpenTrade = (item) => {
    this.setState({
      isOpenTradeOpen: true,
      curItem: item,
    });
  };

  // 解绑交易团队
  onUnbindHosted = async (val) => {
    const modal = unBindHostedModal;
    const verifyType = await this.dispatchWrapper(
      'get_verify_type',
      {
        bizType: bizTypeMap.addAccount,
      },
      {},
      'security_new',
    );
    if (verifyType && verifyType.length === 0) {
      this.onOk(val, modal);
    } else {
      this.setState({
        _modal: modal,
      });
      _value = val;
      this.swithModal(null);
      this.switchModalSecurity(true, verifyType);
    }
  };

  beforeResetPermission = (item) => {
    this.setCur(item);
    this.swithModal('resetPermission');
    this.props.dispatch({
      type: 'subAccount/getSubAccountPosition',
      payload: {
        subUserId: item?.userId,
      },
    });
  };

  handleReTransfer = () => {
    this.handleFailedModalClose();
    this.swithModal('modalTrans');
  };

  onResetPermission = async (values, modal) => {
    const { curItem } = this.state;
    const postData = {
      subUserId: curItem?.userId,
      beforeTradeTypes: curItem?.tradeTypes,
      tradeTypes: mapToArr(values),
    };

    const verifyType = await this.dispatchWrapper(
      'get_verify_type',
      {
        bizType: bizTypeMap.resetPermission,
      },
      {},
      'security_new',
    );

    if (verifyType && verifyType.length === 0) {
      this.onOk(postData, modal);
    } else {
      this.setState({
        _modal: modal,
      });
      _value = postData;
      this.swithModal(null);
      this.switchModalSecurity(true, verifyType);
    }
  };

  render() {
    const {
      modalOpen,
      curItem,
      modalSecurity,
      verifyType,
      _modal,
      isModalBindHostedOpen,
      isModalBindHostedApproveOpen,
      isOpenTradeOpen,
    } = this.state;
    let {
      withdrawOpen,
      verifyOpen,
      accounts,
      pagination,
      loadingList,
      accountsMoney,
      totalAmount,
      baseCurrency,
      remarkModifying,
      statusChanging,
      keywords = '',
      resetPwd,
      resetTradingPwd,
      g2faKey,
      isSub = false,
      oesSubEnabled = false,
      oesCustodyList = [],
      hasLoadTotalAmount,
      subBatchFailedCurrencies,
      subAccountTypeAmount,
      addingAccount,
      responsive,
      accountListType,
      isTradeTeamAccount,
      applyingSubUserCount,
      hostedTotalAmount,
      currentLang,
    } = this.props;

    const { sm } = responsive;

    if (!withdrawOpen || !verifyOpen) {
      return (
        <Protect
          hideBtn
          title={_t('subaccount.subaccounts')}
          tip={_t('subaccount.tips.createAccount')}
        />
      );
    }
    return (
      <div data-inspector="account_sub_page">
        {isSub && <ModalForbid />}

        <AccountHeader title={_t('subaccount.subaccounts')}>
          <Button
            onClick={() => {
              this.setState({ isEdit: false });
              this.swithModal('addAccount');
            }}
            variant="contained"
            size={sm ? 'basic' : 'mini'}
            data-inspector="account_sub_create"
          >
            {_t('subaccount.opt.create')}
          </Button>
        </AccountHeader>

        <Content>
          <SubHeader>
            <SubHeaderLeft>
              <AssetsItem>
                <TotalAssets>
                  {_t('5Q8eKQYR1G2EoHr4LKwaqK')}
                  <Tooltip placement="top" title={_t('72fa7cc34b544000a73f')}>
                    <ICInfoOutlined />
                  </Tooltip>
                </TotalAssets>
                <AssetsInfo>
                  {hasLoadTotalAmount ? (
                    <span>
                      <EmphisisText data-inspector="account_sub_page_total">
                        {`${numberFormat({
                          number: setNumToPrecision(totalAmount),
                          lang: currentLang,
                        })} ${baseCurrency}`}
                      </EmphisisText>
                      <LightTxt>
                        <CoinCurrency value={totalAmount} coin={baseCurrency} />
                      </LightTxt>
                    </span>
                  ) : (
                    <EmphisisText>{_t('1h77gr2PGrfDN8MuVULpxh')}</EmphisisText>
                  )}
                </AssetsInfo>
              </AssetsItem>

              {isTradeTeamAccount ? (
                <AssetsItem>
                  <TotalAssets>{_t('wXq5gfP3kqYLMQru323Uge')}</TotalAssets>
                  <AssetsInfo>
                    {hasLoadTotalAmount ? (
                      <span>
                        <EmphisisText className="small">
                          {`${numberFormat({
                            number: setNumToPrecision(hostedTotalAmount),
                            lang: currentLang,
                          })} ${baseCurrency}`}
                        </EmphisisText>
                        <LightTxt>
                          <CoinCurrency value={hostedTotalAmount} coin={baseCurrency} padZero />
                        </LightTxt>
                      </span>
                    ) : (
                      <EmphisisText className="small">{_t('1h77gr2PGrfDN8MuVULpxh')}</EmphisisText>
                    )}
                  </AssetsInfo>
                </AssetsItem>
              ) : null}
            </SubHeaderLeft>
            <SubHeaderRight>
              <IptSearch>
                <Input
                  allowClear={true}
                  value={keywords}
                  onChange={this.handleSearchInput}
                  onKeyUp={(e) => {
                    if (e && (e.key === 'Enter' || e.keyCode === '13')) {
                      this.handleTableSearch();
                    }
                  }}
                  placeholder={_t('3cec43783cc14000a935')}
                  variant="standard"
                  prefix={<SearchIcon />}
                  autoComplete="new-password"
                />
              </IptSearch>

              <RightBtn
                data-inspector="account_sub_page_query"
                onClick={() => {
                  push('/account/sub/history/transfer');
                }}
                variant="default"
              >
                <DelegationIcon />
                {_t('3uDo5zDipAu3AF3pitgCWB')}
              </RightBtn>
            </SubHeaderRight>
          </SubHeader>

          {/* 账户类型选择 */}
          {isTradeTeamAccount ? (
            <ListTypeBox mb={24}>
              <Tabs
                value={accountListType}
                onChange={(e, value) => {
                  if (loadingList) {
                    return;
                  }
                  this.dispatchWrapper('update', { accountListType: value });
                  this.dispatchWrapper('getAccountList', {
                    page: 1,
                  });
                }}
                variant="bordered"
              >
                {ACCOUNT_TYPE_LIST.map(({ label, value }) => (
                  <Tabs.Tab label={label} value={value} key={value} />
                ))}
              </Tabs>
              {applyingSubUserCount > 0 ? (
                <div
                  onClick={() =>
                    this.setState({
                      isModalBindHostedApproveOpen: true,
                    })
                  }
                  className="approve"
                  role="button"
                  tabIndex="0"
                >
                  {_t('4jkkZQobjUg2SQ4cWpiF5Z', { count: applyingSubUserCount })}
                </div>
              ) : null}
            </ListTypeBox>
          ) : null}

          <AccountsTable
            openModal={this.swithModal}
            beforeSubmit={this.beforeSubmit}
            setCur={this.setCur}
            data={accounts}
            pagination={pagination}
            handleChange={this.handleTableChange}
            loading={loadingList}
            accountsMoney={accountsMoney}
            handleStatus={this.handleStatus}
            beforeResetPermission={this.beforeResetPermission}
            onOpenModalBindHosted={this.onOpenModalBindHosted}
            onOpenModalOpenTrade={this.onOpenModalOpenTrade}
            onUnbindHosted={this.onUnbindHosted}
            dispatchWrapper={this.dispatchWrapper}
          />
        </Content>

        {modalOpen === 'modifyMark' && (
          <ModalModify
            onCancel={this.swithModal}
            handleOk={this.onOk}
            modalName="modifyMark"
            visible={modalOpen === 'modifyMark'}
            loading={remarkModifying}
          />
        )}

        <ModalAdd
          onCancel={this.swithModal}
          modalName="addAccount"
          visible={modalOpen === 'addAccount'}
          handleOk={this.onAdd}
          loading={addingAccount}
          oesSubEnabled={oesSubEnabled}
          oesCustodyList={oesCustodyList}
          count={{
            [SUB_ACCOUNT_MAP.spot]: subAccountTypeAmount?.availableSpotSubQuantity || 0,
            [SUB_ACCOUNT_MAP.margin]: subAccountTypeAmount?.availableMarginSubQuantity || 0,
            [SUB_ACCOUNT_MAP.futures]: subAccountTypeAmount?.availableFuturesSubQuantity || 0,
            [SUB_ACCOUNT_MAP.option]: subAccountTypeAmount?.availableOptionSubQuantity || 0,
          }}
        />
        <ModalResetPwd
          curItem={curItem}
          onCancel={this.swithModal}
          modalName="modalResetPwd"
          visible={modalOpen === 'modalResetPwd'}
          handleOk={this.beforeSubmit}
          loading={resetPwd}
        />
        <ModalResetTradingPwd
          curItem={curItem}
          onCancel={this.swithModal}
          modalName="modalResetTradingPwd"
          visible={modalOpen === 'modalResetTradingPwd'}
          handleOk={this.beforeSubmit}
          loading={resetTradingPwd}
        />
        <ModalReset2fa
          curItem={curItem}
          onCancel={this.swithModal}
          modalName={_2faModal}
          visible={modalOpen === _2faModal}
          g2faKey={g2faKey}
        />

        {modalOpen === 'modalTrans' ? (
          this.state.isUseNewTransferModal ? (
            <UniversalTransferModal
              user={this.props.user}
              message={this.props.message}
              theme={this.props.theme.currentTheme}
              onCancel={this.hideTransferModal}
              visible={modalOpen === 'modalTrans'}
              initCurrency={window._BASE_CURRENCY_}
              initDict={
                curItem.type === 9
                  ? [
                      [curItem.userId, ACCOUNT_CODE.MAIN],
                      [curItem.userId, ACCOUNT_CODE.TRADE],
                    ]
                  : [
                      ['', ACCOUNT_CODE.MAIN],
                      [curItem.userId, ACCOUNT_CODE.MAIN],
                    ]
              }
              subUserList={this.props.accounts.map((x) => ({
                userId: x.userId,
                showName: x.subName,
                type: x.type,
              }))}
              setSubBatchFailedCurrencies={this.setSubBatchFailedCurrencies}
            />
          ) : (
            <SubAccountTransferModal
              initSubAccount={curItem.userId}
              curItem={curItem}
              onCancel={this.hideTransferModal}
              visible={modalOpen === 'modalTrans'}
              initCurrency={window._BASE_CURRENCY_}
            />
          )
        ) : null}
        {this.state.isUseNewTransferModal ? (
          <UniversalTransferMultiFailedModal
            failedCurrencies={this.state.subBatchFailedCurrencies}
            onCancel={this.handleFailedModalClose}
            onConfirm={this.handleReTransfer}
          />
        ) : (
          <SubTransferFailedModal
            failedCurrencies={subBatchFailedCurrencies}
            onCancel={this.handleFailedModalClose}
            onConfirm={this.handleReTransfer}
          />
        )}

        <ModalStatus
          curItem={curItem}
          curStatus={curItem.status === 2}
          onCancel={this.swithModal}
          visible={modalOpen === 'modalStatus'}
          onOk={this.handleStatus}
          loading={statusChanging}
        />

        {modalSecurity ? (
          <ModalSecurity
            curStatus={curItem.status === 'normal'}
            onCancel={this.switchModalSecurity}
            visible={modalSecurity}
            // onOk={this.handleStatus}
            callback={this.handleVerifyCallback}
            verifyType={verifyType}
            bizType={bizTypeMap[_modal] || BIZ}
            modalTitle={modalSecurityTitleMap[_modal] || _t('security.verify')}
            customKeyValue={{
              google_2fa: _t('g2fa.code'),
            }}
            submitBtnTxt={modalSecuritySubmitTxtMap[_modal] || _t('submit')}
          />
        ) : null}

        <ModalResetPermission
          curItem={curItem}
          onCancel={this.swithModal}
          modalName="resetPermission"
          visible={modalOpen === 'resetPermission'}
          handleOk={this.onResetPermission}
          loading={resetPwd}
        />

        {/* 托管子账号绑定交易团队 */}
        {isModalBindHostedOpen ? (
          <ModalBindHosted
            open={isModalBindHostedOpen}
            onCancel={() => {
              this.setState({
                isModalBindHostedOpen: false,
              });
            }}
            dispatchWrapper={this.dispatchWrapper}
            curItem={curItem}
          />
        ) : null}

        {/* 托管子账号绑定审批 */}
        {isModalBindHostedApproveOpen ? (
          <ModalBindHostedApprove
            open={isModalBindHostedApproveOpen}
            onCancel={() => {
              this.setState({
                isModalBindHostedApproveOpen: false,
              });
            }}
            dispatchWrapper={this.dispatchWrapper}
          />
        ) : null}

        {isOpenTradeOpen ? (
          <ModalOpenTrade
            open={isOpenTradeOpen}
            onCancel={() => {
              this.setState({
                isOpenTradeOpen: false,
              });
            }}
            dispatchWrapper={this.dispatchWrapper}
            curItem={curItem}
          />
        ) : null}
      </div>
    );
  }
}

export default PageSubAccount;
