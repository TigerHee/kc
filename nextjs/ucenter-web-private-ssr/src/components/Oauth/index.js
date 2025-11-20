/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import SiteRedirect from 'gbiz-next/siteRedirect';
import { RestrictNotice } from 'gbiz-next/Header';
import { styled, useTheme } from '@kux/mui';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import { Link, withRouter } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import { searchToJson } from 'helper';
import useLocaleChange from 'hooks/useLocaleChange';
import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'kc-next/router';
import Authorize from './Authorize';
import I18nBox from './I18nBox';
import Login from './Login';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

export const Container = styled.div`
  background: ${(props) => props.theme.colors.overlay};
`;

export const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  width: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 60px;
  }
`;

const Oauth = (props) => {
  const { userInfo } = props;
  const dispatch = useDispatch();
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const router = useRouter();
  const { currentLang } = useLocale();
  const pathname = router?.pathname || '';
  const theme = useTheme();
  const changeLocale = useLocaleChange();
  const isShowRestrictNotice = useSelector((s) => s['$header_header']?.isShowRestrictNotice);
  const restrictNoticeHeight = useSelector((s) => s['$header_header']?.restrictNoticeHeight);

  const query = searchToJson();
  const { client_id } = query;

  const onLangChange = (l) => {
    changeLocale(l);
  };

  useEffect(() => {
    dispatch({ type: 'oauth/pullLangList' });
  }, []);

  useEffect(() => {
    if (client_id) {
      dispatch({
        type: 'oauth/getInvitationCodeByBrokerName',
        payload: {
          brokerName: client_id,
        },
      });
    }
  }, [client_id, dispatch]);
  return (
    <Container data-inspector="oauth_page">
      <ErrorBoundary scene={SCENE_MAP.oauth.restrictNotice}>
        <RestrictNotice
          theme={theme.currentTheme}
          userInfo={userInfo}
          pathname={pathname}
          currentLang={currentLang}
        />
      </ErrorBoundary>
      <ErrorBoundary scene={SCENE_MAP.oauth.header}>
        <Header style={isShowRestrictNotice ? { top: restrictNoticeHeight } : { top: 0 }}>
          <Link href="/" />
          <I18nBox currentLang={currentLang} onLangChange={onLangChange} inDrawer={isH5} />
        </Header>
      </ErrorBoundary>
      {userInfo ? (
        <ErrorBoundary scene={SCENE_MAP.oauth.authorize}>
          <Authorize userInfo={userInfo} />{' '}
        </ErrorBoundary>
      ) : (
        <ErrorBoundary scene={SCENE_MAP.oauth.login}>
          <Login />
        </ErrorBoundary>
      )}
      {tenantConfig.common.showSiteRedirectDialog ? (
        <ErrorBoundary scene={SCENE_MAP.oauth.siteRedirect}>
          <SiteRedirect theme={theme.currentTheme} currentLang={currentLang} />
        </ErrorBoundary>
      ) : null}
    </Container>
  );
};

export default withRouter()(
  connect((state) => {
    const { user } = state.user;
    return {
      userInfo: user,
    };
  })(Oauth),
);
