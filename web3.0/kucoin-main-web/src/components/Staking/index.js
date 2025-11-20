/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { Table } from '@kc/ui';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import Empty from 'components/common/Empty';
import CoinCodeToName from 'components/common/CoinCodeToName';
import { showDatetime } from 'helper';
import { getCompleteUrl } from 'utils/seoTools';
import staking from 'static/staking/staking.svg';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';
import SpanForA from 'src/components/common/SpanForA';
import { Link } from 'components/Router';
@connect((state) => {
  const { isLogin } = state.user;
  const { records } = state.staking;
  // const { currentLang } = state.app;
  const coinsMap = state.categories;
  return {
    isLogin,
    records,
    coinsMap,
  };
})
@injectLocale
export default class Index extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'staking/pull',
    });
  }

  go = (url) => {
    push(url);
  };

  createColumns = () => {
    const { coinsMap, isRTL } = this.props;
    return [
      {
        title: _t('staking.table.title.coin'),
        align: isRTL ? 'right' : 'left',
        width: '25%',
        render: ({ currency, privacyUrl }) => {
          const { iconUrl } = coinsMap[currency] || { iconUrl: '' };
          const hrefProp = getCompleteUrl(true, privacyUrl, true);
          return (
            <p className={style.coinInfo}>
              <img alt="" src={iconUrl} />
              <span className={style.name}>
                <CoinCodeToName coin={currency} />
              </span>
              <a className={style.label} {...hrefProp} target="_blank" rel="noopener noreferrer">
                {_t('staking.charge.label')}
              </a>
            </p>
          );
        },
      },
      {
        title: _t('staking.table.title.return'),
        align: isRTL ? 'left' : 'right',
        width: '25%',
        render: ({ rateOfReturn }) => {
          return <span className={style.rate}>{rateOfReturn}</span>;
        },
      },
      {
        title: _t('staking.table.title.date'),
        align: isRTL ? 'left' : 'right',
        width: '25%',
        render: ({ date }) => {
          return <span className={style.date}>{showDatetime(date, 'YYYY-MM-DD')}</span>;
        },
      },
      {
        title: _t('staking.table.title.operation'),
        align: isRTL ? 'left' : 'right',
        width: '25%',
        render: () => {
          const { isLogin } = this.props;
          return (
            <SpanForA
              data-key={isLogin ? '' : 'login'}
              className={style.chargeBtn}
              onClick={() => {
                if (isLogin) {
                  const url = '/assets/coin';
                  this.go(url);
                }
              }}
            >
              {_t('staking.charge.btn')}
            </SpanForA>
          );
        },
      },
    ];
  };

  render() {
    const { records, currentLang } = this.props;
    let url = '/news/en-soft-staking-cash-back-investment-program';
    if (currentLang === 'zh_CN') {
      url = '/news/soft-staking-cash-back-investment-program';
    }
    return (
      <React.Fragment>
        <div className={style.header}>
          <div className={style.info}>
            <p>Soft Staking</p>
            <p>{_t('staking.info')}</p>
            <Link className={style.link_for_a} to={url}>
              {_t('staking.announce.btn')}
            </Link>
          </div>
          <div className={style.pc}>
            <img alt="" src={staking} />
          </div>
        </div>
        <div data-inspector="staking_table" className={style.content}>
          <Table
            rowKey="index"
            dataSource={records}
            pagination={false}
            columns={this.createColumns()}
            locale={{
              emptyText: <Empty size={50} style={{ padding: '40px' }} />,
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}
