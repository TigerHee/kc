// renderConfig.test.js

import {
  bizType,
  renderConfig,
} from 'src/components/ExternalBindingsDialog/config';

jest.mock('static/account/overview/external/apple.svg', () => 'appleIconMock');
jest.mock('static/account/overview/external/apple-dark.svg', () => 'appleIconDarkMock');
jest.mock('static/account/overview/external/google.svg', () => 'googleIconMock');
jest.mock('static/account/overview/external/telegram.svg', () => 'telegramIconMock');
jest.mock('tools/i18n', () => ({
  _t: jest.fn((key) => `translated(${key})`),
}));

describe('Configuration Test', () => {
  it('should have correct renderConfig values', () => {
    expect(renderConfig).toEqual({
      TELEGRAM: {
        icon: 'telegramIconMock',
        label: 'translated(rytY7D8mH3Bm7vYg9qwx45)',
      },
      GOOGLE: {
        icon: 'googleIconMock',
        label: 'translated(oYvYDY5sbZPvtwtcQP1yoj)',
      },
      APPLE: {
        icon: 'appleIconMock',
        darkIcon: 'appleIconDarkMock',
        label: 'translated(5ZTxQ32aNDJ4s2weYKBQGD)',
      },
    });
  });

  it('should have correct bizType value', () => {
    expect(bizType).toBe('EXTERNAL_BINDING');
  });
});
