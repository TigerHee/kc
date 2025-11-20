/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { Popover, Icon, Input, Button } from 'antd';
// import PropTypes from 'prop-types';
import { _t, _tHTML } from 'tools/i18n';
import { push } from 'utils/router';
import style from './style.less';
import SpanForA from 'src/components/common/SpanForA';
import depositSvg from 'static/trc_airdrop/deposit.svg';
import withdrawSvg from 'static/trc_airdrop/withdraw.svg';
import { injectLocale } from '@kucoin-base/i18n';

@injectLocale
export default class ConvertPanel extends React.Component {
  state = {
    depositModalVisible: false,
    confirmVisible: false,
    amount: '',
  };

  showDepositModal = () => {
    this.checkLogin();
    this.setState({
      depositModalVisible: true,
    });
  };

  showConfirmModal = () => {
    this.checkLogin();
    this.setState({
      confirmVisible: true,
    });
  };

  onTransClick = () => {
    const { onTransClick = () => {} } = this.props;
    this.checkLogin();
    onTransClick();
  };

  checkLogin = () => {
    const { isLogin } = this.props;
    if (!isLogin) {
      push(`/ucenter/signin?back=${window.location.href}`);
    }
  };

  handleAmountChange = (e) => {
    // const { amount = '' } = this.state;
    const { balance } = this.props;
    const val = e.target.value.trim();
    const num = Number(val);
    const precisionFlag = val.split('.').length === 2 ? val.split('.').pop().length > 8 : true;
    if (_.isNaN(num) || precisionFlag || num > balance) {
      return null;
    }
    this.setState({
      amount: val,
    });
  };

  renderConfirm = () => {
    const { totalBalance = 0 } = this.props;
    return (
      <div className={style.formContainer} style={{ paddingBottom: '8px' }}>
        <div className={style.depositTip}>
          <Icon className={style.warnIcon} type="info-circle" />
          {_t('trxAirdrop.withdraw.warning')}
        </div>
        <div className="mt-24">{_t('trxAirdrop.withdraw.notice')}</div>
        <div className="mt-24" style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            className={style.halfBtns}
            type="danger"
            size="large"
            onClick={() => this.setState({ confirmVisible: false })}
          >
            {_t('trxAirdrop.withdraw.cancel')}
          </Button>
          <Button
            className={style.halfBtns}
            disabled={+totalBalance <= 0}
            type="primary"
            size="large"
            onClick={this.handleWithdraw}
          >
            {_t('trxAirdrop.withdraw.action')}
          </Button>
        </div>
      </div>
    );
  };

  handleDeposit = () => {
    const { dispatch } = this.props;
    const { amount } = this.state;
    const num = Number(amount);
    if (_.isNaN(num) || num <= 0) {
      return;
    }
    dispatch({
      type: 'airdropTRC/deposit',
      payload: {
        size: num,
      },
    });
    this.setState({
      depositModalVisible: false,
      amount: '',
    });
  };

  handleWithdraw = () => {
    const { dispatch, totalBalance } = this.props;
    if (+totalBalance > 0) {
      dispatch({
        type: 'airdropTRC/withdraw',
      });
    }
    this.setState({
      confirmVisible: false,
    });
  };

  renderDepositForm = () => {
    const { amount } = this.state;
    let { balance = 0 } = this.props;
    balance = Number(balance).toFixed(8);
    return (
      <div className={style.formContainer}>
        <div className={style.depositTip}>
          <Icon className={style.warnIcon} type="info-circle" />
          {_t('trxAirdrop.deposit.warinig')}
        </div>
        <div className="mb-8">{_t('trxAirdrop.balance.available')}</div>
        <span
          onClick={() => balance && this.setState({ amount: balance })}
          className={style.balanceInfo}
        >
          {balance || 0}
        </span>
        <div className="mt-24 mb-16">
          <div className="mb-8">{_t('trxAirdrop.deposite.input')}</div>
          <div className={style.input}>
            <Input
              size="large"
              onChange={this.handleAmountChange}
              addonAfter="USDT"
              value={amount}
            />
          </div>
        </div>
        <Button
          className={style.btns}
          type="primary"
          size="large"
          block
          onClick={this.handleDeposit}
        >
          {_t('trxAirdrop.deposite.confirm')}
        </Button>
        <div className="mt-16" style={{ opacity: '0.5' }}>
          {_t('trxAirdrop.deposite.confirm.tip')}
        </div>
      </div>
    );
  };

  render() {
    const { depositModalVisible, confirmVisible } = this.state;
    const { totalBalance } = this.props;
    return (
      <div className={style.panel} style={{ marginTop: '35px', marginBottom: '24px' }}>
        <div className={style.title}>
          {_t('trxAirdrop.deposit.title')} &nbsp;
          <Popover
            overlayClassName={style.popContainer}
            content={<span className={style.text}>{_t('trxAirdrop.deposit.tips')}</span>}
          >
            <Icon type="question-circle-o" />
          </Popover>
        </div>

        <div className={style.info}>
          <div>
            {totalBalance}
            <span>USDT</span>
          </div>
          <div>
            <Popover
              overlayClassName={style.popContainer}
              visible={depositModalVisible}
              trigger="click"
              content={this.renderDepositForm()}
              onVisibleChange={(visible) => {
                this.setState({ depositModalVisible: visible, amount: '' });
              }}
            >
              <div onClick={this.showDepositModal}>
                <img alt="" src={depositSvg} />
                {_t('trxAirdrop.deposit')}
              </div>
            </Popover>
            <Popover
              overlayClassName={style.popContainer}
              visible={confirmVisible}
              trigger="click"
              content={this.renderConfirm()}
              onVisibleChange={(visible) => {
                this.setState({ confirmVisible: visible });
              }}
            >
              <div onClick={this.showConfirmModal}>
                <img alt="" src={withdrawSvg} />
                {_t('trxAirdrop.withdraw')}
              </div>
            </Popover>
          </div>
        </div>
        <div className={style.tips}>{_tHTML('trxAirdrop.deposit.benefit', { benefit: 20 })}</div>
        <div className={style.balance}>
          <span>
            {_t('trxAirdrop.balance.trade.only')} {}
          </span>
          {/* <span>
          {_t('trxAirdrop.balance.freeze')} {}
        </span> */}
          <SpanForA onClick={this.onTransClick}> {_t('trxAirdrop.transfer')} </SpanForA>
        </div>
      </div>
    );
  }
}
// ConvertPanel.propTypes = {
//   onTransClick: PropTypes.Funciton,
//   balance: PropTypes.number,
//   totalBalance: PropTypes.number,
// };

// ConvertPanel.defaultProps = {
//   onTransClick: () => {},
//   balance: 0,
//   totalBalance: 0,
// };
