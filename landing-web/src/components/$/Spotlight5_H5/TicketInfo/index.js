/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { _t, _tHTML } from 'utils/lang';
import { withRouter } from 'components/Router';
import { showDateTimeByZone } from 'helper';
import style from './style.less';

// 5期第二轮
const SPECIAL_ROUND_KEY = '$this_is_special_round';

const rowLocales = {
  zh_CN: {
    row1: n => `折合 ${n} 个USDT`,
    row2: n => ` ${n} 个Token`,
  },
  en_US: {
    row1: n => `Estimated amount: ${n} USDT`,
    row2: n => ` ${n} Token(s)`,
  },
};

const rowLocales2 = {
  zh_CN: {
    row1: n => `折合 ${n} 个KCS`,
    row2: n => ` ${n} 个Token`,
  },
  en_US: {
    row1: n => `Estimated amount: ${n} KCS`,
    row2: n => ` ${n} Token(s)`,
  },
};

@withRouter()
@connect((state) => {
  const currentLang = state.app.currentLang;
  return {
    currentLang,
    winningInfo: state.spotlight5.winningInfo,
    isLogin: state.user.isLogin,
    isCN: currentLang === 'zh_CN',
  };
})
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

  componentDidMount() {
    const { dispatch, currentLang, isNewSpotlight6 } = this.props;
    // spotlight5检查中文，跳转到英文
    if (isNewSpotlight6) {
      const isWideCN = currentLang.indexOf('zh_') === 0;
      if (isWideCN) {
        dispatch({ type: 'app/selectLang', payload: { lang: 'en_US' } });
      }
    }
  }

  openModal = () => {
    const isSpecialRound = this.hasSpecialCondRule();
    if (!isSpecialRound) {
      this.setState({ visibleModal: true });
    }
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
      return (isLogin && status >= 1 && !!lotteryVolume) ? `${_n || 0}` : '?';
    } else {
      // 以前的不改逻辑
      return (isLogin && status >= 1 && typeof winningStatus !== 'undefined') ? `${_n || 0}` : '?';
    }
  };

  renderRowNum = (_n, index) => {
    const { isCN, isNewSpotlight6 } = this.props;
    const isSpecialRound = this.hasSpecialCondRule();
    const n = this.numStr(_n);

    if (isSpecialRound) {
      if (index > 1) {
        return null;
      }

      const localesOfRow = isNewSpotlight6 ? rowLocales2 : rowLocales;
      const langFn = localesOfRow[isCN ? 'zh_CN' : 'en_US'][index === 0 ? 'row1' : 'row2'];

      return (
        <div>{langFn(n)}</div>
      );
    }

    return (
      <div className={style.ticketNum}>{_tHTML('spotlight.lottery.num', { n })}</div>
    );
  };

  isNewSpotlight2 = () => {
    // const {
    //   query: { id },
    // } = this.props;

    // return id > 73;
    return true;
  }

  hasSpecialCondRule = () => {
    const { item } = this.props;
    const conditionRule = item.rule || [];

    const find = conditionRule.filter(({ key }) => key === SPECIAL_ROUND_KEY);
    return find.length > 0;
  };

  render() {
    const {
      rule,
      winningInfo,
      item,
      isCN,
      isLogin,
    } = this.props;
    const { visibleModal } = this.state;

    const {
      lotteryTime,
      numberTime,
    } = rule;

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
    const isSpecialRound = this.hasSpecialCondRule();

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
        <div className={style.bg}>
          <div className={style.ticketBox}>
            {(!isSpecialRound) && (
              <div className={style.title}>
                {_tHTML('spotlight.lottery.totalnum', { n: numStr })}
                {(useCondition && isLogin && hasNumbers) && (
                  <div
                    className={style.selfTickets}
                    onClick={this.openModal}
                  >
                    {_t('spotlight.lottery.mine')}
                  </div>
                )}
              </div>
            )}
            <div className={style.rows}>
              {useCondition ? (
                conditionRule ? (
                  <React.Fragment>
                    {map(conditionRule, ({ key, cn, en }, index) => {
                      if (key === SPECIAL_ROUND_KEY) {
                        return null;
                      }
                      const _num = (myLotteryVolume || {})[key];
                      return (
                        <div className={style.row} key={`line-${key}`}>
                          <div className={style.rowTitle}>{isCN ? `${cn}` : `${en}`}</div>
                          {this.renderRowNum(_num || 0, index)}
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
            {(!isSpecialRound) && (
              <div className={style.tip}>{_tHTML('spotlight.lottery.tip', { datetimeStr, style: style.impress })}</div>
            )}
            {(useCondition && myNumbers) && (
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
                  {map(myNumbers, ({ number, status }) => {
                    const isYes = status === 'YES';
                    return (
                      <div key={`n-${number}`} className={`${style.lotteryNum} ${isYes ? style.yes : ''}`}>
                        {number}
                        {isYes && (<div className={style.win}>{_t('spotlight.lottery.win')}</div>)}
                      </div>
                    );
                  })}
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    );
  }
}
