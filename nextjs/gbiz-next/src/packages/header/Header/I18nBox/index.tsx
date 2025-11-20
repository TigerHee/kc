/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
import { HookIcon } from '@kux/iconpack';
import LanguageCurrencyIconLight from '../../static/newHeader/lang_currency_light.svg';
import LanguageCurrencyIconDark from '../../static/newHeader/lang_currency_dark.svg';
import LanguageCurrencyIconHover from '../../static/newHeader/lang_currency_hover.svg';
import { Segmented } from '@kux/design';
import loadable from '@loadable/component';
import clsx from 'clsx';
import { isArray, map } from 'lodash-es';
import { kcsensorsClick } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import { CurrencySymbol } from '../config';
import { useTenantConfig } from '../../tenantConfig';
import { useHeaderStore } from '../model';
import { useTranslation } from 'tools/i18n';
import { langToLocale } from 'kc-next/i18n';
import { bootConfig } from 'kc-next/boot';
import styles from './styles.module.scss';
import { usePageProps } from 'provider/PageProvider';

const Dialog = loadable(() => import('./Dialog'));

const types = ['lang', 'currency'];

interface I18nBoxProps {
  currentLang: string;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
  onLangChange?: (lang: string) => void;
  inDrawer: boolean;
  closeI18nDrawer: () => void;
  type?: string;
  showType?: string;
  surportLanguages?: string[];
  outerCurrencies?: any;
  simplify?: boolean;
}

const I18nBox: FC<I18nBoxProps> = props => {
  const {
    currentLang,
    currency = 'USD',
    onCurrencyChange,
    onLangChange,
    inDrawer,
    closeI18nDrawer,
    type = types[0],
    showType = '', // 显示的类型
    surportLanguages, // 支持的语言
    outerCurrencies = undefined, // 使用外部的currenc 数据，减少请求
    simplify,
  } = props;
  const { t } = useTranslation('header');
  const { theme } = usePageProps();
  const tenantConfig = useTenantConfig();

  const langList = (useHeaderStore(state => state.langList) as [string, string][]) || [];
  const currencyList = useHeaderStore(state => state.currencyList) || [];
  const pullRates = useHeaderStore(state => state.pullRates);
  const pullPrices = useHeaderStore(state => state.pullPrices);
  const [isHover, setIsHover] = useState(false);

  const imgSrc = useMemo(() => {
    if (isHover) {
      return LanguageCurrencyIconHover;
    }
    return theme === 'light' ? LanguageCurrencyIconLight : LanguageCurrencyIconDark;
  }, [isHover, theme]);

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

  const tabChange = useCallback(val => {
    setTab(val);
  }, []);

  // cf 未命中 ip 国家限制，但是 ucenter 返回的语言列表过滤了该语言（ip 国家限制）
  // header 语言选择做的兜底处理，为后置重定向（会先满足 storage 场景的语言重定向）
  // 当前访问的该语言子路径需要重定向
  useEffect(() => {
    // 只有主站才会进入这个逻辑
    if (tenantConfig.isRestrictSiteLang) {
      // TODO: boot 需要新增 ipRestrictCountry
      if (typeof window !== 'undefined' && !window.ipRestrictCountry && langList.length !== 0 && currentLang) {
        // currentLang 为当前语言子路径取得的结果，即只有当前语言子路径不在语言列表才会进入下面的判断
        // 英语下的路由 /xxx currentLang => en_US; 即不合法的语言子路径不会进入下面的判断（这里前提是不可能不反回英语）
        if (!langList.find(([langCode]) => langCode === currentLang)) {
          const base = langToLocale(currentLang) || bootConfig._DEFAULT_LOCALE_;
          // 但是万一语言列表没有英语，这里也不对英语去再重定向到英语
          if (base !== (bootConfig._DEFAULT_LOCALE_ || 'en')) {
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
    pullRates?.({ currencyListData: outerCurrencies });
  }, [outerCurrencies]);

  useEffect(() => {
    if (currency) pullPrices?.({ currency });
  }, [currency]);

  const handleCurrencyChange = currency => {
    if (closeI18nDrawer) {
      closeI18nDrawer();
    }
    onCurrencyChange && onCurrencyChange(currency);
    closeModal();
  };

  const handleLangChange = item => {
    if (inDrawer && closeI18nDrawer) {
      closeI18nDrawer();
    }
    onLangChange && onLangChange(item[0]);
  };
  // 根据传入的 surportLanguages 过滤出支持的语种，不传或为空时使用全语种
  const filterSurportLanguages = () => {
    let data = langList;
    if (surportLanguages && isArray(surportLanguages) && surportLanguages.length > 0) {
      data = langList.filter(item => {
        const [langCode] = item;
        if (surportLanguages.find(ele => ele === langCode)) {
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
    const data = _languages.filter(item => {
      const [langCode, langName] = item;
      if (langCode === currentLang) {
        _currentLang = langName;
      }
      // 只有主站走这个逻辑
      // CF 命中国家 ip 限制但 ucenter 返回该国家语言，再过滤一次
      if (tenantConfig.isRestrictSiteLang) {
        if (typeof window !== 'undefined' && window.ipRestrictCountry === langCode) {
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
        {inDrawer && (
          <h4 className={styles.title}>
            <span>{t('language')}</span>
          </h4>
        )}
        <ul className={clsx(styles.group, { langGroup: data.length >= 20 })}>
          <li className={clsx(styles.menuItem, styles.activeItem)}>
            <span>
              <span>
                {_currentLang}
              </span>
              <HookIcon size={20} color="var(--kux-text)" />
            </span>
          </li>
          {map(data, item => {
            return (
              <li key={item[0]}>
                <button type="button" onClick={() => handleLangChange(item)} className={styles.menuItem}>
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
    CurrencySymbol.forEach(item => {
      const array = item.pair.split('_');
      obj[array[0]] = item.symbol;
    });

    const data = currencyList.filter(item => {
      // if (isTrSite) {
      if (tenantConfig.currencyWhiteList?.length) {
        return tenantConfig.currencyWhiteList.includes(item) && item !== currency;
      }
      return item !== currency;
    });

    if (!currencyList || !currencyList.length) {
      return '';
    }
    const symbol = JSON.parse(JSON.stringify(obj, null, 2));
    return (
      <>
        {inDrawer && (
          <h4 className={styles.title}>
            <span>{t('currency')}</span>
          </h4>
        )}
        <ul className={clsx(styles.group, 'currencyGroup')}>
          <li className={clsx(styles.menuItem, styles.activeItem)}>
            <span>
              {currency}-{symbol[currency] || currency}
            </span>
          </li>
          {map(data, item => {
            return (
              <li key={item}>
                <button type="button" onClick={() => handleCurrencyChange(item)} className={styles.menuItem}>
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
    const options = [
      { label: t('language'), value: types[0] },
      { label: t('currency'), value: types[1] },
    ];
    if (!currencyList || !currencyList.length || simplify) {
      options.pop();
    }
    return (
      <Segmented
        defaultValue={tab}
        onChange={tabChange}
        options={options}
        size="large"
        variant="plain"
        className={styles.segmented}
      />
    );
  };

  if (inDrawer) {
    return <div className={styles.inDrawer}>{type === types[0] ? getLang() : getCurrency()}</div>;
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
    <React.Fragment>
      <div
        className={styles.wrapper}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={showModal}
        data-inspector="inspector_i18n_logo_btn"
      >
        {/* {showType === types[0] ? <LanguageIcon size={16} className="navIcon" /> : <span>{currency}</span>} */}
        {/* <LanguageCurrencyIcon className={styles.languageCurrencyIcon} /> */}
        <img src={imgSrc} className={styles.languageCurrencyIcon} alt="language_currency" />
      </div>
      <LoaderComponent show={modalVisible}>
        <Dialog {...dialogProps} />
      </LoaderComponent>
    </React.Fragment>
  );
};

export default I18nBox;
