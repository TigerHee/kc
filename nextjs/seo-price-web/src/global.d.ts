declare module '*.svg' {
  const content: any

  type ReactComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  export const ReactComponent: ReactComponent;

  export default content
}


// // 声明gbiz-next/hooks为any
// declare module 'gbiz-next/hooks' {
//   const useLang: any

//   export const useLang;
// }

declare module "gbiz-next/createStoreProvider" {
  import { ReactNode, JSX } from "react";
  import { UseBoundStore, StoreApi } from "zustand";

  /**
   * 定义覆盖版本的 `createStoreProvider`，将 `useStoreValue` 修改为返回 `U`。
   */
  export default function createStoreProvider<S>(
    storeName: string,
    createStoreFn: (initialState: Partial<S>) => UseBoundStore<StoreApi<S>>,
    defaultState?: any
  ): {
    StoreProvider: ({
      children,
      initialState,
    }: {
      children: ReactNode;
      initialState?: Partial<S>;
    }) => JSX.Element;
    useStoreValue: <U>(selector: (store: S) => U) => U;
  };
}