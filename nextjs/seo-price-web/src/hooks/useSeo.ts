import { useEffect } from 'react';
import tdkManager from '@kc/tdk';
import { getCurrentLang } from 'kc-next/i18n';

export const useTdk = ({ title, description, keywords }) => {
  useEffect(() => {
    // 更新tdk
    tdkManager.handleUpdateTdk(getCurrentLang(), {
      title,
      description,
      keywords,
    });
  }, [title, description, keywords]);
};