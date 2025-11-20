/**
 * Owner: iron@kupotech.com
 */
import { ICEyeCloseOutlined, ICEyeOpenOutlined, UnifiedTradingOutlined } from '@kux/icons';
import { cusCoinPrecision } from '@utils/math';

import React from 'react';
import { Tag } from '@kux/mui';
import Options from '@kux/icons/static/Options.svg';

import useAccountStatus from '@hooks/useAccountStatus';
import Bot from '../../../static/newHeader/bot.svg';
import Unified from '../../../static/newHeader/unified-header.svg';
import buyCryptoIcon from '../../../static/newHeader/buy_crypto.svg';
import depositIcon from '../../../static/newHeader/deposit.svg';
import Finance from '../../../static/newHeader/finance.svg';
import Follow from '../../../static/newHeader/follow.svg';
import Futures from '../../../static/newHeader/futures.svg';

import Main from '../../../static/newHeader/main.svg';
import Margin from '../../../static/newHeader/margin.svg';
import Overview from '../../../static/newHeader/overview.svg';
import TradeNav from '../../../static/newHeader/tradeNav.svg';
import { addLangToPath, composeSpmAndSave } from '../../common/tools';
import { useLang } from '../../hookTool';
import CoinCurrency from './CoinCurrency';
import { tenantConfig } from '../../tenantConfig';
import { useAbTest } from '../hooks';

import {
  AssetsCount,
  AssetsDetail,
  AssetsLoading,
  BottomMenu,
  LegalCurrency,
  MenuItem,
  MenuItemText,
  MenuTitleItem,
  MenuTitleItemText,
  OverlayWrapper,
  Tooltip,
} from './styled';

const Overlay = ({
  hostConfig,
  assetDetail,
  isLong_language,
  inDrawer,
  inTrade,
  currentLang,
  showAssets,
  changeAssetShow,
  color,
  getSubAssetsLoading,
  currency,
  onClose,
  isSub,
  userInfo,
}) => {
  const { t } = useLang();
  const { KUCOIN_HOST } = hostConfig;
  const { totalAssets: _total, balanceCurrency } = assetDetail || {};
  const totalAssets = _total || 0;
  const { showSubAccountBalanceSwitch } = assetDetail || {};

  const showFollowEntrance = useAbTest('assets_enable_follow');
  const { accountType, isHitGray } = useAccountStatus(userInfo?.uid) || {};

  const isUnified = accountType === 'UNIFIED';
  const unifiedItem = (
    <MenuItem
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
      inDrawer={inDrawer}
    >
      <div className="text">
        <img className="textIcon" src={Unified} alt="Unified" />
        <MenuItemText>{t('78a75adc071f4800ab54')}</MenuItemText>
      </div>
      {isUnified && (
        <Tag color="primary" size="small">
          {t('e7114b5e6d794000ae61')}
        </Tag>
      )}
      {!isUnified && (
        <Tag color="default" size="small">
          {t('2e281080bdd04000acc7')}
        </Tag>
      )}
    </MenuItem>
  );
  return (
    <OverlayWrapper isLong_language={isLong_language} inDrawer={inDrawer} inTrade={inTrade}>
      {!inDrawer && (
        <>
          {/* Overview资产概览  */}
          <MenuTitleItem
            href={`${KUCOIN_HOST}/assets`}
            data-ga="assets"
            data-modid="assets"
            data-idx={2}
            lang={currentLang}
            onClick={() => {
              composeSpmAndSave(`${KUCOIN_HOST}/assets`, ['assets', '2'], currentLang);
            }}
            inDrawer={inDrawer}
          >
            <AssetsDetail>
              <span>{t('asset.overview')}</span>
              {showAssets ? (
                <ICEyeOpenOutlined onClick={changeAssetShow} size={24} color={color.text40} />
              ) : (
                <ICEyeCloseOutlined onClick={changeAssetShow} size={24} color={color.text40} />
              )}
              <MenuTitleItemText>
                {showSubAccountBalanceSwitch && t('include.sub.assets')}
              </MenuTitleItemText>
            </AssetsDetail>
            {getSubAssetsLoading ? (
              <AssetsLoading>{t('5Z3YyFVMBaRusVKjJUXXmz')}</AssetsLoading>
            ) : (
              <div>
                <AssetsCount>
                  <span className="account">
                    {showAssets && balanceCurrency
                      ? cusCoinPrecision(balanceCurrency, totalAssets, true, currentLang)
                      : '***'}
                  </span>{' '}
                  <span style={{ color: color.text40 }}>{balanceCurrency}</span>
                </AssetsCount>
                <LegalCurrency>
                  {showAssets ? (
                    <CoinCurrency
                      hideLegalCurrency
                      lang={currentLang}
                      value={totalAssets}
                      coin={balanceCurrency}
                    />
                  ) : (
                    '***'
                  )}{' '}
                  {currency}
                </LegalCurrency>
              </div>
            )}

            {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
          </MenuTitleItem>
        </>
      )}
      {inDrawer ? (
        <MenuItem
          // Overview资产概览
          href={`${KUCOIN_HOST}/assets`}
          data-modid="assets"
          data-idx={10}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets`, ['assets', '10'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Overview} alt="overview" />
          <MenuItemText>{t('9mVnohzR9Sa7MMk3MoLrfJ')}</MenuItemText>
        </MenuItem>
      ) : null}

      {/* 资金账户 Funding Account */}
      {tenantConfig.showFundingAccount ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/main-account`}
          data-modid="assets"
          data-idx={3}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/main-account`, ['assets', '3'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Main} alt="ma" />
          {/* {isSub ? t('main.account') : t('drop.save.account')} */}
          <MenuItemText>{t('main.account')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {isHitGray && isUnified && unifiedItem}
      {/* 币币账户 Trading Account  */}
      {tenantConfig.showTradeAccount ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/trade-account`}
          data-modid="assets"
          data-idx={4}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/trade-account`, ['assets', '4'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={TradeNav} alt="Trade" />
          <MenuItemText>{t('trade.account')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* 杠杆账户 Margin Account */}
      {window._SITE_CONFIG_.functions.margin ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/margin-account`}
          data-modid="assets"
          data-idx={5}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/margin-account`, ['assets', '5'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Margin} alt="Margin" />
          <MenuItemText>{t('margin.margin.account')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* 合约账户 Futures Account */}
      {window._SITE_CONFIG_.functions.futures ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/futures-account`}
          data-modid="assets"
          data-idx={6}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(
              `${KUCOIN_HOST}/assets/futures-account`,
              ['assets', '6'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Futures} alt="futures" />
          <MenuItemText>{t('margin.account')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {window._SITE_CONFIG_.functions.option ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/options-account`}
          data-modid="assets"
          data-idx={9}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(
              `${KUCOIN_HOST}/assets/options-account`,
              ['assets', '9'],
              currentLang,
            );
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Options} alt="options" />
          <MenuItemText>{t('12fd427d3b4d4000a156')}</MenuItemText>
        </MenuItem>
      ) : null}
      {/* 机器人账户 Trading Bot Account */}
      {!isSub && window._SITE_CONFIG_.functions.trading_bot ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/bot-account`}
          data-modid="assets"
          data-idx={7}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/bot-account`, ['assets', '7'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Bot} alt="Bot" />
          <MenuItemText>{t('bot.account')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* 金融账户 Financial Account */}
      {!isSub && window._SITE_CONFIG_.functions.financing ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/earn-account`}
          data-modid="assets"
          data-idx={8}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/earn-account`, ['assets', '8'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Finance} alt="Finance" />
          <MenuItemText>{t('pool.earnAccount.account')}</MenuItemText>
          {/* {!inDrawer && <ArrowOutlined width="13px" height="13px" className="arrow" />} */}
        </MenuItem>
      ) : null}
      {/* 跟单账户 */}
      {showFollowEntrance && !isSub && window._SITE_CONFIG_.functions.copy_trading ? (
        <MenuItem
          href={`${KUCOIN_HOST}/assets/follow`}
          data-modid="assets"
          data-idx={9}
          lang={currentLang}
          onClick={(e) => {
            if (onClose) {
              onClose(e);
            }
            composeSpmAndSave(`${KUCOIN_HOST}/assets/follow`, ['assets', '9'], currentLang);
          }}
          inDrawer={inDrawer}
        >
          <img className="textIcon" src={Follow} alt="Follow" />
          <MenuItemText>{t('assets.overview.menu.follow')}</MenuItemText>
        </MenuItem>
      ) : null}
      {isHitGray && !isUnified && unifiedItem}
      {!isSub && (
        <BottomMenu inDrawer={inDrawer}>
          {/* Buy Crypto */}
          {window._SITE_CONFIG_.functions.fast_trade ? (
            <Tooltip title={t('newheader.buy.crypto.tips')} placement="top" enterDelay={3000}>
              <a
                href={addLangToPath(`${KUCOIN_HOST}/express`, currentLang)}
                className="item"
                data-ga="assets"
                data-modid="assets"
                data-idx={9}
                lang={currentLang}
                onClick={() => {
                  composeSpmAndSave(`${KUCOIN_HOST}/express`, ['assets', '9'], currentLang);
                }}
              >
                <span>{t('newheader.buy.crypto')}</span>
                <img src={buyCryptoIcon} alt="buy" />
              </a>
            </Tooltip>
          ) : null}
          {/* Deposit */}
          {tenantConfig.showDepositAccount ? (
            <Tooltip title={t('newheader.deposit.tips')} placement="top" enterDelay={3000}>
              <a
                href={addLangToPath(`${KUCOIN_HOST}/assets/coin`, currentLang)}
                className="item itemLeft"
                data-ga="assets"
                data-modid="assets"
                data-idx={10}
                lang={currentLang}
                onClick={() => {
                  composeSpmAndSave(`${KUCOIN_HOST}/assets/coin`, ['assets', '10'], currentLang);
                }}
              >
                <span>{t('newheader.deposit')}</span>

                <img src={depositIcon} alt="deposit" />
              </a>
            </Tooltip>
          ) : null}
        </BottomMenu>
      )}
    </OverlayWrapper>
  );
};

export default Overlay;
