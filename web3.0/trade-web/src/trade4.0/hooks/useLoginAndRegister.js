/*
 * @owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { _t } from 'src/utils/lang';
import getMainsiteLink from 'src/utils/getMainsiteLink';
import { isFromTMA } from 'utils/tma/isFromTMA';

const { registerUrl } = getMainsiteLink();

export default function useLoginAndRegister() {
  const { open } = useLoginDrawer();

  const register = useCallback((e) => {
    try {
      const postMessage = window?.parent?.bridge?.postMessage;
      if (postMessage) {
        if (e?.preventDefault && e?.stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        postMessage({
          action: 'register',
        });
      }
    } catch (error) {
      console.error('Failed to register:', error);
    }
  }, []);

  const registerXkucoinProps = isFromTMA()
    ? {
        // style: { pointerEvents: 'none' },
        onClick: register,
      }
    : {};

  return {
    loginProps: {
      type: 'primary',
      onClick: open,
      children: _t('login'),
    },
    registerProps: {
      as: 'a',
      type: 'default',
      href: registerUrl,
      className: 'anchor',
      children: _t('register'),
      rel: 'noopener noreferrer',
      ...registerXkucoinProps,
    },
  };
}
