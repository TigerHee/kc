import { useEffect, useCallback } from 'react';
import initLanguageDetector from 'kc-next/i18n/languageDetector';
import { useUserStore } from '@/store/user';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { bootConfig } from 'kc-next/boot';
import { changeLocale, langToLocale } from 'kc-next/i18n';
/**
 * 用于处理语言切换逻辑
 * 1.从用户语言中获取语言
 * 2.从url参数中获取语言
 * 3.从路径中获取语言
 * 4.从本地存储中获取语言
 * 5.从浏览器中获取语言
 * 6.默认语言兜底,如果上面获取的语言都没有匹配到
 **/

export default function useLocaleOrder() {
  const user = useUserStore((state) => state.user);

  // 处理语言切换逻辑
  const handleLanguageChange = useCallback((userLanguage: string | undefined) => {
    if (!userLanguage) return;

    const DEFAULT_LANG = bootConfig._DEFAULT_LANG_;
    const supportedLanguages = bootConfig.languages?.__ALL__;

    // 验证语言是否支持，不支持则使用默认语言
    const isValidLanguage = supportedLanguages.includes(userLanguage);
    const targetLang = isValidLanguage ? userLanguage : DEFAULT_LANG;
    storage.setItem('lang', targetLang);
    // 根据语言类型进行相应的处理
    changeLocale(langToLocale(targetLang));
  }, []);

  // 监听用户语言变化
  useEffect(() => {
    handleLanguageChange(user?.language);
  }, [user?.language, handleLanguageChange]);

  // 初始化语言检测器（只执行一次）
  useEffect(() => {
    initLanguageDetector({
      storage,
    });
  }, []);
}
