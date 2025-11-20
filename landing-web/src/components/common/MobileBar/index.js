/**
 * Owner: jesse.shao@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { useSelector } from 'dva';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined  } from '@kufox/icons';
import JsBridge from 'utils/jsBridge';
import { LANDING_HOST } from 'utils/siteConfig';
import share from 'assets/showcase/Banner/share.svg';
import styles from './styles.less';

const opacityDistance = 1 / 300;

export default ({ onLeftClick, showClose = true }) => {
  const mobileBarY = useSelector(state => state.showcase.mobileBarY);
  const user = useSelector(state => state.app.user);
  const currentLang = useSelector(state => state.app.currentLang);
  const userLogin = useSelector(state => state.showcase.userLogin);
  const isInApp = useSelector(state => state.app.isInApp);
  const supportCookieLogin = useSelector(state => state.showcase.supportCookieLogin);

  const { id: activityId } = useParams();

  const rcode = useMemo(() => {
    return (user && user.referralCode) || '';
  }, [user]);

  const handleLogin = useCallback(() => {
    if (isInApp && supportCookieLogin) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/login',
        },
      });
      return;
    }
  }, [isInApp, supportCookieLogin]);

  const handleShare = () => {
    if (!userLogin || !user) {
      handleLogin();
      return;
    }
    // const encodedUrl = encodeURIComponent(`http://192.168.3.121:8000/choice/mobileInvitePage?lang=${currentLang}&rcode=${rcode}&id=${activityId}`);
    const encodedUrl = encodeURIComponent(`${LANDING_HOST}/choice/mobileInvitePage?lang=${currentLang}&rcode=${rcode}&id=${activityId}`);
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodedUrl}`,
      }
    });
  };

  const returnApp = useCallback(() => {
    if (onLeftClick) {
      onLeftClick();
      return;
    }
    JsBridge.open({
      type: 'func',
      params: {
        name: 'exit',
      },
    });
  }, [onLeftClick]);

  const opacity = useMemo(() => {
    const optMts = mobileBarY * opacityDistance;
    return optMts > 1 ? 1 : optMts.toFixed(1);
  }, [mobileBarY]);

  return (
    <div className={styles.wrapper} style={{ backgroundColor: `rgba(1, 8, 30, ${opacity})` }}>
      <div className={styles.title} onClick={returnApp}>
        <ArrowLeftOutlined iconId='back' />
      </div>
      {/* {
        showClose && <div className={styles.closeIcon}><Icon iconId='close' /></div>
      } */}
      {
        showClose && <div className={styles.shareIcon} onClick={handleShare}><img src={share} alt="" /></div>
      }
    </div>
  );
}
