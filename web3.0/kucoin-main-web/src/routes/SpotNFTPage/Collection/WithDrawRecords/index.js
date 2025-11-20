/**
 * Owner: willen@kupotech.com
 */
import moment from 'moment';
import React, { useMemo, useCallback } from 'react';
import { throttle } from 'lodash';
import { Table } from '@kufox/mui';
import { useSnackbar } from '@kufox/mui';
import CustomPagination from 'components/SpotNFT/CustomPagination';
import CustomSwipeContainer from 'components/SpotNFT/CustomSwipeContainer';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import TableMobile from '../TableMobile';
import { useIsMobile } from '../../util';
import style from '../TradeRecords/style.less';

const statusMap = {
  PROCESSING: _t('igo.nft.processing'), // 处理中
  WALLET_PROCESSING: _t('igo.nft.processing'), // 钱包处理中
  FAILURE: _t('igo.nft.failed'), // 失败
  SUCCESS: _t('igo.nft.success'), // 成功
};

const Index = (props) => {
  const viewHeight = window.innerHeight;
  const isMobile = useIsMobile(); // 判断当前屏幕尺寸是否满足条件
  const { message } = useSnackbar();
  const { recordsInfo = {}, loading, dispatch } = props;
  const { data = [], loadedData, page, total } = recordsInfo;
  const jump = async (wxId, nftId, nftAccountCode) => {
    try {
      const targetRes = await dispatch({
        type: 'spot_nft_collection/getWalletWxIdBrowserAddr',
        payload: {
          wxId,
          nftId,
          nftAccountCode,
        },
      });
      if (targetRes.code === '200') {
        const newWindow = window.open(targetRes.data);
        newWindow.opener = null;
      } else {
        message.error(_t('get.wallet.address.failed'));
      }
    } catch (e) {
      message.error(_t('get.wallet.address.failed'));
    }
  };
  const columns = useMemo(() => {
    return [
      {
        title: _t('igo.nft.collection.time'),
        dataIndex: 'createdAt',
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
        dataIndex: 'chainName',
      },
      {
        title: _t('igo.nft.collection.txid'),
        render: (row) => {
          const { walletTxId, tokenId, currency } = row;
          if (!walletTxId) {
            return '--';
          }
          return (
            <div className={style.txId} onClick={() => jump(walletTxId, tokenId, currency)}>
              {walletTxId}
            </div>
          );
        },
      },
      {
        title: _t('igo.nft.collection.status'),
        dataIndex: 'status',
        render: (text) => {
          const str = statusMap[text];
          if (!str) {
            return '--';
          }
          return <span>{str}</span>;
        },
      },
      // 先暂时注释，当前不展示
      // {
      //   title: _t('igo.nft.collection.action'),
      //   dataIndex: 'action',
      //   render: (_, records) => {
      //     return '--';
      //   },
      // },
    ];
  }, []);

  const onPageChange = (v) => {
    dispatch({
      type: 'spot_nft_collection/queryWithDrawRecords',
      payload: {
        page: v,
      },
    });
  };
  const getRowKey = (__, idx) => {
    return page + '__' + idx;
  };

  const setDataToPageOne = useCallback(() => {
    dispatch({
      type: 'spot_nft_collection/setDataToPageOne',
      payload: { dataType: 'withDrawRecords' },
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
      title: _t('igo.nft.collection.txid'),
      render: (_record) => {
        const { walletTxId, tokenId, currency } = _record;
        if (!walletTxId) {
          return '--';
        }
        return (
          <div className={style.txId} onClick={() => jump(walletTxId, tokenId, currency)}>
            {walletTxId}
          </div>
        );
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
      key: 'chainName',
    },
    {
      className: style.mobileItemCenter,
      title: _t('igo.nft.collection.status'),
      key: 'status',
      render: (__, v) => {
        return statusMap[v] || '--';
      },
    },
    {
      className: style.mobileItemRight,
      title: _t('igo.nft.collection.time'),
      key: 'createdAt',
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
          className={style.tableContainer}
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
    recordsInfo: spot_nft_collection?.withDrawRecords,
    loading: loading.effects['spot_nft_collection/queryWithDrawRecords'],
  };
})(Index);
