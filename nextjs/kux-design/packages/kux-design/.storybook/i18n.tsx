import { type Decorator } from '@storybook/react-vite';
import { addons, useGlobals, types } from 'storybook/manager-api';
import { IconButton, WithTooltip, TooltipLinkList } from 'storybook/internal/components';
// Storybook 需要显式的生命 React, 否则会报错
import React from 'react';
import { TransferIcon } from '@storybook/icons';

// 定义环境选项
const SITE_OPTIONS = [
  { title: '主站', value: 'kc' },
  { title: '澳洲站', value: 'au' },
  { title: '欧洲站', value: 'eu' },
  { title: '土耳其站', value: 'tr' },
  { title: '泰国站', value: 'th' },
  { title: '演示站', value: 'demo' },
  { title: '申领站', value: 'cl' },
];

// 定义支持的语言
const LANGUAGES = [
  { value: 'en-US', title: '🇺🇸 English', dir: 'ltr' },
  { value: 'ar-AE', title: '🇸🇦 العربية', dir: 'rtl' },
  { value: 'zh-Hant', title: '🇭🇰 繁体中文', dir: 'ltr' },
  { value: 'ja-JP', title: '🇯🇵 日本語', dir: 'ltr' },
  { value: 'ko-KR', title: '🇰🇷 한국어', dir: 'ltr' },
  { value: 'ru-RU', title: '🇷🇺 Русский', dir: 'ltr' },
  { value: 'uk-UA', title: '🇺🇦 Українська', dir: 'ltr' },
] as const;


const SITE_ENV_KEY = 'sb-site-env';

// 获取存储的环境设置
const getStoredSiteEnv = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(SITE_ENV_KEY) || 'kc';
  }
  return 'kc';
};


// 设置环境并刷新页面
const setSiteEnv = (env: string) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SITE_ENV_KEY, env);
  window.location.reload();
};

// 获取默认语言
const getDefaultLanguage = () => {
  return LANGUAGES.find(l => l.value === navigator.language) ? navigator.language : 'en-US';
};

function getLangFromDirection(direction: 'ltr' | 'rtl') {
  return direction === 'ltr' ? 'en-US' : 'ar-AE';
}

function ToggleDirectionButton() {
  const [globals, updateGlobals] = useGlobals();
  const direction = globals.direction || 'ltr';

  const toggleDir = () => {
    const newDir = direction === 'ltr' ? 'rtl' : 'ltr';
    updateGlobals({
      direction: newDir,
      language: getLangFromDirection(newDir),
    })
  };

  return (
    <IconButton
      active
      key="dir-toggle"
      title={`Direction: ${direction.toUpperCase()}`}
      onClick={toggleDir}
    >
      <TransferIcon />
      {direction === 'ltr' ? 'LTR' : 'RTL'}
    </IconButton>
  );
}

function LanguageToggleButton() {
  const [globals, updateGlobals] = useGlobals();
  const onSelect = (language: string) => {
    const lang = LANGUAGES.find(l => l.value === language);
    if (lang) {
      updateGlobals({
        language,
        direction: lang.dir,
      });
    }
  };
  const currentLang = LANGUAGES.find(l => l.value === globals.language) || LANGUAGES[0];
  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnOutsideClick
      tooltip={({ onHide }) => (
        <TooltipLinkList
          links={LANGUAGES.map(opt => ({
            id: opt.value,
            title: opt.title,
            onClick: () => {
              onSelect(opt.value);
              onHide();
            },
            active: opt.value === globals.language,
          }))}
        />
      )}
    >
      <IconButton key="language-toggle" active title="Change Language">
        {currentLang? `${currentLang.title} (${currentLang.value})` : '🌍 Language'}
      </IconButton>
    </WithTooltip>
  );
}

/**
 * 插件, 在 manager 中注册工具按钮
 */
export const i18nAddons = {
  'dir-toggle-addon': () => {
    addons.add('dir-toggle-addon/button', {
      title: 'Toggle Direction',
      type: types.TOOL,
      match: ({ viewMode }) => !!viewMode,
      render: ToggleDirectionButton,
    });
  },
  'language-toggle-addon': () => {
    addons.add('language-toggle-addon/button', {
      title: 'Change Language',
      type: types.TOOL,
      match: ({ viewMode }) => !!viewMode,
      render: LanguageToggleButton,
    });
  },
} as const;

export const i18nDecorators: Decorator[] = [
  // 语言和方向设置装饰器
  (Story, context) => {
    const dir = context.globals.direction || 'ltr';
    const language = context.globals.language || getDefaultLanguage();
    // @ts-expect-error ignore app types
    app.setLang(language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    return Story();
  },
  // 环境设置装饰器
  (Story, context) => {
    // 当环境变化时触发更新
    if (typeof window !== 'undefined') {
      const currentEnv = context.globals.siteEnv;
      const storedEnv = getStoredSiteEnv();
      if (currentEnv !== storedEnv) {
        setSiteEnv(currentEnv);
      }
    }
    return Story();
  }
];

export const i18nGlobalTypes = {
  direction: {
    name: 'Direction',
    description: 'Text direction',
    defaultValue: 'ltr',
  },
  language: {
    name: 'Language',
    description: 'user interface language',
    defaultValue: getDefaultLanguage(),
  },
  siteEnv: {
    description: '站点选择, 会影响部分组件的行为(比如分享组件)',
    defaultValue: getStoredSiteEnv(),
    toolbar: {
      title: '站点环境',
      icon: 'globe',
      items: SITE_OPTIONS.map((item) => ({
        value: item.value,
        title: item.title,
      })),
      dynamicTitle: true,
    },
  },
};
