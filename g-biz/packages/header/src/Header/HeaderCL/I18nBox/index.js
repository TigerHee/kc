/**
 * Owner: iron@kupotech.com
 */
import { ICHookOutlined, ICLanguageOutlined } from '@kux/icons';
import { EmotionCacheProvider, Tabs, useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import { isRTLLanguage } from '@utils';
import clsx from 'clsx';
import { isArray, map } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { kcsensorsClick } from '../../../common/tools';
import LoaderComponent from '../../../components/LoaderComponent';
import { useLang } from '../../../hookTool';
import { tenantConfig } from '../../../tenantConfig';
import { namespace } from '../../model';
import { InDrawer, TabsSpan, TabsWrapper, Wrapper } from '../../I18nBox/styled';

const Dialog = loadable(() => import('./Dialog'));

const { Tab } = Tabs;

const types = ['lang'];

const I18nBox = (props) => {
  const {
    currentLang,
    onLangChange,
    inDrawer,
    closeI18nDrawer,
    showType = '', // 显示的类型
    surportLanguages, // 支持的语言
    inTrade,
  } = props;
  const theme = useTheme();
  const { t } = useLang();

  const { langList } = useSelector((state) => state[namespace]);

  const [modalVisible, setModalVisible] = useState(false);
  const showModal = useCallback(() => {
    setModalVisible(true);
    kcsensorsClick(['langOption', '1'], {
      pagecate: showType === types[0] ? 'langOption' : 'rateOption',
    });
  }, [showType]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

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
              <ICHookOutlined size={20} color={theme.colors.primary} />
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

  const Title = () => {
    return (
      <TabsWrapper>
        <Tabs value={types[0]} size="xlarge">
          <Tab
            value={types[0]}
            label={
              <TabsSpan theme={theme} className="active">
                {t('language')}
              </TabsSpan>
            }
          />
        </Tabs>
      </TabsWrapper>
    );
  };

  if (inDrawer) {
    return <InDrawer>{getLang()}</InDrawer>;
  }
  const dialogProps = {
    Title,
    modalVisible,
    closeModal,
    getLang,
    t,
  };

  return (
    <EmotionCacheProvider isRTL={isRTLLanguage(currentLang)}>
      <Wrapper onClick={showModal} inTrade={inTrade} data-inspector="inspector_i18n_logo_btn">
        <ICLanguageOutlined size={inTrade ? 16 : 20} className="navIcon" />
      </Wrapper>
      <LoaderComponent show={modalVisible}>
        <Dialog {...dialogProps} />
      </LoaderComponent>
    </EmotionCacheProvider>
  );
};

export default I18nBox;
