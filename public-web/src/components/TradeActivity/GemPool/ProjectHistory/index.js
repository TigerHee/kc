/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, styled, ThemeProvider } from '@kux/mui';
import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Header from 'TradeActivityCommon/AppHeader';
import { exposePageStateForSSG } from 'utils/ssgTools';
import HistoryProjects from './List';

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

  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const gempoolState = dvaState.gempool || {};

      return {
        gempool: {
          historyRecords: gempoolState.historyRecords || [],
        },
      };
    });
  }, []);

  return (
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

          <StyledPage id="gempoolHistoryPage">
            <NoSSG>
              <Header title={_t('e6e8b4693eab4000af9b')} theme={currentTheme} />
            </NoSSG>

            <BaseContainer>
              <HistoryProjects />
            </BaseContainer>
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}

export default memo(ProjectHistory);
