/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, FC } from 'react';
import { Modal } from '@kux/design';
import { CloseIcon, LanguageIcon } from '@kux/iconpack';
import useLang from 'hooks/useLang';
import ThemeBox from '../../ThemeBox';
import UserBox from '../UserBox';
import NavUser from '../NavUser';
import { useHeaderStore } from '../../model';
import { bootConfig } from 'kc-next/boot';
import menuDrawerStyles from '../../MenuDrawer/styles.module.scss';
import styles from './styles.module.scss';
import { useTranslation } from 'tools/i18n';
import { ICClosePlusOutlined } from '@kux/icons';

interface MenuDrawerProps {
  show: boolean;
  onClose: () => void;
  handleShowDrawer: any;
  currentLang: string;
  isNav: boolean;
  userInfo: any;
  inTrade?: boolean;
  onThemeChange: (theme: string) => void;
}

function HeaderClose({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.headerClose} onClick={onClose}>
      <ICClosePlusOutlined size={12} color="var(--kux-text)" />
    </div>
  );
}

const MenuDrawer: FC<MenuDrawerProps> = props => {
  const { show, onClose, handleShowDrawer, currentLang, isNav, userInfo, inTrade, onThemeChange } = props;
  const { t } = useTranslation('header');
  const langListMap = useHeaderStore(state => state.langListMap) || {};
  const { isRTL } = useLang();

  return (
    <Modal
      drawAnchor={isRTL ? 'left' : 'right'}
      isOpen={show}
      onClose={onClose}
      showBack={false}
      headerBorder={false}
      footer={null}
      maskClosable
      drawTransform
      className={menuDrawerStyles.cusDrawer}
      style={{ maxWidth: '400px', width: '100%' }}
      header={handlers => {
        return <div className={styles.drawerHeaderWrapper}>
          <HeaderClose onClose={handlers.onClose} />
        </div>;
      }}
    >
      <div className={menuDrawerStyles.drawerWrapper}>
        <div className={menuDrawerStyles.contentWrapper}>
          {show ? (
            <div className={menuDrawerStyles.scrollContent}>
              <div
                className={menuDrawerStyles.userBox2}
              >
                <NavUser {...props} inDrawer />
              </div>
              <div
                className="downBox"
              >
                <div className={menuDrawerStyles.themeItem}>
                  <ThemeBox inDrawer inTrade={inTrade} onChange={onThemeChange} />
                </div>
                <hr className={menuDrawerStyles.hr2} />
                <div className={menuDrawerStyles.i18nItem} onClick={() => handleShowDrawer('i18n', true, 'lang')}>
                  <div className={menuDrawerStyles.title}>
                    <LanguageIcon size={20} />
                    <span>{t('language')}</span>
                  </div>

                  <div className={menuDrawerStyles.itemValue}>
                    {(langListMap[currentLang || bootConfig._DEFAULT_LANG_ || 'en_US'] || {}).langName}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default MenuDrawer;
