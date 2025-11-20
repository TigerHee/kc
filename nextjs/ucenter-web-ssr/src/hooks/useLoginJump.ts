import { useEffect, useRef } from 'react';
import { DEFAULT_JUMP_ROUTE, DEFAULT_JUMP_ROUTE_CL } from '@/config/base';
import { useUserStore } from '@/store/user';
import JsBridge from 'gbiz-next/bridge';
import { getTenantConfig } from '@/tenant';
import { addLangToPath } from '@/tools/i18n';

interface IUseLoginJumpProps {
  check?: (isLogin?: boolean) => boolean;
}

// 提供给业务方
const defaultCheck = (isLogin: boolean) => {
  return isLogin;
};

export const useLoginJump = (props: IUseLoginJumpProps = {}) => {
  const { check = defaultCheck } = props;
  const isLogin = useUserStore((state) => state.isLogin);
  const initRef = useRef(true);

  useEffect(() => {
    if (!initRef.current) {
      return;
    }
    if (typeof window !== 'undefined' && typeof isLogin !== 'undefined') {
      initRef.current = false;
      if (!JsBridge.isApp() && check(isLogin)) {
        window.location.href = addLangToPath(
          getTenantConfig().common.useCLLogin
            ? DEFAULT_JUMP_ROUTE_CL
            : DEFAULT_JUMP_ROUTE
        );
      }
    }
  }, [isLogin]);
};
