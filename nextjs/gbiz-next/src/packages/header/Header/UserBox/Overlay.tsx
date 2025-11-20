/**
 * Owner: iron@kupotech.com
 */
import { Trans } from 'tools/i18n';
import storage from 'tools/storage';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CloseIcon, CopyIcon, ArrowRightIcon } from '@kux/iconpack';
import { toast, Divider } from '@kux/design';
import useLang from 'hooks/useLang';
import { toPercent } from 'tools/math';
import dayjs from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';
import help from '../../static/newHeader/help.svg';
import icon_error from '../../static/newHeader/icon_error.svg';
import icon_warn from '../../static/newHeader/icon_warn.svg';
import { composeSpmAndSave, resolveFee } from '../../common/tools';
import { kcsensorsManualTrack } from 'tools/sensors';
import addLangToPath from 'tools/addLangToPath';
import Link from '../../components/Link';
import { useTranslation } from 'tools/i18n';
import { vip_icon } from '../config';
import VipModal from './VIPModal';
import { useTenantConfig } from '../../tenantConfig';

import AssetsBox from '../AssetsBox';
import OrderBox from '../OrderBox';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';

const MY_REWARDS_ENTRANCE_TIME = 'kucoinv2_my_rewards_entrance_click_mark_time';

const COLOR_MAP = {
  SUCCESS: 'var(--kux-brandGreen)',
  ERROR: 'var(--kux-brandRed)',
  WARN: 'var(--kux-complementaryYellow)',
};
const DEFAULT_COLOR = 'var(--color-text)';

const BACKGROUND_COLOR_MAP = {
  SUCCESS: 'var(--kux-brandGreen12)',
  ERROR: 'var(--kux-brandRed12)',
  WARN: 'var(--kux-complementaryYellow12)',
};

const DEFAULT_BACKGROUND_COLOR = 'var(--kux-cover12)';

//  清退超级账户
const ESCROW_ACCOUNT_TYPE = 12;

const Overlay = props => {
  const {
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
  } = props;

  const { KUCOIN_HOST } = hostConfig;
  const { t } = useTranslation('header');
  const tenantConfig = useTenantConfig();
  const { nickname = '', email = '', phone = '', subAccount = '', language } = userInfo || {};
  const userName = nickname || subAccount || email || phone || '';
  const accountHref = `${KUCOIN_HOST}/account`;
  const { isRTL } = useLang();

  const { myConfig } = multiSiteConfig || {};
  const { profilePhotoDirectorys, rateStandardUrl } = myConfig?.directoryConfig || {};

  const { supportKcsRight } = multiSiteConfig?.myConfig?.overviewConfig ?? {};
  const KCSRights = useHeaderStore(state => state.KCSRights);
  const { kcsLevel, kcsLevelDesc, kcsLevelIcon } = KCSRights?.data ?? ({} as any);
  const pullKCSRights = useHeaderStore(state => state.pullKCSRights);

  useEffect(() => {
    supportKcsRight && pullKCSRights?.();
  }, [supportKcsRight]);

  const [showLevelIcon, setShowLevelIcon] = useState(false);
  useEffect(() => {
    setShowLevelIcon(!!kcsLevelIcon);
  }, [kcsLevelIcon]);

  if (!multiSiteConfig) {
    return null;
  }

  const isEscrowAccount = userInfo?.type === ESCROW_ACCOUNT_TYPE;

  return (
    <div
      className={clsx(styles.overlayWrapper, {
        [styles.overlayWrapperInDrawer]: inDrawer,
        [styles.overlayWrapperInTrade]: !inDrawer && inTrade,
        [styles.overlayWrapperLongLanguage]: !inDrawer && isLong_language,
      })}
    >
      <Link
        className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        href={accountHref}
        data-ga="person"
        data-modid="person"
        data-idx={2}
        lang={currentLang}
        onClick={() => {
          onClose?.();
          composeSpmAndSave(accountHref, ['person', '2'], currentLang);
        }}
      >
        {profilePhotoDirectorys?.includes('accountinfo') && (
          <>
            <div className={styles.nameView}>
              <span className={styles.email}>{userName}</span>
            </div>
            <div className={styles.tagView}>
              {isSub && <span className={styles.subAccount}>{t('subaccount.subaccount')} : </span>}
              <div onClick={doNothing}>
                <CopyToClipboard
                  text={userInfo && userInfo.uid}
                  onCopy={() => {
                    toast.success(t('copy.succeed'));
                  }}
                >
                  <div className={styles.uid}>
                    UID: {userInfo && userInfo.uid}
                    <CopyIcon size={16} color="var(--kux-icon60)" />
                  </div>
                </CopyToClipboard>
              </div>
            </div>
          </>
        )}

        {isSub ? (
          <div className={styles.subAccountAuth}>
            {t('uP89sBvPuGCsbXXZaZQLZi')}
            <span className="highlight">{subAccountAuth()}</span>
          </div>
        ) : null}
        {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
      </Link>
      {webEntranceEnabled && entranceEnabled && (
        <>
          <div className={styles.serviceManager}>
            <div className={styles.rowItem} onClick={handleShowModal}>
              <span className={styles.leftText}>
                <span>{t('Kc_VIPservice_open_title')}</span>
                <img src={help} alt="help" className={styles.helpIcon} />
              </span>
            </div>
            <div className={styles.rowItem}>
              {serviceStatus === 'INEFFECTIVE' ? (
                <Link
                  onClick={() => {
                    composeSpmAndSave(`${KUCOIN_HOST}/trade/BTC-USDT`, ['ToTrade', '1'], currentLang);
                    handleSensor('ToTrade');
                  }}
                  href={`${KUCOIN_HOST}/trade/BTC-USDT`}
                  lang={currentLang}
                  className={styles.rightText}
                >
                  {t('Kc_VIPservice_close_trade')}
                </Link>
              ) : (
                <Link
                  onClick={() => {
                    composeSpmAndSave(`${KUCOIN_HOST}/support?type=userbox`, ['chatNow', '1'], currentLang);
                    handleSensor('chatNow');
                  }}
                  href={`${KUCOIN_HOST}/support?type=userbox`}
                  lang={currentLang}
                  className={styles.rightText}
                >
                  {t('Kc_VIPservice_open_chat')}
                </Link>
              )}
              <ArrowRightIcon width={13} height={13} color="var(--kux-brandGreen)" />
              {serviceStatus === 'INEFFECTIVE' && (
                <div onClick={handleClose} className={styles.closeWrapper}>
                  <CloseIcon width={16} height={16} className={styles.close} />
                </div>
              )}
            </div>
            <VipModal visible={visible} onCancel={handleCloseModal} />
          </div>
          {serviceStatus !== 'EFFECTIVE' && (
            <div className={styles.serviceManagerDes}>
              {serviceStatus === 'EXP' && (
                <Trans
                  i18nKey="Kc_VIPservice_extend_explain"
                  ns="header"
                  values={{
                    year: dayjs(effectiveDeadLine).format('YYYY'),
                    month: dayjs(effectiveDeadLine).format('MM'),
                    day: dayjs(effectiveDeadLine).format('DD'),
                  }}
                />
              )}
              {serviceStatus === 'INEFFECTIVE' && t('Kc_VIPservice_close_explain')}
            </div>
          )}
        </>
      )}
      {profilePhotoDirectorys?.includes('ratestandard') && (
        <>
          <Divider className={clsx(styles.hr, inDrawer && styles.hrInDrawer)} />
          <div className={clsx(styles.vip, inDrawer && styles.inDrawer)}>
            {honorLevel === -1 ? null : (
              <Link
                className={styles.vipInner}
                href={`${KUCOIN_HOST}/vip/privilege`}
                data-modid="person"
                data-idx={3}
                lang={currentLang}
                onClick={() => {
                  composeSpmAndSave(`${KUCOIN_HOST}/vip/privilege`, ['person', '3'], currentLang);
                }}
              >
                <div className={styles.flex}>
                  <span className={clsx(styles.label, inDrawer && styles.inDrawer)}>{t('7kD8xu4m8kfanyzVYDTQKL')}</span>
                  <span className={styles.maker}>
                    {t('n.vip.fee.maker')}/{t('n.vip.fee.taker')}:{' '}
                    <span className={styles.numberSpan}>
                      {resolveFee(
                        levelInfo.makerFeeRate,
                        userKcsDiscountStatus,
                        feeDiscountEnable?.makerEnable ? feeDiscountConfig?.discountRate : 100,
                        currentLang
                      )}{' '}
                      /{' '}
                      {resolveFee(
                        levelInfo.takerFeeRate,
                        userKcsDiscountStatus,
                        feeDiscountEnable?.takerEnable ? feeDiscountConfig?.discountRate : 100,
                        currentLang
                      )}
                    </span>
                  </span>
                </div>
                <div className={styles.flex}>
                  <span className={clsx(styles.label, inDrawer && styles.inDrawer)}>{t('kDsWkjR8Ejg15f4WL9ghKx')}</span>
                  <span className={styles.maker}>
                    {t('n.vip.fee.maker')}/{t('n.vip.fee.taker')}:{' '}
                    <span className={styles.numberSpan}>
                      {toPercent(futureFee?.makerFeeRate, currentLang)} /{' '}
                      {toPercent(futureFee?.takerFeeRate, currentLang)}
                    </span>
                  </span>
                </div>
                {userKcsDiscountStatus && !isSub ? (
                  <>
                    <Divider className={clsx(styles.hr3, inDrawer && styles.inDrawer)} />
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.location.href = addLangToPath(accountHref);
                        composeSpmAndSave(accountHref, ['person', '2'], currentLang);
                      }}
                      className={inDrawer ? styles.kcsDiscountInDrawer : styles.kcsDiscount}
                    >
                      <div className={styles.kcsDiscountStatusLabel}>{t('nav.fee.kcs_tip')}:</div>
                      <div className={styles.kcsDiscountStatus}>{t('nav.fee.kcs_tip.status')}</div>
                    </div>
                  </>
                ) : null}
                {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
              </Link>
            )}
          </div>
        </>
      )}

      <Divider className={clsx(styles.hr0, inDrawer && styles.hrInDrawer)} />
      {inDrawer && (
        <>
          <div className={clsx([styles.links, styles.drawerOrderAndAssets])}>
            <OrderBox {...props} title={t('nav.order')} />
            <AssetsBox {...props} title={t('header.menu.assets')} />
          </div>
          {/* <Hr1 inDrawer={inDrawer} /> */}
        </>
      )}
      {supportKcsRight ? (
        <Link
          className={clsx(
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={addLangToPath('/kcs')}
          lang={currentLang}
          onClick={() => {
            kcsensorsManualTrack({ spm: ['KCS_level_portrait', '1'] });
          }}
        >
          <div className={clsx(styles.kCSWrapper, inDrawer && styles.kCSWrapperInDrawer)}>
            <div>{t('df989ea466424000a0a2')}</div>
            <div
              className={styles.kCSValue}
              style={{ color: kcsLevel === 0 ? 'var(--kux-text30)' : 'var(--kux-text40)' }}
            >
              {showLevelIcon ? (
                <img src={kcsLevelIcon} alt="kcs_level_icon" onError={() => setShowLevelIcon(false)} />
              ) : null}
              {kcsLevelDesc}
            </div>
          </div>
        </Link>
      ) : null}
      {!isSub && rateStandardUrl ? (
        <Link
          className={clsx(
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={`${KUCOIN_HOST}${tenantConfig.rateStandardUrlPath || rateStandardUrl}`}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/vip/privilege`, ['person', '10'], currentLang);
          }}
        >
          <div className={styles.vipWrapper}>
            {/* Fees & VIP */}
            <span>{tenantConfig.feesVipI18Key(t)}</span>
            {userLevel && Number(userLevel) > 0 ? (
              <img src={vip_icon[Number(userLevel) - 1].tinySrc} alt="vip_icon" />
            ) : null}
          </div>
        </Link>
      ) : null}

      {profilePhotoDirectorys?.includes('accountsecurity') && (
        <Link
          className={clsx(
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={`${KUCOIN_HOST}/account/security`}
          data-modid="person"
          data-idx={!isSub ? '5' : '4'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(`${KUCOIN_HOST}/account/security`, ['person', !isSub ? '5' : '4'], currentLang);
          }}
        >
          {t('account.security')}
          {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
        </Link>
      )}
      {!isSub && profilePhotoDirectorys?.includes('kyc') && (
        <Link
          className={clsx(
            'alignCenter',
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={`${KUCOIN_HOST}/account/kyc?app_line=KYC&soure=DEFAULT`}
          data-modid="person"
          data-idx={6}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(`${KUCOIN_HOST}/account/kyc`, ['person', '6'], currentLang);
          }}
        >
          {kycStatusDisplayInfo?.displayType === 'SUCCESS' ||
          !kycStatusDisplayInfo?.displayText ? null : kycStatusDisplayInfo.displayType === 'WARN' ? (
            <div className={styles.yellowDot} />
          ) : (
            <div className={styles.redDot} />
          )}
          <div className={styles.kycFlagBox}>
            {t('kyc.verify')}
            {kycStatusDisplayInfo?.displayText ? (
              <div
                className={styles.kycLevelTag}
                style={{
                  color: COLOR_MAP[kycStatusDisplayInfo?.displayType] || DEFAULT_COLOR,
                  background: BACKGROUND_COLOR_MAP[kycStatusDisplayInfo?.displayType] || DEFAULT_BACKGROUND_COLOR,
                }}
              >
                {kycStatusDisplayInfo.displayText}
              </div>
            ) : null}
          </div>
        </Link>
      )}
      {/* {!(currentLang.indexOf('zh_') === 0) && !isSub && (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/bonus/referral`}
          data-modid="person"
          data-idx={7}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/assets/bonus/referral`,
              ['person', '7'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          {t('nav.drop.invitation')}
        </MenuItem>
      )} */}
      {!isSub && profilePhotoDirectorys?.includes('api') && (
        <Link
          className={clsx(
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={`${KUCOIN_HOST}/account/api`}
          data-modid="person"
          data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '8' : '6'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(
              `${KUCOIN_HOST}/account/api`,
              ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '8' : '7'],
              currentLang
            );
          }}
        >
          {t('drop.api.manage')}
          {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
        </Link>
      )}
      {profilePhotoDirectorys?.includes('myreward') && (
        <Link
          className={clsx(
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={`${KUCOIN_HOST}/account/vouchers`}
          data-modid="person"
          data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '11' : '10'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            storage.setItem(MY_REWARDS_ENTRANCE_TIME, String(new Date().valueOf()));
            composeSpmAndSave(
              `${KUCOIN_HOST}/account/vouchers`,
              ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '11' : '10'],
              currentLang
            );
          }}
        >
          {!myRewardsEntranceClickMarkTime ? <div className={styles.redDot} /> : ''}
          {t('eTDTJxStkmMUQt69pX38Mm')}
          {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
        </Link>
      )}

      {isEscrowAccount && (
        <Link
          className={clsx(
            styles.menuItem,
            inDrawer && styles.menuItemInDrawer,
            inDrawer && styles.menuItemInDrawerCommon
          )}
          href={`${KUCOIN_HOST}/account/escrow-account`}
          data-modid="person"
          data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '13' : '12'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(
              `${KUCOIN_HOST}/account/escrow-account`,
              ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '13' : '12'],
              currentLang
            );
          }}
        >
          {t('f72ec28a21274000ab44')}
        </Link>
      )}

      {!isSub && profilePhotoDirectorys?.includes('subuser') && (
        <>
          <Divider className={clsx(styles.hr2, inDrawer && styles.hrInDrawer)} />
          <Link
            className={clsx(
              styles.menuItem,
              inDrawer && styles.menuItemInDrawer,
              inDrawer && styles.menuItemInDrawerCommon
            )}
            href={`${KUCOIN_HOST}/account/sub`}
            data-modid="person"
            data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8'}
            lang={currentLang}
            onClick={() => {
              onClose?.();
              composeSpmAndSave(
                `${KUCOIN_HOST}/account/sub`,
                ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8'],
                currentLang
              );
            }}
          >
            {t('subaccount.subaccount')}
            {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
          </Link>
        </>
      )}
      <Divider className={clsx(styles.hr2, inDrawer && styles.hrInDrawer)} />
      <Link
        className={clsx(
          'center',
          styles.menuItem,
          styles.logout,
          inDrawer && styles.menuItemInDrawer,
          inDrawer && styles.menuItemInDrawerCommon
        )}
        onClick={handleLogout}
        data-modid="person"
        data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '10' : '9'}
      >
        {t('logout')}
      </Link>
    </div>
  );
};

export default Overlay;
