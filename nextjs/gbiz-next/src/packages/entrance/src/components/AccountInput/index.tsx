import React, { useEffect, useMemo, useState } from 'react';
import { Form, Button, Box } from '@kux/mui';
import storage from 'tools/storage';
import { useMultiSiteConfig } from 'hooks';
import { useLang } from '../../hookTool';
import FusionInputFormItem from '../FusionInputFormItem';
import { checkAccountType, searchToJson } from '../../common/tools';
import styles from './styles.module.scss';
import { getCountryCodeListUsingGet, CountryCodeResponse } from '../../api/ucenter';
import clsx from 'clsx';

const { useForm, useWatch } = Form;

export interface IAccountInputProps {
  className?: string;
  title?: string;
  onSuccess: (values: {
    accountType?: 'email' | 'phone';
    email?: string;
    phone?: string;
    countryCode?: string;
  }) => void;
}

export function AccountInput({ onSuccess, title, className = '' }: IAccountInputProps) {
  const { t } = useLang();
  const [form] = useForm();
  const [countryCodes, setCountryCodes] = useState<CountryCodeResponse[]>([]);
  const _account = useWatch('account', form);
  const countryCode = useWatch('countryCode', form);
  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(_account), [_account]);
  const [initialValue, setInitialValue] = useState<{ countryCode: string; account: string }>();

  const { multiSiteConfig } = useMultiSiteConfig();

  const handleFinish = () => {
    onSuccess?.({
      accountType,
      email: accountType === 'email' ? _account : '',
      phone: accountType === 'phone' ? _account : '',
      countryCode: countryCode || '',
    });
  };

  useEffect(() => {
    getCountryCodeListUsingGet().then(res => {
      setCountryCodes(res?.data || []);
    });
  }, []);

  useEffect(() => {
    const search = searchToJson() as { phone?: string; email?: string };
    let countryCode = storage.getItem('$entrance.f.mc') || '';
    let account = atob?.(storage.getItem('$entrance.f.a') || '') || '';
    if (typeof search.phone === 'string') {
      countryCode = search.phone.split('-')[0];
      account = search.phone.split('-')[1];
    } else if (typeof search.email === 'string') {
      account = search.email;
    }

    setInitialValue({
      countryCode,
      account,
    });
  }, []);

  return (
    <div className={clsx(styles.contentBox, styles.withDrawer, className)}>
      <div className={styles.contentWrapper}>
        <div className={styles.contentInner}>
          <div className={clsx(styles.titleContainer)}>
            <div className={clsx(styles.titleContainer)}>
              {title || <div className={clsx(styles.title, styles.titleWithDrawer)}>{t('login')}</div>}
            </div>
          </div>
          <Form form={form}>
            <FusionInputFormItem
              form={form}
              countryCodes={countryCodes}
              scene="login"
              initValues={initialValue}
              multiSiteConfig={multiSiteConfig}
            />
            <Button
              type="primary"
              fullWidth
              size="large"
              onClick={handleFinish}
              className={styles.button}
              disabled={
                accountType === 'email' ? !_account : accountType === 'phone' ? !_account || !countryCode : true
              }
              data-inspector="login_account_send_code"
            >
              {t('vHBPtPwoVzxY4ZqfjDhAaR')}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
