import { Preview } from '@storybook/react-vite';
import { components, SyntaxHighlighter } from 'storybook/internal/components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import { setupEnv } from './setup-env';
import { docComponents } from './doc-components';

import '../src/style/index.scss';
import { i18nDecorators, i18nGlobalTypes } from './i18n';

SyntaxHighlighter.registerLanguage('scss', scss);
setupEnv();

const cusViewports = {
  S: {
    name: 'S (Mobile)',
    styles: {
      width: '768px',
      height: '100%',
    },
  },
  M: {
    name: 'M (Tablet)',
    styles: {
      width: '1200px',
      height: '100%',
    },
  },
  L: {
    name: 'L (Desktop)',
    styles: {
      width: '1440px',
      height: '100%',
    },
  },
};

const preview: Preview = {
  parameters: {
    layout: 'centered',
    docs: {
      components: docComponents,
    },
    viewport: {
      options: cusViewports,
    },
    options: {
      /**
       * 自定义故事排序规则
       * 组件中 readme, api 靠前排序, 其他用例按字母顺序来
       */
      storySort: (a, b) => {
        if (a.id === b.id) return 0;
        const aName = a.id.replace(/--api$/, '');
        const bName = b.id.replace(/--api$/, '');
        if (aName.startsWith(bName)) {
          if (bName + '-readme' === aName) return -1;
          return 1;
        }
        if (bName.startsWith(aName)) {
          if (aName + '-readme' === bName) return 1;
          return -1;
        }
        return a.id.localeCompare(b.id, { numeric: true, sensitivity: 'base'});
      }
    }
  },
  globalTypes: {
    ...i18nGlobalTypes,
  },
  decorators: [
    ...i18nDecorators,
    // 主题装饰器
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme'
    }),
  ],
  tags: ['autodocs']
};

export default preview;
