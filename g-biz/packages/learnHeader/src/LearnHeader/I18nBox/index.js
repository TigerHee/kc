/**
 * Owner: tom@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICLanguageOutlined, ICHookOutlined } from '@kux/icons';
import { Tabs, useTheme } from '@kux/mui';
import { ClassNames } from '@emotion/react';
import clsx from 'clsx';
import { isArray, map } from 'lodash';
import { CurrencySymbol } from '../config';
import { namespace } from '../model';
import { useLang } from '../../hookTool';
import NoSSGModal from '../NoSSGModal';
import { NoSSG, kcsensorsClick } from '../../common/tools';

const { Tab } = Tabs;
const types = ['lang', 'currency'];
const useStyles = ({ color }) => {
  return {
    wrapper: `
      display: flex;
      align-items: center;
      justify-content: center;
      background-clip: padding-box !important;
      width: 40px;
      height: 40px;
      background: ${color.cover4};
      border-radius: 20px;
      [dir='rtl'] & {
        margin-left: 0;
        margin-right: 12px;
      }
      svg {
        color: ${color.text};
      }
      span {
        color: ${color.text};
        font-weight: 600;
        font-size: 14px;
      }
      &:hover {
        svg,
        span {
          color: ${color.primary};
        }
      }
    `,
    tabsWrapper: `
      .KuxTabs-indicator {
        display: none;
      }
    `,
    dialogWrapper: `
    .KuxModalHeader-root {
      .KuxModalHeader-close {
        top: 24px !important;
      }
    }
    .KuxDialog-content {
      padding: 0;
      border-radius: 0 0 20px 20px;
    }
    `,
    overlayWrapper: `
      min-width: 340px;
      height: 530px;
      display: flex;
      background: ${color.layer};
      flex-direction: column;

      & .group {
        height: 480px;
        flex-flow: wrap;
        display: flex;
        overflow: auto;
        align-content: flex-start;
        padding-left: 20px;
        &::-webkit-scrollbar {
          width: 3px;
          height: 3px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background: ${color.text20};
        }
        & .title {
          color: ${color.text60};
          padding: 8px 48px;
          font-size: 12px;
          line-height: 20px;
        }
        & .menuItem {
          padding: 13px 12px;
          color: ${color.text};
          display: flex;
          align-items: center;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          width: 182px;
          height: 48px;
          margin-right: 16px;
          margin-bottom: 8px;
          border-radius: 8px;
          & span {
            position: relative;
          }
          &:hover {
            background: ${color.cover2};
          }
          & .iconCurrency {
            margin-right: 8px;
            margin-left: 4px;
          }
        }
        & .activeItem {
          color: ${color.primary};
          span {
            display: flex;
            svg {
              margin-left: 16px;
              [dir='rtl'] & {
                margin-left: 0;
                margin-right: 16px;
              }
            }
          }
          & img {
            position: absolute;
            top: 50%;
            right: -18px;
            transform: translate3d(0, -50%, 0);
          }
        }
      }
    `,
    content: `
      width: 100%;
      overflow: auto;
  `,
    overlayTitle: `
      font-size: 14px;
      line-height: 130%;
      color: ${color.text40};
      margin: 0px 32px 12px 32px;
    `,
    inDrawer: `
      font-size: 14px;
      line-height: 22px;
      color: ${color.text};
      padding-bottom: 100px;
      .group {
        margin-top: 12px;
        .title {
          color: ${color.text};
          margin: 20px 32px;
          font-size: 20px;
          font-weight: 500;
        }
        .menuItem {
          padding: 6px 32px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          color: ${color.text};
          &.activeItem {
            flex-direction: row-reverse;
            & span {
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
          }
          &:hover {
            background: ${color.cover4};
          }
        }
      }
    `,
  };
};

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
    // className = '',
    surportLanguages, // 支持的语言
  } = props;
  const theme = useTheme();
  const classes = useStyles({ color: theme.colors });
  const { t } = useLang();

  const { langList, currencyList } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState(types[0]);

  const showModal = useCallback(() => {
    setModalVisible(true);
    setTab(showType === types[0] ? types[0] : types[1]);
    showType === types[0] && kcsensorsClick(['language', '1']);
  }, [showType]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // cf 未命中 ip 国家限制，但是 ucenter 返回的语言列表过滤了该语言（ip 国家限制）
  // header 语言选择做的兜底处理，为后置重定向（会先满足 storage 场景的语言重定向）
  // 当前访问的该语言子路径需要重定向
  useEffect(() => {
    if (window._BRAND_SITE_ === 'KC' || !window._BRAND_SITE_) {
      if (!window.ipRestrictCountry && langList.length !== 0 && currentLang) {
        // currentLang 为当前语言子路径取得的结果，即只有当前语言子路径不在语言列表才会进入下面的判断
        // 英语下的路由 /xxx currentLang => en_US; 即不合法的语言子路径不会进入下面的判断（这里前提是不可能不反回英语）
        if (!langList.find(([langCode]) => langCode === currentLang)) {
          const base = currentLang === 'zh_HK' ? 'zh-hant' : currentLang.split('_')[0];
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
    if (currency) dispatch({ type: `${namespace}/pullPrices`, payload: { currency } });
  }, [currency, dispatch]);

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
      // CF 命中国家 ip 限制但 ucenter 返回该国家语言，再过滤一次
      if (window._BRAND_SITE_ === 'KC' || !window._BRAND_SITE_) {
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
      <div className={clsx('group', { 'langGroup': data.length >= 20 })}>
        {inDrawer && <div className="title">{t('language')}</div>}
        <div className="menuItem activeItem">
          <span>
            {_currentLang}
            <ICHookOutlined size={20} color={theme.colors.primary} />
          </span>
        </div>
        {map(data, (item) => {
          return (
            <div key={item[0]} onClick={() => handleLangChange(item)} className="menuItem">
              <span>{item[1]}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getCurrency = () => {
    const obj = {};
    CurrencySymbol.forEach((item) => {
      const array = item.pair.split('_');
      obj[array[0]] = item.symbol;
    });

    const data = currencyList.filter((item) => {
      return item !== currency;
    });
    if (!currencyList || !currencyList.length) {
      return null;
    }
    const symbol = JSON.parse(JSON.stringify(obj, null, 2));
    return (
      <div className="group currencyGroup">
        {inDrawer && <div className="title">{t('currency')}</div>}
        <div className="menuItem activeItem">
          <span>
            {currency}-{symbol[currency] || currency}
            <ICHookOutlined size={20} color={theme.colors.primary} />
          </span>
        </div>
        {map(data, (item) => {
          return (
            <div key={item} onClick={() => handleCurrencyChange(item)} className="menuItem">
              <span>
                {item}-{symbol[item] || item}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const Title = () => {
    return (
      <ClassNames>
        {({ css }) => (
          <div className={css(classes.tabsWrapper)}>
            <Tabs value={tab} size="xlarge">
              <Tab value={types[0]} label={<span>{t('language')}</span>} />
            </Tabs>
          </div>
        )}
      </ClassNames>
    );
  };

  if (inDrawer) {
    return (
      <ClassNames>
        {({ css }) => (
          <div className={css(classes.inDrawer)}>
            {type === types[0] ? getLang() : getCurrency()}
          </div>
        )}
      </ClassNames>
    );
  }

  return (
    <ClassNames>
      {({ css }) => (
        <>
          <div className={css(classes.wrapper)} onClick={showModal}>
            {showType === types[0] ? (
              <ICLanguageOutlined size="20" className="navIcon" />
            ) : (
              <NoSSG>
                <span>{currency}</span>
              </NoSSG>
            )}
          </div>
          <NoSSGModal
            maskClosable
            showCloseX
            footer={<span />}
            title={<Title />}
            size="large"
            open={modalVisible}
            onCancel={closeModal}
            wrapClassName={css(classes.dialogWrapper)}
            className={css(classes.dialogWrapper)}
          >
            {tab === types[0] ? (
              <div className={css(classes.overlayWrapper)}>
                <div className={css(classes.overlayTitle)}>{t('newheader.select.lang')}</div>
                {getLang()}
              </div>
            ) : (
              <div className={css(classes.overlayWrapper)}>
                <div className={css(classes.overlayTitle)}>{t('newheader.select.currency')}</div>
                <div className={css(classes.content)}>{getCurrency()}</div>
              </div>
            )}
          </NoSSGModal>
        </>
      )}
    </ClassNames>
  );
};

export default I18nBox;
