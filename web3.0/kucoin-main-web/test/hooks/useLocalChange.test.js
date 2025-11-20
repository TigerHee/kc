import { renderHook, act } from '@testing-library/react-hooks';

import { useLocale } from '@kucoin-base/i18n';

import { useSelector } from 'src/hooks/useSelector';

import * as userService from 'services/user';

import useChangeLocale from 'src/hooks/useLocaleChange.js';

// Mock the necessary modules

jest.mock('@kucoin-base/i18n');

jest.mock('src/hooks/useSelector');

jest.mock('services/user');

describe('useChangeLocale Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change locale without updating user if donotChangeUser is true', async () => {
    const changeLocaleMock = jest.fn();

    useLocale.mockReturnValue({ changeLocale: changeLocaleMock });

    useSelector.mockReturnValue({ language: 'en' });

    const { result } = renderHook(() => useChangeLocale());

    await act(async () => {
      await result.current('fr', true);
    });

    expect(userService.setLocal).not.toHaveBeenCalled();

    expect(changeLocaleMock).toHaveBeenCalledWith('fr');
  });

  it('should change locale and update user if donotChangeUser is false', async () => {
    const changeLocaleMock = jest.fn();

    useLocale.mockReturnValue({ changeLocale: changeLocaleMock });

    useSelector.mockReturnValue({ language: 'en' });

    const { result } = renderHook(() => useChangeLocale());

    await act(async () => {
      await result.current('fr');
    });

    expect(userService.setLocal).toHaveBeenCalledWith({ language: 'fr' });

    expect(changeLocaleMock).toHaveBeenCalledWith('fr');
  });

  it('should not update user if the locale is the same', async () => {
    const changeLocaleMock = jest.fn();

    useLocale.mockReturnValue({ changeLocale: changeLocaleMock });

    useSelector.mockReturnValue({ language: 'fr' });

    const { result } = renderHook(() => useChangeLocale());

    await act(async () => {
      await result.current('fr');
    });

    expect(userService.setLocal).not.toHaveBeenCalled();

    expect(changeLocaleMock).toHaveBeenCalledWith('fr');
  });

  it('should handle no user scenario', async () => {
    const changeLocaleMock = jest.fn();

    useLocale.mockReturnValue({ changeLocale: changeLocaleMock });

    useSelector.mockReturnValue(null);

    const { result } = renderHook(() => useChangeLocale());

    await act(async () => {
      await result.current('fr');
    });

    expect(userService.setLocal).not.toHaveBeenCalled();

    expect(changeLocaleMock).toHaveBeenCalledWith('fr');
  });
});
