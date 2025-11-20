/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import {
  ICEdit2Outlined,
  ICInfoOutlined,
  ICMoreOutlined,
  ICTriangleBottomOutlined,
} from '@kux/icons';
import {
  Button,
  Drawer,
  Dropdown,
  numberFormat,
  Table,
  Tooltip,
  withResponsive,
  withSnackbar,
} from '@kux/mui';
import classnames from 'classnames';
import MiniTable from 'components/Account/MiniTable';
import CoinCurrency from 'components/common/CoinCurrency';
import KcPagination from 'components/common/MuiPagination';
import { tenantConfig } from 'config/tenant';
import { add, setNumToPrecision } from 'helper';
import { intersection } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelBindHostedSubAccount } from 'services/account';
import SpanForA from 'src/components/common/SpanForA';
import { injectLocale } from 'src/components/LoadLocale';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import hostedBindIcon from 'static/account/hosted-bind.svg';
import hostedPendingIcon from 'static/account/hosted-pending.svg';
import { _t } from 'tools/i18n';
import { OES_BOUND_TYPE } from 'utils/constants';
import { push } from 'utils/router';
import {
  ACCOUNT_CUSTOMER,
  displayName,
  SUB_ACCOUNT_MAP,
  SUB_ACCOUNT_TYPE_HOSTED,
  SUB_ACCOUNT_TYPE_OES,
  TRADE_TYPE_FUTURE,
  TRADE_TYPE_MARGIN,
} from './config';
import ModalBindHostedToken from './modalBindHostedToken';

const StyledDropDown = styled(Dropdown)``;

const TableWrapper = styled.div`
  tr {
    position: relative;
    th {
      background: ${({ theme }) =>
        theme.currentTheme === 'light' ? '#FBFBFB' : '#171717'} !important;
      &:not(:last-child) {
        padding-right: 8px;
      }
    }
    td {
      padding: 0;
      font-weight: 500;
      font-size: 14px;

      &:not(:last-child) {
        padding-right: 8px;
      }
      & > * {
        display: flex;
        align-items: center;
        height: 80px;
      }
    }
  }
`;
const EditIcon = styled(ICEdit2Outlined)`
  font-size: 16px;
  cursor: pointer;
  margin-right: 8px;
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;
const MoreIcon = styled(ICMoreOutlined)`
  font-size: 24px;
  cursor: pointer;
  &.mb {
    margin-bottom: 12px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-bottom: 8px;
    }
  }
  &.disabled {
    color: ${({ theme }) => theme.colors.text40};
    cursor: not-allowed;
  }
`;
const SettingIcon = styled(ICTriangleBottomOutlined)`
  font-size: 12px;
  cursor: pointer;
  margin-left: 2px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.icon60};
`;
const SettingsLists = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 2px 4px 0px ${(props) => props.theme.colors.divider4},
    0px 0px 1px 0px ${(props) => props.theme.colors.divider4};
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.layer};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0;
    border: none;
    box-shadow: none;
  }
`;
const PopReset = styled.div`
  padding: 0 16px;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  /* background-color: ${({ theme }) => theme.colors.cover4}; */
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
  &.popDanger {
    /* color: ${({ theme }) => theme.colors.secondary}; */
  }
  &.disable {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;
const EmphisisText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};
`;
const LightTxt = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text30};
  ${(props) => props.theme.breakpoints.down('lg')} {
    text-align: right;
  }
  .amount_txt {
    font-size: 12px;
  }
`;
const StatusTxt = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text60};
  &.notAllow {
    cursor: not-allowed;
  }
`;
const SettingBtn = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
`;
const RemarksBox = styled.div`
  display: flex;
  align-items: center;
`;
const Settings = styled.div`
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end !important;
  gap: 4px;
  a,
  span {
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .settingBtn {
    display: flex;
    align-items: center;
  }

  .settingBtnDisabled {
    display: inline-flex;
    color: ${({ theme }) => theme.colors.text40};
    cursor: not-allowed;
  }
  .handleLimit {
    display: inline-block;
  }
  .fontSize14 {
    font-size: 14px;
  }
`;
const H5SubName = styled.span`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
  }
`;
const SubType = styled.span`
  word-break: break-all;
  text-wrap: auto;
`;
const HostedItem = styled.div`
  ${(props) => props.theme.breakpoints.down('lg')} {
    text-align: right;
  }
  .top {
    font-weight: 400;
  }
  .bottom {
    display: flex;
    align-items: center;
    margin-top: 4px;
    cursor: pointer;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    span {
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
    .unbind {
      color: ${({ theme }) => theme.colors.complementary};
    }
    .disable {
      color: ${({ theme }) => theme.colors.text40};
      cursor: not-allowed;
    }
    .danger {
      color: ${({ theme }) => theme.colors.secondary};
    }
    .pending {
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.text40};
    }
    .hosted {
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  .pointer {
    cursor: pointer;
  }
`;
const NotHostTooltipText = styled('div')`
  color: ${(props) => props.theme.colors.textEmphasis};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;

  button {
    height: auto !important;
    margin-left: 4px;
  }
`;
const NotHostedIcon = styled(ICInfoOutlined)`
  color: ${(props) => props.theme.colors.complementary};
  margin-right: 2px;
  width: 16px;
  height: 16px;
`;
const NotHostedItem = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-start;
  color: ${(props) => props.theme.colors.complementary};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  word-break: keep-all;
  white-space: nowrap;
  .not-hosted-text {
    border-bottom: 1px dashed #f8b200;
  }
`;

const Amount = ({ value, baseCurrency, precision, lang }) => (
  <div>
    <div>
      <EmphisisText>
        {/* 如果值为0，则展示 -- */}
        {baseCurrency && value ? (
          <span>{`${numberFormat({
            number: setNumToPrecision(value, precision),
            lang,
          })} ${baseCurrency}`}</span>
        ) : (
          <span>--</span>
        )}
      </EmphisisText>
      <LightTxt>
        {/* 如果值为0，默认展示 -- */}
        <CoinCurrency
          amountClassName="amount_txt"
          value={!value ? null : value}
          coin={baseCurrency}
          defaultValue={'--'}
          padZero
        />
      </LightTxt>
    </div>
  </div>
);

const MoreActions = ({ disabled, isH5, children }) => {
  const [open, setOpen] = useState(false);

  if (disabled) {
    return <MoreIcon className="mb disabled" />;
  }

  if (isH5) {
    return (
      <>
        <MoreIcon className="mb" onClick={() => setOpen(true)} />
        <Drawer anchor="bottom" show={open} back={false} onClose={() => setOpen(false)}>
          {children}
        </Drawer>
      </>
    );
  } else {
    return (
      <StyledDropDown
        visible={open}
        onVisibleChange={(state) => setOpen(state)}
        popperStyle={{ zIndex: 99 }}
        trigger="click"
        overlay={children}
        disablePortal={false}
      >
        <MoreIcon className="mb" />
      </StyledDropDown>
    );
  }
};

@withResponsive
@withSnackbar()
@connect((state) => {
  const { accountListType } = state.subAccount;

  return {
    categories: state.categories,
    user: state.user,
    isCustomerList: accountListType === ACCOUNT_CUSTOMER,
  };
})
@injectLocale
class AccountsTable extends React.Component {
  state = {
    uid: null,
    bindHostedTokenModalVisible: false,
  };

  switchStatus = (status, item) => {
    if (status === 3) {
      this.props.handleStatus(item);
    } else {
      this.props.openModal('modalStatus');
    }
  };

  openBindHostedTokenModal = (item) => {
    this.setState({
      uid: item?.uid,
      bindHostedTokenModalVisible: true,
    });
  };

  closeBindHostedTokenModal = () => {
    this.setState({
      uid: null,
      bindHostedTokenModalVisible: false,
    });
  };

  // 撤销绑定
  onCancelBindHosted = (subUid) => {
    const { dispatchWrapper, message } = this.props;

    cancelBindHostedSubAccount({ subUid })
      .then((res) => {
        if (res?.success) {
          message.success('operation.succeed');
          dispatchWrapper('getAccountList', {
            refreshAmount: true,
          });
        }
      })
      .catch((err) => {
        err?.msg && message.error(err?.msg);
      });
  };

  getDropdownContent = ({ text, record, isXl }) => {
    const self = this;
    const { isCustomerList } = this.props;
    const { status, subName, type, uid, openedTradeTypes = [] } = record;
    const isRobot = record.type === 1;
    const isLoan = record.type === 2;
    const isHostedSub = self.getIsHostedSub(type);

    return (
      <SettingsLists>
        {/* 查看API */}
        <PopReset
          data-inspector="accounts_table_api"
          onClick={() => {
            if (isRobot || isLoan || (isHostedSub && !isCustomerList)) {
              return;
            }
            push(`/account-sub/api-manager/${encodeURIComponent(encodeURIComponent(subName))}`);
          }}
          className={classnames({
            disable: isRobot || isLoan || (isHostedSub && !isCustomerList),
          })}
        >
          {_t('1AQFpAAGb9wCcmZZ7uhpfr')}
        </PopReset>

        {!isCustomerList ? (
          <>
            {/* 开通交易权限 */}
            {isHostedSub &&
            intersection(openedTradeTypes, [TRADE_TYPE_MARGIN, TRADE_TYPE_FUTURE]).length < 2 ? (
              <PopReset
                onClick={() => {
                  self.props.onOpenModalOpenTrade(record);
                }}
              >
                {_t('5zbmfKu6B97KcdGpKsbsmQ')}
              </PopReset>
            ) : null}
            {/* 交易权限设置 */}
            <PopReset
              data-inspector="accounts_table_perm_update"
              onClick={() => {
                self.props.beforeResetPermission(record);
              }}
            >
              {_t('wpHtkAERTs9e1dH9oq4Nav')}
            </PopReset>
            {/* 冻结｜解冻 */}
            <PopReset
              data-inspector="accounts_table_freeze"
              onClick={() => {
                if (isRobot || isLoan) return;
                self.props.setCur(record);
                self.switchStatus(status, record);
              }}
            >
              {status === 2 ? _t('eHpDb7J8R8janXtuNycdkr') : _t('ufKGe6hqRmciFN4HfbcSXq')}
            </PopReset>
            {/* 重置子账号-登录密码 */}
            <PopReset
              data-inspector="accounts_table_login_pwd_reset"
              onClick={() => {
                self.props.setCur(record);
                self.props.openModal('modalResetPwd');
              }}
            >
              {_t('sub.reset.login.password2')}
            </PopReset>
            {/* 重置子账号-交易密码 */}
            <PopReset
              data-inspector="accounts_table_trading_pwd_reset"
              onClick={() => {
                self.props.setCur(record);
                self.props.openModal('modalResetTradingPwd');
              }}
            >
              {_t('sub.reset.trading.password2')}
            </PopReset>
            {/* 重置子账号-谷歌验证 */}
            <PopReset
              data-inspector="accounts_table_g2fa_reset"
              onClick={() => {
                self.props.setCur(record);
                self.props.beforeSubmit({}, 'modalReset2fa');
              }}
            >
              {_t('sub.reset.2fa2')}
            </PopReset>
          </>
        ) : (
          <></>
        )}

        {!isXl ? (
          <>
            {!isCustomerList ? (
              // 资金划转
              <PopReset
                onClick={() => {
                  if (isRobot || isLoan) {
                    return;
                  }
                  self.props.setCur(record);
                  self.props.openModal('modalTrans');
                }}
              >
                {_t('transfer')}
              </PopReset>
            ) : (
              <>
                {/* 解除绑定 */}
                <PopReset
                  className="popDanger"
                  onClick={() => self.props.onUnbindHosted({ subUid: uid })}
                  role="button"
                  tabIndex="0"
                >
                  {_t('38Ans2wHZH3H27gFwSgV9o')}
                </PopReset>
              </>
            )}
            {/* 资产详情 - 主站打开，本地站资产部门在做改造，完成之后再打开 */}
            {tenantConfig.account.showAssetDetail && (
              <PopReset
                onClick={() => {
                  push(`/account/assets/${encodeURIComponent(encodeURIComponent(record.subName))}`);
                }}
              >
                {_t('subaccount.opt.asset.detail')}
              </PopReset>
            )}
          </>
        ) : null}
      </SettingsLists>
    );
  };

  getIsHostedSub = (v) => v === SUB_ACCOUNT_TYPE_HOSTED;
  getIsOESSub = (v) => v === SUB_ACCOUNT_TYPE_OES;

  createColumns = (hasData) => {
    const self = this;
    const { pagination, categories, isRTL, responsive, isCustomerList, multiSiteConfig } =
      this.props;
    const { xl, lg, sm } = responsive;
    const isXl = xl;
    const isPad = !lg && sm;
    const isH5 = !sm;

    // 多站点配置里的枚举是全小写，但 config 里定义的是首字符大写
    // 甚至有些地方还能看到全大写的（全局搜 "SPOT" 可见）
    // 保险点，全部转成小写再进行比较
    const subUserPermissions = (multiSiteConfig?.accountConfig?.subUserPermissions || []).map((p) =>
      p.toLowerCase(),
    );
    const accountCols = Object.values(SUB_ACCOUNT_MAP)
      .map((key) => {
        if (subUserPermissions.includes(key.toLowerCase())) {
          switch (key) {
            case SUB_ACCOUNT_MAP.spot:
              return {
                // 币币账户
                title: _t('c38fc9225db14000a59b'),
                key: 'baseFuturesAmount',
                render(val, rowData) {
                  const { accountsMoney, currentLang } = self.props;
                  const ta = accountsMoney[rowData.subName] || {};
                  const {
                    baseMainAmount = 0,
                    baseTradeAmount = 0,
                    baseTradeHFAmount = 0,
                    baseCurrency = '',
                  } = ta;
                  const total = [baseMainAmount, baseTradeAmount, baseTradeHFAmount]
                    .reduce((a, b) => add(a, b))
                    .toFixed();
                  const { precision } = categories[baseCurrency] || { precision: 8 };
                  return (
                    <Amount
                      // 值是0，就传入正常数字 0
                      value={total === '0' ? 0 : total}
                      precision={precision}
                      lang={currentLang}
                      baseCurrency={baseCurrency}
                    />
                  );
                },
              };
            case SUB_ACCOUNT_MAP.margin:
              return {
                // 杠杆账户
                title: _t('c084e8b30abf4000ad54'),
                render(val, rowData) {
                  const { accountsMoney, currentLang } = self.props;
                  const ta = accountsMoney[rowData.subName] || {};
                  const { baseMarginAmount = 0, baseIsolatedAmount = 0, baseCurrency = '' } = ta;
                  const total = add(baseMarginAmount, baseIsolatedAmount).toFixed();
                  const { precision } = categories[baseCurrency] || { precision: 8 };
                  return (
                    <Amount
                      value={total === '0' ? 0 : total}
                      precision={precision}
                      lang={currentLang}
                      baseCurrency={baseCurrency}
                    />
                  );
                },
              };
            case SUB_ACCOUNT_MAP.futures:
              return {
                // 合约账户
                title: _t('eabfe9d0b8ac4000aae1'),
                key: 'baseFuturesAmount',
                render(val, rowData) {
                  const { accountsMoney, currentLang } = self.props;
                  const ta = accountsMoney[rowData.subName] || {};
                  const { baseFuturesAmount = 0, baseCurrency = '' } = ta;
                  const { precision } = categories[baseCurrency] || { precision: 8 };
                  return (
                    <Amount
                      value={baseFuturesAmount}
                      precision={precision}
                      lang={currentLang}
                      baseCurrency={baseCurrency}
                    />
                  );
                },
              };
            case SUB_ACCOUNT_MAP.option:
              return {
                // 期权账户
                title: _t('ecdf35ac6b904000a464'),
                key: 'baseOptionAmount',
                render(val, rowData) {
                  const { accountsMoney, currentLang } = self.props;
                  const ta = accountsMoney[rowData.subName] || {};
                  const { baseOptionAmount = 0, baseCurrency = '' } = ta;
                  const { precision } = categories[baseCurrency] || { precision: 8 };
                  return (
                    <Amount
                      value={baseOptionAmount}
                      precision={precision}
                      lang={currentLang}
                      baseCurrency={baseCurrency}
                    />
                  );
                },
              };
            default:
              return null;
          }
        }
        return null;
      })
      .filter(Boolean);

    return [
      {
        title: (val, row) => {
          return <H5SubName>{row?.subName}</H5SubName>;
        },
        labelColorKey: 'text',
        dataIndex: 'h5',
        render(val, record) {
          const { status, uid, hostedStatus } = record;
          const isRobot = record.type === 1;
          const isLoan = record.type === 2;
          const isHostedPending = hostedStatus === 1;

          const isDisabled = isRobot || isLoan || isHostedPending;

          return (
            <MoreActions disabled={isDisabled} isH5={isH5}>
              {self.getDropdownContent({ val, record, isXl })}
            </MoreActions>
          );
        },
        hide: !(isPad || isH5),
      },
      {
        title: _t('subaccount.prop.loginName'),
        dataIndex: 'subName',
        width: '160px',
        fixed: hasData ? 'left' : '',
        render(val, item, index) {
          return (
            <div>
              <span>
                {index + 1 + (pagination.current - 1) * (pagination.pageSize || pagination.size)}
              </span>
              <span style={{ marginLeft: '20px', wordBreak: 'break-all' }}>{val}</span>
            </div>
          );
        },
        hide: isPad || isH5,
      },
      isCustomerList
        ? null
        : {
            title: _t('sysqKHEWA1gYGJfJo1dp61'),
            dataIndex: 'hostedStatus',
            width: '190px',
            render: (val, item, index) => {
              const { type, uid, hostedStatus, oesBound } = item;
              const isHostedSub = self.getIsHostedSub(type);
              // 如果是三方资金托管子账号
              const isOESSub = self.getIsOESSub(type);
              if (isHostedSub) {
                // 托管状态；0:未绑定,1:申请绑定中,2:已绑定,3:投资人解绑,4:交易团队解绑,5:审批拒绝
                if ([0, 3, 4, 5].includes(hostedStatus)) {
                  // 永远都是 false
                  const isDisable = [].includes(hostedStatus);
                  const isReject = [5].includes(hostedStatus);

                  // 未关联交易团队
                  return (
                    <Tooltip
                      maxWidth={320}
                      trigger="hover"
                      offset={4}
                      title={
                        <NotHostTooltipText>
                          <span>
                            {isReject ? _t('8uyLLWkeL7TuFk6MaSL8TL') : _t('d6b7f39cd4874800a7f9')}
                          </span>
                          <Button
                            type="brandGreen"
                            variant="text"
                            onClick={() => {
                              if (isDisable) {
                                return;
                              }
                              this.props.onOpenModalBindHosted(item);
                            }}
                          >
                            {_t('e4560bd1e8e24000aa54')}
                          </Button>
                        </NotHostTooltipText>
                      }
                    >
                      <NotHostedItem>
                        <NotHostedIcon />
                        <span className="not-hosted-text">{_t('bcaa4hdNkQiBCrMFN87YVL')}</span>
                      </NotHostedItem>
                    </Tooltip>
                  );
                }
                if (hostedStatus === 2) {
                  // 已托管
                  const content = (
                    <SettingsLists>
                      <PopReset
                        className="popDanger"
                        onClick={() => this.props.onUnbindHosted({ subUid: uid })}
                        role="button"
                        tabIndex="0"
                      >
                        {_t('38Ans2wHZH3H27gFwSgV9o')}
                      </PopReset>
                    </SettingsLists>
                  );

                  return (
                    <div>
                      <HostedItem>
                        <div className="top">{_t('bcaa4hdNkQiBCrMFN87YVL')}</div>
                        <StyledDropDown
                          popperStyle={{ zIndex: 99 }}
                          trigger="click"
                          overlay={content}
                          disablePortal={false}
                        >
                          <div className="bottom">
                            <img alt="hosted-bind-icon" src={hostedBindIcon} />
                            <SpanForA className="hosted">
                              {_t('ijqkn6bbDqJfkieWTtMykF')} <SettingIcon />
                            </SpanForA>
                          </div>
                        </StyledDropDown>
                      </HostedItem>
                    </div>
                  );
                }
                if (hostedStatus === 1) {
                  // 等待托管中
                  const content = (
                    <SettingsLists>
                      <PopReset
                        className="popDanger"
                        onClick={() => this.onCancelBindHosted(uid)}
                        role="button"
                        tabIndex="0"
                      >
                        {_t('f64eb9bbb4bc4000ad60')}
                      </PopReset>
                    </SettingsLists>
                  );

                  return (
                    <div>
                      <HostedItem>
                        <div className="top">{_t('bcaa4hdNkQiBCrMFN87YVL')}</div>

                        <StyledDropDown
                          popperStyle={{ zIndex: 99 }}
                          trigger="click"
                          overlay={content}
                          disablePortal={false}
                        >
                          <div className="bottom">
                            <img alt="hosted-pending-icon" src={hostedPendingIcon} />
                            <span className="pending settingBtn">
                              {_t('gbnNvQmfjt3gQvBMURNz7K')} <SettingIcon />
                            </span>
                          </div>
                        </StyledDropDown>
                      </HostedItem>
                    </div>
                  );
                }

                return _t('bcaa4hdNkQiBCrMFN87YVL');
              }

              if (isOESSub) {
                // 1:oes已绑定；0：oes待绑定；其它值(包括-1)：无法绑定oes；默认值-1
                // 如果不是已经绑定
                if (oesBound !== OES_BOUND_TYPE.alreadyBound) {
                  return (
                    <Tooltip
                      maxWidth={320}
                      trigger="hover"
                      offset={4}
                      title={
                        <NotHostTooltipText>
                          <span>{_t('a472f5445c244000ac95')}</span>
                          <Button
                            type="brandGreen"
                            variant="text"
                            onClick={() => this.openBindHostedTokenModal(item)}
                          >
                            {_t('e4560bd1e8e24000aa54')}
                          </Button>
                        </NotHostTooltipText>
                      }
                    >
                      <NotHostedItem>
                        <NotHostedIcon />
                        <SubType className="not-hosted-text">{_t('d337ebb3c7964000a918')}</SubType>
                      </NotHostedItem>
                    </Tooltip>
                  );
                }

                return <SubType>{_t('d337ebb3c7964000a918')}</SubType>;
              }

              return <SubType>{_t('rh6rV2cDHJPc3Q48qD9bmP')}</SubType>;
            },
          },
      {
        title: 'UID',
        dataIndex: 'uid',
        width: '140px',
        render: (uid, record) => {
          const isRobot = record.type === 1;
          const isLoan = record.type === 2;
          return <span>{isRobot || isLoan ? '--' : uid}</span>;
        },
      },
      {
        title: _t('remark'),
        dataIndex: 'remarks',
        render(text, item) {
          return (
            <RemarksBox>
              <EditIcon
                onClick={() => {
                  self.props.setCur(item);
                  self.props.openModal('modifyMark');
                }}
              />
              <span style={{ flex: 1 }} title={text}>
                {text}
              </span>
            </RemarksBox>
          );
        },
      },
      {
        title: _t('koRMHoMMvFsSDvZwWwjHeB'),
        dataIndex: 'tradeTypes',
        render: (val, record) => {
          return <span>{displayName(val)}</span>;
        },
      },
      // 子账号类型数量小于等于 1 时，账号余额相当于总资产，不用展开显示
      ...(accountCols.length > 1 ? accountCols : []),
      // 统一账户资产
      tenantConfig.account.subAccountShowUnified
        ? {
            title: _t('314a7bb940be4000a5a4'),
            key: 'baseUnifiedAmount',
            render(val, rowData) {
              const { accountsMoney, currentLang } = self.props;
              const ta = accountsMoney[rowData.subName] || {};
              const { baseUnifiedAmount = 0, baseCurrency = '' } = ta;
              const { precision } = categories[baseCurrency] || { precision: 8 };
              return (
                <Amount
                  value={baseUnifiedAmount}
                  precision={precision}
                  lang={currentLang}
                  baseCurrency={baseCurrency}
                />
              );
            },
          }
        : null,
      {
        title: _t('2VktdRQ356HhgBwFbm9VQ7'),
        key: 'money',
        render(val, rowData) {
          const { accountsMoney, currentLang } = self.props;
          const ta = accountsMoney[rowData.subName] || {};
          const {
            baseMainAmount = 0,
            baseTradeAmount = 0,
            baseMarginAmount = 0,
            baseIsolatedAmount = 0,
            baseTradeHFAmount = 0,
            baseOptionAmount = 0,
            baseFuturesAmount = 0,
            baseCurrency = '',
          } = ta;
          const total = [
            baseMainAmount,
            baseTradeAmount,
            baseMarginAmount,
            baseIsolatedAmount,
            baseTradeHFAmount,
            baseOptionAmount,
            baseFuturesAmount,
          ]
            .reduce((a, b) => add(a, b))
            .toFixed();
          const { precision } = categories[baseCurrency] || { precision: 8 };
          return (
            <Amount
              value={total === '0' ? 0 : total}
              precision={precision}
              lang={currentLang}
              baseCurrency={baseCurrency}
            />
          );
        },
      },
      {
        title: _t('trxAirdrop.state'),
        key: 'status',
        width: '50px',
        render(val, record) {
          const { status } = record;
          const isRobot = record.type === 1;
          const isLoan = record.type === 2;
          return (
            <StatusTxt
              className={classnames({
                notAllow: isRobot || isLoan,
              })}
            >
              <span>
                {status === 2 ? _t('subaccount.status.normal') : _t('subaccount.status.frozen')}
              </span>
            </StatusTxt>
          );
        },
      },
      {
        title: _t('sub.operation'),
        key: 'operations',
        align: 'right',
        width: '160px',
        fixed: 'right',
        render(val, record) {
          const { status, uid, hostedStatus } = record;
          const isRobot = record.type === 1;
          const isLoan = record.type === 2;
          const isHostedPending = hostedStatus === 1;
          // （oes子账号，前端过渡兼容）只在 普通子账号 ｜｜ 托管子账号 的时候，开启到资产详情的开关
          const isEnableToDetail = record.type === 0 || record.type === 5;

          const hostedContent = (
            <SettingsLists>
              <PopReset
                className="popDanger"
                onClick={() => self.props.onUnbindHosted({ subUid: uid })}
                role="button"
                tabIndex="0"
              >
                {_t('38Ans2wHZH3H27gFwSgV9o')}
              </PopReset>
            </SettingsLists>
          );

          return (
            <Settings>
              {isRobot || isLoan || isHostedPending ? (
                <SettingBtn className="settingBtnDisabled fontSize14">
                  {isXl ? (
                    <>
                      {_t('setting')} <SettingIcon />
                    </>
                  ) : (
                    <MoreIcon className="disabled" />
                  )}
                </SettingBtn>
              ) : (
                <StyledDropDown
                  popperStyle={{ zIndex: 99 }}
                  trigger="click"
                  overlay={self.getDropdownContent({ val, record, isXl })}
                  disablePortal={false}
                >
                  {isXl ? (
                    <SpanForA className="settingBtn fontSize14">
                      {_t('setting')} <SettingIcon />
                    </SpanForA>
                  ) : (
                    <MoreIcon />
                  )}
                </StyledDropDown>
              )}

              {isXl ? (
                <>
                  {!isCustomerList ? (
                    <>
                      {isRobot || isLoan || isHostedPending ? (
                        <span className="settingBtnDisabled fontSize14">{_t('transfer')}</span>
                      ) : (
                        <SpanForA
                          className="handleLimit fontSize14"
                          onClick={() => {
                            self.props.setCur(record);
                            self.props.openModal('modalTrans');
                          }}
                        >
                          {_t('transfer')}
                        </SpanForA>
                      )}
                    </>
                  ) : null}

                  {/* 资产详情 - 主站打开，本地站资产部门在做改造，完成之后再打开 */}
                  {tenantConfig.account.showAssetDetail && (
                    <>
                      {!isEnableToDetail ? (
                        <span className="settingBtnDisabled">
                          {_t('subaccount.opt.asset.detail')}
                        </span>
                      ) : (
                        <Link
                          className="handleLimit"
                          to={`/account/assets/${encodeURIComponent(
                            encodeURIComponent(record.subName),
                          )}`}
                        >
                          {_t('subaccount.opt.asset.detail')}
                        </Link>
                      )}
                    </>
                  )}

                  {isCustomerList ? (
                    <StyledDropDown
                      popperStyle={{ zIndex: 99 }}
                      trigger="click"
                      overlay={hostedContent}
                      disablePortal={false}
                    >
                      <SpanForA className="settingBtn">
                        {_t('vSE1vUueEsJzWzYtX4yReK')} <SettingIcon />
                      </SpanForA>
                    </StyledDropDown>
                  ) : null}
                </>
              ) : null}
            </Settings>
          );
        },
        hide: isPad || isH5,
      },
    ].filter((i) => i && !i.hide);
  };

  render() {
    const { data, pagination = {}, handleChange, loading, responsive } = this.props;
    const { bindHostedTokenModalVisible, uid } = this.state;
    const _pagination = {
      ...(pagination || {}),
      pageSize: pagination.size || pagination.pageSize,
    };

    const { xl, lg, sm } = responsive;
    const isXl = xl;
    const isPad = !lg && sm;
    const isH5 = !sm;

    return (
      <React.Fragment>
        <TableWrapper>
          {isPad || isH5 ? (
            <MiniTable
              locale={{
                emptyText: _t('subaccount.noData'),
              }}
              loading={loading}
              rowKey="subName"
              dataSource={data}
              columns={this.createColumns(!!data.length)}
              pagination={false}
            />
          ) : (
            <Table
              locale={{
                emptyText: _t('subaccount.noData'),
              }}
              bordered={true}
              loading={loading}
              rowKey="subName"
              dataSource={data}
              columns={this.createColumns(!!data.length)}
              pagination={false}
              size="small"
              scroll={sm && !!data.length ? { x: 1800 } : {}}
            />
          )}
        </TableWrapper>
        {_pagination?.total > _pagination?.pageSize ? (
          <KcPagination {..._pagination} onChange={handleChange} siblingCount={1} />
        ) : null}
        <ModalBindHostedToken
          open={bindHostedTokenModalVisible}
          onCancel={this.closeBindHostedTokenModal}
          uid={uid}
        />
      </React.Fragment>
    );
  }
}

export default withMultiSiteForbiddenPage(AccountsTable);
