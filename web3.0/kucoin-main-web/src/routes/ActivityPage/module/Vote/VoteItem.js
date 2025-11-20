/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { Input, Button } from '@kc/ui';
import { message } from 'components/Toast';
import style from './style.less';
import voteImg from 'static/activity/vote.svg';
import { injectLocale } from '@kucoin-base/i18n';

@injectLocale
class BaseVoteItem extends React.Component {
  render() {
    const { voteItem } = this.props;
    return (
      <div className={style.VoteItem}>
        <div className={style.coin}>
          <div className={style.coinImg}>
            <img alt="" src={voteItem.iconUrl} />
          </div>
          <div className={style.coinName}>
            <p className={style.name}>
              <span>{voteItem.voteCurrency}</span>
              <span>{voteItem.name}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

class TotalVoteItem extends React.Component {
  render() {
    const { voteItem } = this.props;
    return (
      <div className={style.VoteItem}>
        <div className={style.coin}>
          <div className={style.coinImg}>
            <img alt="" src={voteItem.iconUrl} />
          </div>
          <div className={style.coinName}>
            <p className={style.name}>
              <span>{voteItem.voteCurrency}</span>
              <span>{voteItem.name}</span>
            </p>
            <p className={style.voteNum}>
              <span>
                {_t('total.votes')}: {voteItem.voteAmount}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

class FinalVoteItem extends React.Component {
  render() {
    const { voteItem } = this.props;
    return (
      <div className={style.VoteItem}>
        <div className={style.coin}>
          <div className={style.coinImg}>
            <img alt="" src={voteItem.iconUrl} />
          </div>
          <div className={style.coinName}>
            <p className={style.name}>
              <span>{voteItem.voteCurrency}</span>
              <span>{voteItem.name}</span>
            </p>
            <p className={style.voteNum}>
              <span>
                {_t('total.votes')}: {voteItem.voteAmount}
              </span>
            </p>
          </div>
        </div>
        <div className={style.totalVote}>
          <span>
            {_t('vote.rate')}:&nbsp;{voteItem.voteRate}
          </span>
        </div>
      </div>
    );
  }
}

@connect((state) => {
  return {
    mainMap: state.user_assets.mainMap,
  };
})
class ProccessVoteItem extends React.Component {
  state = {
    number: 1,
    pending: false,
  };

  handleChange = (e) => {
    let val = e.target.value.replace(/[^\d]/g, '').trim();
    if (val < 1) {
      val = 1;
    }
    this.setState({
      number: val,
    });
  };

  getVoteData = () => {
    const { dispatch, item } = this.props;
    const { code, type } = item;
    dispatch({
      type: 'activity/pullVote',
      payload: {
        code,
        type,
      },
    });
  };

  checkIsCanVote = () => {
    const { voteItem, mainMap } = this.props;
    const userAvailableKcs = Number((mainMap.KCS || {}).availableBalance);
    const { holdKcsAmount, oneVoteHoldAmount, voteAmountLimit, userAlreadyVoteAmount } = voteItem;
    const { number } = this.state;
    let msg = null;
    if (userAvailableKcs < +holdKcsAmount) {
      msg = _t('kcs.min.help', { amount: holdKcsAmount });
    }
    if (userAvailableKcs < +oneVoteHoldAmount * +number) {
      msg = _t('kcs.insufficient');
    }
    if (+voteAmountLimit - +userAlreadyVoteAmount < 1) {
      msg = _t('vote.exceeded');
    }
    return msg;
  };

  handleVote = async (currency) => {
    const msg = this.checkIsCanVote();
    if (msg) {
      message.error(msg);
      return false;
    }
    const { number, pending } = this.state;
    const { item, dispatch } = this.props;
    if (pending) {
      return false;
    }
    const params = {
      number,
      channel: 'web',
      currency,
      campaignId: item.code,
    };
    this.setState({
      pending: true,
    });
    try {
      await dispatch({
        type: 'activity/addVote',
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
    } finally {
      this.getVoteData();
      this.setState({
        pending: false,
      });
    }
  };

  render() {
    const { number } = this.state;
    const { voteItem } = this.props;
    return (
      <div className={style.VoteItem}>
        <div className={style.coin}>
          <div className={style.coinImg}>
            <img alt="" src={voteItem.iconUrl} />
          </div>
          <div className={style.coinName}>
            <p className={style.name}>
              <span>{voteItem.voteCurrency}</span>
              <span>{voteItem.name}</span>
            </p>
            <p className={style.voteNum}>
              <span>
                {_t('total.votes')}: {voteItem.currencyVoteAmount}
              </span>
            </p>
          </div>
        </div>
        <div className={style.voteContainer}>
          <div className={style.voteBox}>
            <div className={style.num}>
              <span>
                {_t('vote.number')}: {voteItem.userAlreadyVoteAmount || 0}
              </span>
            </div>
            <div className={style.vote}>
              <p>
                <Input value={number} onChange={this.handleChange} />
                <Button
                  onClick={() => {
                    this.handleVote(voteItem.voteCurrency);
                  }}
                >
                  <img alt="" src={voteImg} />
                </Button>
              </p>
              <p>
                <span>
                  {_t('vote.remains')}:{' '}
                  {+voteItem.voteAmountLimit - +voteItem.userAlreadyVoteAmount}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export { BaseVoteItem, TotalVoteItem, FinalVoteItem, ProccessVoteItem };
