/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import { Table } from '@kufox/mui';
import moment from 'moment';
import { _t } from 'tools/i18n';
import CustomPagination from 'components/SpotNFT/CustomPagination';
import CustomSwipeContainer from 'components/SpotNFT/CustomSwipeContainer';
import TableMobile from '../TableMobile';
import { useIsMobile } from '../../util';
import style from './style.less';

const Index = (props) => {
  const viewHeight = window.innerHeight;
  const isMobile = useIsMobile();
  const { recordsInfo = {}, loading, dispatch } = props;
  const { data = [], loadedData, page, total } = recordsInfo;
  const columns = useMemo(() => {
    return [
      {
        title: _t('igo.nft.collection.time'),
        dataIndex: 'time',
        render: (text) => {
          return moment(text).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: _t('igo.nft.collection.asset'),
        dataIndex: 'asset',
      },
      {
        title: () => <div className={style.tokenContainer}>{_t('igo.nft.collection.tokenId')}</div>,
        dataIndex: 'tokenId',
        render: (text) => {
          return <div className={style.token}>{text}</div>;
        },
      },
      {
        title: _t('igo.nft.distribute.blockChain'),
        dataIndex: 'chain',
      },
      {
        title: _t('igo.nft.distribute.price'),
        render: (record) => {
          const { price, currency } = record;
          return <div className={style.numFormat}>{`${price} ${currency}`}</div>;
        },
      },
    ];
  }, []);

  const onPageChange = (v) => {
    dispatch({
      type: 'spot_nft_collection/queryTradeRecords',
      payload: {
        pageNumber: v,
      },
    });
  };
  const getRowKey = (__, idx) => {
    return page + '__' + idx;
  };

  const setDataToPageOne = useCallback(() => {
    dispatch({
      type: 'spot_nft_collection/setDataToPageOne',
      payload: { dataType: 'tradeRecords' },
    });
  }, [dispatch]);
  // 一行的高度，差不多是这么高
  const oneRowHeight = 130;
  const onScroll = throttle((currentDocument) => {
    const _scrollTop = document.documentElement.scrollTop;
    if (loading) {
      return;
    }
    if (!isMobile) {
      return;
    }
    if (currentDocument) {
      const refHeight = currentDocument.clientHeight;
      if (
        _scrollTop > refHeight - (viewHeight - 120 + oneRowHeight) &&
        page < Math.ceil(total / 10)
      ) {
        onPageChange(page + 1);
        return;
      }
      if (_scrollTop < oneRowHeight && page > 1) {
        setDataToPageOne();
      }
    }
  }, 50);

  const mobileColumns = [
    {
      className: style.mobileItemLeft,
      title: _t('igo.nft.distribute.price'),
      key: 'price',
      render: (_record) => {
        const { price, currency } = _record;
        return <div className={style.numFormat}>{`${price} ${currency}`}</div>;
      },
    },
    {
      className: style.mobileItemCenter,
      title: _t('igo.nft.collection.asset'),
      key: 'asset',
    },
    {
      className: style.mobileItemRight,
      title: _t('igo.nft.collection.tokenId'),
      key: 'tokenId',
    },
    {
      className: style.mobileItemLeft,
      title: _t('igo.nft.distribute.blockChain'),
      key: 'chain',
    },
    {
      className: style.mobileItemCenter,
      title: '',
      key: 'asset',
      render: () => <div />,
    },
    {
      className: style.mobileItemRight,
      title: _t('igo.nft.collection.time'),
      key: 'time',
      render: (__, v) => {
        return moment(v).format('YYYY/MM/DD HH:mm:ss');
      },
    },
  ];

  return (
    <div className={style.container}>
      {isMobile ? (
        <CustomSwipeContainer onScroll={onScroll}>
          <TableMobile
            page={page}
            total={total}
            loading={loading}
            data={loadedData}
            columns={mobileColumns}
          />
        </CustomSwipeContainer>
      ) : (
        <Table
          rowKey={getRowKey}
          columns={columns}
          dataSource={data}
          loading={loading}
          locale={{
            emptyText: <div className={style.note}>{_t('igo.nft.collection.notFound')}</div>,
          }}
        />
      )}
      {!isMobile && !loading && total > 0 && (
        <CustomPagination total={total} current={page} onChange={onPageChange} />
      )}
    </div>
  );
};

export default connect((state) => {
  const { loading, spot_nft_collection } = state;
  return {
    recordsInfo: spot_nft_collection?.tradeRecords,
    loading: loading.effects['spot_nft_collection/queryTradeRecords'],
  };
})(Index);
