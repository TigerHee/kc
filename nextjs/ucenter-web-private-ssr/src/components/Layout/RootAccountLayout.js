import AccountMenu from '@/components/Account/Menu';
import Toast from '@/components/Toast';
import UserRoot from '@/components/UserRoot';
import useResponsiveSSR from '@/hooks/useResponsiveSSR';
import { styled } from '@kux/mui';
import { useRouter } from 'kc-next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import ErrorBoundary, { SCENE_MAP } from '../common/ErrorBoundary';

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
  '/account/sub/history/:type',
  '/account/sub/history/transfer',
  '/account/sub/history/login',
  '/account/kyc/tax',
  '/account/kyc/update',
  '/account/kyc/migrate',
  '/account/kyb/migrate',
  '/account/transfer',
  '/account/guidance-zbx',
  '/ucenter/reset-security',
  '/ucenter/reset-security/address/:address',
  '/ucenter/reset-security/token/:token',
  '/utransfer',
  '/account-sub/api-manager/:sub',
  '/authorize-result',
  '/freeze',
  '/freezing',
  '/freeze/apply',
  '/oauth',
];

const AccountLayout = ({ children }) => {
  const router = useRouter();
  const pathname = router?.pathname || '';
  const rv = useResponsiveSSR();
  const totalHeaderHeight = useSelector((state) => state.app.totalHeaderHeight);

  const downSmall = !rv?.sm;

  const isHideMenu = useMemo(() => {
    if (hideMenuPaths.some((routePath) => !!matchPath(routePath, pathname))) {
      return true;
    }
    return downSmall;
  }, [downSmall, pathname]);

  console.warn('check 进入 AccountLayout', pathname, rv, downSmall, isHideMenu);

  return (
    <UserRoot>
      <AccountLayoutWrapper>
        <ErrorBoundary scene={SCENE_MAP.root.accountLayoutMenu}>
          {isHideMenu ? null : (
            <AccountLayoutMenu data-inspector="account_menu" totalHeaderHeight={totalHeaderHeight}>
              <AccountMenu />
            </AccountLayoutMenu>
          )}
        </ErrorBoundary>
        <AccountLayoutContent>{children}</AccountLayoutContent>
      </AccountLayoutWrapper>
      <Toast />
    </UserRoot>
  );
};

export default AccountLayout;
