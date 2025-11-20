/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import { Form, Input, Button } from '@kc/ui';
import SvgIcon from 'components/common/KCSvgIcon';
import CoinSelector from 'components/common/CoinSelector';
import SpanForA from 'components/common/SpanForA';
import { formatNumber } from 'helper';
import _ from 'lodash';
import style from './style.less';
import Decimal from 'decimal.js';
import { injectLocale } from '@kucoin-base/i18n';

const FormItem = Form.Item;

const accountTypeObj = {
  MAIN: 'main.account',
  TRADE: 'trade.account',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

@connect((state) => {
  const { trade, main, mainMap, tradeMap } = state.user_assets;
  return {
    main,
    trade,
    mainMap,
    tradeMap,
    categories: state.categories,
  };
})
@Form.create()
@injectLocale
export default class AssetTransformForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      currentCurrency: undefined,
      visible: false,
      payAccountType: 'MAIN',
      recAccountType: 'TRADE',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.visible !== prevState.visible) {
      return {
        visible: nextProps.visible,
        currentCurrency: nextProps.currency || undefined,
        payAccountType: nextProps.accountType,
        recAccountType: nextProps.accountType === 'MAIN' ? 'TRADE' : 'MAIN',
      };
    }
    return null;
  }

  setCurrency = (currency) => {
    this.setState({
      currentCurrency: currency,
    });
  };

  getCurrencies = () => {
    const { payAccountType } = this.state;
    const { trade, main } = this.props;
    let currencies = [...main];
    if (payAccountType === 'TRADE') {
      currencies = [...trade];
    }
    return currencies;
  };

  genAccountType = (type) => {
    return type === 'MAIN' ? 'TRADE' : 'MAIN';
  };

  handleAccountTypesChange = () => {
    const { payAccountType, recAccountType } = this.state;
    this.setState({
      payAccountType: this.genAccountType(payAccountType),
      recAccountType: this.genAccountType(recAccountType),
    });
  };

  handleSetAmount = () => {
    this.resetAmountToPre(this.getAvailableBalance() || 0);
    // this.props.form.setFieldsValue({
    //   amount: this.getAvailableBalance(),
    // });
  };

  getAvailableBalance = () => {
    const { mainMap, tradeMap } = this.props;
    const { currentCurrency, payAccountType } = this.state;
    if (!currentCurrency) {
      return 0;
    }
    const currencyMap = payAccountType === 'MAIN' ? mainMap : tradeMap;
    if (currencyMap[currentCurrency]) {
      return currencyMap[currentCurrency].availableBalance;
    }
    return 0;
  };

  resetAmountToPre = (value) => {
    const { categories = {}, form } = this.props;
    const { currentCurrency } = this.state;
    form.setFieldsValue({
      amount: Decimal(value).toFixed(
        (categories[currentCurrency] || { precision: 8 }).precision,
        Decimal.ROUND_DOWN,
      ),
    });
  };

  handleConfirmAmount = (rule, value, callback) => {
    if (Number(value) > this.getAvailableBalance()) {
      this.handleSetAmount();
    }
    if (_.isNaN(parseFloat(value)) || value <= 0) {
      callback(_t('form.format.error'));
      return;
    }
    this.resetAmountToPre(value);
    callback();
  };

  afterSubmit = () => {
    if (this.props.afterSubmitCallback) {
      this.props.afterSubmitCallback();
    }
    this.props.form.resetFields();
    setTimeout(() => {
      this.setState({
        pending: false,
      });
    }, 0);
  };

  handleSubmit = () => {
    const { payAccountType, recAccountType, pending } = this.state;
    if (pending) {
      return false;
    }
    const {
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const params = {
          bizType: 'TRANSFER',
          recTag: 'DEFAULT',
          subBizType: 'TRANSFER',
          payTag: 'DEFAULT',
          payAccountType,
          recAccountType,
          amount: values.amount,
          currency: values.currency,
          transferMode: values.auto ? 'AUTOMATIC' : 'MANUAL',
        };
        this.setState({
          pending: true,
        });
        try {
          await dispatch({
            type: 'user_assets/selfTransfer',
            payload: {
              ...params,
            },
          });
          dispatch({
            type: 'notice/feed',
            payload: {
              type: 'message.success',
              message: _t('operation.succeed'),
            },
          });
          dispatch({
            type: 'user_assets/pullAccountCoins@polling:restart',
          });
        } finally {
          this.afterSubmit();
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      categories = {},
      allowClear,
    } = this.props;
    const currenciesWithCoin = this.getCurrencies();
    const { payAccountType, recAccountType, currentCurrency } = this.state;
    const availableBalance = this.getAvailableBalance();
    const { precision } = categories[currentCurrency] || {};
    return (
      <Form>
        <FormItem label={null}>
          <div className={style.accountChangeWrapper}>
            <span>{_t(accountTypeObj[payAccountType])}</span>
            <SvgIcon
              iconId="switch-fill"
              className={style.switchIcon}
              onClick={this.handleAccountTypesChange}
            />
            <span>{_t(accountTypeObj[recAccountType])}</span>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label={_t('vote.coin-type')}>
          <div className={style.itemWrapper}>
            {getFieldDecorator('currency', {
              rules: [
                {
                  required: true,
                  message: _t('form.required'),
                },
              ],
              initialValue: currentCurrency,
            })(
              <CoinSelector
                allowClear={allowClear}
                currencies={currenciesWithCoin}
                onChange={this.setCurrency}
              />,
            )}
            <div className={style.availableBalance}>
              <span>{_t('amount.enabled')}:&nbsp; </span>
              <SpanForA className={style.link_for_a} onClick={this.handleSetAmount}>
                {formatNumber(availableBalance, precision)}
              </SpanForA>
            </div>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label={_t('amount')}>
          {getFieldDecorator('amount', {
            initialValue: undefined,
            rules: [
              {
                validator: this.handleConfirmAmount,
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Input
              addonAfter={
                categories[currentCurrency] ? categories[currentCurrency].currencyName : ''
              }
              autoComplete="off"
            />,
          )}
        </FormItem>
        <Button block type="primary" onClick={this.handleSubmit}>
          {_t('confirm')}
        </Button>
      </Form>
    );
  }
}
