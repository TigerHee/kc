/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from '@kc/ui';
import { _t, _tHTML } from 'tools/i18n';
import { withRouter } from 'components/Router';
import GradientCard from '../../../module/GradientCard';
import { showDateTimeByZone } from 'helper';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@withRouter()
@connect((state) => {
  return {
    winningInfo: state.spotlight2.winningInfo,
    isLogin: state.user.isLogin,
    // isCN: state.app.currentLang === 'zh_CN',
  };
})
@injectLocale
export default class TicketInfo extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    rule: PropTypes.object,
    qualification: PropTypes.object,
  };

  static defaultProps = {
    item: {},
    rule: {},
    qualification: {},
  };

  state = {
    visibleModal: false,
  };

  openModal = () => {
    this.setState({ visibleModal: true });
  };

  closeModal = () => {
    this.setState({ visibleModal: false });
  };

  numStr = (_n) => {
    // 0-未预约，1-等待开奖，2-未中签，3-已中签
    const { qualification, winningInfo, isLogin } = this.props;
    const { status } = qualification || {};
    const { winningStatus } = winningInfo;

    const useCondition = this.isNewSpotlight2();
    if (useCondition) {
      const { lotteryVolume } = winningInfo.context || {};
      return isLogin && status >= 1 && !!lotteryVolume ? `${_n || 0}` : '?';
    }
    // 以前的不改逻辑
    return isLogin && status >= 1 && typeof winningStatus !== 'undefined' ? `${_n || 0}` : '?';
  };

  renderRowNum = (_n) => {
    const n = this.numStr(_n);
    return <div>{_tHTML('spotlight.lottery.num', { n })}</div>;
  };

  isNewSpotlight2 = () => {
    const {
      query: { id },
    } = this.props;

    return id > 73;
  };

  render() {
    const { rule, winningInfo, item, isCN, isLogin } = this.props;
    const { visibleModal } = this.state;

    const { numberTime } = rule;

    const {
      totalNum,
      appNum,
      bonusNum,
      tradeNum,
      kcsNum,

      context,
    } = winningInfo;

    // const context = {
    //   lotteryNumbers: [
    //     { number: '00001', status: 'INIT' },
    //     { number: '00002', status: 'INIT' },
    //     { number: '00001', status: 'YES' },
    //     { number: '00003', status: 'INIT' },
    //     { number: '00004', status: 'INIT' },
    //     { number: '00005', status: 'INIT' },
    //     { number: '00006', status: 'INIT' },
    //   ],
    //   totalLotteryCount: 6,
    // };

    // page rule for conditions
    const conditionRule = item.rule;
    const useCondition = this.isNewSpotlight2();

    let hasNumbers = false;
    let myNumbers = null;
    let myLotteryVolume = null;
    let totalLotteryCount = totalNum;
    if (useCondition && context && typeof context === 'object') {
      const { lotteryNumbers, lotteryVolume } = context;
      hasNumbers = lotteryNumbers && lotteryNumbers.length > 0;
      myNumbers = lotteryNumbers || [];

      const tmpLotteryVolume = lotteryVolume || {};
      myLotteryVolume = tmpLotteryVolume;
      totalLotteryCount = tmpLotteryVolume.totalLotteryCount;
    }

    const datetimeStr = showDateTimeByZone(
      useCondition ? item.winner_publish_time : numberTime,
      'YYYY/MM/DD HH:mm',
    ); // '2019/05/14 10:00';
    const numStr = this.numStr(totalLotteryCount || 0);

    return (
      <div className={style.ticket}>
        <GradientCard>
          <div className={style.ticketBox}>
            <div className={style.title}>
              {_tHTML('spotlight.lottery.totalnum', { n: numStr })}
              {useCondition && isLogin && hasNumbers && (
                <div className={style.selfTickets} onClick={this.openModal}>
                  {_t('spotlight.lottery.mine')}
                </div>
              )}
            </div>
            <div className={style.rows}>
              {useCondition ? (
                conditionRule ? (
                  <React.Fragment>
                    {_.map(conditionRule, ({ key, cn, en }) => {
                      const _num = (myLotteryVolume || {})[key];
                      return (
                        <div className={style.row} key={`line-${key}`}>
                          <div>{isCN ? `${cn}` : `${en}`}</div>
                          {this.renderRowNum(_num || 0)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ) : null
              ) : (
                <React.Fragment>
                  <div className={style.row}>
                    <div>{_t('spotlight.lottery.c1')}</div>
                    {this.renderRowNum(appNum || 0)}
                  </div>
                  <div className={style.row}>
                    <div>{_t('spotlight.lottery.c2')}</div>
                    {this.renderRowNum(bonusNum || 0)}
                  </div>
                  <div className={style.row}>
                    <div>{_t('spotlight.lottery.c3')}</div>
                    {this.renderRowNum(tradeNum || 0)}
                  </div>
                  <div className={style.row}>
                    <div>{_t('spotlight.lottery.c4')}</div>
                    {this.renderRowNum(kcsNum || 0)}
                  </div>
                </React.Fragment>
              )}
            </div>
            <div className={style.tip}>{_t('spotlight.lottery.tip', { datetimeStr })}</div>
            {useCondition && myNumbers && (
              <Modal
                key="lottery-number-modal"
                title={_t('spotlight.lottery.modal.title')}
                width={465}
                maskClosable={false}
                visible={visibleModal}
                onCancel={this.closeModal}
                footer={null}
              >
                <div className={style.lotteryNums}>
                  {_.map(myNumbers, ({ number, status }) => {
                    const isYes = status === 'YES';
                    return (
                      <div
                        key={`n-${number}`}
                        className={`${style.lotteryNum} ${isYes ? style.yes : ''}`}
                      >
                        {number}
                        {isYes && <div className={style.win}>{_t('spotlight.lottery.win')}</div>}
                      </div>
                    );
                  })}
                </div>
              </Modal>
            )}
          </div>
        </GradientCard>
      </div>
    );
  }
}
