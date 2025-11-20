/**
 * Owner: iron@kupotech.com
 */
import React, { FC } from 'react';
import { Label } from '@kux/design';
import {
  FundingThinIcon,
  EyeOpenIcon,
  EyeCloseIcon,
  OptionThinIcon,
  CopytradingThinIcon,
  UnifiedtradingThinIcon,
  TradingThinIcon,
  FuturesThinIcon,
  TradingbotThinIcon,
  EarnThinIcon,
  MarginThinIcon,
  AlphaThinIcon,
} from '@kux/iconpack';
import clsx from 'clsx';
import { cusCoinPrecision } from 'tools/math';

import Overview from '../../static/newHeader/overview.svg';

import useAlphaOpen from '../../hookTool/useAlphaOpen';
import { composeSpmAndSave } from '../../common/tools';
import { useTranslation } from 'tools/i18n';
import useAccountStatus from 'hooks/useAccountStatus';
import CoinCurrency from './CoinCurrency';
import { useTenantConfig } from '../../tenantConfig';
import { useAbTest } from '../hooks';
import Link from '../../components/Link';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';
import { trackClick } from 'tools/sensors';

interface OverlayProps {
  userInfo: any;
  hostConfig: any;
  assetDetail: any;
  isLong_language: boolean;
  inDrawer: boolean;
  inTrade: boolean;
  currentLang: string;
  showAssets: boolean;
  changeAssetShow: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  getSubAssetsLoading: boolean;
  currency: string;
  onClose: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isSub: boolean;
}

function MenuItemDot() {
  return (
    <div className={styles.menuItemDotWrapper}>
      <div className={styles.menuItemDot} />
    </div>
  );
}

const Overlay: FC<OverlayProps> = ({
  userInfo,
  hostConfig,
  assetDetail,
  isLong_language,
  inDrawer,
  inTrade,
  currentLang,
  showAssets,
  changeAssetShow,
  getSubAssetsLoading,
  currency,
  onClose,
  isSub,
}) => {
  const { t } = useTranslation('header');
  const { accountType, isHitGray } = useAccountStatus(userInfo?.uid) || {};
  const isUnified = accountType === 'UNIFIED';
  const tenantConfig = useTenantConfig();
  const isAlphaOpen = useAlphaOpen(userInfo?.uid);
  const { KUCOIN_HOST } = hostConfig;
  const { totalAssets: _total, balanceCurrency } = assetDetail || {};
  const totalAssets = _total || 0;
  const { showSubAccountBalanceSwitch } = assetDetail || {};

  const showFollowEntrance = useAbTest('assets_enable_follow');
  const unifiedItem = (
    <Link
      href={`${KUCOIN_HOST}/assets/unified-account`}
      data-modid="assets"
      data-idx={11}
      lang={currentLang}
      onClick={(e) => {
        if (onClose) {
          onClose(e);
        }
        composeSpmAndSave(`${KUCOIN_HOST}/assets/unified-account`, ['assets', '4'], currentLang);
      }}
      // inDrawer={inDrawer}
      className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
    >
      {!inDrawer ? <UnifiedtradingThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
      <span className={styles.menuItemText}>{t('78a75adc071f4800ab54')}</span>
      {isUnified && (
        <Label color="primary" size="small" className={styles.tag}>
          {t('e7114b5e6d794000ae61')}
        </Label>
      )}
      {!isUnified && (
        <Label color="default" size="small" className={styles.tag}>
          {t('2e281080bdd04000acc7')}
        </Label>
      )}
    </Link>
  );
  {/* 币币账户 Trading Account  */}
  const tradeItem = tenantConfig.showTradeAccount ? (
    <Link
      href={`${KUCOIN_HOST}/assets/trade-account`}
      data-modid="assets"
      data-idx={4}
      lang={currentLang}
      onClick={e => {
        if (onClose) {
          onClose(e);
        }
        composeSpmAndSave(`${KUCOIN_HOST}/assets/trade-account`, ['assets', '4'], currentLang);
      }}
      className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
    >
      {!inDrawer ? <TradingThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
      <span className={styles.menuItemText}>{t('trade.account')}</span>
      {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
    </Link>
  ) : null
    {/* 合约账户 Futures Account */}
  const futureItem = bootConfig._SITE_CONFIG_.functions.futures ? (
    <Link
      href={`${KUCOIN_HOST}/assets/futures-account`}
      data-modid="assets"
      data-idx={6}
      lang={currentLang}
      onClick={e => {
        if (onClose) {
          onClose(e);
        }
        composeSpmAndSave(`${KUCOIN_HOST}/assets/futures-account`, ['assets', '6'], currentLang);
      }}
      className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
    >
      {!inDrawer ? <FuturesThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
      <span className={styles.menuItemText}>{t('margin.account')}</span>
      {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
    </Link>
  ) : null
  return (
    <div
      className={clsx(styles.overlayWrapper, {
        [styles.overlayWrapperInDrawer]: inDrawer,
        [styles.overlayWrapperIsLongLanguage]: !inDrawer && isLong_language,
        [styles.overlayWrapperIsInTrade]: !inDrawer && inTrade,
      })}
    >
      {!inDrawer && (
        <>
          {/* Overview资产概览  */}
          <Link
            className={clsx(styles.menuTitleItem)}
            href={`${KUCOIN_HOST}/assets`}
            data-ga="assets"
            data-modid="assets"
            data-idx={2}
            lang={currentLang}
            onClick={() => {
              composeSpmAndSave(`${KUCOIN_HOST}/assets`, ['assets', '2'], currentLang);
            }}
          >
            <div className={styles.assetsDetail}>
              <span>{t('asset.overview')}</span>
              {showAssets ? (
                <EyeOpenIcon onClick={changeAssetShow} size={24} color="var(--kux-text40)" />
              ) : (
                <EyeCloseIcon onClick={changeAssetShow} size={24} color="var(--kux-text40)" />
              )}
              <span className={styles.menuTitleItemText}>{showSubAccountBalanceSwitch && t('include.sub.assets')}</span>
            </div>
            {getSubAssetsLoading ? (
              <div className={styles.assetsLoading}>{t('5Z3YyFVMBaRusVKjJUXXmz')}</div>
            ) : (
              <div>
                <div className={styles.assetsCount}>
                  <span className={styles.account}>
                    {showAssets && balanceCurrency
                      ? cusCoinPrecision(balanceCurrency, totalAssets, true, currentLang)
                      : '***'}
                  </span>{' '}
                  <span style={{ color: 'var(--kux-text40)' }}>{balanceCurrency}</span>
                </div>

                <div className={styles.legalCurrency}>
                  {showAssets ? (
                    <CoinCurrency hideLegalCurrency lang={currentLang} value={totalAssets} coin={balanceCurrency} />
                  ) : (
                    '***'
                  )}{' '}
                  {currency}
                </div>
              </div>
            )}

            {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
          </Link>
        </>
      )}
      {inDrawer ? (
        <Link
          // Overview资产概览
          href={`${KUCOIN_HOST}/assets`}
          data-modid="assets"
          data-idx={10}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets`, ['assets', '10'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <img className={styles.textIcon} src={Overview} alt="overview" /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('9mVnohzR9Sa7MMk3MoLrfJ')}</span>
        </Link>
      ) : null}

      {/* 资金账户 Funding Account */}
      {tenantConfig.showFundingAccount ? (
        <Link
          href={`${KUCOIN_HOST}/assets/main-account`}
          data-modid="assets"
          data-idx={3}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/main-account`, ['assets', '3'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <FundingThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          {/* <ICEyeCloseOutlined onClick={changeAssetShow} size={20} color={color.text40} /> */}
          {/* {isSub ? t('main.account') : t('drop.save.account')} */}
          <span className={styles.menuItemText}>{t('main.account')}</span>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* 命中灰度并且是统一账户模式时，展示在前面 */}
      {isHitGray && isUnified && unifiedItem}
      {/* 币币账户 */}
      {!isUnified && tradeItem}
      {/* 杠杆账户 Margin Account */}
      {bootConfig._SITE_CONFIG_.functions.margin ? (
        <Link
          href={`${KUCOIN_HOST}/assets/margin-account`}
          data-modid="assets"
          data-idx={5}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/margin-account`, ['assets', '5'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <MarginThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('margin.margin.account')}</span>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {isAlphaOpen ? (
        <Link
          href={`${KUCOIN_HOST}/assets/alpha-account`}
          data-modid="assets"
          data-idx={11}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(
              `${KUCOIN_HOST}/assets/alpha-account`,
              ['assets', '11'],
              currentLang,
            );
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <AlphaThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('e81ae6eed49d4800a8d6')}</span>
        </Link>
      ) : null}
      {bootConfig._SITE_CONFIG_.functions.option ? (
        <Link
          href={`${KUCOIN_HOST}/assets/options-account`}
          data-modid="assets"
          data-idx={9}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/options-account`, ['assets', '9'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <OptionThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('12fd427d3b4d4000a156')}</span>
        </Link>
      ) : null}
      {/* 机器人账户 Trading Bot Account */}
      {!isSub && bootConfig._SITE_CONFIG_.functions.trading_bot ? (
        <Link
          href={`${KUCOIN_HOST}/assets/bot-account`}
          data-modid="assets"
          data-idx={7}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            trackClick(['assets', 'tradingBotAccount']);
            composeSpmAndSave(`${KUCOIN_HOST}/assets/bot-account`, ['assets', '7'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <TradingbotThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('bot.account')}</span>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* 金融账户 Financial Account */}
      {!isSub && bootConfig._SITE_CONFIG_.functions.financing ? (
        <Link
          href={`${KUCOIN_HOST}/assets/earn-account`}
          data-modid="assets"
          data-idx={8}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/earn-account`, ['assets', '8'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <EarnThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('pool.earnAccount.account')}</span>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* 跟单账户 */}
      {showFollowEntrance && !isSub && bootConfig._SITE_CONFIG_.functions.copy_trading ? (
        <Link
          href={`${KUCOIN_HOST}/assets/follow`}
          data-modid="assets"
          data-idx={9}
          lang={currentLang}
          onClick={e => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/follow`, ['assets', '9'], currentLang);
          }}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
        >
          {!inDrawer ? <CopytradingThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <span className={styles.menuItemText}>{t('assets.overview.menu.follow')}</span>
        </Link>
      ) : null}
      {isHitGray && !isUnified && unifiedItem}
      {isHitGray && isUnified && tradeItem}
      {!isUnified && futureItem}
    </div>
  );
};

export default Overlay;
