/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Divider } from '@kux/design';
import clsx from 'clsx';

import { composeSpmAndSave } from '../../common/tools';
import Link from '../../components/Link';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';
import {
  BuycryptoThinIcon,
  EarnThinIcon,
  FuturesThinIcon,
  MarginThinIcon,
  OptionThinIcon,
  TradingThinIcon,
} from '@kux/iconpack';

function MenuItemDot() {
  return (
    <div className={styles.menuItemDotWrapper}>
      <div className={styles.menuItemDot} />
    </div>
  );
}

const Overlay = props => {
  const { t } = useTranslation('header');
  const { hostConfig, inDrawer, isLong_language, inTrade, currentLang, isSub, currency } = props;
  const { KUCOIN_HOST, FASTCOIN_HOST } = hostConfig;
  return (
    <div
      className={clsx(styles.overlayWrapper, {
        [styles.overlayWrapperInDrawer]: inDrawer,
        [styles.overlayWrapperIsInTrade]: !inDrawer && inTrade,
      })}
      style={{ width: inDrawer ? 'auto' : isLong_language ? '340px' : '320px' }}
    >
      {/* Spot Orders 币币订单 */}
      {bootConfig._SITE_CONFIG_.functions.spot ? (
        <Link
          href={`${KUCOIN_HOST}/order/trade`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={1}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/trade`, ['orders', '1'], currentLang);
          }}
        >
          {!inDrawer ? <TradingThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <div className={styles.menuItemText}>{t('drop.coin.order')}</div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* Margin Orders 杠杆订单 */}
      {bootConfig._SITE_CONFIG_.functions.margin ? (
        <Link
          href={`${KUCOIN_HOST}/order/margin`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={2}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/margin`, ['orders', '2'], currentLang);
          }}
        >
          {!inDrawer ? <MarginThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <div className={styles.menuItemText}>{t('drop.lever.order')}</div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* Futures Orders 合约订单 */}
      {bootConfig._SITE_CONFIG_.functions.futures ? (
        <Link
          href={`${KUCOIN_HOST}/order/futures/order-history`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={3}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/futures/order-history`, ['orders', '3'], currentLang);
          }}
        >
          {!inDrawer ? <FuturesThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <div className={styles.menuItemText}>{t('drop.aggrement')}</div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* 赚币订单 Earn Orders */}
      {bootConfig._SITE_CONFIG_.functions.financing ? (
        <Link
          // href={`${KUCOIN_HOST}/earn-account/order`}
          href={`${KUCOIN_HOST}/earn-account/order`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={3}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/earn-account/order`, ['orders', '4'], currentLang);
          }}
        >
          {!inDrawer ? <EarnThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <div className={styles.menuItemText}>{t('drop.earnAccount.order')}</div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* 期权订单 Option Orders */}
      {bootConfig._SITE_CONFIG_.functions.option ? (
        <Link
          href={`${KUCOIN_HOST}/order/options`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={5}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/options`, ['orders', '5'], currentLang);
          }}
        >
          {!inDrawer ? <OptionThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
          <div className={styles.menuItemText}>{t('20a06ea731ee4000aeea')}</div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      <Divider className={clsx(styles.divider, inDrawer && styles.dividerInDrawer)} />
      {/* Buy Crypto Orders 法币交易订单 */}
      {!isSub && bootConfig._SITE_CONFIG_.functions.payment && (
        <>
          <Link
            href={`${FASTCOIN_HOST}/order_list?currency=${currency}`}
            className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
            data-modid="orders"
            data-idx={4}
            lang={currentLang}
            onClick={() => {
              composeSpmAndSave(`${FASTCOIN_HOST}/order_list?currency=${currency}`, ['orders', '5'], currentLang);
            }}
          >
            {!inDrawer ? <BuycryptoThinIcon className={styles.textIcon} size={20} /> : <MenuItemDot />}
            <div className={styles.menuItemText}>{t('fiatCurreny.trade.order')}</div>
            {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
          </Link>
          <Divider className={clsx(styles.divider, inDrawer && styles.dividerInDrawer)} />
        </>
      )}
      {/* Spot Trade History 币币交易历史 */}
      {bootConfig._SITE_CONFIG_.functions.spot ? (
        <Link
          href={`${KUCOIN_HOST}/order/trade/history`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={!isSub ? '6' : '5'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/trade/history`, ['orders', !isSub ? '6' : '5'], currentLang);
          }}
        >
          {/* <img className={clsx(styles.textIcon, styles.tradeIcon)} src={TradeHistory} alt="TradeHistory" /> */}
          {inDrawer && <MenuItemDot />}
          <div className={clsx([styles.menuItemText, styles.historyText, inDrawer && styles.historyTextInDrawer])}>
            {t('drop.coin.history')}
          </div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* Margin Trade History 杠杆成交历史 */}
      {bootConfig._SITE_CONFIG_.functions.margin ? (
        <Link
          href={`${KUCOIN_HOST}/order/margin/history`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={!isSub ? '7' : '6'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/margin/history`, ['orders', !isSub ? '7' : '6'], currentLang);
          }}
        >
          {/* <img className={clsx(styles.textIcon, styles.tradeIcon)} src={TradeHistory} alt="TradeHistory" /> */}
          {inDrawer && <MenuItemDot />}
          <div className={clsx([styles.menuItemText, styles.historyText, inDrawer && styles.historyTextInDrawer])}>
            {t('drop.lever.history')}
          </div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {bootConfig._SITE_CONFIG_.functions.futures ? (
        <Link
          href={`${KUCOIN_HOST}/order/futures/trade-history`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={!isSub ? '8' : '7'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/order/futures/trade-history`,
              ['orders', !isSub ? '8' : '7'],
              currentLang
            );
          }}
        >
          {/* <img className={clsx(styles.textIcon, styles.tradeIcon)} src={TradeHistory} alt="TradeHistory" /> */}
          {inDrawer && <MenuItemDot />}
          <div className={clsx([styles.menuItemText, styles.historyText, inDrawer && styles.historyTextInDrawer])}>
            {t('drop.aggrement.history')}
          </div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
      {/* Options Trade History 期权成交历史 */}
      {bootConfig._SITE_CONFIG_.functions.option ? (
        <Link
          href={`${KUCOIN_HOST}/order/options`}
          className={clsx(styles.menuItem, inDrawer && styles.menuItemInDrawer)}
          data-modid="orders"
          data-idx={!isSub ? '9' : '8'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/options`, ['orders', !isSub ? '9' : '8'], currentLang);
          }}
        >
          {/* <img className={clsx(styles.textIcon, styles.tradeIcon)} src={TradeHistory} alt="OptionsHistory" /> */}
          {inDrawer && <MenuItemDot />}
          <div className={clsx([styles.menuItemText, styles.historyText, inDrawer && styles.historyTextInDrawer])}>
            {t('b8ed0ce55a6a4000aad0')}
          </div>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </Link>
      ) : null}
    </div>
  );
};

export default Overlay;
