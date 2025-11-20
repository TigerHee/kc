/**
 * Owner: lucas.l.lu@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';
import { PageHeader } from 'components/$/CommunityCollect/PageHeader';
import * as hooks from '@kux/mui/hooks';
import JsBridge from 'utils/jsBridge';
import * as dva from 'dva';

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({
      app: {},
    })),
  };
});

// Mock 依赖的组件
jest.mock('components/Header/KCHeader', () => {
  return {
    __esModule: true,
    default: () => {
      return <div id="header">MockHeader</div>
    },
  };
});

jest.mock('components/$/CommunityCollect/H5Header/H5Header', () => {
  return {
    __esModule: true,
    default: () => {
      return <div id="h5-header">MockH5Header</div>
    },
  };
});

jest.mock('@kux/mui/hooks', () => {
  const originalModule = jest.requireActual('@kux/mui/hooks');

  return {
    __esModule: true,
    ...originalModule,
  };
});

// fixed: 单测依赖三方编译报错
jest.mock('@kufox/mui/hooks/useSnackbar', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    useTheme: () => {
      return {
        colors: {
          backgroundMajor: '#ffffff',
        },
        breakpoints: {
          down: () => {},
        },
      }
    },
  };
});

describe('社群页面 PageHeader', () => {
  it('不在 app 中，但是属于 sm 屏幕', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(false);
    jest.spyOn(hooks, 'useMediaQuery').mockReturnValue(true);
    jest.spyOn(dva, 'useSelector').mockReturnValue({
      appVersion: '3.97.0',
    });

    const r = render(<PageHeader />);
    expect(r.container).toBeInTheDocument();
    expect(r.container.querySelector('#h5-header')).toBeInTheDocument();
  });

  it('在 app 中，但是 app 版本 < 3.97.0', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(true);
    jest.spyOn(hooks, 'useMediaQuery').mockReturnValue(true);
    jest.spyOn(dva, 'useSelector').mockReturnValue({
      appVersion: '3.96.0',
    });

    const r = render(<PageHeader />);
    expect(r.container).toBeInTheDocument();
    expect(r.container.querySelector('#h5-header')).toBeInTheDocument();
  });

  it('在 app 中，但是 app 版本 >= 3.97.0', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(true);
    jest.spyOn(hooks, 'useMediaQuery').mockReturnValue(true);
    jest.spyOn(dva, 'useSelector').mockReturnValue({
      appVersion: '3.98.0',
    });

    const r = render(<PageHeader />);
    expect(r.container).toBeInTheDocument();
    expect(r.container.querySelector('#h5-header')).toBe(null);
  });

  it('不在 app 中，大屏幕的情况', () => {
    jest.spyOn(JsBridge, 'isApp').mockReturnValue(false);
    jest.spyOn(hooks, 'useMediaQuery').mockReturnValue(false);
    jest.spyOn(dva, 'useSelector').mockReturnValue({
      appVersion: '3.98.0',
    });

    const r = render(<PageHeader />);
    expect(r.container).toBeInTheDocument();
    expect(r.container.querySelector('#header')).toBeInTheDocument();
  });
});
