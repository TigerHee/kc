// hooks/useI18n.ts
import { useTranslation as useTransNext, Trans as BaseTrans } from 'next-i18next';
import type { TransProps } from 'react-i18next';
import { bootConfig } from 'kc-next/boot';
import { useCallback, useMemo } from 'react';

const DEFAULT_COMPS = {
  span: <span />,
  a: <a />,
}

type TransPropsWithDefault = Omit<TransProps<any>, 'values'> & {
  values?: Record<string, any>;
};

export default function useTranslation(ns: string = 'common') {
  const DEFAULT_PARAMS = useMemo(() => ({
    brandName: bootConfig._BRAND_NAME_,
    siteBaseCurrency: bootConfig._BASE_CURRENCY_,
  }), []);

  const { t: baseT, i18n } = useTransNext(ns);

  // 封装 t 函数，自动合并默认参数
  const t = useCallback((key: string, options?: any) => {
    return baseT(key, {
      ...DEFAULT_PARAMS,
      ...(options || {}),
    }) as string;
  }, [DEFAULT_PARAMS, baseT]);

  // 封装 Trans 组件，自动传参
  const Trans = useCallback((props: TransPropsWithDefault) => {
    const mergedValues = {
      ...DEFAULT_PARAMS,
      ...(props.values || {}),
    };

    return <BaseTrans ns={ns} {...props} values={mergedValues} />;
  }, [DEFAULT_PARAMS, ns]);

  const _tHTML = useCallback((
    key: string,
    vars: Record<string, any>,
    components?: { readonly [tagName: string]: React.ReactElement }
  ) => {

    return (
      <Trans
        i18nKey={key}
        values={vars}
        components={components ? { ...DEFAULT_COMPS, ...components} : DEFAULT_COMPS}
      />
    )
  }, [Trans])

  return {
    t,
    _t: t,
    _tHTML,
    Trans,
    i18n,
  };
}
