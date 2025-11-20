import React, { useCallback } from 'react';
import { Dialog } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import deposit_crypto_entry from '../../../../static/goldEntry/deposit_crypto_entry.svg';
import buy_crypto_entry from '../../../../static/goldEntry/buy_crypto_entry.svg';
import deposit_fiat_entry from '../../../../static/goldEntry/deposit_fiat_entry.svg';
import skip_arrow from '../../../../static/goldEntry/skip_arrow.svg';
import { addLangToPath, kcsensorsClick } from '../../../common/tools.js';

import { StyledFundWalletModal, StyledItem, WrapperIcon } from './style.js';

const Item = (props) => {
  const { icon, title, desc, type, link, locationid, lang } = props;
  const onClick = useCallback((link, locationid, lang) => {
    kcsensorsClick(['fundWindow', locationid]);
    window.location.href = addLangToPath(link, lang);
  }, []);
  return (
    <StyledItem type={type} href={link} onClick={() => onClick(link, locationid, lang)}>
      <div className="icon">
        <img src={icon} alt="" />
      </div>
      <div className="main">
        <div className="title">{title}</div>
        <div className="desc">{desc}</div>
      </div>
      <WrapperIcon>
        <img className="skip-arrow" src={skip_arrow} alt="" />
      </WrapperIcon>
    </StyledItem>
  );
};

export default function GoldEntryModal({ open, title, onCancel = () => {}, lang }) {
  const { t: _t } = useTranslation('header');

  const freshItems = [
    {
      icon: deposit_crypto_entry,
      title: _t('5fLut4WnjVFMyNhRHGrdUH'),
      desc: _t('kSaD9wEmbYcfM7MDG3sVKB'),
      type: 'primary',
      link: '/assets/coin/USDT',
      locationid: '1',
    },
    {
      icon: buy_crypto_entry,
      title: _t('oNX5MZ9ms9DY4ZPA2HTUJB'),
      desc: _t('irfLKWTyWFWq88DwHUU34w'),
      type: 'default',
      link: '/express',
      locationid: '2',
    },
    {
      icon: deposit_fiat_entry,
      title: _t('sqmEfzDPDJCs3Co3x448Uq'),
      desc: _t('qj7S5x65MM2c65DTRpFv35'),
      type: 'default',
      link: '/assets/fiat-currency/recharge',
      locationid: '3',
    },
  ];
  return (
    <Dialog title={title} size="medium" open={open} onCancel={onCancel} footer={null}>
      <StyledFundWalletModal>
        <div className="title">{_t('gYUA59WRhfWdtu4JW8Bzyc')}</div>
        <Item {...freshItems[0]} lang={lang} type="primary" />
        <div className="title mt24">{_t('rzfHFHUkXavGWjGmwpF4Qx')}</div>
        {window._SITE_CONFIG_.functions.fast_trade && <Item {...freshItems[1]} lang={lang} />}
        {window._SITE_CONFIG_.functions.fiat_deposit && <Item {...freshItems[2]} lang={lang} />}
      </StyledFundWalletModal>
    </Dialog>
  );
}
