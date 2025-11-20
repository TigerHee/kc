/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import JsBridge from '@knb/native-bridge';
import ListPageHeader from 'src/components/Votehub/containers/components/ListPageHeader/index.js';
import { customRender } from 'src/test/setup';

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('test ListPageHeader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('test ListPageHeader', async () => {
    customRender(<ListPageHeader title="title" />, { setting: { currentTheme: 'dark' } });
    customRender(<ListPageHeader title="title" />, { setting: { currentTheme: 'light' } });
  });
  test('test ListPageHeader in App', async () => {
    JsBridge.isApp.mockReturnValue(true);
    customRender(<ListPageHeader title="title" />, { setting: { currentTheme: 'dark' } });
    customRender(<ListPageHeader title="title" />, { setting: { currentTheme: 'light' } });
  });
});
