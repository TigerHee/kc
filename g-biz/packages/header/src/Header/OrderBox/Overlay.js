/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import Options from '@kux/icons/static/Options.svg';
import Finance from '../../../static/newHeader/finance.svg';
import FinanceOrder from '../../../static/newHeader/financeOrder.svg';
import Futures from '../../../static/newHeader/futures.svg';
import Margin from '../../../static/newHeader/margin.svg';
import TradeHistory from '../../../static/newHeader/tradeHistory.svg';
import TradeNav from '../../../static/newHeader/tradeNav.svg';
import { composeSpmAndSave } from '../../common/tools';
import { useLang } from '../../hookTool';
import { Divider, MenuItem, MenuItemText, OverlayWrapper } from './styled';

const Overlay = (props) => {
  const { t } = useLang();
  const { hostConfig, inDrawer, isLong_language, inTrade, currentLang, isSub, currency } = props;
  const { KUCOIN_HOST, FASTCOIN_HOST } = hostConfig;
  return (
    <OverlayWrapper inDrawer={inDrawer} isLong_language={isLong_language} inTrade={inTrade}>
      {/* Spot Orders 币币订单 */}
      {window._SITE_CONFIG_.functions.spot ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/trade`}
          data-modid="orders"
          data-idx={1}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/trade`, ['orders', '1'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={TradeNav} alt="TradeNav" />
          <MenuItemText>{t('drop.coin.order')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* Margin Orders 杠杆订单 */}
      {window._SITE_CONFIG_.functions.margin ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/margin`}
          data-modid="orders"
          data-idx={2}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/margin`, ['orders', '2'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Margin} alt="Margin" />
          <MenuItemText>{t('drop.lever.order')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* Futures Orders 合约订单 */}
      {window._SITE_CONFIG_.functions.futures ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/futures/order-history`}
          data-modid="orders"
          data-idx={3}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/order/futures/order-history`,
              ['orders', '3'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Futures} alt="Futures" />
          <MenuItemText>{t('drop.aggrement')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* 赚币订单 Earn Orders */}
      {window._SITE_CONFIG_.functions.financing ? (
        <MenuItem
          // href={`${KUCOIN_HOST}/earn-account/order`}
          href={`${KUCOIN_HOST}/earn-account/order`}
          data-modid="orders"
          data-idx={3}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/earn-account/order`, ['orders', '4'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Finance} alt="Finance" />
          <MenuItemText>{t('drop.earnAccount.order')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* 期权订单 Option Orders */}
      {window._SITE_CONFIG_.functions.option ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/options`}
          data-modid="orders"
          data-idx={5}
          onClick={() => {
            composeSpmAndSave(`${KUCOIN_HOST}/order/options`, ['orders', '5'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Options} alt="Options" />
          <MenuItemText>{t('20a06ea731ee4000aeea')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      <Divider inDrawer={inDrawer} />
      {/* Buy Crypto Orders 法币交易订单 */}
      {!isSub && window._SITE_CONFIG_.functions.payment && (
        <>
          <MenuItem
            href={`${FASTCOIN_HOST}/order_list?currency=${currency}`}
            data-modid="orders"
            data-idx={4}
            lang={currentLang}
            onClick={() => {
              composeSpmAndSave(
                `${FASTCOIN_HOST}/order_list?currency=${currency}`,
                ['orders', '5'],
                currentLang,
              );
            }}
            inDrawer={inDrawer}
          >
            <img className="textIcon" src={FinanceOrder} alt="FinanceOrder" />
            <MenuItemText>{t('fiatCurreny.trade.order')}</MenuItemText>
            {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
          </MenuItem>
          <Divider inDrawer={inDrawer} />
        </>
      )}
      {/* Spot Trade History 币币交易历史 */}
      {window._SITE_CONFIG_.functions.spot ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/trade/history`}
          data-modid="orders"
          data-idx={!isSub ? '6' : '5'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/order/trade/history`,
              ['orders', !isSub ? '6' : '5'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon tradeIcon" src={TradeHistory} alt="TradeHistory" />
          <MenuItemText>{t('drop.coin.history')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* Margin Trade History 杠杆成交历史 */}
      {window._SITE_CONFIG_.functions.margin ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/margin/history`}
          data-modid="orders"
          data-idx={!isSub ? '7' : '6'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/order/margin/history`,
              ['orders', !isSub ? '7' : '6'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon tradeIcon" src={TradeHistory} alt="TradeHistory" />
          <MenuItemText>{t('drop.lever.history')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {window._SITE_CONFIG_.functions.futures ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/futures/trade-history`}
          data-modid="orders"
          data-idx={!isSub ? '8' : '7'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/order/futures/trade-history`,
              ['orders', !isSub ? '8' : '7'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon tradeIcon" src={TradeHistory} alt="TradeHistory" />
          <MenuItemText>{t('drop.aggrement.history')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* Options Trade History 期权成交历史 */}
      {window._SITE_CONFIG_.functions.option ? (
        <MenuItem
          href={`${KUCOIN_HOST}/order/options`}
          data-modid="orders"
          data-idx={!isSub ? '9' : '8'}
          lang={currentLang}
          onClick={() => {
            composeSpmAndSave(
              `${KUCOIN_HOST}/order/options`,
              ['orders', !isSub ? '9' : '8'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon tradeIcon" src={TradeHistory} alt="OptionsHistory" />
          <MenuItemText>{t('b8ed0ce55a6a4000aad0')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
    </OverlayWrapper>
  );
};

export default Overlay;
