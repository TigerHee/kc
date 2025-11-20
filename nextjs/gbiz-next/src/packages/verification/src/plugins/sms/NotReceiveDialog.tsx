/**
 * Owner: vijay.zhou@kupotech.com
 * 从 packages/entrance/src/components/NewVoiceCode/NotReceiveDialog.js 迁移过来
 */
import React from 'react';
import { Button, Modal } from '@kux/design';
import useLang from '../../hooks/useLang';
import styles from './styles.module.scss';

interface DidNotReceiveCodeProps {
  open: boolean;
  isSupportVoice: boolean;
  onSend: () => void;
  onClose: () => void;
  phone: string;
  countryCode: string;
  disabled: boolean;
  countTimer: number;
}

/**
 * @param    {Boolean}   open    弹窗打开/关闭
 * @param    {Function}  onSend   发送语音验证
 * @param    {Boolean}   isSupportVoice   是否支持语音验证
 * @param    {Function}  onClose 关闭弹窗
 * @param    {String}    phone 手机号
 */
const DidNotReceiveCode = ({
  open = false,
  isSupportVoice = false,
  onSend = () => {},
  onClose = () => {},
  phone = '',
  countryCode,
  disabled,
  countTimer,
}: DidNotReceiveCodeProps) => {
  const { t } = useLang();

  return (
    <Modal
      maskClosable
      isOpen={open}
      size="medium"
      title={t('newsignup.phone.ask')}
      mobileTransform
      footerBorder
      footer={<div className={styles.footer}>
        {isSupportVoice && <Button type="text" disabled={disabled} onClick={onSend}>{`${t('6Vkjuzgbz2LvrjQDdRaevp')} ${countTimer ? ` ${countTimer}s` : ''}`}</Button>}
        <Button type="primary" onClick={onClose}>{t('a4CTBzVQA53tTRgpeu8hHs')}</Button>
      </div>}
      onClose={onClose}
    >
      <div>
        <div>{t('newsignup.phone.try1')}</div>
        <div>{t('newsignup.phone.try2')}</div>
        <div>{t('newsignup.phone.try3', { phone: `+${countryCode}-${phone}` })}</div>
        <div>{t('newsignup.phone.try4', { minute: 10 })}</div>
      </div>
    </Modal>
  );
};

export default DidNotReceiveCode;
