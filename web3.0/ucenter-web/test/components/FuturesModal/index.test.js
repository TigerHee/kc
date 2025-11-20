import { useLocale } from '@kucoin-base/i18n';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { message } from 'components/Toast';
import useOpenFuturesIsBonus from 'hooks/useOpenFuturesIsBonus';
import { useDispatch } from 'react-redux';
import FuturesModal from 'src/routes/AccountPage/FuturesModal/index';
import { _t, _tHTML } from 'tools/i18n';
import { getUtmLink } from 'utils/getUtm';
import siteCfg from 'utils/siteConfig';
import { customRender } from 'test/setup';

// Mock 依赖
jest.mock('@kucoin-base/i18n', () => ({
  useLocale: jest.fn(),
}));

jest.mock('hooks/useOpenFuturesIsBonus', () => jest.fn());

jest.mock('components/Toast', () => ({
  message: {
    error: jest.fn(),
  },
}));

jest.mock('tools/i18n', () => ({
  _t: jest.fn((key) => key),
  _tHTML: jest.fn((key, params) => `${key}_${JSON.stringify(params)}`),
}));

jest.mock('utils/getUtm', () => ({
  getUtmLink: jest.fn((url) => url),
}));

jest.mock('utils/siteConfig', () => ({
  MAINSITE_HOST: 'https://www.kucoin.com',
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Mock 子组件
jest.mock('src/routes/AccountPage/FuturesModal/Content', () => {
  return function MockContent({ isBonus }) {
    return <div data-testid="futures-content">{isBonus ? 'bonus-content' : 'default-content'}</div>;
  };
});

jest.mock('src/routes/AccountPage/FuturesModal/OpenSuccessDialog', () => {
  const { forwardRef, useImperativeHandle, useState } = require('react');
  return forwardRef(function MockOpenSuccessDialog(__, ref) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(false);
    
    useImperativeHandle(ref, () => ({
      open: (data) => {
        setOpen(true);
        setData(data);
      },
      close: () => {
        setOpen(false);
      },
    }));
    
    return open ? (
      <div data-testid="success-dialog" data-bonus={data}>
        Success Dialog
      </div>
    ) : null;
  });
});

describe('FuturesModal', () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();

  const defaultState = {
    open_futures: {
      openFuturesVisible: true,
      openContract: false,
      isBonus: false,
    },
    loading: {
      effects: {
        'open_futures/openContract': false,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 默认 mock 设置
    useLocale.mockReturnValue({
      currentLang: 'en_US',
    });
    
    useOpenFuturesIsBonus.mockReturnValue(false);
    useDispatch.mockReturnValue(mockDispatch);
    
    mockDispatch.mockResolvedValue(null);
  });

  const renderFuturesModal = (state = {}, props = {}) => {
    const mergedState = { ...defaultState, ...state };
    return customRender(
      <FuturesModal onClose={mockOnClose} {...props} />,
      mergedState
    );
  };

  test('应该正确处理中文语言设置', () => {
    useLocale.mockReturnValue({
      currentLang: 'zh_CN',
    });
    
    renderFuturesModal();
    
    expect(_tHTML).toHaveBeenCalledWith('open.futures.intro', {
      href: `${siteCfg.MAINSITE_HOST}/announcement/futures-terms-of-use-list`,
    });
  });

  test('应该正确处理英文语言设置', () => {
    useLocale.mockReturnValue({
      currentLang: 'en_US',
    });
    
    renderFuturesModal();
    
    expect(_tHTML).toHaveBeenCalledWith('open.futures.intro', {
      href: `${siteCfg.MAINSITE_HOST}/announcement/en-futures-terms-of-use-list`,
    });
  });

  test('当已开通合约时点击确定应该直接返回', async () => {
    const user = userEvent.setup();
    const { container } = renderFuturesModal({
      open_futures: {
        ...defaultState.open_futures,
        openContract: true,
      },
    });
    
    const okButton = container.querySelector('button:first-of-type');
    await user.click(okButton);
    
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test('当 modal 不可见时不应该渲染', () => {
    const { container } = renderFuturesModal({
      open_futures: {
        ...defaultState.open_futures,
        openFuturesVisible: false,
      },
    });
    
    // Dialog 组件在 open=false 时不会渲染内容
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  test('应该正确传递 UTM 链接参数', () => {
    renderFuturesModal();
    
    expect(getUtmLink).toHaveBeenCalledWith(
      `${siteCfg.MAINSITE_HOST}/announcement/en-futures-terms-of-use-list`
    );
  });

  test('应该使用 React.memo 进行性能优化', () => {
    expect(FuturesModal.$$typeof).toBeDefined(); // React.memo 组件的特征
  });
});
