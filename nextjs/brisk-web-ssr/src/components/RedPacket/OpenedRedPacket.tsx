/**
 * Owner: willen@kupotech.com
 * OpenedRedPacket component - converted to TypeScript with zustand and @kux/mui-next
 */
import useTranslation from '@/hooks/useTranslation';
import borderIcon from '@/static/redpacket/border.png';
import deleteIcon from '@/static/redpacket/delete.png';
import { useRedPacketStore } from '@/store/redPacket';
import { useUserStore } from '@/store/user';
import { addLangToPath } from '@/tools/i18n';
import { Button } from '@kux/mui-next';
import { dateTimeFormat, numberFormat } from '@kux/mui-next/utils';
import { trackClick } from 'gbiz-next/sensors';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { getCurrentLang } from 'kc-next/boot';
import { debounce, isFunction } from 'lodash-es';
import React, { useCallback, useEffect, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import CoinImportant from './CoinImportant';
import CountDown from './CountDown';
import styles from './redPacket.module.scss';
import background from '@/static/redpacket/background.png';

interface OpenedRedPacketProps {
  onClose: () => void;
}

const OpenedRedPacket: React.FC<OpenedRedPacketProps> = ({ onClose }) => {
  const { t, Trans } = useTranslation();

  // Zustand stores
  const {
    redPacketAccount,
    redPacketInfo,
    receivedInfo,
    redPacketList,
    redPacketFooterInfo,
    filters,
    getRedPacketListLoading,
    getReceiveInfo,
    getRedPacketList,
  } = useRedPacketStore();

  const { isLogin } = useUserStore();

  const { welfareType } = redPacketInfo; // 0:拼手气红包 1:固定金额红包
  const { hasMore } = filters;
  const { phone = '', email = '', countryCode } = redPacketAccount || {};
  const { isNewUser } = receivedInfo || {};
  const currentLang = getCurrentLang();

  const {
    id,
    sendNum,
    sendAmount,
    receiveNum,
    receive,
    currency,
    nickName,
    welfareStatus,
    extendUrl,
  } = redPacketFooterInfo || {};

  const {
    receiveAmount = 0,
    receiveStatus, // 0-待领取,1-已领取,2-入账成功,11-锁定,12-退回
    remainingAt,
    nickName: receiveNickName,
    isNewUser: receiveIsNewUser,
  } = receive || {};

  /** 账户是否是新用户 */
  const accountIsNewUser = useMemo(
    () => isNewUser || receiveIsNewUser,
    [isNewUser, receiveIsNewUser],
  );

  /** 操作按钮是否显示注册 */
  const showRegisterBtn = useMemo(
    () => accountIsNewUser && receiveStatus !== 12,
    [accountIsNewUser, receiveStatus],
  );

  /** 领取到红用户的打码信息 */
  const receiveUserStr = useMemo(() => {
    let _receiveUserStr = '';
    if (receiveNickName) {
      _receiveUserStr = receiveNickName;
    } else if (countryCode && phone) {
      _receiveUserStr = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3 ');
    } else if (email) {
      const splitArray = email.split('@');
      const splitArrayAfter = splitArray[1].replace('@', '*');
      if (splitArray[0] && splitArray[0].length < 3) {
        _receiveUserStr =
          splitArray[0] + '**@**' + splitArrayAfter.substr(splitArrayAfter.indexOf('.'));
      } else {
        _receiveUserStr =
          splitArray[0].substr(0, 2) +
          '**@**' +
          splitArrayAfter.substr(splitArrayAfter.indexOf('.'));
      }
    }
    return _receiveUserStr;
  }, [receiveNickName, countryCode, phone, email]);

  const getData = useCallback(
    debounce((page: number) => {
      if (!hasMore && page !== 1) {
        return;
      }
      getRedPacketList(page);
    }, 200),
    [hasMore],
  );

  // 初始查询列表和底部信息
  const init = useCallback(() => {
    getReceiveInfo();
    getData(1);
  }, [isLogin]);

  useEffect(() => {
    init();
  }, [init]);

  /** 点击底部的操作按钮 */
  const handleFooterBtn = useCallback(() => {
    // 埋点
    trackClick([showRegisterBtn ? 'ed_envelope_click_signup' : 'ed_envelope_click_login', '1']);
    if (showRegisterBtn) {
      // 新人用户
      const type = !!countryCode ? 'phone' : 'email';
      const value = !!countryCode ? phone : email;
      if (countryCode) {
        // 设置区号
        storage.setItem('signup.phoneCode', countryCode);
      }
      // 设置 账号
      storage.setItem('signup.account', {
        type,
        value,
      });
      // 关闭弹窗
      isFunction(onClose) && onClose();
      // 跳转去注册页面
      window.location.href = addLangToPath(`/ucenter/signup?type=${type}`);
    } else {
      isFunction(onClose) && onClose();
      // TODO: 需要实现登录抽屉的调用
      window.location.href = addLangToPath(`/ucenter/signin?backUrl=${encodeURIComponent(window.location.href)}`);
      // dispatch({
      //   type: 'entranceDrawer/update',
      //   payload: {
      //     loginOpen: true,
      //   },
      // });
    }
  }, [showRegisterBtn, phone, email, countryCode, onClose]);

  // 红包抢到显示顶部存入账户信息
  const showTopBanner = Number(receiveStatus) > 0 && Number(receiveStatus) < 12;

  // 优先级：红包退回 > 实际抢到的钱 > 已抢完
  const renderStatus = useMemo(() => {
    if (!id) {
      return <div style={{ height: 56 }} />;
    }
    // 退回 - 显示文案 紅包被退回。
    if (receiveStatus === 12) {
      return <span className={styles.statusText}>{t('redEnvelope.back')}</span>;
    }
    // 抢到 - 显示抢到的金额
    if (Number(receiveStatus) > 0) {
      return <CoinImportant coin={currency || ''} value={receiveAmount || 0} />;
    }
    // 抢完 - 显示文案 紅包已搶完
    if (welfareStatus === 2) {
      return <span className={styles.statusText}>{t('redEnvelope.snatchedUp')}</span>;
    }
  }, [id, receiveStatus, receiveAmount]);

  // 优先级：红包退回 > 实际抢到的钱 > 已抢完
  const renderFooter = () => {
    // 退回 显示文案 因為您沒有及時登入查收紅包，紅包已退回給發送者，下次搶紅包記得先登入哦。
    if (receiveStatus === 12) {
      return <span>{t('redEnvelope.helpText2')}</span>;
    }
    // 抢到但是因为未登录锁定
    // 普通红包 - 盡快登入查收以免紅包被退回！倒计时
    // 新人红包 - 现在完成注册，即可领取红包，否则将自动退回 倒计时
    if (receiveStatus === 11) {
      return (
        <span style={{ textAlign: 'center' }}>
          {accountIsNewUser ? (
            <span>{t('68a0b582245d4000aa8e')}</span>
          ) : (
            <span>{t('redEnvelope.helpText5')}</span>
          )}
          {Number(remainingAt) > 0 && (
            <div>
              {t('redEnvelope.countDown')} {/* 倒计时加1秒，避免查询服务器时还没有处理状态 */}
              <CountDown totalMS={Number(remainingAt) + 1000} onFetch={init} />
            </div>
          )}
        </span>
      );
    }
    // 其他情况 - 显示文案 「打码信息」 您當前還沒有登入，登入後搶紅包更有利，快登入吧！
    return (
      <span>
        {receiveUserStr}&nbsp;
        {t('redEnvelope.helpText3')}
      </span>
    );
  };

  return (
    <div className={styles.redPacketWrapper}>
      {showTopBanner && (
        <div className={styles.topBanner}>
          <span>
            <Trans
              i18nKey="redEnvelope.hasDeposit"
              values={{ className: styles.icon }}
              components={{ p: <p /> }}
            />
          </span>
        </div>
      )}
      <div className={styles.bodyContent}>
        <div className={styles.redPacketOpended}
          style={{backgroundImage: `url(${background})`}}>
          {/* 红包边框 start */}
          <img
            role="presentation"
            src={borderIcon}
            alt="borderIcon"
            className={styles.borderIcon}
          />
          {/* 红包边框 end */}
          {/* 红包封面 start */}
          {!!extendUrl ? (
            <div className={styles.packetCover}>
              <div className={styles.packetCoverBox}>
                <img src={extendUrl} alt="" className={styles.packetCoverImg} />
              </div>
            </div>
          ) : null}
          {/* 红包封面 end */}
          <div className={styles.whiteBodyBg}>
            <span className={styles.nickName}>
              {nickName}
              {welfareType === 0 && (
                <span className={styles.flagItem}>{t('redEnvelope.ping')}</span>
              )}
            </span>
            {renderStatus}
            <div className={styles.listScroll}>
              <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={getData}
                hasMore={hasMore}
                useWindow={false}
              >
                {redPacketList.map((l, idx) => (
                  <div key={idx} className={styles.listItem}>
                    <div>
                      <div className={styles.nickName_inTable}>{l.nickName}</div>
                      <span className="color-gray">
                        {dateTimeFormat({ date: l.receiveAt, lang: currentLang, format: 'HH:mm MM-DD' })}
                      </span>
                    </div>
                    <CoinImportant coin={currency || ''} value={l.receiveAmount || 0} isInTable />
                  </div>
                ))}
                {!getRedPacketListLoading && !redPacketList.length ? (
                  <div className={styles.noData}>{t('table.empty')}</div>
                ) : null}
              </InfiniteScroll>
            </div>
          </div>
          <span className={styles.bottomText}>
            {t('redEnvelope.totalInfo', {
              receiveNum: receiveNum || '0',
              sendNum,
              sendAmount: numberFormat({ number: sendAmount, lang: currentLang }),
              currency,
            })}
          </span>
        </div>
      </div>

      {!isLogin && (
        <div className={styles.footer}>
          {renderFooter()}
          <Button className={styles.confirButton} onClick={handleFooterBtn}>
            {showRegisterBtn ? t('09cf7c111ded4000a0f3') : t('login')}
          </Button>
        </div>
      )}
      <div className={styles.deleteIconBox}>
        <img
          role="presentation"
          src={deleteIcon}
          alt="deleteIcon"
          className={styles.deleteIcon}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default OpenedRedPacket;
