/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { clsx, Modal } from '@kux/design';
import { AppdownloadIcon, LanguageIcon, BuyCryptoIcon } from '@kux/iconpack';
import storage from 'tools/storage';
import useLang from 'hooks/useLang';
import { CompliantBox } from 'packages/compliantCenter';
import { CurrencySymbol, DOWNLOAD_CPLT_SPM } from '../config';
import { useTenantConfig } from '../../tenantConfig';
import ThemeBox from '../ThemeBox';
import {
  isMobile,
  checkIfIsStandAlone,
  isInApp,
  isIOS,
  isIOSSupportPWA,
  isSafari,
  isChrome,
  kcsensorsClick,
} from '../../common/tools';
import ICtradeAddImg from '../../static/pwa/ic2_trade_add.svg';
import UserBox from '../UserBox';
import SearchBox from '../SearchBox';
import NavUser from '../NavUser';
import NavLink from '../Nav/Nav';
import EntranceTab from '../EntranceTab';
import Link from '../../components/Link';
import { useHeaderStore } from '../model';
import { bootConfig } from 'kc-next/boot';
import styles from './styles.module.scss';
import { useTranslation } from 'tools/i18n';
import { ICClosePlusOutlined } from '@kux/icons';

function HeaderClose({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.headerClose} onClick={onClose}>
      <ICClosePlusOutlined size={12} color="var(--kux-text)" />
    </div>
  );
}

export default function MenuDrawer(props) {
  const {
    show,
    onClose,
    handleShowDrawer,
    currentLang,
    isNav,
    userInfo,
    navStatus,
    inTrade,
    onThemeChange,
    menuConfig = [],
    keepMounted,
    pathname,
    showWeb3EntranceTab,
  } = props;
  const { t } = useTranslation('header');
  const isStandAlone = checkIfIsStandAlone();
  const isLogin = !!userInfo?.uid;
  const langListMap = useHeaderStore(state => state.langListMap) || {};
  const currencyList = useHeaderStore(state => state.currencyList);
  const updateHeader = useHeaderStore(state => state.updateHeader);
  const currency = props.currency || bootConfig._DEFAULT_RATE_CURRENCY_ || 'USD';

  const { isRTL } = useLang();
  const tenantConfig = useTenantConfig();
  // 查找汇率符号
  const obj = {};
  CurrencySymbol.forEach(item => {
    const array = item.pair.split('_');
    obj[array[0]] = item.symbol;
  });
  const symbol = JSON.parse(JSON.stringify(obj, null, 2));

  const needThemeBox = useMemo(() => {
    const configuredTheme = menuConfig.length > 0 && menuConfig.includes('theme');
    if (configuredTheme) return true;
    return false;
  }, [menuConfig]);

  // 只在首页显示侧边栏的安装PWA菜单
  const hiddenPwaTipMenu =
    isInApp ||
    isStandAlone ||
    !isMobile() ||
    !isIOS() ||
    !(isSafari() || isChrome()) ||
    (isChrome() && !isIOSSupportPWA()) ||
    pathname !== '/';

  // useEffect(() => {
  //   if (navStatus < 1) {
  //     onClose();
  //   }
  // }, [onClose, navStatus]);

  const handleInstall = () => {
    storage.setItem('__kc_hidden_pwa_tip_time__', null);
    kcsensorsClick(['pwaAddhomescreen', '3']);
    onClose();
    updateHeader?.({ showPwaTip: true });
  };

  const drawerHeaderEle = onDrawerClose => {
    // 如果已经登陆信息，则导航栏状态 >= 3 才展示「WEB3 入口」
    if (isLogin) {
      if (navStatus >= 3) {
        return (
          <div className={styles.h5Wrapper}>
            {showWeb3EntranceTab && tenantConfig.showWeb3EntranceTab && <EntranceTab lang={currentLang} inDrawer />}
            <HeaderClose onClose={onDrawerClose || onClose} />
          </div>
        );
      }
    } else if (navStatus >= 2) {
      // 如果没有登陆信息，则导航栏状态 >= 2 才展示「WEB3 入口」
      return (
        <div className={styles.h5Wrapper}>
          {showWeb3EntranceTab && tenantConfig.showWeb3EntranceTab && <EntranceTab lang={currentLang} inDrawer />}
          <HeaderClose onClose={onDrawerClose || onClose} />
        </div>
      );
    }

    // 如果不满足以上条件，则只渲染「关闭按钮」
    return <HeaderClose onClose={onDrawerClose || onClose} />;
  };

  return (
    <Modal
      drawAnchor={isRTL ? 'left' : 'right'}
      isOpen={show}
      onClose={onClose}
      drawTransform
      header={handlers => {
        return <div className={styles.drawerHeaderWrapper}>{drawerHeaderEle(handlers.onClose)}</div>;
      }}
      footer={null}
      maskClosable
      style={{ maxWidth: '400px', width: '100%' }}
      className={styles.cusDrawer}
    >
      <div className={styles.drawerWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.scrollContent}>
            {tenantConfig.showSearchBox && <SearchBox inDrawer lang={currentLang} />}
            {!isNav && (
              <div className={styles.userBox}>
                <UserBox {...props} inDrawer />
              </div>
            )}
            {isNav && !userInfo && (
              <div className={styles.userBox2}>
                <NavUser {...props} inDrawer navStatus={navStatus} />
              </div>
            )}
            {navStatus >= (isLogin ? 2 : 1) && isNav && (
              <div className={clsx(styles.navLinks, !!userInfo && styles.navLinksWithUser)}>
                <NavLink {...props} inDrawer />
                <hr className={styles.hr} />
              </div>
            )}
            {navStatus > 0 && isNav && (
              <div className={styles.downBox} style={{ marginTop: navStatus < 2 ? 12 : 0 }}>
                <CompliantBox spm={DOWNLOAD_CPLT_SPM}>
                  <div className={styles.item}>
                    <Link href="/download" className={styles.cusLink}>
                      <AppdownloadIcon size={20} />
                      <span>{t('download')}</span>
                    </Link>
                  </div>
                  <hr className={styles.hr2} />
                </CompliantBox>
                {needThemeBox && (
                  <>
                    <div className={styles.themeItem}>
                      <ThemeBox inDrawer inTrade={inTrade} onChange={onThemeChange} />
                    </div>
                    <hr className={styles.hr2} />
                  </>
                )}
                <div className={styles.i18nItem} onClick={() => handleShowDrawer('i18n', true, 'lang')}>
                  <div className={styles.title}>
                    <LanguageIcon size={20} />
                    <span>{t('language')}</span>
                  </div>

                  <div className={styles.itemValue}>
                    {(langListMap[currentLang || bootConfig._DEFAULT_LANG_ || 'en_US'] || {}).langName}
                  </div>
                </div>
                {!currencyList || !currencyList.length ? null : (
                  <div className={styles.item} onClick={() => handleShowDrawer('i18n', true, 'currency')}>
                    <div className={styles.title}>
                      <BuyCryptoIcon size={20} className="USD" />
                      <span>{t('currency')}</span>
                    </div>
                    <div className={styles.itemValue}>
                      {currency}
                      <span>({symbol[currency] || currency})</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!hiddenPwaTipMenu && (
              <>
                <hr className={styles.hr2} />
                <div className={styles.item} onClick={handleInstall}>
                  <div className={styles.title}>
                    <img className={styles.addIcon} src={ICtradeAddImg} alt="KuCoin" width="20" height="20" />
                    <span>Add KuCoin to home screen</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
