/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Input, Tooltip } from '@kux/mui'
import noop from 'lodash-es/noop';
import { queryPersistence } from 'tools/base/QueryPersistence';
import { ICArrowUpOutlined, ICArrowDownOutlined } from '@kux/icons';
import { useLang } from '../../hookTool';
import { kcsensorsManualTrack } from 'tools/sensors';
import clsx from 'clsx';
import styles from './index.module.scss';

interface InviteCodeProps {
  defaultExpand?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  onBlur?: () => void;
  className?: string;
  [key: string]: any;
}

export default function InviteCode({
  defaultExpand = true,
  onChange = noop,
  value,
  onBlur = noop,
  className,
  ...others
}: InviteCodeProps) {
  const { t } = useLang();
  const [show, setShow] = useState<boolean>(defaultExpand);
  const [RCode, setRCode] = useState<string>(value || '');
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const persistenceRcode = queryPersistence.getPersistenceQuery('rcode');
    if (persistenceRcode) {
      setRCode(persistenceRcode);
      setDisabled(true);
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(RCode);
    }
  }, [RCode]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    kcsensorsManualTrack(
      {
        spm: ['createAccount', 'referralCodeSelector'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpty',
          is_login: false,
        },
      },
      'page_click',
    );
    setRCode(e.target.value);
  }, []);

  const handleClickShow = () => {
    setShow(!show);
  };

  const handleBlur = () => {
    typeof onBlur === 'function' && onBlur();
    kcsensorsManualTrack(
      {
        spm: ['createAccount', 'referralCodeInput'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpty',
          is_login: false,
        },
      },
      'page_click',
    );
  };

  return (
    <div className={clsx(styles.container, className)} data-inspector="signup_rcode_container">
      {!show ? (
        <div className={styles.labelTitle} onClick={handleClickShow}>
          <Tooltip title={t('referral_tips')} placement="right">
            <span>{t('referral_msg')}</span>
          </Tooltip>
          {show ? (
            <ICArrowUpOutlined size="20" color="var(--kux-icon)" />
          ) : (
            <ICArrowDownOutlined size="20" color="var(--kux-icon)" />
          )}
        </div>
      ) : null}
      <div className={clsx(styles.inputWrapper, !show && styles.hidden)}>
        {/* @ts-ignore */}
        <Input
          size="xlarge"
          disabled={disabled}
          style={{ width: '100%' }}
          value={RCode}
          type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          data-inspector="signup_rcode_input"
          {...others}
        />
      </div>
    </div>
  );
}
