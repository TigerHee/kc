/**
 * Owner: melon@kupotech.com
 */

import UserRoot from 'components/UserRoot';
import { styled } from '@kux/mui/emotion';
import { useResponsive } from '@kux/mui/hooks';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COUPON_CENTER_WEB_URL } from 'src/constants';

const LayoutBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  min-height: calc(100vh - 80px);
  box-shadow: 0px 1px 0px rgba(29, 29, 29, 0.08);
  border-top: 1px solid rgba(29, 29, 29, 0.08);
  padding: 32px 64px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 32px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

/** 保留的子页面  */
const ROUTERS = ['/assets/bonus/margin-bonus', '/assets/bonus/rewards', '/assets/bonus/loans'];

export default (props) => {
  const { pathname } = useLocation();
  const rv = useResponsive();
  const isSm = rv.xs && !rv.sm && !rv.lg;
  const isCanViewPage = ROUTERS.some((i) => pathname.includes(i));
  /** 2024.05.27 我的福利页面下架 除了保留杠杆体验金/杠杆免息券/其他获赠页面外，其余页面都重定向到 卡券中心  */
  useEffect(() => {
    if (!isCanViewPage) {
      window.location.href = COUPON_CENTER_WEB_URL;
    }
  }, [isCanViewPage]);
  return (
    <UserRoot>
      <LayoutBox>{props.children}</LayoutBox>
    </UserRoot>
  );
};
