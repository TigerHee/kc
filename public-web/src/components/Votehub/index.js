/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, ThemeProvider } from '@kux/mui';
import { memo, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';
import Header from 'TradeActivityCommon/AppHeader';
import Banner from './containers/Banner';
import Bg from './containers/Bg';
import HowToPlayModal from './containers/components/HowToPlayModal';
import NominationProjectModal from './containers/components/NominationProjectModal';
import ProjectDetailModal from './containers/components/ProjectDetailModal';
import RulesModal from './containers/components/RulesModal';
// import TaskModal from './containers/components/TaskModal';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { exposePageStateForSSG } from 'src/utils/ssgTools';
import TicketModal from './containers/components/TicketModal';
import CurrentProjectList from './containers/CurrentProjectList';
import FAQ from './containers/FAQ';
import Footer from './containers/Footer';
// import Header from './containers/Header';
import HistoryProjectList from './containers/HistoryProjectList';
import Rules from './containers/Rules';
import TaskList from './containers/TaskList';
import WinProjectList from './containers/WinProjectList';
import { useInitActivityStatus, usePullVoteData } from './hooks';
import { BaseContainer, StyledPage } from './styledComponents';

const { SnackbarProvider } = Snackbar;

const ProjectList = memo(() => {
  const winProjectList = useSelector((state) => state.votehub.winProjectList, shallowEqual);

  if (winProjectList?.length) {
    return <WinProjectList />;
  }
  return <CurrentProjectList />;
});

const Content = memo(() => {
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  useInitActivityStatus();
  usePullVoteData();

  return (
    <StyledPage id="votehubPage">
      <NoSSG>
        <Header title={_t('nrzND6HxSyEV4dCcUThwAh')} theme={currentTheme} />
      </NoSSG>
      <Bg />
      <BaseContainer>
        <Banner />
        <ProjectList />
        <HistoryProjectList />
        <TaskList />
        <FAQ />
        <Rules />
      </BaseContainer>
      <Footer />
    </StyledPage>
  );
});

export default function Votehub() {
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
      const {
        pageInfo = {},
        currenctPojectList = [],
        nominatedProjectList = [],
        winProjectList = [],
        taskList = [],
        welfareList = [],
      } = dvaState.votehub;

      // 热度信息隐藏
      const currenctPojectListSSG = currenctPojectList?.map((item) => {
        return {
          ...item,
          voteNumber: 0,
        };
      });

      return {
        votehub: {
          pageInfo,
          nominatedProjectList,
          winProjectList,
          taskList,
          welfareList,
          currenctPojectList: currenctPojectListSSG,
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
              font-family: 'Roboto';
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
              background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              .root {
                background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              }
            }
            [dir="rtl"] .KuxTable-root table tr td:first-of-type:before {
              right: -40px !important;
              border-radius: 0 16px 16px 0;
            }
            [dir="rtl"] .KuxTable-root table tr td:last-of-type:after {
              left: -40px !important;
              right: auto !important;
              border-radius: 16px 0 0 16px;
            }
          `}
          />
          <Content />
          <RulesModal />
          <HowToPlayModal />
          <ProjectDetailModal />
          <NominationProjectModal />
          <TicketModal />
          {/* <TaskModal /> */}
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
