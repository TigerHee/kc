/**
 * Owner: corki.bai@kupotech.com
 */

import { fireEvent, screen } from '@testing-library/react';
import Back from 'src/components/common/Back';
import { customRender } from 'test/setup';

// 模拟工具函数
jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(() => false),
  open: jest.fn(),
}));

jest.mock('@kucoin-base/i18n', () => ({
  useLocale: jest.fn(),
}));

jest.mock('tools/i18n', () => ({
  _t: (key) => key,
}));

describe('Back component', () => {
  test('renders correctly', () => {
    customRender(<Back />);
    expect(screen.getByText('back')).toBeInTheDocument();
  });

  test('calls window.history.go(-1) when clicked if not in app and no onClick prop', () => {
    const historyGoMock = jest.fn();
    window.history.go = historyGoMock;

    customRender(<Back />);
    fireEvent.click(screen.getByText('back'));

    expect(historyGoMock).toHaveBeenCalledWith(-1);
  });

  test('calls onClick prop when clicked if provided', () => {
    const onClickMock = jest.fn();

    customRender(<Back onClick={onClickMock} />);
    fireEvent.click(screen.getByText('back'));

    expect(onClickMock).toHaveBeenCalled();
  });

  test('replaces location with document.referrer if in app and referrer exists', () => {
    const jsBridgeMock = require('@knb/native-bridge');
    jsBridgeMock.isApp.mockReturnValue(true);
    Object.defineProperty(document, 'referrer', {
      value: 'http://example.com',
      configurable: true,
    });
    const locationReplaceMock = jest.fn();
    delete window.location;
    window.location = { replace: locationReplaceMock };

    customRender(<Back />);
    fireEvent.click(screen.getByText('back'));

    expect(locationReplaceMock).toHaveBeenCalledWith('http://example.com');
  });

  test('calls JsBridge.open with exit if in app and no referrer', () => {
    const jsBridgeMock = require('@knb/native-bridge');
    jsBridgeMock.isApp.mockReturnValue(true);
    Object.defineProperty(document, 'referrer', {
      value: '',
      configurable: true,
    });

    customRender(<Back />);
    fireEvent.click(screen.getByText('back'));

    expect(jsBridgeMock.open).toHaveBeenCalledWith({
      type: 'func',
      params: { name: 'exit' },
    });
  });
});
