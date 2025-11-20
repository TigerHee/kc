/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import moment from 'moment';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import { Breadcrumb, Spin } from '@kux/mui';
import { Link } from 'components/Router';
import Filter from 'components/Assets/Bonus/Rewards/Filter';
import Table from 'components/Assets/Bonus/Rewards/Table';
import { injectLocale } from '@kucoin-base/i18n';
import { styled } from '@kux/mui';
import { COUPON_CENTER_URL } from 'src/constants';

const NewRewards = styled.div`
  width: 100%;
  & > div {
    padding-bottom: 24px;
    a {
      color: ${({ theme }) => theme.colors.text60};
    }
  }
`;

const TYPES = () => [
  { label: _t('rewards'), value: 1 },
  { label: _t('airdrop.fork'), value: 2 },
  { label: _t('distrbution'), value: 3 },
  { label: _t('kyc.investment.other'), value: 4 },
];

@connect((state) => {
  const { filters } = state.bonus;
  return {
    filters: {
      ...filters,
      startAt: moment(filters.startAt),
      endAt: moment(filters.endAt),
    },
    categories: state.categories,
    records: state.bonus.records,
    pagination: state.bonus.pagination,
    loading: state.loading.effects['bonus/query'],
  };
})
@injectLocale
export default class RewardsDetailPage extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'bonus/query@polling' });
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'bonus/query@polling:cancel' });
  }

  handleFilterChange = (values) => {
    this.props.dispatch({
      type: 'bonus/filter',
      payload: { ...values },
    });
  };

  handleTableChange = (event, page) => {
    this.handleFilterChange({ page });
  };

  getData = () => {
    const { records, categories } = this.props;
    if (!records) return null;
    // 对币种丢失的情况做容错处理
    const parseCoin = (currency) => {
      if (!categories[currency]) {
        return {};
      }
      return categories[currency];
    };

    return records.map((item) => {
      const coin = parseCoin(item.currency);
      return { ...item, coin };
    });
  };

  render() {
    const { filters, pagination, loading } = this.props;
    return (
      <NewRewards>
        <Breadcrumb>
          <Breadcrumb.Item key="bonus">
            {/* 我的奖励入口 */}
            <Link to={COUPON_CENTER_URL}>{_t('eTDTJxStkmMUQt69pX38Mm')}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item key="rewards">{_t('other.rewards')}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={loading}>
          <Filter {...filters} _t={_t} typeMap={TYPES()} onFilterChange={this.handleFilterChange} />
          <Table
            data={this.getData()}
            typeMap={TYPES()}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </Spin>
      </NewRewards>
    );
  }
}
