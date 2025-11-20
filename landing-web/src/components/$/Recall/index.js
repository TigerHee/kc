/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { styled } from '@kufox/mui/emotion';
import background_light from 'assets/recall/background_light.png';
import background_dark from 'assets/recall/background_dark.png';
import { px2rem } from '@kufox/mui/utils';
import { ThemeProvider } from '@kufox/mui';
import JsBridge from 'src/utils/jsBridge';
import RecallHeader from 'components/$/Recall/Header';
import ChestProgress from 'components/$/Recall/ChestProgress';
import QuestDetail from 'components/$/Recall/QuestDetail';
import UnLogin from 'components/$/Recall/UnLogin';
import { useElementVisible } from 'src/hooks/useElementVisible';
import { useDispatch, useSelector } from 'dva';
import NoAccess from 'components/$/Recall/NoAccess';
import UnOpenCardModal from 'components/$/Recall/Modal/UnOpenCard';
import UnReceiveCardModal from 'components/$/Recall/Modal/UnReceiveCard';
import CompleteQuestModal from 'components/$/Recall/Modal/CompleteQuest';
import TipsModal from 'components/$/Recall/Modal/Tips';
import PageLoading from 'components/$/Recall/Loading';
import router from 'umi/router';
import { recallStageStatus, formatNumber } from 'components/$/Recall/config';
import { _t } from 'utils/lang';
import { kcsensorsClick } from 'utils/ga';
import { cloneDeep } from 'lodash';
import useTheme from '@kufox/mui/hooks/useTheme';
import Recommend from 'components/$/Recall/Recommend';
import Expire from 'components/$/Recall/Expire';
import { useHistory } from 'react-router';

const PageWrapper = styled.div`
  max-width: ${px2rem(750)};
  margin: 0 auto;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  background-image: url(${({ theme }) =>
    theme.currentTheme === 'light' ? background_light : background_dark});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top;
  display: flex;
  flex-direction: column;
  padding-top: ${({ isInApp, bannerHeight }) => (isInApp ? px2rem(88) : px2rem(54 + bannerHeight))};
  overflow: auto;

  & > div {
    flex-shrink: 0;
  }
`;

const RecallPage = () => {
  const { colors } = useTheme();
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [tipsModalConf, setTipsModalConf] = useState({});
  const { isLogin } = useSelector((state) => state.user); // 是否登陆
  const { isInApp } = useSelector((state) => state.app);
  const { noAccess, currentStageInfo, generalInfo } = useSelector((state) => state.userRecall);
  const getInfoLoading = useSelector(
    (state) => state.loading.effects[`userRecall/getUserRecallInfo`],
  );
  const dispatch = useDispatch();
  const { location } = useHistory();
  const { currency: activityCurrency } = generalInfo;
  //埋点，所有阶段目标交易额&最低奖金信息拼接，如：1000,4000,10000&1,2.5,3.5
  const optionKey = useMemo(() => {
    let targetAmount = '',
      minBonusAmount = '',
      list = cloneDeep(generalInfo?.userRecallConfigs) || [];
    list.map((item) => {
      targetAmount = targetAmount ? targetAmount + ',' + item?.targetAmount : item?.targetAmount;
      minBonusAmount = minBonusAmount ? minBonusAmount + ',' + item?.leastBonus : item?.leastBonus;
    });
    return targetAmount + '&' + minBonusAmount;
  }, [generalInfo]);

  const handleClose = () => {
    if (isInApp) {
      JsBridge.open({ type: 'func', params: { name: 'exit' } });
    } else router.go(-1);
  };

  // 获取召回基本信息
  const getRecallInfo = useCallback(async () => {
    await dispatch({
      type: 'userRecall/getUserRecallInfo',
      payload: {
        recordId: location?.query?.id,
      },
    });
  }, [dispatch, location.query.id]);

  // 立即提现
  const handleWithdraw = async () => {
    if (generalInfo?.curStageId && !getInfoLoading) {
      await dispatch({
        type: 'userRecall/recallWithdraw',
        payload: { stageId: generalInfo.curStageId },
      });
      setTipsModalConf({
        show: true,
        title: _t('mLUssfAu2kvs4zF6iWs5ys', {
          number: formatNumber(currentStageInfo.bonusAmount),
          currency: activityCurrency,
        }),
        subTitle: _t('rL8rewRyeKyuZBVkSkWfEB'),
        onClose: () => {
          getRecallInfo();
          setTipsModalConf({ show: false });
        },
      });
    }
  };

  const handleClickIcon = (order) => {
    try {
      kcsensorsClick(['validBox', '1']);
    } catch (e) {
      console.log('e', e);
    }
    // 当前阶段失败
    if (currentStageInfo.status === recallStageStatus.FAIL) return;
    if (
      order > currentStageInfo.order ||
      currentStageInfo.status === recallStageStatus.WAIT_QUEST_COMPLETE
    ) {
      setTipsModalConf({
        show: true,
        title: _t('e24sANidmkQMc4rV8UsuXK'),
        subTitle: _t('1y6hQUFUMJaWctBjzmG2uA'),
        onClose: () => {
          setTipsModalConf({ show: false });
        },
      });
    } else if (currentStageInfo.status === recallStageStatus.WAIT_WITHDRAW) {
      handleWithdraw();
      try {
        kcsensorsClick(['completeTask', '1'], {
          optionKey,
          allItemAmount: generalInfo?.curStageOrder, //所属阶段
          clickPosition: 'box',
        });
      } catch (e) {
        console.log('e', e);
      }
    }
  };
  useEffect(() => {
    if (isLogin) getRecallInfo();
  }, [getRecallInfo, isLogin]);

  useEffect(() => {
    if (currentStageInfo.status === recallStageStatus.WAIT_WITHDRAW) {
      setWithdrawModalVisible(true);
    }
  }, [currentStageInfo]);

  useEffect(() => {
    document.body.style = `background-color: ${colors.background}`;
  }, [colors]);

  const showRecommend =
    currentStageInfo.status === recallStageStatus.WAIT_QUEST_COMPLETE ||
    currentStageInfo.status === recallStageStatus.WAIT_WITHDRAW;

  const ele = useElementVisible('land-recall-act-page', 'restrictNotice');
  const bannerHeight = ele?.show ? (ele?.el?.clientHeight || 0) : 0;

  return (
    <>
      <PageWrapper isInApp={isInApp} data-inspector="recallPage" bannerHeight={bannerHeight}>
        <RecallHeader handleClose={handleClose} bannerHeight={bannerHeight} />
        {isLogin === undefined ? (
          <PageLoading />
        ) : isLogin ? (
          noAccess === undefined ? (
            <PageLoading />
          ) : noAccess === false ? (
            generalInfo.finished ? (
              <Expire />
            ) : (
              <>
                <ChestProgress handleClickIcon={handleClickIcon} />
                <QuestDetail
                  handleWithdraw={handleWithdraw}
                  style={{ flex: showRecommend ? 'none' : '1' }}
                />
                {showRecommend && activityCurrency === 'USDT' ? (
                  <Recommend optionKey={optionKey} />
                ) : null}
              </>
            )
          ) : (
            <NoAccess bannerHeight={bannerHeight}/>
          )
        ) : (
          <UnLogin bannerHeight={bannerHeight} />
        )}
      </PageWrapper>
      {currentStageInfo.status === recallStageStatus.WAIT_DRAW ? (
        <UnOpenCardModal
          show={true}
          onCancel={handleClose}
          onOpen={getRecallInfo}
          optionKey={optionKey}
        />
      ) : currentStageInfo.status === recallStageStatus.WAIT_REWARD ? (
        <UnReceiveCardModal
          show={true}
          onCancel={handleClose}
          onReceive={getRecallInfo}
          optionKey={optionKey}
        />
      ) : null}
      <CompleteQuestModal
        show={withdrawModalVisible}
        onWithdraw={() => {
          setWithdrawModalVisible(false);
          handleWithdraw();
        }}
        optionKey={optionKey}
        onCancel={() => {
          setWithdrawModalVisible(false);
        }}
      />
      <TipsModal
        onClose={tipsModalConf.onClose}
        show={tipsModalConf.show}
        title={tipsModalConf.title}
        subTitle={tipsModalConf.subTitle}
      />
    </>
  );
};

export default () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    // 兜底处理，3秒后无论getAppInfo是否返回都通知native关闭loading进入页面。
    const timer = setTimeout(() => {
      JsBridge.open({ type: 'event', params: { name: 'onPageMount' } });
    }, 3000);
    // 获取native主题
    JsBridge.open({ type: 'func', params: { name: 'getAppInfo' } }, function (params) {
      // 同步主题
      if (params?.data?.darkMode) {
        setTheme(params.data.darkMode ? 'dark' : 'light');
      }
      // 通知native关闭loading进入页面
      JsBridge.open({ type: 'event', params: { name: 'onPageMount' } });
      timer && clearTimeout(timer);
    });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecallPage />
    </ThemeProvider>
  );
};
