/**
 * Owner: iron@kupotech.com
 */
import { Trans } from '@tools/i18n';
import storage from '@utils/storage';
import React, { useEffect, useState } from 'react';

import { CloseOutlined, ICCopyOutlined, RightOutlined } from '@kux/icons';
import { useSnackbar, useTheme } from '@kux/mui';
import { isRTLLanguage } from '@utils';
import { toPercent } from '@utils/math';
import dayjs from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import help from '../../../static/newHeader/help.svg';
import icon_error from '../../../static/newHeader/icon_error.svg';
import icon_warn from '../../../static/newHeader/icon_warn.svg';
import {
  addLangToPath,
  composeSpmAndSave,
  kcsensorsManualTrack,
  resolveFee,
} from '../../common/tools';
import Link from '../../components/Link';
import { useLang } from '../../hookTool';
import { vip_icon } from '../config';
import VipModal from './VIPModal';
import { tenantConfig } from '../../tenantConfig';

import AssetsBox from '../AssetsBox';
import OrderBox from '../OrderBox';
import {
  Flex,
  Hr,
  Hr0,
  Hr2,
  Hr3,
  KYCStatusIcon,
  KcsDiscount,
  KcsDiscountStatus,
  KycLevelTag,
  Label,
  Links,
  Maker,
  MenuItem,
  NumberSpan,
  OverlayWrapper,
  ServiceManager,
  ServiceManagerDes,
  Vip,
  VipInner,
  VipWrapper,
  KCSWrapper,
  KCSLabel,
  KCSValue,
} from './styled';
import { namespace } from '../model';

const MY_REWARDS_ENTRANCE_TIME = 'kucoinv2_my_rewards_entrance_click_mark_time';

const Overlay = (props) => {
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
  const { message } = useSnackbar();
  const { t } = useLang();
  const theme = useTheme();
  const { nickname = '', email = '', phone = '', subAccount = '', language } = userInfo || {};
  const userName = nickname || subAccount || email || phone || '';
  const accountHref = `${KUCOIN_HOST}/account`;
  const isRTL = isRTLLanguage(language);

  const { myConfig } = multiSiteConfig || {};
  const { profilePhotoDirectorys, rateStandardUrl } = myConfig?.directoryConfig || {};

  const { supportKcsRight } = multiSiteConfig?.myConfig?.overviewConfig ?? {};
  const { kcsLevel, kcsLevelDesc, kcsLevelIcon } = useSelector(
    (state) => state[namespace]?.KCSRights?.data ?? {},
  );
  const dispatch = useDispatch();

  useEffect(() => {
    supportKcsRight && dispatch({ type: `${namespace}/pullKCSRights` });
  }, [supportKcsRight]);

  const [showLevelIcon, setShowLevelIcon] = useState(false);
  useEffect(() => {
    setShowLevelIcon(!!kcsLevelIcon);
  }, [kcsLevelIcon]);

  if (!multiSiteConfig) {
    return null;
  }

  return (
    <OverlayWrapper inDrawer={inDrawer} isLong_language={isLong_language} inTrade={inTrade}>
      <MenuItem
        href={accountHref}
        data-ga="person"
        data-modid="person"
        data-idx={2}
        lang={currentLang}
        onClick={() => {
          onClose?.();
          composeSpmAndSave(accountHref, ['person', '2'], currentLang);
        }}
        inDrawer={inDrawer}
      >
        {profilePhotoDirectorys?.includes('accountinfo') && (
          <>
            <div className="nameView">
              <span className="email">{userName}</span>
            </div>
            <div className="tagView">
              {isSub && <span className="subAccount">{t('subaccount.subaccount')} : </span>}
              <div onClick={doNothing}>
                <CopyToClipboard
                  text={userInfo && userInfo.uid}
                  onCopy={() => {
                    message.success(t('copy.succeed'));
                  }}
                >
                  <div className="uid">
                    UID: {userInfo && userInfo.uid}
                    <ICCopyOutlined
                      size={inDrawer ? 16 : 14}
                      style={
                        isRTL ? { marginRight: inDrawer ? 4 : 6 } : { marginLeft: inDrawer ? 4 : 6 }
                      }
                      color={inDrawer ? theme.colors.icon60 : theme.colors.icon}
                    />
                  </div>
                </CopyToClipboard>
              </div>
            </div>
          </>
        )}

        {isSub ? (
          <div className="subAccountAuth">
            {t('uP89sBvPuGCsbXXZaZQLZi')}
            <span className="highlight">{subAccountAuth()}</span>
          </div>
        ) : null}
        {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
      </MenuItem>
      {webEntranceEnabled && entranceEnabled && (
        <>
          <ServiceManager>
            <div className="rowItem" onClick={handleShowModal}>
              <span className="leftText">
                <span>{t('Kc_VIPservice_open_title')}</span>
                <img src={help} alt="help" className="helpIcon" />
              </span>
            </div>
            <div className="rowItem">
              {serviceStatus === 'INEFFECTIVE' ? (
                <Link
                  onClick={() => {
                    composeSpmAndSave(
                      `${KUCOIN_HOST}/trade/BTC-USDT`,
                      ['ToTrade', '1'],
                      currentLang,
                    );
                    handleSensor('ToTrade');
                  }}
                  href={`${KUCOIN_HOST}/trade/BTC-USDT`}
                  lang={currentLang}
                  className="rightText"
                >
                  {t('Kc_VIPservice_close_trade')}
                </Link>
              ) : (
                <Link
                  onClick={() => {
                    composeSpmAndSave(
                      `${KUCOIN_HOST}/support?type=userbox`,
                      ['chatNow', '1'],
                      currentLang,
                    );
                    handleSensor('chatNow');
                  }}
                  href={`${KUCOIN_HOST}/support?type=userbox`}
                  lang={currentLang}
                  className="rightText"
                >
                  {t('Kc_VIPservice_open_chat')}
                </Link>
              )}
              <RightOutlined width="13px" height="13px" color={theme.colors.primary} />
              {serviceStatus === 'INEFFECTIVE' && (
                <div onClick={handleClose} className="closeWrapper">
                  <CloseOutlined width="16px" height="16px" className="close" />
                </div>
              )}
            </div>
            <VipModal visible={visible} onCancel={handleCloseModal} />
          </ServiceManager>
          {serviceStatus !== 'EFFECTIVE' && (
            <ServiceManagerDes>
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
            </ServiceManagerDes>
          )}
        </>
      )}
      <Hr inDrawer={inDrawer} isSub={isSub} />
      {profilePhotoDirectorys?.includes('ratestandard') && (
        <Vip inDrawer={inDrawer}>
          {honorLevel === -1 ? null : (
            <VipInner
              href={`${KUCOIN_HOST}/vip/privilege`}
              data-modid="person"
              data-idx={3}
              lang={currentLang}
              onClick={() => {
                composeSpmAndSave(`${KUCOIN_HOST}/vip/privilege`, ['person', '3'], currentLang);
              }}
              inDrawer={inDrawer}
            >
              <Flex inDrawer={inDrawer}>
                <Label inDrawer={inDrawer}>{t('7kD8xu4m8kfanyzVYDTQKL')}</Label>
                <Maker inDrawer={inDrawer}>
                  {t('n.vip.fee.maker')}/{t('n.vip.fee.taker')}:{' '}
                  <NumberSpan>
                    {resolveFee(
                      levelInfo.makerFeeRate,
                      userKcsDiscountStatus,
                      feeDiscountEnable?.makerEnable ? feeDiscountConfig?.discountRate : 100,
                      currentLang,
                    )}{' '}
                    /{' '}
                    {resolveFee(
                      levelInfo.takerFeeRate,
                      userKcsDiscountStatus,
                      feeDiscountEnable?.takerEnable ? feeDiscountConfig?.discountRate : 100,
                      currentLang,
                    )}
                  </NumberSpan>
                </Maker>
              </Flex>
              <Flex inDrawer={inDrawer}>
                <Label inDrawer={inDrawer}>{t('kDsWkjR8Ejg15f4WL9ghKx')}</Label>
                <Maker inDrawer={inDrawer}>
                  {t('n.vip.fee.maker')}/{t('n.vip.fee.taker')}:{' '}
                  <NumberSpan>
                    {toPercent(futureFee?.makerFeeRate, currentLang)} /{' '}
                    {toPercent(futureFee?.takerFeeRate, currentLang)}
                  </NumberSpan>
                </Maker>
              </Flex>
              {userKcsDiscountStatus && !isSub ? (
                <>
                  <Hr3 inDrawer={inDrawer} />
                  <KcsDiscount
                    inDrawer={inDrawer}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.location.href = addLangToPath(
                        accountHref,
                        storage.getItem('kucoinv2_lang'),
                      );
                      composeSpmAndSave(accountHref, ['person', '2'], currentLang);
                    }}
                  >
                    {t('nav.fee.kcs_tip')}:
                    <KcsDiscountStatus inDrawer={inDrawer}>
                      {t('nav.fee.kcs_tip.status')}
                    </KcsDiscountStatus>
                  </KcsDiscount>
                </>
              ) : null}
              {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
            </VipInner>
          )}
        </Vip>
      )}

      <Hr0 inDrawer={inDrawer} />
      {inDrawer && (
        <>
          <Links>
            <OrderBox {...props} themeColors={theme.colors} title={t('nav.order')} />
            <AssetsBox {...props} themeColors={theme.colors} title={t('header.menu.assets')} />
          </Links>
          {/* <Hr1 inDrawer={inDrawer} /> */}
        </>
      )}
      {supportKcsRight ? (
        <MenuItem
          href={addLangToPath('/kcs')}
          lang={currentLang}
          inDrawer={inDrawer}
          onClick={() => {
            kcsensorsManualTrack({ spm: ['KCS_level_portrait', '1'] });
          }}
        >
          <KCSWrapper>
            <KCSLabel>{t('df989ea466424000a0a2')}</KCSLabel>
            <KCSValue level={kcsLevel}>
              {showLevelIcon ? (
                <img
                  src={kcsLevelIcon}
                  alt="kcs_level_icon"
                  onError={() => setShowLevelIcon(false)}
                />
              ) : null}
              {kcsLevelDesc}
            </KCSValue>
          </KCSWrapper>
        </MenuItem>
      ) : null}
      {!isSub && rateStandardUrl ? (
        <MenuItem
          href={`${KUCOIN_HOST}${tenantConfig.rateStandardUrlPath || rateStandardUrl}`}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/vip/privilege`, ['person', '10'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <VipWrapper>
            {/* Fees & VIP */}
            <span>{tenantConfig.feesVipI18Key(t)}</span>
            {userLevel && Number(userLevel) > 0 ? (
              <img src={vip_icon[Number(userLevel) - 1].tinySrc} alt="vip_icon" />
            ) : null}
          </VipWrapper>
        </MenuItem>
      ) : null}

      {profilePhotoDirectorys?.includes('accountsecurity') && (
        <MenuItem
          href={`${KUCOIN_HOST}/account/security`}
          data-modid="person"
          data-idx={!isSub ? '5' : '4'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(
              `${KUCOIN_HOST}/account/security`,
              ['person', !isSub ? '5' : '4'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          {t('account.security')}
          {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
        </MenuItem>
      )}
      {!isSub && profilePhotoDirectorys?.includes('kyc') && (
        <MenuItem
          href={`${KUCOIN_HOST}/account/kyc?app_line=KYC&soure=DEFAULT`}
          className="alignCenter"
          data-modid="person"
          data-idx={6}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(`${KUCOIN_HOST}/account/kyc`, ['person', '6'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          {t('kyc.verify')}
          {kycStatusDisplayInfo?.displayText ? (
            <KycLevelTag type={kycStatusDisplayInfo?.displayType}>
              {kycStatusDisplayInfo?.displayType === 'SUCCESS' ? null : (
                <KYCStatusIcon
                  src={kycStatusDisplayInfo?.displayType === 'WARN' ? icon_warn : icon_error}
                />
              )}
              {kycStatusDisplayInfo.displayText}
            </KycLevelTag>
          ) : null}
        </MenuItem>
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
        <MenuItem
          href={`${KUCOIN_HOST}/account/api`}
          data-modid="person"
          data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '8' : '6'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            composeSpmAndSave(
              `${KUCOIN_HOST}/account/api`,
              ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '8' : '7'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          {t('drop.api.manage')}
          {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
        </MenuItem>
      )}
      {profilePhotoDirectorys?.includes('myreward') && (
        <MenuItem
          href={`${KUCOIN_HOST}/account/vouchers`}
          data-modid="person"
          data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '11' : '10'}
          lang={currentLang}
          onClick={() => {
            onClose?.();
            storage.setItem(MY_REWARDS_ENTRANCE_TIME, new Date().valueOf());
            composeSpmAndSave(
              `${KUCOIN_HOST}/account/vouchers`,
              ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '11' : '10'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          {!myRewardsEntranceClickMarkTime ? <div className="redDot" /> : ''}
          {t('eTDTJxStkmMUQt69pX38Mm')}
          {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
        </MenuItem>
      )}

      {!isSub && profilePhotoDirectorys?.includes('subuser') && (
        <>
          <Hr2 inDrawer={inDrawer} />
          <MenuItem
            href={`${KUCOIN_HOST}/account/sub`}
            data-modid="person"
            data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8'}
            lang={currentLang}
            onClick={() => {
              onClose?.();
              composeSpmAndSave(
                `${KUCOIN_HOST}/account/sub`,
                ['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8'],
                currentLang,
              );
            }}
            inDrawer={inDrawer}
          >
            {t('subaccount.subaccount')}
            {/* <ArrowOutlined width="13px" height="13px" className="arrow" /> */}
          </MenuItem>
        </>
      )}
      <Hr2 inDrawer={inDrawer} />
      <MenuItem
        onClick={handleLogout}
        className="center"
        data-modid="person"
        data-idx={!(currentLang.indexOf('zh_') === 0) && !isSub ? '10' : '9'}
        inDrawer={inDrawer}
      >
        {t('logout')}
      </MenuItem>
    </OverlayWrapper>
  );
};

export default Overlay;
