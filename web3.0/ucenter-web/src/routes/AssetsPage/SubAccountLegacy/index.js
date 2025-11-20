/**
 * Owner: willen@kupotech.com
 */
import { ICQuestionOutlined } from '@kux/icons';
import {
  Checkbox,
  Input,
  numberFormat,
  Popover,
  styled,
  Table,
  Tabs,
  Tooltip,
  withTheme,
} from '@kux/mui';
import CoinCodeToName from 'components/common/CoinCodeToName';
import CoinCurrency from 'components/common/CoinCurrency';
import CoinPrecision from 'components/common/CoinPrecision';
import BreadCrumbs from 'components/KcBreadCrumbs';
import { InfoItem, LiabilityRate } from 'components/Margin/DebtStats';
import { withRouter } from 'components/Router';
import { multiplyFloor, toPercent } from 'helper';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';

import { injectLocale } from '@kucoin-base/i18n';

const BreadWrapper = styled.div`
  margin-bottom: 26px;
`;

const TabsWrapper = styled.div`
  margin-top: 24px;
`;

const CenterCheckbox = styled.div`
  display: flex;
  align-items: flex-end;
  .KuxCheckbox-wrapper {
    display: flex;
    align-items: flex-end;
    .KuxCheckbox-checkbox {
      top: -3px;
    }
  }
`;

const AssetsAmount = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 34px;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 24px;
  line-height: 38px;
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-direction: column;
  }
`;

const Operations = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.down('md')} {
    justify-content: flex-start;
    margin-top: 33px;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const MinTable = styled.div`
  min-width: 720px;
`;

const RespInput = styled.div`
  width: 100%;
  max-width: 260px;
  margin-right: 16px;
`;

const Tipsss = styled.div`
  display: inline-flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
`;

const CurrencyWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  .money_txt {
    font-weight: 400;
    font-size: 12px;
  }
  .amount_txt {
    font-size: 12px;
  }
`;

const CoinIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 5px;
`;

const IconName = styled.span`
  margin-left: 3px;
  color: #9b9b9b;
  font-size: 12px;
  font-weight: 400;
`;

const TableCell = styled.div`
  font-size: 14px;
  font-weight: 500;
  .money_txt {
    font-weight: 400;
    font-size: 12px;
  }
  .amount_txt {
    font-size: 12px;
  }
`;

const MoneyTxt = styled.span`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text60};
  .ml6 {
    margin-left: 6px;
  }
`;

const CoinWrapper = styled.span`
  .currency {
    margin-left: 8px;
    color: ${(props) => props.theme.colors.text60};
  }
`;

const TipWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  margin-bottom: 2px;
`;

const amountMap = {
  main: 'baseMainAmount',
  trade: 'baseTradeAmount',
  margin: 'baseMarginAmount',
  tradeHF: 'baseTradeHFAmount',
};

@withTheme
@withRouter()
@connect((state) => {
  const { categories } = state;
  const { marginConfigs } = state.market;
  const { subAccountsMoney: accountsMoney, baseCurrency } = state.subAccount;
  const loading = state.loading.effects['subAccount/getSubAccountAmountDetail'];
  const { smallExchangeConfig, isHFOpen } = state.user_assets;
  const { prices } = state.currency;
  return {
    marginConfigs,
    categories,
    accountsMoney,
    baseCurrency,
    loading,
    smallExchangeConfig,
    prices,
    isHFOpen,
  };
})
@injectLocale
class PageSubAccountAssets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curType: 'main',
      ifHideLittle: false,
      filterCur: undefined,
      pagination: {
        current: 1,
        pageSize: 12,
        total: 0,
      },
      hiddenLittleCurrency: false,
    };
    this._filterCurrency = _.debounce(this._filterCurrency, 300);
  }

  componentDidMount() {
    const { query } = this.props;
    const { qId } = this.state;
    const { sub } = query || {};
    this.props.dispatch({
      type: 'subAccount/getSubAccountAmountDetail',
      payload: {
        subName: qId || sub,
      },
    });
  }

  // 清除子账号标识
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'api_key/update',
      payload: {
        filters: {
          bizType: '',
        },
        subName: undefined,
        apiKeys: [],
        cloneApiKeys: [],
        ApiWordModalVisible: false,
        securityModalVisible: false,
        needActions: [],
        ready: false,
      },
    });
    dispatch({
      type: 'subAccount/update',
      payload: {
        subAccountsMoney: {},
      },
    });
  }

  // 切换账户类型
  switchType = (nextType) => {
    const { curType } = this.state;
    if (nextType && curType !== nextType) {
      this.setState({
        curType: nextType,
      });
    }
  };

  filterCurrency = (e) => {
    e.persist();
    this._filterCurrency(e);
  };

  _filterCurrency = (e) => {
    // e.persist();
    const cur = e.target.value;
    this.setState({
      currency: cur.toUpperCase(),
    });
  };

  createColumns = () => {
    const { curType } = this.state;
    const { categories, currentLang } = this.props;
    const columns = [
      {
        title: _t('assets.categories'),
        key: 'currency',
        dataIndex: 'currency',
        render(v) {
          return (
            <CurrencyWrapper>
              <CoinIcon src={(categories[v] || {}).iconUrl} alt="coin-icon" />
              <CoinCodeToName coin={v} />
              <IconName>{(categories[v] || {}).name}</IconName>
            </CurrencyWrapper>
          );
        },
      },
      {
        title: _t('amount.total'),
        key: 'total',
        dataIndex: 'balance',
        render(v, { currency }) {
          return (
            <TableCell>
              {numberFormat({
                number: v,
                lang: currentLang,
                options: { maximumFractionDigits: v >= 1000000 ? 2 : 8 },
              })}{' '}
              <CoinCodeToName coin={currency} />
              <div className="money_txt">
                <CoinCurrency amountClassName="amount_txt" value={v} coin={currency} />
              </div>
            </TableCell>
          );
        },
      },
      {
        title: _t('amount.enabled'),
        key: 'available',
        dataIndex: 'available',
        render(v, { currency }) {
          return (
            <TableCell>
              {numberFormat({
                number: v,
                lang: currentLang,
                options: { maximumFractionDigits: v >= 1000000 ? 2 : 8 },
              })}{' '}
              <CoinCodeToName coin={currency} />
              <div className="money_txt">
                <CoinCurrency amountClassName="amount_txt" value={v} coin={currency} />
              </div>
            </TableCell>
          );
        },
      },
      {
        title: _t('amount.freeze'),
        key: 'hold',
        dataIndex: 'holds',
        render(v, { currency }) {
          return (
            <TableCell>
              {numberFormat({
                number: v,
                lang: currentLang,
                options: { maximumFractionDigits: v >= 1000000 ? 2 : 8 },
              })}{' '}
              <CoinCodeToName coin={currency} />
              <div className="money_txt">
                <CoinCurrency amountClassName="amount_txt" value={v} coin={currency} />
              </div>
            </TableCell>
          );
        },
      },
    ];
    if (curType === 'margin') {
      columns.push({
        title: _t('asset.debts'),
        key: 'liability',
        dataIndex: 'liability',
        render(v, { currency }) {
          return (
            <TableCell>
              {numberFormat({
                number: v,
                lang: currentLang,
                options: { maximumFractionDigits: v >= 1000000 ? 2 : 8 },
              })}{' '}
              <CoinCodeToName coin={currency} />
              <div className="money_txt">
                <CoinCurrency amountClassName="amount_txt" value={v} coin={currency} />
              </div>
            </TableCell>
          );
        },
      });
    }
    return columns;
  };

  /**
   * 隐藏小额资产
   */
  hideLittle = async (val) => {
    const { query } = this.props;
    this.setState({
      [`main_${query.sub}`]: undefined,
      [`trade_${query.sub}`]: undefined,
      hiddenLittleCurrency: val,
    });
    this._getAmountMoney();
  };

  renderTitle = () => {
    const { curType } = this.state;
    const { isHFOpen } = this.props;
    const { subUserOpen } = isHFOpen;

    return (
      <TabsWrapper>
        <Tabs value={curType} onChange={(e, v) => this.switchType(v)}>
          <Tabs.Tab value="main" label={_t('main.account')} />
          <Tabs.Tab value="trade" label={_t('trade.account')} />
          {/* {subUserOpen && <Tabs.Tab value="tradeHF" label={_t('highFrequency.account')} />} */}
        </Tabs>
      </TabsWrapper>
    );
  };

  // 缓存，减少循环
  _getAmountMoney = () => {
    const { query, accountsMoney } = this.props;
    const { curType, qId } = this.state;
    const { sub } = query;
    let target = null;
    if (!qId) {
      [target] =
        _.filter(accountsMoney, (val) => {
          return val.subName === sub;
        }) || [];
      if (target) {
        this.setState({
          qId: target.subName,
        });
      }
    } else {
      target = accountsMoney[qId];
    }
    return target ? target[`${curType}Accounts`] : [];
  };

  getAmountMoney = () => {
    const { curType, currency, hiddenLittleCurrency } = this.state;
    const { query, smallExchangeConfig, prices = {} } = this.props;
    const key = `${curType}_${query.sub}`;
    let finalArr = [];
    if (this.state[key] !== undefined && this.state[key].length) {
      finalArr = this.state[key];
    } else {
      const v = this._getAmountMoney();
      if (v && v.length) {
        this.setState({
          [key]: v,
        });
      }
      finalArr = v;
    }
    let result = [];
    if (currency) {
      result = _.filter(finalArr, (v) => v.currency.indexOf(currency) > -1);
    } else {
      result = finalArr;
    }
    if (hiddenLittleCurrency) {
      // 需要隐藏小额币种
      const { quotaLimit, baseCurrency: _baseCurrency } = smallExchangeConfig || {};
      const rate = prices[_baseCurrency] || 0;
      const target = Number(multiplyFloor(rate, quotaLimit, 2), 2);
      result = _.filter(result, (item) => {
        const { balance, currency: cur } = item || {};
        if (Number(balance) > 0) {
          // 有值，计算
          const _rate = prices[cur] || 0;
          const _target = Number(multiplyFloor(_rate, balance, 2), 2);
          return +_target >= +target;
        }
        return false;
      });
    }
    return result;
  };

  render() {
    const {
      accountsMoney,
      baseCurrency,
      loading,
      query = {},
      marginConfigs,
      smallExchangeConfig,
      theme,
    } = this.props;
    const { curType, qId } = this.state;
    const { flWarnDebtRatio = 0, flDebtRatio = 0 } = marginConfigs || {};
    const account = accountsMoney[qId] || {};
    const total = account[amountMap[curType]] || 0;
    const { quotaLimit, baseCurrency: _baseCurrency } = smallExchangeConfig || {};
    const liabilityModule =
      curType === 'margin' ? (
        <span>
          <InfoItem
            isLogin
            title={
              <Tooltip
                title={_tHTML('debtRatio.desc', {
                  x: toPercent(flWarnDebtRatio, ''),
                  y: toPercent(flDebtRatio, ''),
                })}
              >
                <span>{_t('margin.debt.rate')}</span>
              </Tooltip>
            }
            style={{ display: 'inline', marginTop: 4 }}
            item={<LiabilityRate liabilityRate={0} />}
          />
          <CoinWrapper style={{ marginLeft: 4, fontSize: 12 }}>
            (&nbsp;
            {_t('margin.debt.total')}:
            <CoinPrecision coin={baseCurrency} value={0} /> {baseCurrency}
            <CoinCurrency coin={baseCurrency} className={`currency`} value={0} />
            &nbsp;)
          </CoinWrapper>
        </span>
      ) : null;

    return (
      <div data-inspector="account_sub_assets_page">
        <BreadWrapper>
          <BreadCrumbs
            breadCrumbs={[
              { label: _t('subaccount.subaccount'), url: '/account/sub' },
              { label: query.sub },
            ]}
          />
          {/* <Back onClick={() => push('/account/sub')} /> */}
        </BreadWrapper>
        {this.renderTitle()}
        <AssetsAmount>
          <div>
            <span>
              {_t('subaccount.prop.assets')}: <CoinPrecision coin={baseCurrency} value={total} />
              <MoneyTxt> {baseCurrency}</MoneyTxt>
              <MoneyTxt>
                <CoinCurrency value={total} coin={baseCurrency} className="ml6" />
              </MoneyTxt>
            </span>
            {liabilityModule}
          </div>
          <Operations style={{ flexWrap: 'wrap' }}>
            <RespInput>
              <Input allowClear={true} onChange={this.filterCurrency} placeholder={_t('search')} />
            </RespInput>
            <CenterCheckbox>
              <Checkbox
                onChange={(e) => {
                  this.hideLittle(e.target.checked);
                }}
              >
                {_t('hide.small.balance')}
              </Checkbox>
              <Popover
                placement="top"
                content={_t('small.balance.help', {
                  value: quotaLimit,
                  currency: _baseCurrency,
                })}
              >
                <TipWrapper>
                  <ICQuestionOutlined size={18} color={theme.colors.icon} />
                </TipWrapper>
              </Popover>
            </CenterCheckbox>
          </Operations>
        </AssetsAmount>
        <TableWrapper>
          <MinTable>
            <Table
              loading={loading}
              columns={this.createColumns()}
              dataSource={this.getAmountMoney()}
              pagination={false}
              rowKey="currency"
            />
          </MinTable>
        </TableWrapper>
      </div>
    );
  }
}

export default PageSubAccountAssets;
