/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { forEach as _forEach } from 'lodash';
import { useSelector } from 'src/hooks/useSelector';
import { Table, Spin, Pagination, Box } from '@kux/mui';
import dateTimeFormat from '../utils/dateTimeFormat';

import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import CoinPrecision from 'components/common/CoinPrecision';

// import Empty from 'components/common/KcEmpty';

const columns = (productCategory, orderStatus) => [
  {
    title: _t('earn.account.earnDetail.time'),
    key: 'source_created_at',
    dataIndex: 'source_created_at',
    render(_, { source_created_at }) {
      return <span>{dateTimeFormat(source_created_at)}</span>;
    },
  },
  {
    title: _t('uGjtESqp2R2G2ogHKaJeXZ'),
    key: 'product_name',
    dataIndex: 'product_name',
  },
  {
    title: _t('earn.account.earnDetail.type'),
    dataIndex: 'product_category',
    key: 'product_category',
    render(_, { product_category, LOCK = {} }) {
      const { category_text } = LOCK;
      return <span>{category_text || productCategory[`${product_category}`]}</span>;
    },
  },
  {
    title: _t('earn.account.earnDetail.amount'),
    dataIndex: 'amount',
    key: 'amount',
    render(item, record) {
      return (
        <span className={'numFormat'}>
          <CoinPrecision coin={record.currency} value={item} />
        </span>
      );
    },
  },
  {
    title: _t('earn.account.tableStaking.status'),
    key: 'order_tx_status',
    dataIndex: 'order_tx_status',
    render(_, { order_tx_status }) {
      return <span>{orderStatus[`${order_tx_status}`]}</span>;
    },
  },
];

export default React.memo((props) => {
  const { records = [], pagination, onChange = () => {} } = props;
  const loading = useSelector(
    (state) => state.loading.effects['earnAccount-assets/getOrderHistory'],
  );
  const productCategory = useSelector((state) => state['earnAccount-assets'].productCategory);
  const orderStatus = useSelector((state) => state['earnAccount-assets'].orderStatus);

  const productCategoryMap = useMemo(() => {
    const productCategoryKV = {};
    _forEach(productCategory, ({ name, value }) => {
      productCategoryKV[value] = name;
    });
    return productCategoryKV;
  }, [productCategory]);

  const orderStatustMap = useMemo(() => {
    const orderStatustKV = {};
    _forEach(orderStatus, ({ name, value }) => {
      orderStatustKV[value] = name;
    });
    return orderStatustKV;
  }, [orderStatus]);

  useLocale();

  const changePageHandle = useCallback(
    (e, target) => {
      if (onChange) {
        onChange(target);
        window.scrollTo(0, 0);
      }
    },
    [onChange],
  );

  const _columns = useMemo(() => {
    return columns(productCategoryMap, orderStatustMap);
  }, [productCategoryMap, orderStatustMap]);

  return (
    <Spin spinning={loading} size="small">
      <Table rowKey="id" dataSource={records} columns={_columns} />
      {!!(pagination && pagination.total > pagination.pageSize) && (
        <Box mt={24} display="flex" justifyContent="flex-end">
          <Pagination
            total={pagination.total}
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={changePageHandle}
          />
        </Box>
      )}
    </Spin>
  );
});
