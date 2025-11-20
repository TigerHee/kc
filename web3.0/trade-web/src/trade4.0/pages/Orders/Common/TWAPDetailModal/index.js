/**
 * Owner: jessie@kupotech.com
 */
import React, { useCallback, memo, useState, Fragment } from 'react';
import { map } from 'lodash';
import { shallowEqual, useDispatch, useSelector } from 'dva';
import useIsH5 from '@/hooks/useIsH5';
import Drawer from '@mui/Drawer';
import Button from '@mui/Button';
import Pagination from '@mui/Pagination';
import { Tabs } from '@mui/Tabs';
import Empty from '@mui/Empty';
import { _t } from 'utils/lang';
import {
  DetailContent,
  DetailBaseInfoContent,
  DetailListContent,
  DetailCardListContent,
  TabsWrapper,
  EmptyWrapper,
  ItemTitle,
  SpinWrapper,
  ButtonWrapper,
  PaginationWrapper,
  DialogWrapper,
} from '../style';
import { TwapRunStatusHeader } from './components/TwapRunStatusHeader';
import { cardListColumns, makeBaseInfoList, tableColumns } from './nodeHelper';
import { H5TwapRunStatusHeader } from './index.style';

const { Tab } = Tabs;

const tabsKey = {
  baseInfo: 'baseInfo',
  detail: 'detail',
};

const mapRender = (item, value, data = {}) => {
  return item.render && Object.keys(data).length ? item.render(value, data) : value;
};

const TWAPDetailModal = (props) => {
  const { visible, onCancel, namespace } = props;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(tabsKey.baseInfo);
  const isH5 = useIsH5();
  const currentLang = useSelector((state) => state.app.currentLang);

  const loading = useSelector(
    (state) =>
      state.loading.effects[`${namespace}/pullOrder`] ||
      state.loading.effects[`${namespace}/pullFills`],
    shallowEqual,
  );

  const { orderDetail, fillsRecords, fillCurrent, fillTotal } = useSelector(
    (state) => state[namespace],
    shallowEqual,
  );

  const handleFillPageChange = useCallback(
    (e, page) => {
      dispatch({ type: `${namespace}/pullFills`, payload: { page } });
    },
    [dispatch],
  );

  const handleCancel = useCallback(() => {
    dispatch({ type: `${namespace}/resetData` });
    onCancel();
  }, [dispatch, onCancel]);

  const baseInfoList = makeBaseInfoList({ currentLang });

  // 移动端
  if (isH5) {
    return (
      <DialogWrapper
        back={false}
        show={visible}
        onCancel={handleCancel}
        onOk={handleCancel}
        onClose={handleCancel}
        title={_t('9vZMJ91Rea72iuDjqm7zrD')}
        okText={_t('confirm')}
        cancelText=""
        size="large"
        footer={null}
        height="100%"
      >
        <SpinWrapper spinning={loading}>
          <div>
            <TabsWrapper>
              <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} size="small">
                <Tab label={_t('orders.detail.baseinfo')} value={tabsKey.baseInfo} />
                <Tab label={_t('1h26HHrLecbZdLVnaJzbYX')} value={tabsKey.detail} />
              </Tabs>
            </TabsWrapper>
            {activeTab === tabsKey.baseInfo ? (
              <DetailBaseInfoContent className="xs">
                <H5TwapRunStatusHeader
                  symbol={orderDetail?.symbol}
                  status={orderDetail?.status}
                  usedDurationSec={orderDetail?.usedDurationSec}
                  namespace={namespace}
                />
                {baseInfoList.map((item) => (
                  <div key={item.key} className="row">
                    <span className="label">{item.label}</span>
                    <span className="value">
                      {mapRender(item, orderDetail[item.key], orderDetail)}
                    </span>
                  </div>
                ))}
              </DetailBaseInfoContent>
            ) : !fillsRecords?.length ? (
              <EmptyWrapper>
                <Empty />
              </EmptyWrapper>
            ) : (
              <React.Fragment>
                {fillsRecords.map((data, index) => {
                  return (
                    <DetailCardListContent key={index}>
                      {cardListColumns.map((item) => {
                        return (
                          <div key={item.key} className="row">
                            <span className="label">{item.title}</span>
                            <span className="value">{item.render(data[item.key], data)}</span>
                          </div>
                        );
                      })}
                    </DetailCardListContent>
                  );
                })}
                {fillTotal > 0 ? (
                  <PaginationWrapper style={{ padding: '24px 12px' }}>
                    <Pagination
                      fillTotal={fillTotal}
                      fillCurrent={fillCurrent}
                      onChange={handleFillPageChange}
                      pageSize={10}
                    />
                  </PaginationWrapper>
                ) : null}
              </React.Fragment>
            )}
          </div>
        </SpinWrapper>
      </DialogWrapper>
    );
  }
  return (
    <Drawer
      width="560px"
      back={false}
      show={visible}
      anchor="right"
      onClose={handleCancel}
      contentPadding="0"
      title={_t('9vZMJ91Rea72iuDjqm7zrD')}
      okText={_t('confirm')}
    >
      <SpinWrapper spinning={loading}>
        <DetailContent>
          <TwapRunStatusHeader
            symbol={orderDetail?.symbol}
            status={orderDetail?.status}
            usedDurationSec={orderDetail?.usedDurationSec}
            namespace={namespace}
          />
          <DetailBaseInfoContent>
            <ItemTitle>{_t('orders.detail.baseinfo')}</ItemTitle>
            {baseInfoList.map((item) => (
              <div key={item.key} className="row">
                <span className="label">{item.label}</span>
                <span className="value">{mapRender(item, orderDetail[item.key], orderDetail)}</span>
              </div>
            ))}
          </DetailBaseInfoContent>
          <DetailListContent>
            <ItemTitle>{_t('1h26HHrLecbZdLVnaJzbYX')}</ItemTitle>
            <div className="header">
              <div className="content">
                {tableColumns.map((column) => {
                  return (
                    <div className="col" key={`header_${column.key}`}>
                      {column.title}
                    </div>
                  );
                })}
              </div>
            </div>

            {!fillsRecords?.length ? (
              <EmptyWrapper>
                <Empty />
              </EmptyWrapper>
            ) : (
              <Fragment>
                <div className="list">
                  {map(fillsRecords, (data, index) => {
                    return (
                      <div key={`data_${index}`} className="row">
                        {tableColumns.map((item) => {
                          return (
                            <div key={item.key} className="col">
                              {item.render(data[item.key], data)}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </Fragment>
            )}
          </DetailListContent>
          {fillTotal > 0 ? (
            <PaginationWrapper>
              <Pagination
                fillTotal={fillTotal}
                fillCurrent={fillCurrent}
                onChange={handleFillPageChange}
                pageSize={10}
              />
            </PaginationWrapper>
          ) : null}
        </DetailContent>
        <ButtonWrapper>
          <Button onClick={handleCancel}>{_t('cancel')}</Button>
        </ButtonWrapper>
      </SpinWrapper>
    </Drawer>
  );
};

export default memo(TWAPDetailModal);
