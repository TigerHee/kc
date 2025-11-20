/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useState, FC } from 'react';
import { HookIcon, LanguageIcon } from '@kux/iconpack';
import { Segmented } from '@kux/design';
import loadable from '@loadable/component';
import clsx from 'clsx';
import { isArray, map } from 'lodash-es';
import { kcsensorsClick } from '../../../common/tools';
import LoaderComponent from '../../../components/LoaderComponent';
import { useTenantConfig } from '../../../tenantConfig';
import { useHeaderStore } from '../../model';
import useLang from 'hooks/useLang';
import styles from '../../I18nBox/styles.module.scss';
import { useTranslation } from 'tools/i18n';

const Dialog = loadable(() => import('./Dialog'));

const types = ['lang'];

export interface I18nBoxProps {
  currentLang: string;
  onLangChange?: (lang: string) => void;
  inDrawer?: boolean;
  closeI18nDrawer?: () => void;
  showType?: string;
  surportLanguages?: string[];
  inTrade?: boolean;
}

const I18nBox: FC<I18nBoxProps> = props => {
  const {
    currentLang,
    onLangChange,
    inDrawer,
    closeI18nDrawer,
    showType = '', // 显示的类型
    surportLanguages, // 支持的语言
    inTrade,
  } = props;
  const tenantConfig = useTenantConfig();
  const { t } = useTranslation('header');
  const { isRTL } = useLang();

  const langList = useHeaderStore(state => state.langList) || [];

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
        const langCode = item[0];
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
      const langCode = item[0];
      const langName = item[1];
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
        {inDrawer && <h4 className={styles.title}>{t('language')}</h4>}
        <ul className={clsx(styles.group, { langGroup: data.length >= 20 })}>
          <li className={clsx(styles.menuItem, styles.activeItem)}>
            <span>
              {_currentLang}
              <HookIcon size={20} color="var(--kux-brandGreen)" />
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

  const Title = () => {
    return (
      <div className={styles.tabsWrapper}>
        <Segmented
          defaultValue={types[0]}
          onChange={() => {}}
          options={[
            {
              label: t('language'),
              value: types[0],
            },
          ]}
        />
      </div>
    );
  };

  if (inDrawer) {
    return <div className={styles.inDrawer}>{getLang()}</div>;
  }
  const dialogProps = {
    Title,
    modalVisible,
    closeModal,
    getLang,
    t,
  };

  return (
    <React.Fragment>
      <button className={styles.wrapper} onClick={showModal} data-inspector="inspector_i18n_logo_btn">
        <LanguageIcon size={16} className="navIcon" />
      </button>
      <LoaderComponent show={modalVisible}>
        <Dialog {...dialogProps} />
      </LoaderComponent>
    </React.Fragment>
  );
};

export default I18nBox;
