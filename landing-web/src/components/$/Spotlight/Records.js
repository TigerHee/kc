/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import requireProps from 'hocs/requireProps';
import GradientRecords from './module/GradientRecords';
import CoinPrecision from 'components/common/CoinPrecision';
import { _t } from 'utils/lang';
import { showDatetime, multiply } from 'helper';
import { MAINSITE_HOST } from 'utils/siteConfig';

const colorRed = { color: '#FF495F' };
const colorGreen = { color: '#01AA78' };
const colorNormal = { color: '#0F7DFF' };

@connect((state) => {
  return {
    user: state.user.user,
    isLogin: state.user.isLogin,
    records: state.spotlight.list,
    loading: state.loading.effects['spotlight/getList'],
  };
})
@requireProps({
  user(value) {
    return value !== undefined;
  },
})
export default class Records extends React.Component {
  static propTypes = {
    item: PropTypes.object,
  };

  static defaultProps = {
    item: {},
  };

  componentDidMount() {
    const { isLogin, dispatch } = this.props;
    if (isLogin) {
      dispatch({ type: 'spotlight/getList@polling' });
    } else {
      dispatch({
        type: 'user/update',
        payload: { showLoginDrawer: true },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'spotlight/getList@polling:cancel' });
  }

  createColumns = () => {
    return [{
      title: _t('spotlight.table.id'),
      key: 'id',
      dataIndex: 'id',
    }, {
      title: _t('spotlight.table.time'),
      key: 'createdAt',
      dataIndex: 'createdAt',
      render(item) {
        return (<span>{showDatetime(item)}</span>);
      },
    }, {
      title: _t('spotlight.table.currency'),
      key: 'currency',
      dataIndex: 'currency',
    }, {
      title: _t('spotlight.table.price'),
      key: 'price',
      dataIndex: 'price',
      render(item, record) {
        const { quoteCurrency } = record;
        return (
          <div>
            <CoinPrecision value={item || 0} coin={quoteCurrency} /> {quoteCurrency}
          </div>
        );
      },
    }, {
      title: _t('spotlight.table.amount'),
      key: 'amount',
      dataIndex: 'amount',
      render(item, record) {
        const { currency } = record;
        return (
          <div>
            <CoinPrecision value={item} coin={currency} /> {currency}
          </div>
        );
      },
    }, {
      title: _t('spotlight.table.total'),
      key: 'total',
      dataIndex: 'price',
      render(price, record) {
        const { quoteCurrency, amount } = record;
        const total = multiply(amount || 0, price || 0);
        return (
          <div>
            <CoinPrecision value={total} coin={quoteCurrency} /> {quoteCurrency}
          </div>
        );
      },
    }, {
      title: _t('spotlight.table.status'),
      key: 'status',
      dataIndex: 'status',
      render(item) {
        // 0新建，1用户支付中，2用户支付失败，3用户支付成功，4平台支付成功
        const STATUS = [
          [_t('spotlight.status.waitpay'), colorNormal],
          [_t('spotlight.status.paying'), colorNormal],
          [_t('spotlight.status.payfailed'), colorRed],
          [_t('spotlight.status.send'), colorRed],
          [_t('spotlight.status.end'), colorGreen],
        ];
        if (STATUS[item]) {
          const [_text, _style] = STATUS[item];
          return (<span style={_style}>{ _text }</span>);
        } else {
          return '--';
        }
      },
    }];
  };

  render() {
    const { records, loading } = this.props;
    const dataSource = records || [];
    const load = records === null && loading;

    return (
      <GradientRecords
        rowKey="id"
        title={_t('spotlight.buy.records')}
        empty={_t('spotlight.table.empty')}
        loading={load}
        records={dataSource}
        columns={this.createColumns()}
        pagination={false}
      />
    );
  }
}
