/**
 * Owner: clyne@kupotech.com
 */
import { map } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import AdaptiveDrawer from '@/components/AdaptiveDrawer';
import CoinCurrency from '@/components/CoinCurrency';
import PrettyCurrency from '@/components/PrettyCurrency';
import {
  CLOSE_ADL_LONG,
  CLOSE_ADL_SHORT,
  CLOSE_LIQ_LONG,
  CLOSE_LIQ_SHORT,
  futuresPositionNameSpace as namespace,
} from '@/pages/Orders/FuturesOrders/config';
import { styled } from '@/style/emotion';
import { Divider as KuxDivider, Pagination } from '@kux/mui';
import Spin from '@mui/Spin';

import useI18n from 'src/trade4.0/hooks/futures/useI18n';
import BasicInfo from './BasicInfo';
import Details, { item3, item4 } from './Detail';
import { useDetail, useInitDetail } from './hooks/useDetail';
import Item from './Item';
import { Title } from './style';

const lastLabelKeys = {
  [CLOSE_ADL_LONG]: 'realised.type.adl.long',
  [CLOSE_ADL_SHORT]: 'realised.type.adl.short',
  [CLOSE_LIQ_LONG]: 'realised.type.liq.long',
  [CLOSE_LIQ_SHORT]: 'realised.type.liq.short',
};

const Drawer = styled(AdaptiveDrawer)`
  .KuxDrawer-content {
    padding: 16px 32px;
  }
  .drawer-footer {
    padding: 20px 0;
  }

  // mobile 样式
  &.adaptive-m-drawer {
    width: 100%;
    max-width: 100%;
    .KuxDrawer-content {
      padding: 0;
    }
    .KuxMDialog-content {
      padding: 16px;
      border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
    }
    .KuxModalFooter-buttonWrapper {
      .KuxButton-root {
        width: 100%;
      }
    }
  }
`;

const PaginationContent = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 12px 0 18px;
  .KuxPagination-item {
    background-color: ${(props) => props.theme.colors.layer};
    button {
      background-color: ${(props) => props.theme.colors.layer};
    }
  }
`;

const BasicInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .item-box {
    margin-bottom: 20px;
  }
  .item-wrapper {
    margin-bottom: 20px;
    .item-box {
      ${(props) => (props.isShowTax ? item4() : item3())}
      ${(props) => props.theme.breakpoints.down('sm')} {
        width: 33.33%;
        ${(props) => (props.isShowTax ? 'margin-bottom: 12px;' : 'margin-bottom: 0')}
        &:nth-of-type(3n + 3) {
          align-items: flex-end;
        }
        &:nth-of-type(4n + 4) {
          align-items: flex-start;
        }
      }
    }
  }
`;

const Divider = styled(KuxDivider)`
  margin: 4px 0 24px;
`;

const SpinBox = styled(Spin)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  &::after {
    background-color: transparent;
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .detail-box {
    &:not(:last-of-type) {
      margin-bottom: 24px;
    }
  }
`;

const PAGE_SIZE = 10;

const RealisedDetail = () => {
  const { _t } = useI18n();
  const loading = useSelector((state) => state.loading.effects[`${namespace}/pullCloseDetail`]);
  const closeDetails = useSelector((state) => state[namespace].closeDetails);
  const { items = [], ...pagination } = closeDetails;
  const { onClose, pnlDetail: overviewData, pnlDetailVisible, handlePageChange } = useDetail();
  const isShowTax = overviewData?.tax;
  const detailLastLabelKey = useMemo(() => {
    return lastLabelKeys[overviewData.type];
  }, [overviewData.type]);

  useInitDetail();

  return (
    <Drawer
      width="480px"
      title={_t('realised.title')}
      back={false}
      show={pnlDetailVisible}
      onClose={onClose}
    >
      <BasicInfoWrapper isShowTax={isShowTax}>
        <Title>{_t('realised.detial.title')}</Title>
        <Item
          amount={
            <PrettyCurrency
              isShort
              value={overviewData.realisedPnl}
              currency={overviewData.currency}
            />
          }
          showColor
          value={overviewData.realisedPnl}
          coin={
            <CoinCurrency
              className="coin-color"
              value={overviewData.realisedPnl}
              coin={overviewData.currency}
            />
          }
        />
        <BasicInfo isShowTax={isShowTax} data={overviewData} />
      </BasicInfoWrapper>
      <Divider />
      {loading ? (
        <SpinBox />
      ) : (
        <DetailWrapper className="detail-box">
          <Title>{_t('orders.detail.title')}</Title>
          {map(items, (o, index) => (
            <Details
              isShowTax={isShowTax}
              data={o}
              key={`detail-${index}`}
              isLast={index === 0 && pagination.page === 0}
              detailLastLabelKey={detailLastLabelKey}
            />
          ))}
        </DetailWrapper>
      )}
      <PaginationContent>
        <Pagination
          total={pagination?.count}
          defaultPageSize={PAGE_SIZE}
          current={pagination?.page}
          onChange={handlePageChange}
          labelRowsPerPage=""
        />
      </PaginationContent>
    </Drawer>
  );
};

export default React.memo(RealisedDetail);
