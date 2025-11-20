/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useTheme, styled } from '@kux/mui';
import { useSelector, useDispatch } from 'react-redux';
import {
  ICClosePlusOutlined,
  ICAppDownloadOutlined,
  ICLanguageOutlined,
  ICBuyCryptoOutlined,
} from '@kux/icons';
import storage from '@utils/storage';
import { isRTLLanguage } from '@utils';
import { CompliantBox } from '@packages/compliantCenter';
import { useLang } from '../../hookTool';
import { namespace } from '../model';
import { namespace as pwaTipModel } from '../../PWATip/model';
import { CurrencySymbol, DOWNLOAD_CPLT_SPM } from '../config';
import { tenantConfig } from '../../tenantConfig';
import {
  HeaderClose,
  DrawerWrapper,
  DrawerHeaderWrapper,
  ContentWrapper,
  ScrollContent,
  CusDrawer,
  Hr,
  Hr2,
  Item,
  I18nItem,
  CusLink,
  ItemValue,
  Title,
  ThemeItem,
} from './styled';
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
  NoSSG,
} from '../../common/tools';
import ICtradeAddImg from '../../../static/pwa/ic2_trade_add.svg';
import UserBox from '../UserBox';
import SearchBox from '../SearchBox';
import NavUser from '../NavUser';
import NavLink from '../Nav/Nav';
import EntranceTab from '../EntranceTab';

const AddIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const H5Wrapper = styled.div`
  width: 100%;
  height: 79px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  z-index: 1;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

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
    mainTheme,
    onThemeChange,
    menuConfig = [],
    keepMounted,
    pathname,
    showWeb3EntranceTab,
  } = props;
  const theme = useTheme();
  const { t } = useLang();
  const dispatch = useDispatch();
  const isStandAlone = checkIfIsStandAlone();
  const langListMap = useSelector((state) => state[namespace].langListMap);
  const currencyList = useSelector((state) => state[namespace].currencyList);
  const isRTL = isRTLLanguage(currentLang);
  const currency = props.currency || window._DEFAULT_RATE_CURRENCY_ || 'USD';
  // 查找汇率符号
  const obj = {};
  CurrencySymbol.forEach((item) => {
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

  useEffect(() => {
    if (navStatus < 1) {
      onClose();
    }
  }, [onClose, navStatus]);

  const handleInstall = () => {
    storage.setItem('__kc_hidden_pwa_tip_time__', null);
    kcsensorsClick(['pwaAddhomescreen', '3']);
    onClose();
    dispatch({ type: `${pwaTipModel}/update`, payload: { showPwaTip: true } });
  };

  const DrawerHeaderEleMemo = useMemo(() => {
    // 如果已经登陆信息，则导航栏状态 >= 5 才展示「WEB3 入口」
    if (userInfo) {
      if (navStatus >= 5) {
        return (
          <H5Wrapper>
            {showWeb3EntranceTab && tenantConfig.showWeb3EntranceTab && (
              <NoSSG>
                <EntranceTab lang={currentLang} inDrawer />
              </NoSSG>
            )}
            <HeaderClose onClick={onClose}>
              <ICClosePlusOutlined size={12} color={theme.colors.text} />
            </HeaderClose>
          </H5Wrapper>
        );
      }
    } else if (navStatus >= 4) {
      // 如果没有登陆信息，则导航栏状态 >= 4 才展示「WEB3 入口」
      return (
        <H5Wrapper>
          {showWeb3EntranceTab && tenantConfig.showWeb3EntranceTab && (
            <NoSSG>
              <EntranceTab lang={currentLang} inDrawer />
            </NoSSG>
          )}
          <HeaderClose onClick={onClose}>
            <ICClosePlusOutlined size={12} color={theme.colors.text} />
          </HeaderClose>
        </H5Wrapper>
      );
    }

    // 如果不满足以上条件，则只渲染「关闭按钮」
    return (
      <HeaderClose onClick={onClose}>
        <ICClosePlusOutlined size={12} color={theme.colors.text} />
      </HeaderClose>
    );
  }, [userInfo, navStatus, currentLang, theme]);

  return (
    <CusDrawer
      anchor={isRTL ? 'left' : 'right'}
      show={show}
      onClose={onClose}
      colors={theme.colors}
      back={false}
      headerBorder={false}
      header={null}
      keepMounted={keepMounted}
    >
      <DrawerWrapper>
        <DrawerHeaderWrapper>{DrawerHeaderEleMemo}</DrawerHeaderWrapper>
        <ContentWrapper theme={theme}>
          {show ? (
            <ScrollContent>
              {navStatus >= 3 && tenantConfig.showSearchBox && (
                <SearchBox inDrawer lang={currentLang} />
              )}
              {!isNav && (
                <div className="userBox">
                  <UserBox {...props} inDrawer />
                </div>
              )}
              {isNav && !userInfo && (
                <div
                  className="userBox2"
                  style={{ marginTop: navStatus > 2 && navStatus <= 5 ? 24 : 0 }}
                >
                  <NavUser {...props} inDrawer navStatus={navStatus} />
                </div>
              )}
              {navStatus >= (userInfo ? 5 : 4) && isNav && (
                <div className="navLinks">
                  <NavLink {...props} inDrawer />
                  <Hr colors={theme.colors} />
                </div>
              )}
              {navStatus > 0 && isNav && (
                <div
                  className="downBox"
                  style={{ marginTop: userInfo && navStatus <= 2 ? 0 : navStatus <= 4 ? 12 : 0 }}
                >
                  <CompliantBox spm={DOWNLOAD_CPLT_SPM}>
                    <Item colors={theme.colors}>
                      <CusLink href="/download" colors={theme.colors}>
                        <ICAppDownloadOutlined size={20} />
                        <span>{t('download')}</span>
                      </CusLink>
                    </Item>
                    <Hr2 colors={theme.colors} />
                  </CompliantBox>
                  {needThemeBox && (
                    <>
                      <ThemeItem>
                        <ThemeBox
                          inDrawer
                          inTrade={inTrade}
                          onChange={onThemeChange}
                          mainTheme={mainTheme}
                        />
                      </ThemeItem>
                      <Hr2 colors={theme.colors} />
                    </>
                  )}
                  <I18nItem
                    colors={theme.colors}
                    onClick={() => handleShowDrawer('i18n', true, 'lang')}
                  >
                    <Title>
                      <ICLanguageOutlined size={20} />
                      <span>{t('language')}</span>
                    </Title>

                    <ItemValue colors={theme.colors}>
                      {
                        (langListMap[currentLang || window._DEFAULT_LANG_ || 'en_US'] || {})
                          .langName
                      }
                    </ItemValue>
                  </I18nItem>
                  {!currencyList || !currencyList.length ? null : (
                    <Item
                      colors={theme.colors}
                      onClick={() => handleShowDrawer('i18n', true, 'currency')}
                    >
                      <Title>
                        <ICBuyCryptoOutlined size={20} className="USD" />
                        <span>{t('currency')}</span>
                      </Title>
                      <ItemValue colors={theme.colors}>
                        {currency}
                        <span>({symbol[currency] || currency})</span>
                      </ItemValue>
                    </Item>
                  )}
                </div>
              )}
              {!hiddenPwaTipMenu && (
                <>
                  <Hr2 colors={theme.colors} />
                  <Item colors={theme.colors} onClick={handleInstall}>
                    <Title>
                      <AddIcon src={ICtradeAddImg} alt="KuCoin" width="20" height="20" />
                      <span>Add KuCoin to home screen</span>
                    </Title>
                  </Item>
                </>
              )}
            </ScrollContent>
          ) : null}
        </ContentWrapper>
      </DrawerWrapper>
    </CusDrawer>
  );
}
