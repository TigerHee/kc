/**
 * Owner: solar@kupotech.com
 */
import React, { createContext, useMemo, useContext } from 'react';
import useAccountStatus from '@hooks/useAccountStatus';
import { useProps } from './props';

export const UnifiedContext = createContext();

export function useUnifiedStatus() {
  return useContext(UnifiedContext);
}

// 这里新用户currency返回null，这里设置一个默认计价法币（目前前端不会使用这个法币计价，只保证接口不报错即可）
const NIL_OBJECT = {};
export const UnifiedProvider = ({ children }) => {
  const uid = useProps((props) => props.uid);
  const accountStatus = useAccountStatus(uid);
  const { isHitGray: unifiedSupport, accountType, hasOpened } = accountStatus || NIL_OBJECT;
  const value = useMemo(() => {
    return {
      unifiedSupport,
      isUnifiedMode: unifiedSupport && accountType === 'UNIFIED',
      unifiedHasOpened: hasOpened && unifiedSupport,
    };
  }, [unifiedSupport, accountType, hasOpened]);
  // 如果没获取到是否开通统一账户的开关，就不渲染
  if (!accountStatus) return null;
  return <UnifiedContext.Provider value={value}>{children}</UnifiedContext.Provider>;
};
