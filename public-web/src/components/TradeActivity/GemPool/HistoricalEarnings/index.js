/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-06-10 16:18:50
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-03 15:19:42
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/index.js
 * @Description:
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, styled, ThemeProvider } from '@kux/mui';
import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import UserRoot from 'src/components/UserRoot';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Header from 'TradeActivityCommon/AppHeader';
import HistoricalEarningsList from './List';

const { SnackbarProvider } = Snackbar;

const StyledPage = styled.main`
  // background: ${(props) => props.theme.colors.overlay};
`;

export const BaseContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
  }
`;

function ProjectHistory() {
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
    <UserRoot>
      <EmotionCacheProvider isRTL={isRTL}>
        <ThemeProvider theme={currentTheme}>
          <SnackbarProvider>
            <Global
              styles={`
            body *{
              font-family: Roboto;
            }
            body {
              background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              .root {
                background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
                ${
                  isInApp
                    ? `
                    &::-webkit-scrollbar {
                      display: none;
                    }
                    &::-webkit-scrollbar-thumb {
                      display: none;
                    }
                    &::-webkit-scrollbar-track {
                      display: none;
                    }
                    `
                    : ''
                }
              }
            }
          `}
            />
            <StyledPage id="gempoolHistoricalEarningsPage">
              <NoSSG>
                <Header title={_t('62b56b869ea84000a68b')} theme={currentTheme} />
              </NoSSG>
              <BaseContainer>
                <HistoricalEarningsList />
              </BaseContainer>
            </StyledPage>
          </SnackbarProvider>
        </ThemeProvider>
      </EmotionCacheProvider>
    </UserRoot>
  );
}

export default memo(ProjectHistory);
