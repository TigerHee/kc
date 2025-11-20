/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Modal } from '@kux/design';
import I18nBox from '../I18nBox';
import useLang from 'hooks/useLang';
import styles from './styles.module.scss';
import { ICClosePlusOutlined } from '@kux/icons';
interface I18nDrawerProps {
  show: boolean;
  type: string;
  onClose: () => void;
  keepMounted?: boolean;
  currentLang: string;
}

function HeaderClose({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.headerCloseWrapper} onClick={onClose}>
      <div className={styles.headerClose}>
        <ICClosePlusOutlined size={12} color="var(--kux-text)" />
      </div>
    </div>
  );
}

export default function I18nDrawer({
  show,
  type = 'lang',
  onClose,
  keepMounted,
  currentLang,
  ...rest
}: I18nDrawerProps) {
  const { isRTL } = useLang();

  return (
    <Modal
      drawAnchor={isRTL ? 'left' : 'right'}
      isOpen={show}
      onClose={onClose}
      showBack={false}
      headerBorder={false}
      drawTransform
      header={() => null}
      footer={() => null}
      style={{ maxWidth: '400px', width: '100%' }}
      className={styles.cusDrawer}
    >
        <HeaderClose onClose={onClose} />
        {show ? (
          <I18nBox inDrawer type={type} {...rest} closeI18nDrawer={onClose} currentLang={currentLang} />
        ) : (
          <span />
        )}
    </Modal>
  );
}
