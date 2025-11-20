import { useTranslation, Trans as BaseTrans } from 'next-i18next';
import type { TransProps } from 'react-i18next';
import { bootConfig } from 'kc-next/boot';

type TransPropsWithDefault = Omit<TransProps<any>, 'values'> & {
  values?: Record<string, any>;
};

export type TranslationFunction = (key: string, options?: any) => string;

export default function useI18n(ns: string = 'common') {
  const { t: baseT, i18n } = useTranslation(ns);
  const DEFAULT_PARAMS = {
    brandName: bootConfig._BRAND_NAME_,
  };

  // 封装 t 函数，自动合并默认参数
  const t: TranslationFunction = (key: string, options?: any) => {
    return baseT(key, {
      ...DEFAULT_PARAMS,
      ...(options || {}),
    }) as string;
  };

  // 封装 Trans 组件，自动传参
  const Trans = (props: TransPropsWithDefault) => {
    const mergedValues = {
      ...DEFAULT_PARAMS,
      ...(props.values || {}),
    };

    return <BaseTrans ns={ns} {...props} values={mergedValues} />;
  };

  return {
    t,
    Trans,
    i18n,
  };
}
