/*
 * Owner: jesse.shao@kupotech.com
 */
import { css, Global } from '@kufox/mui/emotion';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '@kufox/mui';
import { useDispatch, useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';
import Banner from './Banner';
import { Wrapper, Page } from './common/StyledComps';
import useReferFriends from './hooks/useReferFriends';
import useModals from './hooks/useModals';
import { Home } from './Home';
import Modals from './Modals';
import PlatformPower from './Modals/PlatformPower';
import Loading from 'src/components/Loading';
import { useEagerLoadResources } from './Home/useEagerLoadResources';
import useInviteLink from './hooks/useInviteLink';
import { useCopyToClipboard } from 'react-use';
import { _t } from 'utils/lang';
import Toast from '../CryptoCup/common/Toast';
import { useLocale } from 'src/hooks/useLocale';
import { isEmpty } from 'lodash';

function ReferFriends() {
  const dispatch = useDispatch();
  const { isRTL } = useLocale();

  // share
  const shareRefOrigin = useRef(null);
  // loading
  const loading = useSelector((state) => state.loading);
  const isLoading = loading.effects['app/getServerTime'];

  // hooks
  const { isBeInvitedMan, isLogin, clearPlatformAssist, rcode, getPlatformAssist, handleLogin } =
    useReferFriends();
  const { initModal, triggerGetGift, showModal } = useModals();
  const { isInApp } = useSelector((state) => state.app);

  // 优先加载资源，防止 layout shift
  const isAllLoaded = useEagerLoadResources();

  // share 时先 copy link
  const { inviteLink } = useInviteLink();
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const copyLink = () => {
    if (inviteLink?.length) {
      copyToClipboard(inviteLink);
      if (!copyState?.error) {
        Toast(
          // rtl 的语言会直接被换行，很丑，做一下单独适配
          <div style={{ whiteSpace: isRTL ? 'nowrap' : undefined }}>
            {_t('dEeArVvEiuNtDGt7DigrfB')}
          </div>,
        );
      }
    }
  };
  const sharePost = () => {
    if (!isLogin) {
      handleLogin();
      return;
    }
    if (!shareRefOrigin.current) {
      return;
    }
    copyLink();
    shareRefOrigin.current.goShare?.();
  };

  const init = async () => {
    dispatch({ type: 'app/getServerTime' });

    try {
      const [referInfo] = await Promise.all([
        // 判断汇总
        dispatch({ type: 'referFriend/getReferInfo' }),
      ]);

      if (referInfo?.login) {
        // 上报访问
        dispatch({
          type: 'referFriend/reportEntry',
          payload: {
            behavior: 'REFERRAL_SUPPORT_BONUS',
          },
        });
      }

      // 初始化modal展示
      initModal({
        referInfo,
        isBeInvitedMan,
      });
    } catch (e) {
      console.log('ReferFriends page init err:', e);
    }
  };

  const disableScroll = () => {
    if (isInApp) {
      JsBridge.open({ type: 'func', params: { name: 'enableBounces', isEnable: false } });
    }
  }
  useEffect(() => {
    if (isInApp) {
      const cb = () => {
        if (document.hidden) {
          // do noting
        } else {
          if (isInApp) {
            disableScroll()
            JsBridge.open({
              type: 'event',
              params: {
                name: 'updateHeader',
                statusBarTransparent: true,
                statusBarIsLightMode: false, // 状态栏文字设置为白色
                visible: false,
              },
            });
          }
        }
      };
      document.addEventListener('visibilitychange', cb);

      return () => {
        document.removeEventListener('visibilitychange', cb);
      };
    }
  }, [isInApp]);

  useEffect(() => {
    init();

    // return () => {
    //   alert('unmout');
    // };
  }, []);

  useEffect(() => {
    if (isBeInvitedMan) {
      dispatch({
        type: 'referFriend/userByRcode',
        payload: {
          rcode,
        },
      });
    }
  }, [isBeInvitedMan, dispatch, rcode]);

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'referFriend/invitationCode',
      });
    }
  }, [isLogin, dispatch]);

  useEffect(() => {
    if (isInApp) {
      disableScroll()
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          statusBarTransparent: true,
          statusBarIsLightMode: false, // 状态栏文字设置为白色
          visible: false,
        },
      });

      window.onListenEvent('onLogin', () => {
        dispatch({ type: 'app/init' });
      });
    }
  }, [dispatch, isInApp]);

  // ensure refer info loaded
  const referInfo = useSelector((state) => state.referFriend.referInfo);
  const [referInfoLoaded, setReferInfoLoaded] = useState(isEmpty(referInfo) ? false : true);

  useEffect(() => {
    if (referInfoLoaded) {
      return;
    }
    if (!isEmpty(referInfo)) {
      setReferInfoLoaded(true);
    }
  }, [referInfo, referInfoLoaded]);

  // eager load all assets
  if (!isAllLoaded || isLoading || !referInfoLoaded) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      {getPlatformAssist > 0 ? (
        <PlatformPower
          text={getPlatformAssist}
          onEnd={async () => {
            clearPlatformAssist();
            //  刷新总接口
            const res = await dispatch({ type: 'referFriend/getReferInfo' });
            const { bonusGiftToBeObtain } = res;

            if (bonusGiftToBeObtain) {
              // 达到了礼包领取条件
              const gift = await triggerGetGift();

              if (gift?.awardId) {
                showModal('BOOST_PRIZE_WINNING_POP_UP_WINDOW');
              }
            }
          }}
        />
      ) : (
        <Modals sharePost={sharePost} />
      )}
      <Wrapper className="page-with-768" data-inspector="ReferFriendsPage">
        <Page isInApp={isInApp}>
          <Banner shareRef={shareRefOrigin} copyLink={copyLink} />
          <Home sharePost={sharePost} />
        </Page>
      </Wrapper>

      {isInApp && <Global
        styles={
          // disable scroll bar
          css`
            body {
              -ms-overflow-style: none;
              scrollbar-width: none;
              &::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
                color: transparent;
                background: transparent;
              }
              &::-webkit-scrollbar-track {
                display: none;
                width: 0;
                height: 0;
                color: transparent;
                background: transparent;
              }
              &::-webkit-scrollbar-thumb {
                display: none;
                width: 0;
                height: 0;
                color: transparent;
                background: transparent;
              }
            }
          `
        } />}
    </ThemeProvider>
  );
}

export default ReferFriends;
