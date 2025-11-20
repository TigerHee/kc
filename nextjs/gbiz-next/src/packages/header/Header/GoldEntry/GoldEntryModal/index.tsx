import React, { useCallback, FC } from 'react';
import clsx from 'clsx';
import { Modal } from '@kux/design';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import { BuycryptoThinIcon, DepositfiatThinIcon, DepositThinIcon } from '@kux/iconpack';
import skip_arrow from '../../../static/goldEntry/skip_arrow.svg';
import { kcsensorsClick } from '../../../common/tools.js';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';

interface IconProps {
  size: number;
  className: string;
}
interface ItemProps {
  Icon: React.ComponentType<IconProps>;
  title: string;
  desc: string;
  type: string;
  link: string;
  locationid: string;
  lang: string;
}

const Item: FC<ItemProps> = props => {
  const { Icon, title, desc, type, link, locationid, lang } = props;
  const onClick = useCallback((link, locationid, lang) => {
    kcsensorsClick(['fundWindow', locationid]);
    window.location.href = addLangToPath(link);
  }, []);
  return (
    <div
      className={styles.styledItem}
      style={{
        backgroundColor: type === 'primary' ? 'var(--color-primary4)' : 'var(--color-cover2)',
        border: type === 'primary' ? '1px solid var(--color-primary20)' : 0,
      }}
      onClick={() => onClick(link, locationid, lang)}
    >
      <Icon size={28} className={styles.icon} />
      <div className={styles.main}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
      <div className={styles.wrapperIcon}>
        <img className={styles.skipArrow} src={skip_arrow} alt="" />
      </div>
    </div>
  );
};

interface GoldEntryModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  lang: string;
}

const GoldEntryModal: FC<GoldEntryModalProps> = ({ open, title, onCancel = () => {}, lang }) => {
  const { t: _t } = useTranslation('header');

  const freshItems = [
    {
      Icon: DepositThinIcon,
      title: _t('5fLut4WnjVFMyNhRHGrdUH'),
      desc: _t('kSaD9wEmbYcfM7MDG3sVKB'),
      type: 'primary',
      link: '/assets/coin',
      locationid: '1',
    },
    {
      Icon: BuycryptoThinIcon,
      title: _t('oNX5MZ9ms9DY4ZPA2HTUJB'),
      desc: _t('irfLKWTyWFWq88DwHUU34w'),
      type: 'default',
      link: '/express',
      locationid: '2',
    },
    {
      Icon: DepositfiatThinIcon,
      title: _t('sqmEfzDPDJCs3Co3x448Uq'),
      desc: _t('qj7S5x65MM2c65DTRpFv35'),
      type: 'default',
      link: '/assets/fiat-currency/recharge',
      locationid: '3',
    },
  ];
  return (
    <Modal title={title} size="medium" isOpen={open} onClose={onCancel} footer={null}>
      <div className={styles.styledFundWalletModal}>
        <div className={styles.title}>{_t('gYUA59WRhfWdtu4JW8Bzyc')}</div>
        <Item {...freshItems[0]} lang={lang} type="primary" />
        <div className={clsx(styles.title, styles.mt24)}>{_t('rzfHFHUkXavGWjGmwpF4Qx')}</div>
        {bootConfig._SITE_CONFIG_.functions.fast_trade && <Item {...freshItems[1]} lang={lang} />}
        {bootConfig._SITE_CONFIG_.functions.fiat_deposit && <Item {...freshItems[2]} lang={lang} />}
      </div>
    </Modal>
  );
};

export default GoldEntryModal;
