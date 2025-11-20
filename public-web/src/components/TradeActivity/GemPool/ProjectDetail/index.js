/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, styled, ThemeProvider } from '@kux/mui';
import GlobalTransferScope from 'components/Root/GlobalTransferScope';
import debounce from 'lodash/debounce';
import indexOf from 'lodash/indexOf';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Header from 'TradeActivityCommon/AppHeader';
import { replace } from 'utils/router';
import Banner from './containers/Banner';
import CurrentPools from './containers/CurrentPools';
import SymbolInfo from './containers/SymbolInfo';
import Tasks, { TaskEntrance } from './containers/Tasks';

const { SnackbarProvider } = Snackbar;

const StyledPage = styled.main`
`;

export const BaseContainer = styled.div`
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

function ProjectDetail() {
  const dispatch = useDispatch();
  const { isRTL } = useLocale();
  const isInApp = JsBridge.isApp();
  const { coin } = useParams();

  const user = useSelector((state) => state.user.user, shallowEqual);
  const earnTokenList = useSelector((state) => state.gempool.earnTokenList, shallowEqual);
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const isShowRestrictNotice = useSelector((state) => state?.$header_header?.isShowRestrictNotice);

  useEffect(() => {
    dispatch({
      type: 'gempool/pullGemPoolEarnTokenList',
    });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      // gempool质押查询kcs可用余额
      dispatch({
        type: 'gempool/pullGempoolBalance@polling',
      });
      return () => {
        dispatch({
          type: 'gempool/pullGempoolBalance@polling:cancel',
        });
      };
    }
  }, [dispatch, user]);

  const getTabBarOffSetTop = useCallback(
    debounce(() => {
      let top = 0;
      const headerEle = document.querySelector(isInApp ? '.app-custom-header' : '.gbiz-headeroom');
      top = headerEle?.clientHeight || 0;

      dispatch({
        type: 'gempool/update',
        payload: {
          headerHeight: top,
        },
      });
    }, 60),
    [dispatch, isShowRestrictNotice, isInApp],
  );

  useEffect(() => {
    getTabBarOffSetTop();
  }, [getTabBarOffSetTop]);

  useEffect(() => {
    window.addEventListener('resize', getTabBarOffSetTop);
    return () => {
      window.removeEventListener('resize', getTabBarOffSetTop);
    };
  }, [getTabBarOffSetTop]);

  const currency = useMemo(() => {
    if (!earnTokenList?.length) {
      return '';
    }
    // 检查值是否合法
    const isValid = indexOf(earnTokenList, coin) > -1;
    if (isValid) {
      return coin;
    }
    // 参数不合法重定向到落地页
    replace('/gempool');
    return '';
  }, [coin, earnTokenList]);

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
    if (currency) {
      dispatch({
        type: 'gempool/pullGemPoolProjectDetail',
        payload: {
          currency,
        },
      });
    }
  }, [dispatch, currency, user]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <SnackbarProvider>
          <Global
            styles={`
            body *{
              font-family: Roboto;
            }
            body fieldset {
              min-width: initial;
              padding: initial;
              margin: initial;
              border: initial;
              margin-inline-start: 2px;
              margin-inline-end: 2px;
              padding-block-start: 0.35em;
              padding-inline-start: 0.75em;
              padding-inline-end: 0.75em;
              padding-block-end: 0.625em;
            }
            body legend {
              width: initial;
              padding: initial;
              padding-inline-start: 2px;
              padding-inline-end: 2px;
            }
            body {
              [dir='rtl'] & .right_svg__icon, [dir='rtl'] & .left_svg__icon {
                transform: rotate(0deg);
              }
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
          <GlobalTransferScope />
          <StyledPage id="gempoolDetailPage">
            <NoSSG>
              <Header title={_t('49c1bf0d46d14000ad56')} theme={currentTheme} />
            </NoSSG>
            <Banner />
            <BaseContainer>
              <TaskEntrance />
              <CurrentPools />
              <Tasks />
              <SymbolInfo showDisclaim />
            </BaseContainer>
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}

export default memo(ProjectDetail);
