/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useCallback, useEffect, useState } from 'react';
import { styled, Spin, Button, useResponsive } from '@kux/mui';
import { withRouter } from 'components/Router';
import { _t } from 'tools/i18n';
import { Link } from 'components/Router';
import BreadCrumbs from 'components/NewKcBreadCrumbs';
import { getCouponDetailList, getCouponInfo } from 'src/services/bonus';
import { useFetchHandle } from 'hooks';
import { useSelector } from 'src/hooks';
import LoansLayout from '../LoansLayout';
import StateCardList from './StateCardList';
import DetailTable from './DetailTable';
import { COUPON_CENTER_URL } from 'src/constants';

const LoansContentDetailWrap = styled.div`
  line-height: 1.3;
`;

const BreadCrumbsWrap = styled.div`
  font-weight: 500;
  padding-bottom: 8px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 26px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 0;
  }
`;

const DetailLoansTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 0px;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

const DetailTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 24px;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 0;
  }
`;

const PageSize = 10;

const LoansContentDetail = (props) => {
  const { sm } = useResponsive();
  const detailId = props.query?.detail;
  const { fetchHandle, loading } = useFetchHandle();
  const [detailInfo, setSetailInfo] = useState({});
  const { fetchHandle: fetchDetailHandle, loading: detailLoading } = useFetchHandle();
  const [data, setData] = useState({
    pagination: {
      pageSize: PageSize,
      current: 1,
    },
  });

  const userId = useSelector(({ user }) => user.user?.uid);

  const { couponId, currency } = detailInfo || {};

  const getList = useCallback(
    (currentPage = 1) => {
      if (!couponId) return;
      fetchHandle(
        getCouponDetailList({
          couponId,
          userId,
          currentPage,
          pageSize: PageSize,
        }),
        {
          onSilenceOk(res) {
            const data = res?.data;
            if (data) {
              const { items, pageSize, totalNum, currentPage } = data;
              setData({
                list: items || [],
                pagination: {
                  pageSize,
                  total: totalNum,
                  current: currentPage,
                },
              });
            }
          },
        },
      );
    },
    [couponId, userId, fetchHandle],
  );

  const getDetailInfo = useCallback(() => {
    fetchDetailHandle(
      getCouponInfo({
        id: detailId,
        userId,
      }),
      {
        onSilenceOk(res) {
          const data = res?.data;
          if (data) {
            setSetailInfo(data || {});
          }
        },
      },
    );
  }, [fetchDetailHandle, detailId]);

  useEffect(() => {
    getDetailInfo();
  }, [getDetailInfo]);
  useEffect(() => {
    getList();
  }, [getList]);

  const breadCrumbs = [
    {
      label: _t('eTDTJxStkmMUQt69pX38Mm'),
      url: COUPON_CENTER_URL,
    },
    {
      label: _t('assets.bonus.loans'),
      url: '/assets/bonus/loans',
    },
    {
      label: _t('details'),
    },
  ];

  return (
    <LoansLayout>
      <Spin spinning={detailLoading}>
        <LoansContentDetailWrap>
          {sm && (
            <BreadCrumbsWrap>
              <BreadCrumbs breadCrumbs={breadCrumbs} />
            </BreadCrumbsWrap>
          )}
          <div>
            <Header>
              <DetailLoansTitle>{_t('assets.bonus.loans')}</DetailLoansTitle>
              <Link
                to={`/trade/margin/${
                  !currency || currency === 'USDT' ? 'BTC-USDT' : `${currency}-USDT`
                }`}
              >
                <Button size={sm ? 'basic' : 'small'}>{_t('assets.margin.bonus.link')}</Button>
              </Link>
            </Header>
            <StateCardList data={detailInfo} />
            <DetailTitle>{_t('iwe7mwAfgphybSb8PEYXxw')}</DetailTitle>
            <DetailTable
              dataSource={data?.list}
              pagination={data?.pagination}
              onChange={getList}
              loading={loading}
            />
          </div>
        </LoansContentDetailWrap>
      </Spin>
    </LoansLayout>
  );
};

export default withRouter()(memo(LoansContentDetail));
