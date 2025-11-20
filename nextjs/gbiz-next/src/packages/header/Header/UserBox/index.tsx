/**
 * Owner: iron@kupotech.com
 */
import storage from 'tools/storage';
import React, { useCallback, useEffect, useState } from 'react';
import { InfoFilledIcon } from '@kux/iconpack';
import clsx from 'clsx';
import { useMultiSiteConfig } from 'hooks/useMultiSiteConfig';
import loadable from '@loadable/component';
import { throttle } from 'lodash-es';
import { useResponsive, Divider } from '@kux/design';
import AnimateDropdown from '../AnimateDropdown';
import icon_error from '../../static/newHeader/icon_error.svg';
import icon_warn from '../../static/newHeader/icon_warn.svg';
import { composeSpmAndSave, kcsensorsClick } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import { SUB_ACCOUNT_MAP, long_language } from '../config';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';

const Overlay = loadable(() => import('./Overlay'));

const doNothing = e => {
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
      if (nicknameStr[1] && nicknameStr[0].charCodeAt(0) <= 255 && nicknameStr[1].charCodeAt(0) <= 255) {
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

export default props => {
  const {
    currentLang,
    userInfo,
    hostConfig,
    isSub = false,
    handleShowDrawer,
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
  const { t } = useTranslation('header');

  const levelInfo = useHeaderStore(state => state.levelInfo);
  const feeDiscountConfig = useHeaderStore(state => state.feeDiscountConfig);
  const feeDiscountEnable = useHeaderStore(state => state.feeDiscountEnable);
  const userKcsDiscountStatus = useHeaderStore(state => state.userKcsDiscountStatus);
  const serviceInfo = useHeaderStore(state => state.serviceInfo) || {};
  const futureFee = useHeaderStore(state => state.futureFee);
  const kycStatusDisplayInfo = useHeaderStore(state => state.kycStatusDisplayInfo) as any;
  const logout = useHeaderStore(state => state.logout);
  const pullUserLevel = useHeaderStore(state => state.pullUserLevel);
  const queryServiceInfo = useHeaderStore(state => state.queryServiceInfo);
  const getUserFutureFee = useHeaderStore(state => state.getUserFutureFee);
  const getKycStatusDisplayInfo = useHeaderStore(state => state.getKycStatusDisplayInfo);

  // serviceStatus: 专属客服经理状态：EFFECTIVE-生效期, EXP-延长期, INEFFECTIVE-已失效
  const { serviceStatus, effectiveDeadLine, entranceEnabled, webEntranceEnabled } = serviceInfo || ({} as any);
  const { honorLevel = -1, userLevel } = levelInfo || ({} as any);

  const handleLogout = e => {
    kcsensorsClick(['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8']);
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const to = '';
    logout?.({ to, spm: ['person', '9'] });
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
        pullUserLevel?.();
        queryServiceInfo?.();
        getUserFutureFee?.();
        getKycStatusDisplayInfo?.();
      }
    },
    2000,
    { leading: true }
  );

  const updateHeader = useHeaderStore(state => state.updateHeader);
  const closeService = useHeaderStore(state => state.closeService);

  // 点击关闭客户经理
  const handleClose = useCallback(() => {
    updateHeader?.({
      serviceInfo: {
        ...serviceInfo,
        entranceEnabled: false,
      },
    });
    closeService?.();
  }, [serviceInfo]);

  const handleRouter = useCallback(() => {
    kcsensorsClick(['person', '1']);
    const { KUCOIN_HOST } = hostConfig;
    const _url = addLangToPath(`${KUCOIN_HOST}/account`);
    composeSpmAndSave(_url, ['person', '1'], currentLang);
    window.location.href = _url;
  }, [currentLang]);

  const handleSensor = useCallback(blockid => {
    kcsensorsClick([blockid, '1']);
  }, []);

  const subAccountAuth = useCallback(() => {
    const { permissionTrades } = userInfo;
    try {
      // const permissionTrades = ['Spot', 'Margin', 'Futures'];
      if (!permissionTrades || permissionTrades.length === 0) return '-';
      const arr: string[] = [];
      const tmp = permissionTrades.sort().reverse();

      Object.keys(tmp).forEach(key => {
        arr.push(t(SUB_ACCOUNT_MAP[tmp[key]]));
      });

      return arr.join(',');
    } catch (error) {
      return '-';
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.uid) {
      getKycStatusDisplayInfo?.();
    }
  }, [userInfo]);

  const onVisibleChange = useCallback(v => {
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
  const isSm = rv === 'sm';
  const avatarBoxCls = clsx('avatar', userInfo?.avatar ? 'avatar-type-image' : 'avatar-type-text', styles.avatarBox);

  if (inDrawer) {
    return (
      <LoaderComponent show={inDrawer}>
        <Overlay
          {...overlayProps}
          fallback={
            <div
              className={clsx(styles.overlayWrapper, {
                [styles.overlayWrapperInDrawer]: inDrawer,
                [styles.overlayWrapperInTrade]: !inDrawer && inTrade,
                [styles.overlayWrapperLongLanguage]: !inDrawer && isLong_language,
              })}
            />
          }
        />
      </LoaderComponent>
    );
  }

  return (
    <div className={styles.root}>
      {navStatus >= 2 ? (
        <div
          className={avatarBoxCls}
          onClick={() => handleShowDrawer('user', true)}
          onMouseEnter={handleMouseEnter}
          data-lang={currentLang}
          // navStatus={navStatus}
        >
          {userInfo.avatar ? (
            <img src={userInfo.avatar} width={30} height={30} />
          ) : (
            <div className={clsx('avatar-text-box', styles.userFlag, inTrade && styles.inTrade)}>
              {/* flag 必须由span包裹，合伙人侧需要做渐变色文字头像 */}
              <span className="avatar-text">{getUserFlag(userInfo, isSub)}</span>
            </div>
          )}
          {!isSub && kycStatusDisplayInfo?.kycLimit && kycStatusDisplayInfo?.displayType !== 'SUCCESS' ? (
            <InfoFilledIcon
              size={12}
              className={clsx({
                [styles.kycLevelDot]: true,
                [styles.kycWarning]: kycStatusDisplayInfo?.displayType === 'WARN',
                [styles.kycError]: kycStatusDisplayInfo?.displayType !== 'WARN',
              })}
            />
          ) : null}
        </div>
      ) : (
        <AnimateDropdown
          visible={dropState}
          trigger="hover"
          overlay={
            <LoaderComponent show={dropState}>
              <Overlay
                {...overlayProps}
                fallback={
                  <div
                    className={clsx(styles.overlayWrapper, {
                      [styles.overlayWrapperInDrawer]: inDrawer,
                      [styles.overlayWrapperInTrade]: !inDrawer && inTrade,
                      [styles.overlayWrapperLongLanguage]: !inDrawer && isLong_language,
                    })}
                  />
                }
              />
            </LoaderComponent>
          }
          placement="bottom"
          anchorProps={{ style: { display: 'block' } }}
          inDrawer={inDrawer}
          keepMounted
          className={styles.dropdown}
          onVisibleChange={onVisibleChange}
        >
          <div className={avatarBoxCls} onClick={handleRouter} onMouseEnter={handleMouseEnter}>
            {userInfo.avatar ? (
              <img src={userInfo.avatar} width={30} height={30} />
            ) : (
              <div className={clsx('avatar-text-box', styles.userFlag, inTrade && styles.inTrade)}>
                {/* flag 必须由span包裹，合伙人侧需要做渐变色文字头像 */}
                <span className="avatar-text">{getUserFlag(userInfo, isSub)}</span>
              </div>
            )}
            {!isSub && kycStatusDisplayInfo?.kycLimit && kycStatusDisplayInfo?.displayType !== 'SUCCESS' ? (
              <InfoFilledIcon
                size={12}
                className={clsx({
                  [styles.kycLevelDot]: true,
                  [styles.kycWarning]: kycStatusDisplayInfo?.displayType === 'WARN',
                  [styles.kycError]: kycStatusDisplayInfo?.displayType !== 'WARN',
                })}
              />
            ) : null}
          </div>
        </AnimateDropdown>
      )}
      <Divider className={styles.divider} />
    </div>
  );
};
