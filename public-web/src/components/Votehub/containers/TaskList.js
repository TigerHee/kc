/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined, ICInfoOutlined, ICShareOutlined } from '@kux/icons';
import { Button, Divider, useSnackbar } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { debounce, isNil, map } from 'lodash';
import { memo, useCallback, useEffect, useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { tenantConfig } from 'src/config/tenant';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import TaskIcon from 'static/votehub/task.svg';
import welfareCoin from 'static/votehub/welfare_coin.png';
import welfareGift from 'static/votehub/welfare_gift.png';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { push } from 'utils/router';
import Modal from '../components/Modal';
import Tooltip from '../components/Tooltip';
import { useResponsiveSize, useShare } from '../hooks';
import {
  ContentWrapper,
  StyledTask,
  TaskButtonWrapper,
  TaskContentWrapper,
} from '../styledComponents';
import { skip2Login } from '../util';
import { InviteTaskCard } from './components/InviteTaskCard';
import TaskCard from './components/TaskCard';
import TaskSuccessModal from './components/TaskSuccessModal';
import Title from './components/Title';

const { KUCOIN_HOST, KUCOIN_HOST_COM } = siteCfg;

// type 分为 welfare_0 -- 福利中心交易任务 welfare_2 -- 福利中心kyc任务 cash_invite -- 现金礼包邀请任务 vote_KCS -- 投票上币kcs持仓任务
// status统一采用 3 -- 已完成/可领取 0 -- 未完成/不可领取
const TaskButton = memo(({ type, status, taskId, isInModal }) => {
  const { message } = useSnackbar();
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const size = useResponsiveSize();
  const handleShare = useShare();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const referralCode = useSelector((state) => state.user.referralCode, shallowEqual);
  const loading = useSelector((state) => state.loading.effects['votehub/postClaimKcsHoldReward']);

  const handleJump = useCallback(
    (url) => {
      if (isInApp) {
        const tragetUrl = KUCOIN_HOST + addLangToPath(url);
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodeURIComponent(tragetUrl)}`,
          },
        });
      } else {
        push(url);
      }
    },
    [isInApp],
  );

  // 福利中心任务均跳转相关任务详情页
  const handle2WelfareCenter = useCallback(() => {
    // 跳转kyc
    handleJump(`/land/KuRewards/detail?id=${taskId || ''}`);
  }, [taskId, handleJump]);

  const handle2Trade = useCallback(() => {
    if (isInApp) {
      // app内跳转
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/trade?goBackUrl=${encodeURIComponent(window.location.href)}`,
        },
      });
    } else {
      push('/trade');
    }
  }, [isInApp]);

  const handle2TradeBySymbol = useCallback(() => {
    if (isInApp) {
      // app内跳转
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/trade?symbol=KCS-USDT&goBackUrl=${encodeURIComponent(window.location.href)}`,
        },
      });
    } else {
      push(`/trade/KCS-USDT`);
    }
  }, [isInApp]);

  const handle2Cash = useCallback(() => {
    // 跳转现金红包
    handleJump('/earn-crypto-rewards-by-referring');
  }, [handleJump]);

  const handleReward = useCallback(
    debounce(
      () => {
        dispatch({
          type: 'votehub/postClaimKcsHoldReward',
        });
      },
      1000,
      { trailing: false, leading: true },
    ),
    [dispatch],
  );

  const btnSize = useMemo(() => {
    return size === 'sm' ? 'mini' : 'basic';
  }, [size]);

  const btnComp = useMemo(() => {
    if (!user) {
      return (
        <Button size={btnSize} onClick={skip2Login}>
          {_t('qXQDAbAWfbjfPzVQpDBXSV')}
        </Button>
      );
    } else if (type === 'welfare_2') {
      if (status === 3) {
        return (
          <Button disabled={true} size={btnSize}>
            {_t('mXvj4C7ZhY79au9kwrhKmM')}
          </Button>
        );
      }
      return (
        <Button size={btnSize} onClick={handle2WelfareCenter}>
          {_t('bAS2b1zJ6FeJmDhUgie3rQ')}
        </Button>
      );
    } else if (type === 'welfare_0') {
      if (status === 3) {
        return (
          <Button size={btnSize} onClick={handle2Trade}>
            {_t('caapPkDnWVJTbX1bbp3UPw')}
          </Button>
        );
      }
      return (
        <Button size={btnSize} onClick={handle2WelfareCenter}>
          {_t('bAS2b1zJ6FeJmDhUgie3rQ')}
        </Button>
      );
    } else if (type === 'cash_invite') {
      return (
        <>
          {status === 3 ? (
            <Button size={btnSize} onClick={handle2Cash} className="primary">
              {_t('6oWuXUkyKH81eEYxN8RgCH')}
            </Button>
          ) : null}
          {isInApp ? (
            <Button size={btnSize} onClick={handleShare}>
              <ICShareOutlined />
              {_t('suizVFit7GaXfWmdFPzSVD')}
            </Button>
          ) : (
            <CopyToClipboard
              text={`${window.location.href}?rcode=${referralCode}`}
              onCopy={() => {
                message.success(_t('copy.succeed'));
              }}
            >
              <Button size={btnSize}>
                <ICShareOutlined />
                {_t('suizVFit7GaXfWmdFPzSVD')}
              </Button>
            </CopyToClipboard>
          )}
        </>
      );
    } else if (type === 'vote_KCS') {
      return (
        <>
          {status === 3 ? (
            <Button size={btnSize} onClick={handleReward} className="primary" loading={loading}>
              {_t('6oWuXUkyKH81eEYxN8RgCH')}
            </Button>
          ) : null}
          <Button size={btnSize} onClick={handle2TradeBySymbol}>
            {_t('gCGkRgBmfia13fkcmPDNPs')}
          </Button>
        </>
      );
    }
  }, [
    handle2WelfareCenter,
    handle2Trade,
    handle2TradeBySymbol,
    handle2Cash,
    handleShare,
    handleReward,
    btnSize,
    type,
    status,
    user,
    isInApp,
    message,
    referralCode,
    loading,
  ]);

  const isSpecialBtn = useMemo(() => {
    return user && size === 'sm' && status === 3 && (type === 'vote_KCS' || type === 'cash_invite');
  }, [status, type, size, user]);

  return (
    <TaskButtonWrapper
      className={`${isSpecialBtn ? 'specialBtn' : ''} ${isInModal ? 'isInModal' : ''}`}
    >
      {btnComp}
    </TaskButtonWrapper>
  );
});

export const Content = memo(({ isInModal = false }) => {
  const { currentLang } = useLocale();
  const size = useResponsiveSize();
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const welfareList = useSelector((state) => state.votehub.welfareList, shallowEqual);
  const kcsTaskInfo = useSelector((state) => state.votehub.kcsTaskInfo, shallowEqual);
  const cashTaskInfo = useSelector((state) => state.votehub.cashTaskInfo, shallowEqual);
  const user = useSelector((state) => state.user.user, shallowEqual);
  const kcsHoldStatus = useSelector((state) => state.votehub.kcsHoldStatus);
  const cashTaskStatus = useSelector((state) => state.votehub.cashTaskStatus);
  const kcsHoldRewardLimit = useSelector((state) => state.votehub.kcsHoldRewardLimit);

  const { claim, nextClaimTime, claimAmount } = kcsTaskInfo || {};

  const handle2Welfare = useCallback(() => {
    if (isInApp) {
      const url = KUCOIN_HOST + addLangToPath('/land/KuRewards');
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${encodeURIComponent(url)}`,
        },
      });
    } else {
      // window.open(url);
      push('/land/KuRewards');
    }
  }, [isInApp]);

  const kcsLabel = useMemo(() => {
    // 没查到数据时
    if (isNil(claim)) {
      return null;
    }

    if (claim) {
      return (
        <span className={+claimAmount > 0 ? 'active' : ''}>
          {_tHTML('wHQ8xwfUHgRbQTQfs3GCZA', { num: claimAmount || '0' })}
        </span>
      );
    } else {
      return nextClaimTime > 0 ? (
        <span>{_tHTML('2GXE9spVFj3cCmAiCz5eah', { day: nextClaimTime || '0' })}</span>
      ) : null;
    }
  }, [claim, claimAmount, nextClaimTime]);

  return (
    <ContentWrapper className={isInModal ? 'modalWrapper' : ''}>
      {tenantConfig.showKuReward && (
        <div className="entranceWrapper" onClick={handle2Welfare} role="button" tabIndex="-1">
          <div className="content">
            <h2>
              <span className="text">{_t('tEFCVuNNEiYNTkqjpQC1XT')}</span>
              {size === 'sm' ? (
                <span className="icon">
                  <ICArrowRight2Outlined />
                </span>
              ) : (
                <ICArrowRight2Outlined />
              )}
            </h2>
          </div>
          <LazyImg src={welfareCoin} alt="img" className="welfareCoin" />
          <LazyImg src={welfareGift} alt="img" className="welfareGift" />
        </div>
      )}
      {welfareList?.length || cashTaskInfo?.title || kcsHoldStatus ? (
        <div className="taskWrapper">
          {map(welfareList, (item, index) => {
            return (
              <div key={`task_${index}`}>
                <TaskCard
                  title={item?.taskTitle}
                  desc={item?.taskSubTitle}
                  isInModal={isInModal}
                  operator={
                    <TaskButton
                      type={`welfare_${item?.taskType}`}
                      status={item?.userTaskStatus}
                      taskId={item?.taskId}
                      isInModal={isInModal}
                    />
                  }
                />
                {index !== welfareList?.length - 1 ? <Divider /> : null}
              </div>
            );
          })}
          <InviteTaskCard />
          {/*暂时屏蔽 {cashTaskInfo?.title ? (
            <>
              {welfareList?.length ? <Divider /> : null}
              <TaskCard
                title={cashTaskInfo.title}
                desc={cashTaskInfo.subTitle}
                isInModal={isInModal}
                tag={_t('2uYzL5YxBb4qSFhB762ikr')}
                isSpecialBtn={user && size === 'sm' && cashTaskStatus}
                operator={
                  <TaskButton
                    isInModal={isInModal}
                    type={`cash_invite`}
                    status={cashTaskStatus ? 3 : 0} // 是否有待领取
                  />
                }
              />
            </>
          ) : null} */}
          {kcsHoldStatus ? (
            <>
              <Divider />
              <TaskCard
                title={
                  <span className="title">
                    {_t('3JGpBtyYuubPuoLwxdZsrZ')}
                    <Tooltip title={_t('9oQ6mYjnui184FnFWgczvP')}>
                      <ICInfoOutlined />
                    </Tooltip>
                  </span>
                }
                desc={_t('nSPRgjdF1YzxGG1iR74ezE', {
                  num: kcsHoldRewardLimit
                    ? numberFormat({ lang: currentLang, number: kcsHoldRewardLimit })
                    : '0',
                })}
                isInModal={isInModal}
                label={kcsLabel}
                tag={_t('71oucZ3hoiHwYisbQ856HM')}
                isSpecialBtn={user && size === 'sm' && claim && +claimAmount > 0}
                operator={
                  <TaskButton
                    type={`vote_KCS`}
                    status={claim && +claimAmount > 0 ? 3 : 0} // 是否有待领取
                    isInModal={isInModal}
                  />
                }
              />
            </>
          ) : null}
        </div>
      ) : null}
    </ContentWrapper>
  );
});

const TaskList = () => {
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const taskModal = useSelector((state) => state.votehub.taskModal);
  const taskSuccessModal = useSelector((state) => state.votehub.taskSuccessModal);

  // 登陆后重拉数据
  useEffect(() => {
    // 登陆后与未登录获取信息不同
    dispatch({
      type: 'votehub/pullWelfareTaskList',
    });
    if (user) {
      dispatch({
        type: 'votehub/pullKcsHoldRewardInfo',
      });
      dispatch({
        type: 'votehub/pullCashInviteTaskStatus',
      });
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch({
      type: 'votehub/pullCashInviteTaskInfo',
      payload: {
        businessLine: 'toc',
        codes: 'GemVoteCashInviteTask',
      },
    });
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        taskModal: false,
      },
    });
  }, [dispatch]);

  return (
    <>
      <StyledTask data-inspector="inspector_votehub_task_list">
        <Title title={_t('t7AT5v5u4AmXtuyjZAUfec')} coin={TaskIcon} />
        <Content />
      </StyledTask>
      <Modal
        title={_t('t7AT5v5u4AmXtuyjZAUfec')}
        open={taskModal}
        onClose={handleClose}
        onCancel={handleClose}
        size="large"
        footer={null}
      >
        <TaskContentWrapper>
          <Content isInModal={true} />
        </TaskContentWrapper>
      </Modal>
      {taskSuccessModal && <TaskSuccessModal />}
    </>
  );
};

export default memo(TaskList);
