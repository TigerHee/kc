/**
 * Owner: jessie@kupotech.com
 */
import React, { useState, useEffect, useCallback, useRef, Fragment, useMemo } from 'react';
import _, { debounce } from 'lodash';
import { connect } from 'dva';
import { useSelector } from 'react-redux';
import Spin from '@mui/Spin';
import { useSnackbar } from '@kux/mui/hooks';
import { commonSensorsFunc } from '@/meta/sensors';
import useMarginModel from '@/hooks/useMarginModel';
import { filterAndCheckSymbolArray } from 'src/helper';
import { _t, _tHTML } from 'utils/lang';
import getMainsiteLink from 'utils/getMainsiteLink';
import DetailModal from '../DetailModal';
import FeeModal from '../FeeModal';
import CancelAllModal from '../CancelAllModal';
import { useOrderListInit } from '../hooks/useOrderListInit';
import List from './List';
import CardList from './CardList';
import Header from './Header';
import Filters from './Filters';
import { OrderListContent, CardListWrapper, TipContainer, LoginWrapper } from './style';
import TWAPDetailModal from '../TWAPDetailModal';
import { isRelativedTWAPNamespace } from './utils';

const { registerUrl } = getMainsiteLink();
const noop = () => {};
const OrderContent = (props) => {
  const {
    namespace,
    filters,
    rowPercentage = noop,
    tradeType,
    creator = noop,
    dispatch,
    currentLang,
    ocoEnable,
    type,
    tsoEnable,
    screen,
    moreUrl,
    showFilter,
  } = props;

  const listBodyRef = useRef();
  const [detailVisible, setDetailVisible] = useState(false);
  const [columns, setColumns] = useState();
  const [percentage, setPercentage] = useState();
  // 手续费详情
  const [feeDetailInfo, setFeeDetailInfo] = useState();
  const { message } = useSnackbar();
  const { symbols: allRecords } = useSelector((state) => state.symbols); // 全部可用币对

  const {
    onCancelAll,
    onCancel,
    cancelVisible,
    isDisableCancel,
    hideCancelVisible,
    showCancelVisible,
    disabledAllCancel,
  } = useOrderListInit({
    namespace,
    type,
  });

  const onSelectChange = useCallback(
    (key, value) => {
      dispatch({
        type: `${namespace}/filter`,
        payload: {
          [key]: value,
          triggerMethod: 'rest',
        },
      });
      dispatch({ type: `${namespace}/update`, payload: { page: 1 } });
    },
    [dispatch, namespace],
  );

  const hideDetailVisible = useCallback(() => {
    setDetailVisible(false);
  }, []);

  const showDetailVisible = useCallback(() => {
    setDetailVisible(true);
  }, []);

  const viewDetail = useCallback(
    (id, isStop, symbol) => {
      dispatch({ type: `${namespace}/pullOrder`, payload: { id, isStop } });
      dispatch({ type: `${namespace}/pullFills`, payload: { id } });
      showDetailVisible();

      if (namespace === 'orderHistory') {
        commonSensorsFunc(['orderHistory', 7, 'click'], symbol);
      } else {
        commonSensorsFunc(['openOrders', 11, 'click'], symbol);
      }
    },
    [dispatch, namespace, showDetailVisible],
  );

  const routeToSymbol = useCallback(
    debounce((record) => {
      const { symbolExists: isExists } = filterAndCheckSymbolArray(allRecords, record);
      if (isExists) {
        const symbolCode = record;
        dispatch({
          type: '$tradeKline/routeToSymbol',
          payload: {
            symbol: symbolCode,
          },
        });
      } else {
        message.info(_t('symboloffline'));
      }
    }, 500),
    [dispatch, namespace],
  );

  const twapOrderRunOrPauseOrder = useCallback(
    (order) => {
      // 非TWAP订单 返回
      if (namespace !== 'orderTwap') return;
      dispatch({
        type: 'orderTwap/runOrPauseTWAPOrder',
        payload: {
          order,
        },
      });
    },
    [dispatch, namespace],
  );

  const feeDetail = useCallback((records) => {
    setFeeDetailInfo(records);
    commonSensorsFunc(['tradeHistory', 6, 'click'], records.symbol);
  }, []);

  useEffect(() => {
    setColumns(
      creator({
        ...filters,
        onSelectChange,
        viewDetail,
        routeToSymbol,
        message,
        event: {
          onFeeDetailClick: feeDetail,
        },
        tipContainer: listBodyRef.current,
        cancelAllOrder: showCancelVisible,
        cancelOrder: onCancel,
        isDisableCancel,
        disabledAllCancel,
        ocoEnable,
        tsoEnable,
        tradeType,
        screen,
        runOrPauseOrder: twapOrderRunOrPauseOrder, // twap订单 运行/暂停
      }),
    );
  }, [
    screen,
    currentLang,
    namespace,
    ocoEnable,
    filters,
    tsoEnable,
    tradeType,
    isDisableCancel,
    disabledAllCancel,
    showCancelVisible,
    onCancel,
    creator,
    onSelectChange,
    viewDetail,
    feeDetail,
    routeToSymbol,
    message,
  ]);

  useEffect(() => {
    setPercentage(
      rowPercentage({
        screen,
      }),
    );
  }, [rowPercentage, screen]);

  // 不同类型订单 显示table和list的断点不同
  const cardListCondition = useMemo(() => {
    // Open Orders (orderCurrent) | Order History (orderHistory) | Trade Order(orderDealDetail) 1024以下显示list
    if (
      _.includes(['sm', 'md', 'lg', 'lg1'], screen) &&
      (namespace === 'orderCurrent' ||
        namespace === 'orderHistory' ||
        namespace === 'orderTwapHistory' ||
        namespace === 'orderDealDetail')
    ) {
      return true;
    } else if (_.includes(['sm', 'md', 'lg'], screen)) {
      // 其他 768以下显示list
      return true;
    }
    return false;
  }, [screen, namespace]);

  return (
    <Fragment>
      {cardListCondition ? (
        <React.Fragment>
          {showFilter && <Filters namespace={namespace} columns={columns} />}

          <CardListWrapper>
            <CardList
              namespace={namespace}
              columns={columns}
              screen={screen}
              link={moreUrl(tradeType)}
            />
          </CardListWrapper>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Header
            namespace={namespace}
            columns={columns}
            rowPercentage={percentage}
            screen={screen}
          />
          <OrderListContent ref={listBodyRef}>
            <List
              namespace={namespace}
              columns={columns}
              rowPercentage={percentage}
              screen={screen}
              link={moreUrl(tradeType)}
            />
          </OrderListContent>
        </React.Fragment>
      )}

      {isRelativedTWAPNamespace(namespace) && (
        <TWAPDetailModal
          namespace={namespace}
          visible={detailVisible}
          onCancel={hideDetailVisible}
        />
      )}

      {namespace === 'orderCurrent' || namespace === 'orderHistory' ? (
        <DetailModal
          keepMounted
          namespace={namespace}
          visible={detailVisible}
          onCancel={hideDetailVisible}
        />
      ) : null}
      {namespace === 'orderDealDetail' && !!feeDetailInfo && (
        <FeeModal data={feeDetailInfo} onChange={setFeeDetailInfo} />
      )}
      <CancelAllModal visible={cancelVisible} onOK={onCancelAll} onCancel={hideCancelVisible} />
    </Fragment>
  );
};

const Order = (props) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const { statusInfo } = useMarginModel(['statusInfo']);

  if (!isLogin) {
    return <LoginWrapper>{_tHTML('trd.form.login.reg', { registerUrl })}</LoginWrapper>;
  }

  if (typeof statusInfo.tipInOrderList === 'function') {
    return (
      <TipContainer>
        <Spin size="small" />
        <div className="text">
          <span>{statusInfo.tipInOrderList()}</span>
        </div>
      </TipContainer>
    );
  }

  return <OrderContent {...props} />;
};

export default connect((state, props) => {
  const { namespace } = props;
  const { filters } = state[namespace];
  const { tradeType, ocoEnable, tsoEnable } = state.trade;
  const { currentLang } = state.app;
  return {
    filters,
    tradeType,
    ocoEnable,
    tsoEnable,
    currentLang,
  };
})(Order);
