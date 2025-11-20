import 'systemjs';
import '@kux/app-sdk';
import { setup } from '../src/setup';

// const cdnPrefix = import.meta.env.REACT_APP_CDN || 'https://assets.staticimg.com';
const cdnPrefix = 'https://assets.staticimg.com';

export function setupEnv() {
  System.addImportMap({
    imports: {
      '@kc/report': `${cdnPrefix}/natasha/npm/@kc/report@2.2.8/dist/lib.min.js`,
      'lottie-web': `${cdnPrefix}/natasha/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
    }
  })
  setup({
    // 设置全局的 Lottie 配置, 例如:
    getLottie: () => System.import('lottie-web'),
  })
}
