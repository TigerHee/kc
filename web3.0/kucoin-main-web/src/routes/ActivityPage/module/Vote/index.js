/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import style from './style.less';
import { ActivityStatus } from 'config/base';
import { showDatetime } from 'helper';
// import { Link } from 'components/Router';
import { BaseVoteItem, FinalVoteItem, TotalVoteItem, ProccessVoteItem } from './VoteItem';
import { injectLocale } from '@kucoin-base/i18n';
import SpanForA from 'src/components/common/SpanForA';
const format = 'YYYY-MM-DD HH:mm:ss';
@connect((state) => {
  return {
    user: state.user.user,
    categories: state.categories,
  };
})
@injectLocale
export default class VoteList extends React.Component {
  getSteps = () => {
    const {
      campaignResponse: { status },
      user,
    } = this.props;
    if (status === ActivityStatus.WAIT_START) {
      return 0;
    }
    if (status === ActivityStatus.PROCESSING) {
      if (!user) {
        return 2;
      }
      return 1;
    }
    return 3;
  };

  getSubTitleStep = () => {
    const {
      campaignResponse: { status },
      user,
    } = this.props;
    if (status === ActivityStatus.WAIT_START) {
      return 1;
    }
    if (status === ActivityStatus.PROCESSING) {
      if (!user) {
        return 2;
      }
      return 0;
    }
    return 0;
  };

  getVoteList = () => {
    const { voteListResponses, categories } = this.props;
    const temp = voteListResponses.map((v) => {
      const { voteCurrency } = v;
      const currentCurrency = categories[voteCurrency];
      if (currentCurrency) {
        const { iconUrl, name } = currentCurrency;
        return {
          name,
          iconUrl,
          ...v,
        };
      }
      return {
        ...v,
      };
    });
    return temp;
  };

  render() {
    const {
      item,
      campaignResponse: { startTIme },
    } = this.props;
    const voteListResponses = this.getVoteList();
    const step = this.getSteps();
    const subTitleStep = this.getSubTitleStep();
    const steps = {
      0: BaseVoteItem,
      1: ProccessVoteItem,
      2: TotalVoteItem,
      3: FinalVoteItem,
    };
    const sunTitleSteps = {
      0: null,
      1: (
        <p className={style.voteSubTitle}>
          <span>{_t('activity.start.time.2', { time: showDatetime(startTIme, format) })}</span>
        </p>
      ),
      2: (
        <p className={style.voteSubTitle}>
          <SpanForA data-key="login">请登录后投票</SpanForA>
        </p>
      ),
    };
    const VoteItem = steps[step];
    return (
      <React.Fragment>
        <div className={style.voteHeader}>
          <p className={style.voteTitle}>{_t('coin.list')}</p>
          {sunTitleSteps[subTitleStep]}
        </div>
        <div className={style.voteMain}>
          {voteListResponses.map((voteItem, idx) => {
            return <VoteItem key={idx} voteItem={voteItem} item={item} />;
          })}
        </div>
      </React.Fragment>
    );
  }
}
