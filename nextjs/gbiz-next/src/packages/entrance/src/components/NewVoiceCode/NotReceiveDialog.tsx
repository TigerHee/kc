/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import { map } from 'lodash-es';
import clsx from 'clsx';
import { Modal, Button } from '@kux/design';
import useIsMobile from '../../hooks/useIsMobile';
import { Trans } from 'tools/i18n';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { getTenantConfig } from '../../config/tenant';
import styles from './index.module.scss';
import { useLang } from '../../hookTool';
import { formatEmail, formatPhoneNumber } from '../../common/tools';

interface DidNotReceiveCodeProps {
  open?: boolean;
  isSupportVoice?: boolean;
  loading?: boolean;
  isFromPhoneRegister?: boolean;
  onSend?: () => void;
  onClose?: () => void;
  phone?: string;
  email?: string;
  countryCode?: string;
  disabled?: boolean;
  countTime?: number;
}

const EmailCheckListFunc = (email: string, t: (key: string, variables?: Record<string, any>) => string) => [
  t('newsignup.email.try1'),
  t('newsignup.email.try2', { email: formatEmail(email) }),
  t('newsignup.email.try3', { minute: 10 }),
];

const BasicPhoneCheckFunc = (
  phone: string,
  countryCode: string,
  t: (key: string, variables?: Record<string, any>) => any
) =>
  [
    t('newsignup.phone.try1'),
    t('newsignup.phone.try2'),
    t('newsignup.phone.try3', { phone: `+${countryCode}-${formatPhoneNumber(phone)}` }),
    t('newsignup.phone.try4', { minute: 10 }),
  ] as React.ReactNode[];

const PhoneCheckListFunc = (options: {
  phone: string;
  isSupportVoice: boolean;
  t: any;
  countryCode: string;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  countTime?: number;
}) => {
  const { phone, isSupportVoice, t, countryCode, onSend, disabled, loading } = options;
  const concatArr = isSupportVoice
    ? [
        <span
          key="send-button"
          className={clsx(styles.sendButton, { [styles.disabled]: disabled })}
          onClick={() => {
            if (!disabled && !loading) onSend();
          }}
        >
          <Trans
            i18nKey={'newsignup.phone.try5'}
            ns="entrance"
            components={{
              a: <a />,
            }}
          />
        </span>,
      ]
    : [];
  return BasicPhoneCheckFunc(phone, countryCode, t).concat(concatArr);
};

const DidNotReceiveCode: React.FC<DidNotReceiveCodeProps> = ({
  open = false,
  isSupportVoice = false,
  loading = false,
  onSend = () => {},
  onClose = () => {},
  phone = '',
  email = '',
  countryCode = '',
  disabled,
  countTime,
}) => {
  const { t } = useLang();
  const type = email ? 'email' : 'phone';

  const isMobile = useIsMobile();

  const handleSend = () => {
    trackClick(['noCodePopUp', '4']);
    onClose?.();
    onSend?.();
  };

  const EmailCheckList = EmailCheckListFunc(email, t);
  const PhoneCheckList = PhoneCheckListFunc({
    phone,
    countryCode,
    isSupportVoice,
    onSend: handleSend,
    t,
    disabled: !!disabled,
    loading,
    countTime,
  });


  const list = type === 'email' ? EmailCheckList : PhoneCheckList;

  return (
    <Modal
      maskClosable
      isOpen={open}
      mobileTransform
      onCancel={onClose}
      onClose={onClose}
      className={styles.notReceiverDialog}
      title={type === 'email' ? t('newsignup.email.ask') : t('newsignup.phone.ask')}
      size="medium"
      footer={
        <div className={clsx(styles.footerWrapper, { [styles.footerWrapperH5]: isMobile })}>
          {type === 'phone' && isSupportVoice ? (
            <Button
              type="text"
              key="send"
              fullWidth={isMobile}
              disabled={disabled}
              loading={loading}
              size="large"
              onClick={() => {
                handleSend();
                trackClick(['noCodePopUp', '2']);
                kcsensorsManualTrack(
                  {
                    spm: ['SMSSecurityVerify', 'voiceCode'],
                    data: {
                      before_click_element_value: '',
                      after_click_element_value: 'Voice Code',
                    },
                  },
                  'page_click'
                );
              }}
            >
              {`${t('6Vkjuzgbz2LvrjQDdRaevp')}${countTime ? ` ${countTime}s` : ''}`}
            </Button>
          ) : null}
          <Button
            key="ok"
            type="primary"
            fullWidth={isMobile}
            size="large"
            onClick={() => {
              onClose?.();
              trackClick(['noCodePopUp', '3']);
            }}
          >
            {t('a4CTBzVQA53tTRgpeu8hHs')}
          </Button>
        </div>
      }
    >
      <div>
        <ul className={styles.contentList}>
          {map(list, (item, index) => (
            <li className={styles.contentListItem} key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default DidNotReceiveCode;
