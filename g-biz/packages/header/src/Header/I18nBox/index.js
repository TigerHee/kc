/**
 * Owner: iron@kupotech.com
 */
import { ICLanguageOutlined } from '@kux/icons';
import { EmotionCacheProvider, Tabs, useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import { isRTLLanguage } from '@utils';
import clsx from 'clsx';
import { isArray, map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NoSSG, kcsensorsClick } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import { useLang } from '../../hookTool';
import { CurrencySymbol } from '../config';
import { tenantConfig } from '../../tenantConfig';
import { namespace } from '../model';
import { InDrawer, TabsSpan, TabsWrapper, Wrapper } from './styled';

const Dialog = loadable(() => import('./Dialog'));

const { Tab } = Tabs;

const types = ['lang', 'currency'];

const I18nBox = (props) => {
  const {
    currentLang,
    currency,
    onCurrencyChange,
    onLangChange,
    inDrawer,
    closeI18nDrawer,
    type = types[0],
    showType = '', // 显示的类型
    surportLanguages, // 支持的语言
    outerCurrencies = undefined, // 使用外部的currenc 数据，减少请求
    inTrade,
    simplify,
  } = props;
  const theme = useTheme();
  const { t } = useLang();

  const { langList, currencyList } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState(types[0]);

  const showModal = useCallback(() => {
    setModalVisible(true);
    setTab(showType === types[0] ? types[0] : types[1]);
    kcsensorsClick([showType === types[0] ? 'langOption' : 'rateOption', '1'], {
      pagecate: showType === types[0] ? 'langOption' : 'rateOption',
    });
  }, [showType]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const tabChange = useCallback((val) => {
    setTab(val);
  }, []);

  // cf 未命中 ip 国家限制，但是 ucenter 返回的语言列表过滤了该语言（ip 国家限制）
  // header 语言选择做的兜底处理，为后置重定向（会先满足 storage 场景的语言重定向）
  // 当前访问的该语言子路径需要重定向
  useEffect(() => {
    // 只有主站才会进入这个逻辑
    if (tenantConfig.isRestrictSiteLang) {
      if (!window.ipRestrictCountry && langList.length !== 0 && currentLang) {
        // currentLang 为当前语言子路径取得的结果，即只有当前语言子路径不在语言列表才会进入下面的判断
        // 英语下的路由 /xxx currentLang => en_US; 即不合法的语言子路径不会进入下面的判断（这里前提是不可能不反回英语）
        if (!langList.find(([langCode]) => langCode === currentLang)) {
          const base =
            window.__KC_LANGUAGES_BASE_MAP__.langToBase[currentLang] || window._DEFAULT_LOCALE_;
          // 但是万一语言列表没有英语，这里也不对英语去再重定向到英语
          if (base !== (window._DEFAULT_LOCALE_ || 'en')) {
            const nextPath = window.location.pathname.replace(`/${base}`, '');
            const nextSearch = window.location.search
              ? `${window.location.search}&x=${currentLang}`
              : `?x=${currentLang}`;
            const nextUrl = `${window.location.origin}${nextPath}${nextSearch}`;
            window.location.replace(nextUrl);
          }
        }
      }
    }
  }, [langList, currentLang]);

  useEffect(() => {
    // 如果未使用外部数据则使用原本请求
    dispatch({
      type: `${namespace}/pullRates`,
      payload: {
        currencyListData: outerCurrencies,
      },
    });
  }, [outerCurrencies]);

  useEffect(() => {
    if (currency) dispatch({ type: `${namespace}/pullPrices`, payload: { currency } });
  }, [currency]);

  const handleCurrencyChange = (currency) => {
    if (closeI18nDrawer) {
      closeI18nDrawer();
    }
    onCurrencyChange && onCurrencyChange(currency);
    closeModal();
  };

  const handleLangChange = (item) => {
    if (inDrawer && closeI18nDrawer) {
      closeI18nDrawer();
    }
    onLangChange && onLangChange(item[0]);
  };
  // 根据传入的 surportLanguages 过滤出支持的语种，不传或为空时使用全语种
  const filterSurportLanguages = () => {
    let data = langList;
    if (surportLanguages && isArray(surportLanguages) && surportLanguages.length > 0) {
      data = langList.filter((item) => {
        const [langCode] = item;
        if (surportLanguages.find((ele) => ele === langCode)) {
          return item;
        }
        return null;
      });
    }
    return data;
  };

  const getLang = () => {
    let _currentLang = currentLang;
    const _languages = filterSurportLanguages();
    const data = _languages.filter((item) => {
      const [langCode, langName] = item;
      if (langCode === currentLang) {
        _currentLang = langName;
      }
      // 只有主站走这个逻辑
      // CF 命中国家 ip 限制但 ucenter 返回该国家语言，再过滤一次
      if (tenantConfig.isRestrictSiteLang) {
        if (window.ipRestrictCountry === langCode) {
          return false;
        }
      }
      return langCode !== currentLang;
    });
    if (!langList || !langList.length) {
      return null;
    }

    return (
      <>
        {inDrawer && <h4 className="title">{t('language')}</h4>}
        <ul className={clsx('group', { langGroup: data.length >= 20 })}>
          <li className="menuItem activeItem">
            <span>
              {_currentLang}
            </span>
          </li>
          {map(data, (item) => {
            return (
              <li key={item[0]}>
                <button type="button" onClick={() => handleLangChange(item)} className="menuItem">
                  {item[1]}
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  const getCurrency = () => {
    const obj = {};
    CurrencySymbol.forEach((item) => {
      const array = item.pair.split('_');
      obj[array[0]] = item.symbol;
    });

    const data = currencyList.filter((item) => {
      // if (isTrSite) {
      if (tenantConfig.currencyWhiteList?.length) {
        return tenantConfig.currencyWhiteList.includes(item) && item !== currency;
      }
      return item !== currency;
    });
    if (!currencyList || !currencyList.length) {
      return null;
    }
    const symbol = JSON.parse(JSON.stringify(obj, null, 2));
    return (
      <>
        {inDrawer && <h4 className="title">{t('currency')}</h4>}
        <ul className="group currencyGroup">
          <li className="menuItem activeItem">
            <span>
              {currency}-{symbol[currency] || currency}
            </span>
          </li>
          {map(data, (item) => {
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => handleCurrencyChange(item)}
                  className="menuItem"
                >
                  {item}-{symbol[item] || item}
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  const Title = () => {
    return (
      <TabsWrapper>
        <Tabs value={tab} onChange={(e, v) => tabChange(v)} size="xlarge">
          <Tab
            value={types[0]}
            label={
              <TabsSpan theme={theme} className={clsx(tab === types[0] ? 'active' : '')}>
                {t('language')}
              </TabsSpan>
            }
          />
          {!currencyList || !currencyList.length || simplify ? null : (
            <Tab
              label={
                <TabsSpan theme={theme} className={clsx(tab === types[1] ? 'active' : '')}>
                  {t('currency')}
                </TabsSpan>
              }
              value={types[1]}
            />
          )}
        </Tabs>
      </TabsWrapper>
    );
  };

  if (inDrawer) {
    return <InDrawer>{type === types[0] ? getLang() : getCurrency()}</InDrawer>;
  }
  const dialogProps = {
    Title,
    modalVisible,
    closeModal,
    tab,
    getCurrency,
    getLang,
    t,
  };

  return (
    <EmotionCacheProvider isRTL={isRTLLanguage(currentLang)}>
      <Wrapper onClick={showModal} inTrade={inTrade} data-inspector="inspector_i18n_logo_btn">
        {showType === types[0] ? (
          <ICLanguageOutlined size={inTrade ? 16 : 20} className="navIcon" />
        ) : (
          <NoSSG>
            <span>{currency}</span>
          </NoSSG>
        )}
      </Wrapper>
      <LoaderComponent show={modalVisible}>
        <Dialog {...dialogProps} />
      </LoaderComponent>
    </EmotionCacheProvider>
  );
};

export default I18nBox;
