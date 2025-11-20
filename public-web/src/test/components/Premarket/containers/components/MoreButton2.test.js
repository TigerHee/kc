/**
 * Owner: june.lee@kupotech.com
 */
import '@testing-library/jest-dom/extend-expect';
import { MoreButton } from 'src/components/Premarket/containers/components/MoreButton';
import { customRender } from 'src/test/setup.js';

const RTLLangs = ['ar_AE', 'ur_PK'];
jest.mock('@kucoin-base/i18n', () => ({
  currentLang: 'ar_AE',
  basename: 'zh-hant',
  useLocale: () => ({ currentLang: 'ar_AE', isRTL: true }),
  isRTLLanguage: (lang) => RTLLangs.includes(lang),
  isCN: true,
}));

describe('test MoreButton', () => {
  it('test MoreButton', async () => {
    customRender(<MoreButton />);
  });
});
