import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { type IDirection } from '@/shared-type';

export interface IStackContext {
  /**
   * flex 方向
   */
  direction: IDirection;
  /**
   * flex内 Spacer 大小, 仅影响 Spacer 组件, 非 gap 属性, 若不设置则 Spacer 使用 auto (flex 1)
   */
  spacing?: number | string | undefined;
}

const StackContext = createContext<IStackContext>({
  direction: 'horizontal',
});

export const useStackContext = () => useContext(StackContext);

export function StackProvider ({children, ...contextValue}: PropsWithChildren & IStackContext) {
  const memoizedValue = useRef<IStackContext>(contextValue);
  memoizedValue.current = app.utils.isDeepEqual(memoizedValue.current, contextValue) ? memoizedValue.current : contextValue;
  return (<StackContext.Provider value={memoizedValue.current}>
    {children}
  </StackContext.Provider>)
}
