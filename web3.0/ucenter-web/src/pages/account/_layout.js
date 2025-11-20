/**
 * Owner: willen@kupotech.com
 */
import sensors from '@kucoin-base/sensors';
import { styled, useResponsive } from '@kux/mui';
import AccountMenu from 'components/Account/Menu';
import UserRoot from 'components/UserRoot';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { exposeContext } from 'utils/ga';

// 神策曝光IntersectionObserver实例
const ExposeProvider = exposeContext.Provider;

const AccountLayoutWrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.overlay};
`;
const AccountLayoutMenu = styled.div`
  display: flex;
  justify-content: center;
  height: ${({ totalHeaderHeight }) => `calc(100vh - ${totalHeaderHeight}px)`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  position: sticky;
  top: ${({ totalHeaderHeight }) => totalHeaderHeight + 1}px;
`;
const AccountLayoutContent = styled.div`
  flex: 1;
  min-width: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  .KuxTable-root {
    .KuxEmpty-img {
      width: 180px;
      height: 146px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    border-bottom: unset;
  }
`;

const hideMenuPaths = [
  '/account/sub/history/transfer',
  '/account/sub/history/login',
  '/account/kyc/tax',
  '/account/kyc/update',
  '/account/kyc/migrate',
  '/account/kyb/migrate',
  '/account/transfer',
  '/account/guidance-zbx',
];

const AccountPage = ({ children }) => {
  const { pathname } = useLocation();
  const rv = useResponsive();

  const totalHeaderHeight = useSelector((state) => state['$header_header']?.totalHeaderHeight);

  const downSmall = !rv?.sm;

  const isHideMenu = useMemo(() => {
    if (hideMenuPaths.includes(pathname)) {
      return true;
    }
    return downSmall;
  }, [downSmall, pathname]);

  return (
    <UserRoot>
      <ExposeProvider value={{ instance: sensors.observeExpose() }}>
        <AccountLayoutWrapper>
          {isHideMenu ? null : (
            <AccountLayoutMenu data-inspector="account_menu" totalHeaderHeight={totalHeaderHeight}>
              <AccountMenu />
            </AccountLayoutMenu>
          )}
          <AccountLayoutContent>{children}</AccountLayoutContent>
        </AccountLayoutWrapper>
      </ExposeProvider>
    </UserRoot>
  );
};

export default AccountPage;
