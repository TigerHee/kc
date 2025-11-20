/**
 * Owner: june.lee@kupotech.com
 */
import '@testing-library/jest-dom/extend-expect';
import { MoreButton } from 'src/components/Premarket/containers/components/MoreButton';
import { customRender } from 'src/test/setup.js';

const RTLLangs = ['ar_AE', 'ur_PK'];
jest.mock('@kucoin-base/i18n', () => ({
  currentLang: 'en_US',
  basename: 'zh-hant',
  useLocale: () => ({ currentLang: 'en_US', isRTL: false }),
  isRTLLanguage: (lang) => RTLLangs.includes(lang),
  isCN: true,
}));

describe('test MoreButton', () => {
  it('test MoreButton', async () => {
    customRender(<MoreButton />);
  });
});
