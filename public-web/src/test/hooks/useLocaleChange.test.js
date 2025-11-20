/**
 * Owner: jessie@kupotech.com
 */
import { act, renderHook } from '@testing-library/react-hooks';
import * as userService from 'services/user';
const { useSelector } = require('src/hooks/useSelector');
const { default: useLocaleChange } = require('src/hooks/useLocaleChange');

jest.mock('services/user');
jest.mock('@kucoin-base/i18n', () => ({
  basename: '/en',
  useLocale: jest.fn().mockImplementation(() => ({ changeLocale: jest.fn((x) => x) })),
}));

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest.fn(),
}));

describe('useLocaleChange', () => {
  let wrapper;

  afterEach(() => {
    useSelector.mockClear();
  });

  it('should not change user language if not user', async () => {
    const mockUserInfo = undefined;
    useSelector.mockReturnValue(mockUserInfo);

    const { result } = renderHook(() => useLocaleChange(), { wrapper });
    userService.setLocal.mockResolvedValue();

    await act(async () => {
      await result.current('en');
    });

    expect(userService.setLocal).not.toHaveBeenCalled();
  });

  it('should not change user language if same as nextLocale', async () => {
    const mockUserInfo = { language: 'en' };
    useSelector.mockReturnValue(mockUserInfo);

    const { result } = renderHook(() => useLocaleChange(), { wrapper });
    userService.setLocal.mockResolvedValue();

    await act(async () => {
      await result.current('en');
    });

    expect(userService.setLocal).not.toHaveBeenCalled();
  });

  it('should not change user language if donotChangeUser is true', async () => {
    const mockUserInfo = { language: 'en' };
    useSelector.mockReturnValue(mockUserInfo);

    const { result } = renderHook(() => useLocaleChange(), { wrapper });
    userService.setLocal.mockResolvedValue();

    await act(async () => {
      await result.current('fr', true);
    });

    expect(userService.setLocal).not.toHaveBeenCalled();
  });

  it('should change user language if different from nextLocale', async () => {
    const mockUserInfo = { language: 'en' };
    useSelector.mockReturnValue(mockUserInfo);

    const { result } = renderHook(() => useLocaleChange(), { wrapper });
    userService.setLocal.mockResolvedValue();

    await act(async () => {
      await result.current('fr');
    });

    expect(userService.setLocal).toHaveBeenCalledWith({ language: 'fr' });
  });
});
