/**
 * Owner: iron@kupotech.com
 */
import { Notification, Snackbar, ThemeProvider } from '@kux/mui';
import { UserRestricted } from '@packages/userRestrictedCommon';
import SiteRedirect from '@packages/siteRedirect';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import loadable from '@loadable/component';
import CommonServiceProvider from '../components/CommonServiceProvider';
import useInitThemeAB from '../hookTool/useInitThemeAB';
import Header from './Header';
import { namespace } from './model';
import { tenantConfig } from '../tenantConfig';

const HeaderCL = loadable(() => import('./HeaderCL'));
const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

export default (props) => {
  // 如果有站点定向弹窗，则不展示其它弹窗
  const [siteRedirectDialogOpen, setSiteRedirectDialogOpen] = useState(false);

  const dispatch = useDispatch();

  useInitThemeAB(props);

  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <CommonServiceProvider>
            {/* 如果是 claim 站点，使用专用 header */}
            {tenantConfig.useHeaderCL ? (
              <HeaderCL {...props} />
            ) : (
              <>
                <Header {...props} />
                {tenantConfig.showSiteRedirectDialog ? (
                  <SiteRedirect
                    theme={props.theme}
                    currentLang={props.currentLang}
                    onOpen={() => {
                      setSiteRedirectDialogOpen(true);
                    }}
                  />
                ) : null}
                {!siteRedirectDialogOpen ? (
                  <UserRestricted
                    userInfo={props.userInfo}
                    pathname={props.pathname}
                    theme={props.theme}
                    currentLang={props.currentLang}
                    userRestrictedStayDuration={props.userRestrictedStayDuration}
                    onShow={(obj) =>
                      dispatch({
                        type: `${namespace}/update`,
                        payload: { restrictDialogStatus: obj },
                      })
                    }
                    onHide={(obj) =>
                      dispatch({
                        type: `${namespace}/update`,
                        payload: { restrictDialogStatus: obj },
                      })
                    }
                  />
                ) : null}
              </>
            )}
          </CommonServiceProvider>
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
