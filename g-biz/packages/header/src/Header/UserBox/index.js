/**
 * Owner: iron@kupotech.com
 */
import storage from '@utils/storage';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { useMultiSiteConfig } from '@hooks/useMultiSiteConfig';
import loadable from '@loadable/component';
import { throttle } from 'lodash';
import { Avatar, useResponsive } from '@kux/mui';
import icon_error from '../../../static/newHeader/icon_error.svg';
import icon_warn from '../../../static/newHeader/icon_warn.svg';
import { addLangToPath, composeSpmAndSave, kcsensorsClick } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import { useLang } from '../../hookTool';
import { SUB_ACCOUNT_MAP, long_language } from '../config';
import { namespace } from '../model';
import {
  AvatarBox,
  Divider,
  Dropdown,
  KycLevelDot,
  OverlayWrapper,
  Root,
  UserFlag,
} from './styled';

const Overlay = loadable(() => import('./Overlay'));

const doNothing = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

// 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
const getUserFlag = (user, isSub = false) => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  let userFlag = '';
  try {
    if (nickname) {
      const nicknameStr = `${nickname}`;
      userFlag += nicknameStr[0];
      if (
        nicknameStr[1] &&
        nicknameStr[0].charCodeAt() <= 255 &&
        nicknameStr[1].charCodeAt() <= 255
      ) {
        userFlag += nicknameStr[1];
      }
    } else if (isSub) {
      userFlag = subAccount.substring(0, 2) || '';
    } else if (email) {
      userFlag += email.substring(0, 2);
    } else if (phone) {
      userFlag += phone.substring(phone.length - 2);
    }
  } catch (e) {
    console.log(e);
  }
  return userFlag.toUpperCase();
};

const MY_REWARDS_ENTRANCE_TIME = 'kucoinv2_my_rewards_entrance_click_mark_time';

export default (props) => {
  const {
    currentLang,
    userInfo,
    hostConfig,
    isSub = false,
    handleShowDrawer,
    minNav,
    inDrawer,
    navStatus,
    inTrade,
    onClose,
  } = props;

  const [visible, setVisible] = useState(false);
  const [dropState, setState] = useState(false);

  // 我的奖励入口点击时间
  const myRewardsEntranceClickMarkTime = storage.getItem(MY_REWARDS_ENTRANCE_TIME);

  const { multiSiteConfig } = useMultiSiteConfig();

  const isLong_language = long_language.indexOf(currentLang) > -1;
  const { t } = useLang();

  const levelInfo = useSelector((state) => state[namespace].levelInfo);
  const feeDiscountConfig = useSelector((state) => state[namespace].feeDiscountConfig);
  const feeDiscountEnable = useSelector((state) => state[namespace].feeDiscountEnable);
  const userKcsDiscountStatus = useSelector((state) => state[namespace].userKcsDiscountStatus);
  const serviceInfo = useSelector((state) => state[namespace].serviceInfo);
  const futureFee = useSelector((state) => state[namespace].futureFee);
  const kycStatusDisplayInfo = useSelector((state) => state[namespace].kycStatusDisplayInfo);

  // serviceStatus: 专属客服经理状态：EFFECTIVE-生效期, EXP-延长期, INEFFECTIVE-已失效
  const { serviceStatus, effectiveDeadLine, entranceEnabled, webEntranceEnabled } =
    serviceInfo || {};
  const { honorLevel = -1, userLevel } = levelInfo || {};
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    kcsensorsClick(['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8']);
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const to = '';
    dispatch({ type: `${namespace}/logout`, payload: { to, spm: ['person', '9'] } });
  };

  const handleShowModal = useCallback(() => {
    kcsensorsClick(['QuestionMark', '1']);
    setVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setVisible(false);
  }, []);

  // TODO:
  const handleMouseEnter = throttle(
    () => {
      const { myConfig } = multiSiteConfig || {};
      const { profilePhotoDirectorys } = myConfig?.directoryConfig || {};
      // 只有打开了ratestandard才请求对应接口
      if (profilePhotoDirectorys?.includes('ratestandard')) {
        dispatch({ type: `${namespace}/pullUserLevel` });
        dispatch({ type: `${namespace}/queryServiceInfo` });
        dispatch({ type: `${namespace}/getUserFutureFee` });
        dispatch({ type: `${namespace}/getKycStatusDisplayInfo` });
      }
    },
    2000,
    { leading: true },
  );

  // 点击关闭客户经理
  const handleClose = useCallback(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        serviceInfo: {
          ...serviceInfo,
          entranceEnabled: false,
        },
      },
    });
    dispatch({ type: `${namespace}/closeService` });
  }, [serviceInfo]);

  const handleRouter = useCallback(() => {
    kcsensorsClick(['person', '1']);
    const { KUCOIN_HOST } = hostConfig;
    const _url = addLangToPath(`${KUCOIN_HOST}/account`, currentLang);
    composeSpmAndSave(_url, ['person', '1'], currentLang);
    window.location.href = _url;
  }, [currentLang]);

  const handleSensor = useCallback((blockid) => {
    kcsensorsClick([blockid, '1']);
  }, []);

  const subAccountAuth = useCallback(() => {
    const { permissionTrades } = userInfo;
    try {
      // const permissionTrades = ['Spot', 'Margin', 'Futures'];
      if (!permissionTrades || permissionTrades.length === 0) return '-';
      const arr = [];
      const tmp = permissionTrades.sort().reverse();

      Object.keys(tmp).forEach((key) => {
        arr.push(t(SUB_ACCOUNT_MAP[tmp[key]]));
      });

      return arr.join(',');
    } catch (error) {
      return '-';
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.uid) {
      dispatch({ type: `${namespace}/getKycStatusDisplayInfo` });
    }
  }, [userInfo]);

  const onVisibleChange = useCallback((v) => {
    setState(v);
  }, []);

  const overlayProps = {
    visible,
    hostConfig,
    userInfo,
    multiSiteConfig,
    inDrawer,
    isLong_language,
    inTrade,
    currentLang,
    onClose,
    isSub,
    webEntranceEnabled,
    entranceEnabled,
    serviceStatus,
    handleClose,
    doNothing,
    handleShowModal,
    handleCloseModal,
    handleSensor,
    subAccountAuth,
    effectiveDeadLine,
    honorLevel,
    levelInfo,
    userKcsDiscountStatus,
    kycStatusDisplayInfo,
    feeDiscountEnable,
    feeDiscountConfig,
    futureFee,
    userLevel,
    handleLogout,
    myRewardsEntranceClickMarkTime,
  };

  const rv = useResponsive();
  const isSm = !rv?.sm;
  const avatarBoxCls = clsx('avatar', userInfo?.avatar ? 'avatar-type-image' : 'avatar-type-text');

  if (inDrawer) {
    return (
      <LoaderComponent show={inDrawer}>
        <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
      </LoaderComponent>
    );
  }
  return (
    <Root>
      {minNav ? (
        <AvatarBox
          className={avatarBoxCls}
          onClick={() => {
            handleShowDrawer('user', true);
          }}
          onMouseEnter={handleMouseEnter}
          data-lang={currentLang}
          navStatus={navStatus}
        >
          {userInfo.avatar ? (
            <Avatar src={userInfo.avatar} size={isSm || inTrade ? 30 : 38} />
          ) : (
            <UserFlag className="avatar-text-box" inTrade={inTrade}>
              {/* flag 必须由span包裹，合伙人侧需要做渐变色文字头像 */}
              <span className="avatar-text">{getUserFlag(userInfo, isSub)}</span>
            </UserFlag>
          )}
          {!isSub &&
          kycStatusDisplayInfo?.kycLimit &&
          kycStatusDisplayInfo?.displayType !== 'SUCCESS' ? (
            <KycLevelDot>
              <img
                src={kycStatusDisplayInfo?.displayType === 'WARN' ? icon_warn : icon_error}
                alt="kycStatus"
              />
            </KycLevelDot>
          ) : null}
        </AvatarBox>
      ) : (
        <Dropdown
          visible={dropState}
          trigger="hover"
          overlay={
            <LoaderComponent show={dropState}>
              <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
            </LoaderComponent>
          }
          placement="bottom"
          anchorProps={{ style: { display: 'block' } }}
          inDrawer={inDrawer}
          keepMounted
          onVisibleChange={onVisibleChange}
        >
          <AvatarBox className={avatarBoxCls} onClick={handleRouter} onMouseEnter={handleMouseEnter}>
            {userInfo.avatar ? (
              <Avatar src={userInfo.avatar} size={isSm || inTrade ? 30 : 38} />
            ) : (
              <UserFlag className="avatar-text-box" inTrade={inTrade}>
                {/* flag 必须由span包裹，合伙人侧需要做渐变色文字头像 */}
                <span className="avatar-text">{getUserFlag(userInfo, isSub)}</span>
              </UserFlag>
            )}
            {!isSub &&
            kycStatusDisplayInfo?.kycLimit &&
            kycStatusDisplayInfo?.displayType !== 'SUCCESS' ? (
              <KycLevelDot>
                <img
                  src={kycStatusDisplayInfo?.displayType === 'WARN' ? icon_warn : icon_error}
                  alt="kycStatus"
                />
              </KycLevelDot>
            ) : null}
          </AvatarBox>
        </Dropdown>
      )}
      <Divider />
    </Root>
  );
};
