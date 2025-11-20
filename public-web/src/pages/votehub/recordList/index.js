/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 17:53:55
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-02-05 18:00:13
 * @FilePath: /public-web/src/pages/votehub/recordList/index.js
 * @Description:
 */

import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, ThemeProvider } from '@kux/mui';
import RecordList from 'components/Votehub/recordList/components/index';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Footer from 'src/components/Votehub/containers/Footer.js';
import { StyledPage } from 'src/components/Votehub/styledComponents';
import { useSelector } from 'src/hooks/useSelector';

const { SnackbarProvider } = Snackbar;

export default function RecordListPage() {
  const pageRef = useRef();
  const dispatch = useDispatch();
  const { isRTL } = useLocale();
  const isInApp = JsBridge.isApp();

  const currentTheme = useSelector((state) => state.setting.currentTheme);

  // 如果在app内，从app登录返回时，应再次触发init
  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });
    }
  }, [dispatch, isInApp]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <Global
          styles={`
            body *{
              font-family: Roboto;
            }
            body {
              background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              .root {
                background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              }
            }
          `}
        />
        <SnackbarProvider>
          <StyledPage id="recordListPage" ref={pageRef}>
            <RecordList />
            <Footer />
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
